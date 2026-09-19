"""
LLM provider abstraction with fast failover.

Every provider we care about (Groq, NVIDIA NIM, OpenRouter, Ollama, ...)
speaks the same OpenAI-compatible chat-completions API, so one LangChain
client class covers all of them. Which providers are active, and in what
order, is purely a config.py/.env concern.

get_llm() returns a FallbackChat exposing the three methods the
orchestrator uses (bind_tools / astream / ainvoke). Latency work done here:

1. Client reuse: ChatOpenAI clients are cached, so requests reuse warm
   HTTPS connections instead of paying a TCP+TLS handshake every time.
2. Fail fast: no same-provider retries, short connect timeout, and a read
   timeout (LLM_TIMEOUT) so a stalled provider is abandoned quickly.
3. Cooldowns (circuit breaker): once a provider is rate-limited, down, or
   misconfigured, it is skipped for a while instead of every request
   paying for a doomed attempt first. Cooling providers are still tried
   last, so a stale cooldown can never turn into a hard failure.

Failover happens BEFORE the first token is streamed. If a provider dies
halfway through an answer, that error propagates as before (the widgets
keep whatever text already streamed); two models' output is never spliced.
"""

import logging
import time
from functools import lru_cache

import httpx
import openai
from langchain_openai import ChatOpenAI

from app.config import settings

log = logging.getLogger(__name__)

# Fail over instead of retrying the same struggling provider.
_MAX_RETRIES = 0

# Errors that mean "this provider couldn't serve this request".
FALLBACK_ERRORS = (openai.APIError,)

_MAX_COOLDOWN = 300.0  # never sideline a provider for longer than 5 min


# --------------------------------------------------------------------------
# Cooldowns
# --------------------------------------------------------------------------
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


# One shared instance per process: get_llm() runs per request, but what we
# learned about a provider must outlive a single request.
_SHARED_COOLDOWNS = Cooldowns()


def _retry_after(err: openai.APIError) -> float | None:
    try:
        return float(err.response.headers.get("retry-after"))  # type: ignore[attr-defined]
    except (AttributeError, TypeError, ValueError):
        return None


def cooldown_seconds(err: Exception) -> float:
    """How long to sideline a provider after this error (0 = don't)."""
    if isinstance(err, openai.RateLimitError):
        return min(max(_retry_after(err) or 60.0, 1.0), _MAX_COOLDOWN)
    if isinstance(
        err,
        (openai.AuthenticationError, openai.PermissionDeniedError, openai.NotFoundError),
    ):
        return _MAX_COOLDOWN  # bad key / retired model won't fix itself
    if isinstance(err, (openai.APIConnectionError, openai.InternalServerError)):
        return 30.0  # includes timeouts
    return 0.0  # e.g. 400: a problem with THIS request, not the provider


# --------------------------------------------------------------------------
# Clients
# --------------------------------------------------------------------------
@lru_cache(maxsize=32)
def _build(model: str, api_key: str, base_url: str, temperature: float, effort: str) -> ChatOpenAI:
    use_effort = bool(effort) and "groq.com" in base_url and model.startswith("openai/gpt-oss")

    return ChatOpenAI(
        model=model,
        api_key=api_key,
        base_url=base_url,
        temperature=temperature,
        timeout=httpx.Timeout(settings.LLM_TIMEOUT, connect=3.0, write=5.0, pool=3.0),
        max_retries=_MAX_RETRIES,
        reasoning_effort=effort if use_effort else None,
    )


class FallbackChat:
    def __init__(self, models: list, keys: list[str] | None = None, cooldowns: Cooldowns | None = None):
        self._models = models
        self._keys = keys or [f"provider-{i}" for i in range(len(models))]
        self._cooldowns = cooldowns or Cooldowns()

    def bind_tools(self, tools, tool_choice=None):
        # Bind on every model, keep the same keys/cooldowns.
        bound = [m.bind_tools(tools, tool_choice=tool_choice) for m in self._models]
        return FallbackChat(bound, self._keys, self._cooldowns)

    def _order(self):
        ready, cooling = [], []
        for key, model in zip(self._keys, self._models):
            (cooling if self._cooldowns.active(key) else ready).append((key, model))
        for key, _ in cooling:
            log.debug("LLM provider %s is cooling down; trying it last", key)
        return ready + cooling

    def _record_failure(self, key: str, err: Exception) -> None:
        secs = cooldown_seconds(err)
        if secs:
            self._cooldowns.start(key, secs)
        log.warning(
            "LLM provider %s failed (%s)%s; trying next",
            key, type(err).__name__, f", sidelined {secs:.0f}s" if secs else "",
        )

    async def astream(self, messages):
        last_err: Exception | None = None
        for key, model in self._order():
            stream = model.astream(messages)
            try:
                first = await stream.__anext__()
            except StopAsyncIteration:
                last_err = RuntimeError(f"{key} returned an empty response")
                log.warning("LLM provider %s returned nothing; trying next", key)
                continue
            except FALLBACK_ERRORS as err:
                last_err = err
                self._record_failure(key, err)
                continue

            yield first
            async for chunk in stream:
                yield chunk
            return

        raise last_err if last_err else RuntimeError("no LLM providers configured")

    async def ainvoke(self, messages):
        last_err: Exception | None = None
        for key, model in self._order():
            try:
                return await model.ainvoke(messages)
            except FALLBACK_ERRORS as err:
                last_err = err
                self._record_failure(key, err)

        raise last_err if last_err else RuntimeError("no LLM providers configured")


def get_llm(temperature: float | None = None) -> FallbackChat:
    if not settings.LLM_API_KEY:
        raise RuntimeError(
            "LLM_API_KEY is not set. Add it to ai-service/.env "
            "(see .env.example)."
        )

    temp = float(temperature if temperature is not None else settings.LLM_TEMPERATURE)
    effort = settings.LLM_REASONING_EFFORT

    slots = [(settings.LLM_BASE_URL, settings.LLM_MODEL, settings.LLM_API_KEY)]
    slots += [(f["base_url"], f["model"], f["api_key"]) for f in settings.LLM_FALLBACKS]

    models = [_build(model, key, url, temp, effort) for url, model, key in slots]
    keys = [f"{url} {model}" for url, model, _ in slots]  # never includes the API key

    return FallbackChat(models, keys, _SHARED_COOLDOWNS)
