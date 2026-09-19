"""
Pulls plain text out of a team/vendor's verificationDoc so the LLM has
something to actually check against the checklist.

Documents are a mix of PDFs (GST certificates, registration letters) and
images (photographed/scanned IDs) — see the two extraction paths below.
Both are best-effort: a document the extractor can't read still gets a
verdict, just one that says so (status="review", not a silent crash),
because "the AI couldn't read this" is exactly the kind of thing a human
admin should be told, not something that should blow up the request.
"""

import io
import logging

import httpx
import pytesseract
from PIL import Image
from pypdf import PdfReader

logger = logging.getLogger("scylla_ai.document_review.extract")

MAX_DOC_BYTES = 20 * 1024 * 1024  # 20 MB — matches the Multer limit used on upload


class ExtractionError(Exception):
    pass


async def _download(url: str) -> tuple[bytes, str]:
    async with httpx.AsyncClient(timeout=20) as client:
        resp = await client.get(url)
    resp.raise_for_status()
    content = resp.content
    if len(content) > MAX_DOC_BYTES:
        raise ExtractionError("Document is too large to analyze.")
    content_type = resp.headers.get("content-type", "")
    return content, content_type


def _extract_pdf_text(content: bytes) -> str:
    reader = PdfReader(io.BytesIO(content))
    pages = [page.extract_text() or "" for page in reader.pages]
    return "\n".join(pages).strip()


def _extract_image_text(content: bytes) -> str:
    image = Image.open(io.BytesIO(content))
    return pytesseract.image_to_string(image).strip()


def _looks_like_pdf(content: bytes, content_type: str, url: str) -> bool:
    return content[:4] == b"%PDF" or "pdf" in content_type.lower() or url.lower().endswith(".pdf")


async def extract_document_text(url: str) -> str:
    """
    Returns extracted text, or "" if extraction genuinely found nothing
    (e.g. a blank scan) — callers treat empty text as a signal to flag
    the document for manual review rather than guessing.
    """
    try:
        content, content_type = await _download(url)
    except httpx.HTTPError as exc:
        raise ExtractionError(f"Could not download the document: {exc}") from exc

    try:
        if _looks_like_pdf(content, content_type, url):
            text = _extract_pdf_text(content)
            # Some PDFs are scanned images with no embedded text layer at
            # all — fall through to OCR on the raw bytes only if that's
            # genuinely why nothing came back, not just a short doc.
            if text:
                return text
        return _extract_image_text(content)
    except Exception as exc:  # noqa: BLE001 - any parser/OCR failure lands here
        logger.warning("Text extraction failed for %s: %s", url, exc)
        raise ExtractionError(
            "Could not read this document's content (unsupported or corrupted file)."
        ) from exc
