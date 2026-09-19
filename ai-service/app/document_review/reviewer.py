import logging

from app.document_review.extract import ExtractionError, extract_document_text
from app.document_review.rules_retrieval import select_relevant_rules
from app.document_review.schemas import DocumentReviewRequest, DocumentReviewResponse
from app.llm import get_llm

logger = logging.getLogger("scylla_ai.document_review.reviewer")

SYSTEM_PROMPT = """You are a document-compliance checker for Scylla, a \
student-motorsport platform. You are given the extracted text of a {doc_type} \
verification document and a checklist of rules an admin has defined for \
that document type.

Decide whether the document satisfies the checklist:
- "approve": the document clearly satisfies every applicable rule.
- "reject": the document clearly fails one or more MANDATORY rules, or is \
obviously not the right kind of document at all.
- "review": you cannot tell either way — e.g. the extracted text is too \
sparse/garbled to check a rule, or a rule is ambiguous for this document. \
Never guess approve/reject when you are not reasonably confident; "review" \
routes it to a human, which is always the safe choice.

For every rule the document fails or that you could not verify, add its \
exact rule text to flaggedRules. reasoning should be 2-4 sentences an \
admin can read in a few seconds to see WHY you suggest what you suggest \
— reference specific rules, not vague impressions. This is a suggestion \
only; a human admin makes the final call, so be precise about what you \
did and didn't verify rather than overstating your confidence."""


async def review_document(payload: DocumentReviewRequest) -> DocumentReviewResponse:
    try:
        document_text = await extract_document_text(payload.docUrl)
    except ExtractionError as exc:
        # Extraction failure is itself a valid, useful verdict — not an
        # HTTP error. The admin should see "AI: needs manual review,
        # couldn't read the file" rather than a blank/broken badge.
        return DocumentReviewResponse(
            suggestion="review",
            confidence=0.0,
            reasoning=str(exc),
            flaggedRules=[],
        )

    if not document_text:
        return DocumentReviewResponse(
            suggestion="review",
            confidence=0.0,
            reasoning="No readable text could be extracted from this document "
            "(possibly a blank page or an unsupported scan quality).",
            flaggedRules=[],
        )

    relevant_rules = select_relevant_rules(payload.rules, document_text)

    if not relevant_rules:
        return DocumentReviewResponse(
            suggestion="review",
            confidence=0.0,
            reasoning="No approval checklist has been defined for this document "
            "type yet, so there is nothing for the AI to check it against.",
            flaggedRules=[],
        )

    rules_block = "\n".join(
        f"- [{'MANDATORY' if r.mandatory else 'optional'}] {r.text}" for r in relevant_rules
    )

    # Extracted text can be long (multi-page PDFs); cap what we send so a
    # single document can't blow the context window or the token bill.
    truncated_text = document_text[:12000]

    prompt = (
        f"Checklist rules:\n{rules_block}\n\n"
        f"Extracted document text:\n\"\"\"\n{truncated_text}\n\"\"\""
    )

    llm = get_llm(temperature=0.1).with_structured_output(DocumentReviewResponse)

    try:
        result: DocumentReviewResponse = await llm.ainvoke(
            [
                {"role": "system", "content": SYSTEM_PROMPT.format(doc_type=payload.docType)},
                {"role": "user", "content": prompt},
            ]
        )
    except Exception:
        logger.exception("LLM call failed during document review")
        return DocumentReviewResponse(
            suggestion="review",
            confidence=0.0,
            reasoning="The AI reviewer is temporarily unavailable; please review manually.",
            flaggedRules=[],
        )

    return result
