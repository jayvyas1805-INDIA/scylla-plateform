from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse

from app.orchestrator.chain import run_chat, run_chat_stream
from app.rate_limit import limiter
from app.schemas import ChatRequest, ChatResponse
from app.security import Caller, get_caller

router = APIRouter(prefix="/api/assistant", tags=["assistant"])


@router.post("/message", response_model=ChatResponse)
@limiter.limit("15/minute")
async def send_message(
    request: Request, payload: ChatRequest, caller: Caller = Depends(get_caller)
) -> ChatResponse:
    try:
        reply = await run_chat(payload, caller)
    except RuntimeError as exc:
        # Config errors (e.g. missing API key) — safe message, no internals leaked
        raise HTTPException(status_code=503, detail="Assistant is not configured yet.") from exc
    except Exception:
        # Never leak provider errors/stack traces to the client
        raise HTTPException(status_code=502, detail="Assistant is temporarily unavailable.")

    return ChatResponse(reply=reply, role_used=caller.role)


@router.post("/message/stream")
@limiter.limit("15/minute")
async def send_message_stream(
    request: Request, payload: ChatRequest, caller: Caller = Depends(get_caller)
):
    async def event_source():
        try:
            async for token in run_chat_stream(payload, caller):
                # SSE format: each event is "data: <text>\n\n". Newlines
                # inside a token would break the SSE framing, so escape
                # them to a literal marker the client un-escapes.
                safe_token = token.replace("\n", "\\n")
                yield f"data: {safe_token}\n\n"
        except RuntimeError:
            yield "data: [error] Assistant is not configured yet.\n\n"
        except Exception:
            yield "data: [error] Assistant is temporarily unavailable.\n\n"
        finally:
            yield "event: done\ndata: \n\n"

    return StreamingResponse(event_source(), media_type="text/event-stream")
