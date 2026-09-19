"""
LLM provider abstraction with fast failover.

All providers use the OpenAI-compatible chat-completions API.

Features:
- Cached LangChain ChatOpenAI clients
- Fast provider failover
- Groq rate-limit handling
- TPM retry-after parsing
- Circuit breaker / cooldowns
- Streaming failover BEFORE first token
- Tool binding
- Non-streaming invoke
- No provider/API-key hardcoding
"""

import logging
import re
import time
from functools import lru_cache

import httpx
import openai
from langchain_openai import ChatOpenAI

from app.config import settings


log = logging.getLogger(__name__)


# ============================================================
# Configuration
# ============================================================

_MAX_RETRIES = 0

_MAX_COOLDOWN = 300.0  # 5 minutes maximum


# These errors mean that the provider itself couldn't serve
# the request and another provider should be attempted.
FALLBACK_ERRORS = (
    openai.APIError,
)


# ============================================================
# Cooldown / Circuit Breaker
# ============================================================

class Cooldowns:

    def __init__(self, clock=time.monotonic):
        self._until: dict[str, float] = {}
        self._clock = clock

    def active(self, key: str) -> bool:
        return self._until.get(key, 0.0) > self._clock()

    def start(self, key: str, seconds: float) -> None:
        self._until[key] = self._clock() + seconds

    def clear(self, key: str) -> None:
        self._until.pop(key, None)

    def remaining(self, key: str) -> float:
        until = self._until.get(key, 0.0)
        return max(0.0, until - self._clock())


_SHARED_COOLDOWNS = Cooldowns()


# ============================================================
# Retry-after extraction
# ============================================================

def _retry_after(err: Exception) -> float | None:
    """
    Extract retry-after duration from:

    1. HTTP Retry-After header
    2. Groq error message:
       'Please try again in 15.6225s'
    3. Other common formats
    """

    # --------------------------------------------------------
    # 1. HTTP header
    # --------------------------------------------------------

    try:
        response = getattr(err, "response", None)

        if response is not None:

            headers = getattr(
                response,
                "headers",
                None,
            )

            if headers:

                value = headers.get("retry-after")

                if value is not None:
                    return float(value)

    except (
        AttributeError,
        TypeError,
        ValueError,
    ):
        pass

    # --------------------------------------------------------
    # 2. Groq error message
    # --------------------------------------------------------

    text = str(err)

    patterns = [
        r"try again in\s+([\d.]+)s",
        r"retry[- ]after[:\s]+([\d.]+)s",
        r"retry after\s+([\d.]+)s",
        r"wait\s+([\d.]+)s",
    ]

    for pattern in patterns:

        match = re.search(
            pattern,
            text,
            flags=re.IGNORECASE,
        )

        if match:

            try:
                return float(match.group(1))
            except ValueError:
                pass

    return None


# ============================================================
# Cooldown calculation
# ============================================================

def cooldown_seconds(err: Exception) -> float:
    """
    Determine how long a provider should be sidelined.
    """

    # --------------------------------------------------------
    # Rate limit / TPM
    # --------------------------------------------------------

    if isinstance(
        err,
        openai.RateLimitError,
    ):

        retry_after = _retry_after(err)

        if retry_after is not None:

            return min(
                max(
                    retry_after + 1.0,
                    1.0,
                ),
                _MAX_COOLDOWN,
            )

        # No retry-after available.
        return 30.0

    # --------------------------------------------------------
    # Invalid key / retired model / permission
    # --------------------------------------------------------

    if isinstance(
        err,
        (
            openai.AuthenticationError,
            openai.PermissionDeniedError,
            openai.NotFoundError,
        ),
    ):

        return _MAX_COOLDOWN

    # --------------------------------------------------------
    # Connection / server errors
    # --------------------------------------------------------

    if isinstance(
        err,
        (
            openai.APIConnectionError,
            openai.InternalServerError,
            openai.APITimeoutError,
        ),
    ):

        return 30.0

    # --------------------------------------------------------
    # Other errors
    # --------------------------------------------------------

    # Example:
    # 400 invalid request
    #
    # Don't disable the provider because the request itself
    # is probably the problem.

    return 0.0


# ============================================================
# Client creation
# ============================================================

@lru_cache(maxsize=32)
def _build(
    model: str,
    api_key: str,
    base_url: str,
    temperature: float,
    effort: str,
) -> ChatOpenAI:

    # Groq gpt-oss models support reasoning_effort.
    use_effort = (
        bool(effort)
        and "groq.com" in base_url
        and model.startswith("openai/gpt-oss")
    )

    return ChatOpenAI(
        model=model,
        api_key=api_key,
        base_url=base_url,
        temperature=temperature,

        timeout=httpx.Timeout(
            settings.LLM_TIMEOUT,
            connect=3.0,
            write=5.0,
            pool=3.0,
        ),

        max_retries=_MAX_RETRIES,

        reasoning_effort=(
            effort
            if use_effort
            else None
        ),
    )


# ============================================================
# Fallback Chat
# ============================================================

