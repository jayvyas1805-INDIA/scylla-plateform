import pytest
from unittest.mock import patch

from app.orchestrator.memory import build_memory_context
from app.schemas import ChatTurn


@pytest.mark.asyncio
async def test_short_history_is_not_summarized():
    short = [ChatTurn(role="user", content="hi")]
    summary, recent = await build_memory_context(short, recent_turns_kept=6)

    assert summary is None
    assert recent == short


@pytest.mark.asyncio
async def test_long_history_is_summarized_and_recent_turns_kept_verbatim():
    long_history = [
        ChatTurn(role="user" if i % 2 == 0 else "assistant", content=f"msg {i} about Alpha Racing")
        for i in range(15)
    ]

    class FakeSummaryMsg:
        content = "User asked about Alpha Racing across several turns."

    class FakeLLM:
        async def ainvoke(self, msgs):
            return FakeSummaryMsg()

    with patch("app.orchestrator.memory.get_llm", return_value=FakeLLM()):
        summary, recent = await build_memory_context(long_history, recent_turns_kept=6)

    assert summary == "User asked about Alpha Racing across several turns."
    assert len(recent) == 6
    assert recent == long_history[-6:]
