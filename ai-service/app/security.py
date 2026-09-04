"""
Reads (never issues) the same JWT the Client already sends to Express.

IMPORTANT: this module answers "who is probably asking?" so we can pick
the right tone/tools and forward the right token onward. It is NOT the
authorization boundary. Every piece of actual Scylla data still comes
from an Express endpoint that runs its own authUser/adminAuth/teamAuth
check on this same token. If verification fails here, we simply treat
the caller as a public/anonymous visitor and let Express reject any
tool call that needs real auth — we never widen access on our side.
"""

from dataclasses import dataclass

import jwt
from fastapi import Header

from app.config import settings


@dataclass
class Caller:
    raw_token: str | None  # forwarded as-is to Express on tool calls
    role: str | None  # "admin" | "TEAM_ADMIN" | "MEMBER" | "VENDOR" | None (public)
    user_id: str | None


def get_caller(authorization: str | None = Header(default=None)) -> Caller:
    if not authorization or not authorization.startswith("Bearer "):
        return Caller(raw_token=None, role=None, user_id=None)

    token = authorization.split(" ", 1)[1]

    if not settings.JWT_SECRET:
        # No shared secret configured — still forward the raw token so
        # Express can make the real decision; we just can't pre-read the
        # role for prompt context in this case.
        return Caller(raw_token=token, role=None, user_id=None)

    try:
        decoded = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        return Caller(
            raw_token=token,
            role=decoded.get("role"),
            user_id=decoded.get("id"),
        )
    except jwt.PyJWTError:
        # Expired/invalid — treat as public. Express will independently
        # reject this same token if any tool call needs real auth.
        return Caller(raw_token=token, role=None, user_id=None)