class FallbackChat:

    def __init__(
        self,
        models: list,
        keys: list[str] | None = None,
        cooldowns: Cooldowns | None = None,
    ):

        self._models = models

        self._keys = (
            keys
            or [
                f"provider-{i}"
                for i in range(len(models))
            ]
        )

        self._cooldowns = (
            cooldowns
            or Cooldowns()
        )

    # --------------------------------------------------------
    # Tool binding
    # --------------------------------------------------------

    def bind_tools(
        self,
        tools,
        tool_choice=None,
    ):

        bound = [
            model.bind_tools(
                tools,
                tool_choice=tool_choice,
            )
            for model in self._models
        ]

        return FallbackChat(
            bound,
            self._keys,
            self._cooldowns,
        )

    # --------------------------------------------------------
    # Provider ordering
    # --------------------------------------------------------

    def _order(self):

        ready = []
        cooling = []

        for key, model in zip(
            self._keys,
            self._models,
        ):

            if self._cooldowns.active(key):

                cooling.append(
                    (key, model)
                )

            else:

                ready.append(
                    (key, model)
                )

        # Healthy providers first.
        #
        # Cooling providers are still attempted last.
        #
        # This prevents a stale cooldown from creating a
        # permanent hard failure if every other provider dies.

        return ready + cooling

    # --------------------------------------------------------
    # Record provider failure
    # --------------------------------------------------------

    def _record_failure(
        self,
        key: str,
        err: Exception,
    ):

        seconds = cooldown_seconds(err)

        if seconds > 0:

            self._cooldowns.start(
                key,
                seconds,
            )

        log.warning(
            "LLM provider %s failed (%s)%s; "
            "trying next provider",
            key,
            type(err).__name__,
            (
                f", sidelined {seconds:.1f}s"
                if seconds
                else ""
            ),
        )

    # --------------------------------------------------------
    # Successful provider
    # --------------------------------------------------------

    def _record_success(
        self,
        key: str,
    ):

        # If provider was cooling and eventually worked,
        # immediately remove its cooldown.

        self._cooldowns.clear(key)

        log.debug(
            "LLM provider %s succeeded",
            key,
        )

    # ========================================================
    # Streaming
    # ========================================================

    async def astream(
        self,
        messages,
    ):

        last_err: Exception | None = None

        for key, model in self._order():

            log.info(
                "Trying LLM provider: %s",
                key,
            )

            stream = model.astream(
                messages
            )

            # ------------------------------------------------
            # IMPORTANT:
            #
            # Don't yield anything until we receive the first
            # chunk.
            #
            # This allows failover before the user sees output.
            # ------------------------------------------------

            try:

                first = await stream.__anext__()

            except StopAsyncIteration:

                last_err = RuntimeError(
                    f"{key} returned an empty response"
                )

                self._record_failure(
                    key,
                    last_err,
                )

                continue

            except FALLBACK_ERRORS as err:

                last_err = err

                self._record_failure(
                    key,
                    err,
                )

                continue

            # ------------------------------------------------
            # First chunk arrived.
            #
            # Provider successfully started responding.
            # ------------------------------------------------

            self._record_success(key)

            yield first

            # ------------------------------------------------
            # Continue stream.
            #
            # If provider dies here, DO NOT switch providers.
            #
            # Otherwise two models could produce one mixed
            # response.
            # ------------------------------------------------

            try:

                async for chunk in stream:

                    yield chunk

            except Exception as err:

                log.error(
                    "LLM provider %s failed "
                    "after streaming started: %s",
                    key,
                    err,
                )

                # Don't splice another provider's answer
                # into an already streamed answer.

                raise

            return

        # ----------------------------------------------------
        # Nothing worked.
        # ----------------------------------------------------

        if last_err:

            raise last_err

        raise RuntimeError(
            "No LLM providers configured"
        )

    # ========================================================
    # Non-streaming
    # ========================================================

    async def ainvoke(
        self,
        messages,
    ):

        last_err: Exception | None = None

        for key, model in self._order():

            log.info(
                "Trying LLM provider: %s",
                key,
            )

            try:

                result = await model.ainvoke(
                    messages
                )

                self._record_success(key)

                return result

            except FALLBACK_ERRORS as err:

                last_err = err

                self._record_failure(
                    key,
                    err,
                )

                continue

        if last_err:

            raise last_err

        raise RuntimeError(
            "No LLM providers configured"
        )


# ============================================================
# Public get_llm()
# ============================================================

def get_llm(
    temperature: float | None = None,
) -> FallbackChat:

    if not settings.LLM_API_KEY:

        raise RuntimeError(
            "LLM_API_KEY is not set. "
            "Add it to ai-service/.env "
            "(see .env.example)."
        )

    temperature_value = float(
        temperature
        if temperature is not None
        else settings.LLM_TEMPERATURE
    )

    effort = (
        settings.LLM_REASONING_EFFORT
    )

    # --------------------------------------------------------
    # Primary provider
    # --------------------------------------------------------

    slots = [
        (
            settings.LLM_BASE_URL,
            settings.LLM_MODEL,
            settings.LLM_API_KEY,
        )
    ]

    # --------------------------------------------------------
    # Fallback providers
    # --------------------------------------------------------

    slots += [
        (
            fallback["base_url"],
            fallback["model"],
            fallback["api_key"],
        )
        for fallback in settings.LLM_FALLBACKS
    ]

    # --------------------------------------------------------
    # Build cached LangChain clients
    # --------------------------------------------------------

    models = [
        _build(
            model=model,
            api_key=api_key,
            base_url=base_url,
            temperature=temperature_value,
            effort=effort,
        )
        for base_url, model, api_key in slots
    ]

    # Never include API keys in provider identifiers.
    keys = [
        f"{base_url} {model}"
        for base_url, model, _ in slots
    ]

    return FallbackChat(
        models=models,
        keys=keys,
        cooldowns=_SHARED_COOLDOWNS,
    )