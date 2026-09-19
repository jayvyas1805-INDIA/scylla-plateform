"""
Provider failover: when the primary LLM fails with a rate limit / outage,
the next configured fallback answers instead. No network or API keys
needed - the models here are in-process fakes.
"""

import httpx
import openai
import pytest
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.outputs import ChatGeneration, ChatResult

from app import llm as llm_module
from app.config import _load_llm_fallbacks, settings
from app.llm import FallbackChat, get_llm


class FakeChat(BaseChatModel):
    reply: str = "ok"
    fail_with: Exception | None = None
    calls: int = 0

    @property
    def _llm_type(self) -> str:
        return "fake"

    def _generate(self, messages, stop=None, run_manager=None, **kwargs):
        self.calls += 1
        if self.fail_with:
            raise self.fail_with
        return ChatResult(generations=[ChatGeneration(message=AIMessage(content=self.reply))])

    def bind_tools(self, tools, tool_choice=None):
        return self


def _rate_limited() -> openai.RateLimitError:
    req = httpx.Request("POST", "http://provider.test/chat/completions")
    return openai.RateLimitError("rate limited", response=httpx.Response(429, request=req), body=None)


async def _collect(runnable, messages):
    text = ""
    async for chunk in runnable.astream(messages):
        text += chunk.content
    return text


MSGS = [HumanMessage(content="hi")]


async def test_rate_limited_primary_falls_back_with_bound_tools_and_streaming():
    primary = FakeChat(reply="from primary", fail_with=_rate_limited())
    backup = FakeChat(reply="from backup")
    bound = FallbackChat([primary, backup]).bind_tools([], tool_choice="required")

    assert await _collect(bound, MSGS) == "from backup"
    assert primary.calls == 1 and backup.calls == 1


async def test_healthy_primary_never_touches_fallback():
    primary = FakeChat(reply="from primary")
    backup = FakeChat(reply="from backup")

    assert await _collect(FallbackChat([primary, backup]), MSGS) == "from primary"
    assert backup.calls == 0


async def test_ainvoke_also_fails_over():
    primary = FakeChat(fail_with=_rate_limited())
    backup = FakeChat(reply="summary text")

    result = await FallbackChat([primary, backup]).ainvoke(MSGS)
    assert result.content == "summary text"


async def test_programming_errors_are_not_swallowed():
    primary = FakeChat(fail_with=ValueError("bug in our code"))
    backup = FakeChat(reply="from backup")

    with pytest.raises(ValueError):
        await _collect(FallbackChat([primary, backup]), MSGS)
    assert backup.calls == 0


async def test_all_providers_failing_raises():
    a = FakeChat(fail_with=_rate_limited())
    b = FakeChat(fail_with=_rate_limited())

    with pytest.raises(openai.RateLimitError):
        await _collect(FallbackChat([a, b]), MSGS)


def test_incomplete_fallback_slots_are_skipped(monkeypatch):
    for k in list(__import__("os").environ):
        if k.startswith("LLM_FALLBACK_"):
            monkeypatch.delenv(k)
    monkeypatch.setenv("LLM_FALLBACK_1_BASE_URL", "http://one/v1")
    monkeypatch.setenv("LLM_FALLBACK_1_MODEL", "m1")
    monkeypatch.setenv("LLM_FALLBACK_1_API_KEY", "k1")
    # slot 2 has no key -> skipped; slot 3 is complete -> kept
    monkeypatch.setenv("LLM_FALLBACK_2_BASE_URL", "http://two/v1")
    monkeypatch.setenv("LLM_FALLBACK_2_MODEL", "m2")
    monkeypatch.setenv("LLM_FALLBACK_3_BASE_URL", "http://three/v1")
    monkeypatch.setenv("LLM_FALLBACK_3_MODEL", "m3")
    monkeypatch.setenv("LLM_FALLBACK_3_API_KEY", "k3")

    assert [f["model"] for f in _load_llm_fallbacks()] == ["m1", "m3"]


