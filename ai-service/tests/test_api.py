import json
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["success"] is True


def test_empty_message_is_rejected_by_validation():
    r = client.post("/api/assistant/message", json={"message": ""})
    assert r.status_code == 422  # Pydantic min_length=1, never reaches the LLM


def test_overly_long_message_is_rejected_by_validation():
    r = client.post("/api/assistant/message", json={"message": "x" * 5000})
    assert r.status_code == 422


def test_config_error_returns_generic_503_not_a_stack_trace():
    async def boom(*a, **kw):
        raise RuntimeError("LLM_API_KEY is not set")

    with patch("app.routers.chat.run_chat_collect", side_effect=boom):
        r = client.post("/api/assistant/message", json={"message": "hi"})

    assert r.status_code == 503
    assert "LLM_API_KEY" not in r.text  # internal detail must not leak


def test_unexpected_error_returns_generic_502_not_a_stack_trace():
    async def boom(*a, **kw):
        raise ValueError("some provider internals: sk-abc123")

    with patch("app.routers.chat.run_chat_collect", side_effect=boom):
        r = client.post("/api/assistant/message", json={"message": "hi"})

    assert r.status_code == 502
    assert "sk-abc123" not in r.text


def test_rate_limit_returns_429_after_threshold():
    app.state.limiter.reset()

    async def fake_ok(*a, **kw):
        return ("ok", [], [])

    with patch("app.routers.chat.run_chat_collect", side_effect=fake_ok):
        codes = [client.post("/api/assistant/message", json={"message": "hi"}).status_code for _ in range(18)]

    assert codes.count(429) >= 1
    assert codes[:15].count(200) == 15


def test_streaming_endpoint_frames_navigate_action_as_named_sse_event():
    async def fake_stream(request, caller):
        yield ("token", "Taking you there.")
        yield ("navigate", {"route": "/teams-directory"})

    with patch("app.routers.chat.run_chat_stream", side_effect=lambda req, caller: fake_stream(req, caller)):
        with client.stream("POST", "/api/assistant/message/stream", json={"message": "hi"}) as r:
            lines = list(r.iter_lines())

    assert "data: Taking you there." in lines
    assert "event: navigate" in lines
    nav_data_line = lines[lines.index("event: navigate") + 1]
    assert json.loads(nav_data_line.removeprefix("data: ")) == {"route": "/teams-directory"}
    assert "event: done" in lines


def test_streaming_endpoint_frames_comparison_as_named_sse_event():
    async def fake_stream(request, caller):
        yield ("token", "Here's the comparison.")
        yield ("comparison", {"entity_type": "team", "a": {"name": "Alpha"}, "b": {"name": "Beta"}})

    with patch("app.routers.chat.run_chat_stream", side_effect=lambda req, caller: fake_stream(req, caller)):
        with client.stream("POST", "/api/assistant/message/stream", json={"message": "hi"}) as r:
            lines = list(r.iter_lines())

    assert "event: comparison" in lines
    comp_data_line = lines[lines.index("event: comparison") + 1]
    payload = json.loads(comp_data_line.removeprefix("data: "))
    assert payload["a"]["name"] == "Alpha"
    assert payload["b"]["name"] == "Beta"
