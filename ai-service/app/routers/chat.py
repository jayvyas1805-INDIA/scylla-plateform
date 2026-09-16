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
    except Exception:
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
        except Exception:
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
