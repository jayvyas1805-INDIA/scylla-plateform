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

import logging
from dataclasses import dataclass

import jwt
from fastapi import Header

from app.config import settings

logger = logging.getLogger("scylla_ai.security")


@dataclass
class Caller:
    raw_token: str | None  # forwarded as-is to Express on tool calls
    role: str | None  # "admin" | "TEAM_ADMIN" | "MEMBER" | "vendor" | None (public)
    user_id: str | None


def get_caller(authorization: str | None = Header(default=None)) -> Caller:
    if not authorization or not authorization.startswith("Bearer "):
        return Caller(raw_token=None, role=None, user_id=None)

    token = authorization.split(" ", 1)[1]

    if not settings.JWT_SECRET:
        # No shared secret configured — still forward the raw token so
        # Express can make the real decision; we just can't pre-read the
        # role for prompt context in this case. Logged at warning level
        # because a token WAS sent — a caller is trying to be
        # authenticated and getting silently treated as public is exactly
        # the confusing failure mode this log line exists to surface.
        logger.warning(
            "A Bearer token was sent but JWT_SECRET is not configured — "
            "treating caller as public. Set JWT_SECRET in ai-service/.env "
            "to match your Express backend's JWT_SECRET exactly."
        )
        return Caller(raw_token=token, role=None, user_id=None)

    try:
        decoded = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        return Caller(
            raw_token=token,
            role=decoded.get("role"),
            user_id=decoded.get("id"),
        )
    except jwt.PyJWTError as exc:
        # Expired/invalid/wrong-secret — treat as public. Express will
        # independently reject this same token if any tool call needs
        # real auth. Logged because this is the single most common way
        # "I'm logged in but the assistant won't give me admin/my-team
        # data" happens in practice: JWT_SECRET here doesn't match the
        # Express backend's real JWT_SECRET, so every token silently
        # fails verification with no visible error to the user at all.
        logger.warning(
            "A Bearer token was sent but failed JWT verification (%s) — "
            "treating caller as public. If this is unexpected, check that "
            "ai-service/.env's JWT_SECRET is EXACTLY equal to the Express "
            "backend's JWT_SECRET (backend/.env).",
            type(exc).__name__,
        )
        return Caller(raw_token=token, role=None, user_id=None)
