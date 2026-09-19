import logging

from fastapi import APIRouter, Header, HTTPException

from app.config import settings
from app.document_review.reviewer import review_document
from app.document_review.schemas import DocumentReviewRequest, DocumentReviewResponse

logger = logging.getLogger("scylla_ai.document_review.router")

router = APIRouter(prefix="/api/assistant", tags=["document-review"])


@router.post("/review-document", response_model=DocumentReviewResponse)
async def review_document_endpoint(
    payload: DocumentReviewRequest,
    x_internal_secret: str | None = Header(default=None),
) -> DocumentReviewResponse:
    """
    Server-to-server only — called once by the Express backend right
    after a team/vendor's verificationDoc is (re)uploaded (see
    backend/utils/aiDocumentReview.js). There is no browser client for
    this route and no per-user JWT to check here, so a shared secret is
    the entire access boundary: never relax this to "any request" even
    for testing, since it would let anyone burn LLM calls against
    arbitrary URLs.
    """
    if not settings.INTERNAL_SERVICE_SECRET or x_internal_secret != settings.INTERNAL_SERVICE_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        return await review_document(payload)
    except Exception:
        logger.exception("Unhandled error reviewing document for docType=%s", payload.docType)
        raise HTTPException(status_code=502, detail="Document review failed.")
