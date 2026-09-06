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


def _tokens_only(events):
    return [payload for kind, payload in events if kind == "token"]


ANON_CALLER = Caller(raw_token=None, role=None, user_id=None)


@pytest.mark.asyncio
async def test_first_turn_forces_a_tool_call(make_scripted_llm):
    """
    Regression test: previously the model could answer navigation/
    factual questions straight from its own guess without ever calling
    search_scylla_knowledge, producing a fabricated UI flow. The first
    LLM turn must be bound with tool_choice='required' so that can't
    happen — verified here by inspecting what bind_tools was actually
    called with, not just that the code compiles.
    """
    llm = make_scripted_llm([_text_turn(["hi"])])  # won't even reach here if forcing isn't wired

    with patch("app.orchestrator.chain.get_llm", return_value=llm):
        req = ChatRequest(message="where can i see the teams?")
        _ = [e async for e in chain.run_chat_stream(req, ANON_CALLER)]

    assert llm.tool_choice_calls[0] == "required"


@pytest.mark.asyncio
async def test_pure_text_turn_streams_tokens_live(make_scripted_llm):
    llm = make_scripted_llm([_text_turn(["Scylla ", "is ", "a ", "platform."])])

    with patch("app.orchestrator.chain.get_llm", return_value=llm):
        req = ChatRequest(message="what is scylla?")
        events = [e async for e in chain.run_chat_stream(req, ANON_CALLER)]

    assert _tokens_only(events) == ["Scylla ", "is ", "a ", "platform."]


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
            events = [e async for e in chain.run_chat_stream(req, ANON_CALLER)]

    # No leaked empty/partial content from the tool-call turn itself.
    assert "".join(_tokens_only(events)) == "Alpha Racing is a team."


@pytest.mark.asyncio
async def test_iteration_budget_stops_infinite_tool_loop(make_scripted_llm):
    # Model keeps calling the same tool forever — must not hang.
    turns = [_tool_call_turn("list_teams", "{}") for _ in range(chain.MAX_TOOL_ITERATIONS + 2)]
    llm = make_scripted_llm(turns)

    with patch("app.orchestrator.chain.get_llm", return_value=llm):
        with patch("app.tools.scylla_api.list_teams", new=AsyncMock(return_value=[])):
            req = ChatRequest(message="loop please")
            events = [e async for e in chain.run_chat_stream(req, ANON_CALLER)]

    assert "rephrase" in "".join(_tokens_only(events)).lower()


@pytest.mark.asyncio
async def test_navigate_action_is_emitted_after_all_tokens(make_scripted_llm):
    """
    Regression/feature test: when the model calls navigate_to, the
    frontend needs a distinct ('navigate', {...}) event AFTER the visible
    text — not interleaved, so the reply reads naturally before the app
    routes anywhere.
    """
    llm = make_scripted_llm(
        [
            _tool_call_turn("navigate_to", '{"destination_key": "teams_directory"}'),
            _text_turn(["Taking ", "you ", "there."]),
        ]
    )

    with patch("app.orchestrator.chain.get_llm", return_value=llm):
        req = ChatRequest(message="take me to the teams page")
        events = [e async for e in chain.run_chat_stream(req, ANON_CALLER)]

    kinds = [kind for kind, _ in events]
    assert kinds == ["token", "token", "token", "navigate"]
    nav_payload = events[-1][1]
    assert nav_payload["route"] == "/teams-directory"


@pytest.mark.asyncio
async def test_compare_teams_emits_structured_comparison_event(make_scripted_llm):
    llm = make_scripted_llm(
        [
            _tool_call_turn("compare_teams", '{"team_id_a": "aaa", "team_id_b": "bbb"}'),
            _text_turn(["Here's ", "the ", "comparison."]),
        ]
    )
    fake_a = {"name": "Alpha Racing", "category": "Rally", "members": [1], "vehicles": [], "achievements": [], "sponsors": []}
    fake_b = {"name": "Beta Motorsport", "category": "Formula", "members": [], "vehicles": [1, 2], "achievements": [], "sponsors": []}

    with patch("app.orchestrator.chain.get_llm", return_value=llm):
        with patch("app.tools.scylla_api.get_team_profile", new=AsyncMock(side_effect=[fake_a, fake_b])):
            req = ChatRequest(message="compare Alpha Racing and Beta Motorsport")
            events = [e async for e in chain.run_chat_stream(req, ANON_CALLER)]

    comparison_events = [payload for kind, payload in events if kind == "comparison"]
    assert len(comparison_events) == 1
    assert comparison_events[0]["a"]["name"] == "Alpha Racing"
    assert comparison_events[0]["b"]["name"] == "Beta Motorsport"