def test_get_llm_builds_primary_then_fallbacks_in_order(monkeypatch):
    monkeypatch.setattr(settings, "LLM_API_KEY", "primary-key")
    monkeypatch.setattr(settings, "LLM_MODEL", "primary-model")
    monkeypatch.setattr(
        settings,
        "LLM_FALLBACKS",
        [{"base_url": "http://fb/v1", "model": "fb-model", "api_key": "fb-key"}],
    )

    chat = get_llm()

    assert [m.model_name for m in chat._models] == ["primary-model", "fb-model"]
    assert chat._models[0].max_retries == llm_module._MAX_RETRIES


# ---------------------------------------------------------------------------
# Latency work: cooldowns (skip known-bad providers), client reuse, effort
# ---------------------------------------------------------------------------
from app.llm import Cooldowns, _build, cooldown_seconds


def _http_error(cls, status, headers=None):
    req = httpx.Request("POST", "http://provider.test/chat/completions")
    return cls("boom", response=httpx.Response(status, request=req, headers=headers or {}), body=None)


def _chat(primary, backup, clock):
    return FallbackChat([primary, backup], ["primary", "backup"], Cooldowns(clock=lambda: clock[0]))


async def test_failed_provider_is_skipped_on_the_next_request():
    t = [0.0]
    primary = FakeChat(fail_with=_rate_limited())
    backup = FakeChat(reply="from backup")
    chat = _chat(primary, backup, t)

    assert await _collect(chat, MSGS) == "from backup"
    assert await _collect(chat, MSGS) == "from backup"

    assert primary.calls == 1  # second request went straight to the backup
    assert backup.calls == 2


async def test_provider_is_retried_after_cooldown_expires():
    t = [0.0]
    primary = FakeChat(fail_with=_rate_limited())
    backup = FakeChat(reply="from backup")
    chat = _chat(primary, backup, t)

    await _collect(chat, MSGS)
    t[0] += 61  # default 429 cooldown is 60s
    primary.fail_with = None
    primary.reply = "primary is back"

    assert await _collect(chat, MSGS) == "primary is back"


async def test_retry_after_header_sets_the_cooldown():
    err = _http_error(openai.RateLimitError, 429, {"retry-after": "7"})
    assert cooldown_seconds(err) == 7
    huge = _http_error(openai.RateLimitError, 429, {"retry-after": "86400"})
    assert cooldown_seconds(huge) == 300  # capped, so we re-probe every 5 min


async def test_bad_request_falls_back_but_does_not_sideline_the_provider():
    t = [0.0]
    primary = FakeChat(fail_with=_http_error(openai.BadRequestError, 400))
    backup = FakeChat(reply="from backup")
    chat = _chat(primary, backup, t)

    assert await _collect(chat, MSGS) == "from backup"
    primary.fail_with = None
    primary.reply = "primary ok"

    assert await _collect(chat, MSGS) == "primary ok"  # no cooldown after a 400


async def test_cooling_providers_are_still_tried_as_a_last_resort():
    t = [0.0]
    primary = FakeChat(fail_with=_rate_limited())
    backup = FakeChat(fail_with=_rate_limited())
    chat = _chat(primary, backup, t)

    with pytest.raises(openai.RateLimitError):
        await _collect(chat, MSGS)

    # both are now cooling, but a recovered one must still be usable
    backup.fail_with = None
    backup.reply = "recovered"
    assert await _collect(chat, MSGS) == "recovered"


def test_clients_are_cached_so_connections_are_reused():
    a = _build("m", "k", "http://x/v1", 0.3, "")
    b = _build("m", "k", "http://x/v1", 0.3, "")
    assert a is b
    assert _build("m", "k", "http://x/v1", 0.0, "") is not a  # different temperature


def test_reasoning_effort_is_only_sent_to_groq_gpt_oss():
    groq = _build("openai/gpt-oss-120b", "k", "https://api.groq.com/openai/v1", 0.3, "low")
    other_host = _build("openai/gpt-oss-120b", "k", "https://openrouter.ai/api/v1", 0.3, "low")
    other_model = _build("qwen/qwen3.6-27b", "k", "https://api.groq.com/openai/v1", 0.3, "low")
    unset = _build("openai/gpt-oss-20b", "k", "https://api.groq.com/openai/v1", 0.3, "")

    assert groq._default_params["reasoning_effort"] == "low"  # this is what gets sent
    assert "reasoning_effort" not in other_host._default_params
    assert "reasoning_effort" not in other_model._default_params
    assert "reasoning_effort" not in unset._default_params
