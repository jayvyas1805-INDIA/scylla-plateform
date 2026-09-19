from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.rate_limit import limiter
from app.routers import chat, document_review

import logging

logger = logging.getLogger("scylla_ai.startup")

app = FastAPI(title="Scylla AI Assistant", version="0.1.0")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)

# A production deploy left on the default (localhost-only) ALLOWED_ORIGINS
# doesn't fail loudly — the server starts up fine, and every request from
# the real deployed frontend just gets its CORS preflight silently
# rejected with a 400 "Disallowed CORS origin" (Starlette's own message),
# which only ever shows up in the BROWSER's network tab, never in this
# service's own logs. That's exactly the kind of misconfiguration that's
# invisible from the server side until someone happens to check the
# client. Logging it here at least makes it visible in this service's
# own startup logs instead of only discoverable by inspecting a failing
# request in DevTools.
if settings.ENV == "production" and all(
    origin.startswith("http://localhost") or origin.startswith("http://127.0.0.1")
    for origin in settings.ALLOWED_ORIGINS
):
    logger.warning(
        "ENV=production but ALLOWED_ORIGINS is still localhost-only (%s). "
        "Any request from your real deployed frontend will fail CORS "
        "preflight with a 400. Set ALLOWED_ORIGINS to include your "
        "deployed frontend's origin.",
        settings.ALLOWED_ORIGINS,
    )

app.include_router(chat.router)
app.include_router(document_review.router)


@app.get("/health")
def health():
    return {"success": True, "message": "Scylla AI Assistant is running"}
