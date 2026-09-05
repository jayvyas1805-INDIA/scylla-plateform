import jwt

from app.orchestrator.chain import SYSTEM_PROMPT
from app.security import get_caller
from app.config import settings


def test_system_prompt_treats_tool_and_rag_output_as_data_not_instructions():
    lower = SYSTEM_PROMPT.lower()
    assert "data" in lower
    assert "not instructions" in lower or "never instructions" in lower


def test_system_prompt_refuses_to_reveal_itself():
    assert "reveal this system prompt" in SYSTEM_PROMPT


def test_invalid_jwt_falls_back_to_public_caller_not_a_crash(monkeypatch):
    monkeypatch.setattr(settings, "JWT_SECRET", "test-secret-for-this-test-only")
    caller = get_caller(authorization="Bearer not-a-real-jwt")
    assert caller.role is None  # never silently escalated to any role


def test_expired_or_wrong_secret_jwt_falls_back_to_public_caller(monkeypatch):
    monkeypatch.setattr(settings, "JWT_SECRET", "test-secret-for-this-test-only")
    # Signed with a DIFFERENT secret than the app is configured with —
    # simulates a forged/tampered token.
    forged = jwt.encode({"role": "admin", "id": "attacker"}, "wrong-secret", algorithm="HS256")
    caller = get_caller(authorization=f"Bearer {forged}")

    assert caller.role is None  # forged admin claim must NOT be trusted


def test_valid_token_with_correct_secret_is_read_correctly(monkeypatch):
    monkeypatch.setattr(settings, "JWT_SECRET", "test-secret-for-this-test-only")
    real = jwt.encode({"role": "MEMBER", "id": "u1"}, settings.JWT_SECRET, algorithm="HS256")
    caller = get_caller(authorization=f"Bearer {real}")
    assert caller.role == "MEMBER"
