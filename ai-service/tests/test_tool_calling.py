import pytest
from langchain_core.messages import AIMessageChunk
from unittest.mock import AsyncMock, patch

from app.orchestrator import chain
from app.schemas import ChatRequest
from app.security import Caller


def _text_turn(pieces):
    return [AIMessageChunk(content=p) for p in pieces]


def _tool_call_turn(name, args_json, call_id="call_1"):
    return [
        AIMessageChunk(content="", tool_call_chunks=[{"name": name, "args": "", "id": call_id, "index": 0}]),
        AIMessageChunk(content="", tool_call_chunks=[{"name": None, "args": args_json, "id": None, "index": 0}]),
    ]


ANON_CALLER = Caller(raw_token=None, role=None, user_id=None)


@pytest.mark.asyncio
async def test_pure_text_turn_streams_tokens_live(make_scripted_llm):
    llm = make_scripted_llm([_text_turn(["Scylla ", "is ", "a ", "platform."])])

    with patch("app.orchestrator.chain.get_llm", return_value=llm):
        req = ChatRequest(message="what is scylla?")
        tokens = [tok async for tok in chain.run_chat_stream(req, ANON_CALLER)]

    assert tokens == ["Scylla ", "is ", "a ", "platform."]


@pytest.mark.asyncio
async def test_tool_call_then_final_answer(make_scripted_llm):
    llm = make_scripted_llm(
        [
            _tool_call_turn("list_teams", "{}"),
            _text_turn(["Alpha ", "Racing ", "is ", "a ", "team."]),
        ]
    )

    with patch("app.orchestrator.chain.get_llm", return_value=llm):
        with patch(
            "app.tools.scylla_api.list_teams",
            new=AsyncMock(return_value=[{"name": "Alpha Racing", "_id": "123", "category": "Rally"}]),
        ):
            req = ChatRequest(message="who are the teams?")
            tokens = [tok async for tok in chain.run_chat_stream(req, ANON_CALLER)]

    # No leaked empty/partial content from the tool-call turn itself.
    assert "".join(tokens) == "Alpha Racing is a team."


@pytest.mark.asyncio
async def test_iteration_budget_stops_infinite_tool_loop(make_scripted_llm):
    # Model keeps calling the same tool forever — must not hang.
    turns = [_tool_call_turn("list_teams", "{}") for _ in range(chain.MAX_TOOL_ITERATIONS + 2)]
    llm = make_scripted_llm(turns)

    with patch("app.orchestrator.chain.get_llm", return_value=llm):
        with patch("app.tools.scylla_api.list_teams", new=AsyncMock(return_value=[])):
            req = ChatRequest(message="loop please")
            tokens = [tok async for tok in chain.run_chat_stream(req, ANON_CALLER)]

    assert "rephrase" in "".join(tokens).lower()
