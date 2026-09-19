import json
import logging

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse

from app.orchestrator.chain import run_chat_collect, run_chat_stream
from app.rate_limit import limiter
from app.schemas import ChatRequest, ChatResponse
from app.security import Caller, get_caller

logger = logging.getLogger("scylla_ai.chat")

router = APIRouter(prefix="/api/assistant", tags=["assistant"])


def _is_provider_rate_limit(exc: Exception) -> bool:
    """True if this looks like a 429 from the LLM provider itself (Groq/
    OpenAI-compatible), as opposed to some other unexpected failure. Duck-
    typed on status_code rather than importing openai.RateLimitError
    specifically, since any OpenAI-compatible provider's client raises
    something with this shape on a 429 — this is genuinely a different,
    actionable-by-the-user situation ("wait a moment") from an unknown
    crash, and previously got flattened into the same generic 502 message
    the client can't distinguish from a real outage."""
    return getattr(exc, "status_code", None) == 429


@router.post("/message", response_model=ChatResponse)
@limiter.limit("15/minute")
async def send_message(
    request: Request, payload: ChatRequest, caller: Caller = Depends(get_caller)
) -> ChatResponse:
    try:
        reply, navigations, comparisons = await run_chat_collect(payload, caller)
    except RuntimeError as exc:
        # Config errors (e.g. missing API key) — safe message, no internals leaked
        raise HTTPException(status_code=503, detail="Assistant is not configured yet.") from exc
    except Exception as exc:
        if _is_provider_rate_limit(exc):
            logger.warning("LLM provider rate limit hit for role=%s", caller.role)
            raise HTTPException(
                status_code=429,
                detail="You're sending messages a bit fast — please wait a moment and try again.",
            ) from exc
        # Never leak provider errors/stack traces to the CLIENT — but log
        # the real exception server-side, or a real failure here is
        # completely undiagnosable from the generic message alone.
        logger.exception("Unhandled error in /message for role=%s", caller.role)
        raise HTTPException(status_code=502, detail="Assistant is temporarily unavailable.")

    return ChatResponse(reply=reply, role_used=caller.role, actions=navigations, comparisons=comparisons)


@router.post("/message/stream")
@limiter.limit("15/minute")
async def send_message_stream(
    request: Request, payload: ChatRequest, caller: Caller = Depends(get_caller)
):
    async def event_source():
        try:
            async for kind, content in run_chat_stream(payload, caller):
                if kind == "token":
                    # SSE format: each event is "data: <text>\n\n". Newlines
                    # inside a token would break the SSE framing, so escape
                    # them to a literal marker the client un-escapes.
                    safe_token = content.replace("\n", "\\n")
                    yield f"data: {safe_token}\n\n"
                else:
                    # Structured side-channel events (navigate/comparison):
                    # named SSE event + JSON payload, so the frontend can
                    # distinguish "text to show" from "action to take"
                    # without guessing from content shape.
                    yield f"event: {kind}\ndata: {json.dumps(content)}\n\n"
        except RuntimeError:
            logger.warning("Assistant not configured (role=%s)", caller.role)
            yield "data: [error] Assistant is not configured yet.\n\n"
        except Exception as exc:
            if _is_provider_rate_limit(exc):
                # Distinct marker (not just "[error]") so the client can
                # tell "you're going too fast, try again shortly" apart
                # from an actual crash — see assistant.api.js's handling
                # of the "[error:429]" prefix. Same underlying cause as
                # the doubled per-turn LLM calls from the forced-tool-call
                # pattern: two LLM calls per turn instead of one means
                # rapid back-to-back testing burns through a provider's
                # free-tier per-minute quota about twice as fast.
                logger.warning("LLM provider rate limit hit for role=%s", caller.role)
                yield (
                    "data: [error:429] You're sending messages a bit fast — "
                    "please wait a moment and try again.\n\n"
                )
            else:
                # Same principle as above: safe message to the client, real
                # exception (including whether it happened before or after
                # some text had already streamed) logged server-side.
                logger.exception(
                    "Unhandled error in /message/stream for role=%s, message=%r",
                    caller.role,
                    payload.message,
                )
                yield "data: [error] Assistant is temporarily unavailable.\n\n"
        finally:
            yield "event: done\ndata: \n\n"

    return StreamingResponse(event_source(), media_type="text/event-stream")
