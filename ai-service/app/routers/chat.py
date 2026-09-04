from fastapi import APIRouter, Depends, HTTPException, Request

from app.orchestrator.chain import run_chat
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
