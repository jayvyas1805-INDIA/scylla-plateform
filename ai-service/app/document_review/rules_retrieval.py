"""
Selects which admin-defined checklist rules to hand the LLM for a given
document.

Same reasoning as app/knowledge/retrieval.py for using BM25 instead of an
embeddings/vector-DB setup: the rule set is small and admin-curated, not
a large unstructured corpus, so keyword retrieval is enough and avoids
another paid API call. The one thing that's different here: this index
is rebuilt on every call (rules come from Mongo via the request body and
can change at any time), not loaded once at import time like the static
FAQ docs are.

Mandatory rules bypass retrieval entirely and are always included — see
ApprovalRule.mandatory's docstring in the backend model. Only
non-mandatory rules are filtered by relevance, so a large "nice to have"
checklist doesn't drown the LLM's context in rules that don't apply to
this particular document.
"""

import re

from rank_bm25 import BM25Okapi

from app.document_review.schemas import RuleInput

_STOPWORDS = {
    "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
    "of", "at", "by", "for", "with", "and", "or", "to", "from", "in", "on",
    "must", "should", "shall", "document", "show", "showing",
}


def _tokenize(text: str) -> list[str]:
    return [t for t in re.findall(r"[a-z0-9]+", text.lower()) if t not in _STOPWORDS]


def select_relevant_rules(
    rules: list[RuleInput], document_text: str, top_k: int = 8
) -> list[RuleInput]:
    mandatory = [r for r in rules if r.mandatory]
    optional = [r for r in rules if not r.mandatory]

    if not optional:
        return mandatory

    query_tokens = _tokenize(document_text)
    if not query_tokens:
        # Nothing extracted from the doc to match against — fall back to
        # including every optional rule too rather than silently dropping
        # them; the LLM (which also sees the raw extraction status) is
        # better placed to say "couldn't verify" per-rule than we are.
        return mandatory + optional

    index = BM25Okapi([_tokenize(r.text) for r in optional])
    scores = index.get_scores(query_tokens)
    ranked = sorted(zip(scores, optional), key=lambda x: x[0], reverse=True)
    relevant = [r for score, r in ranked[:top_k] if score > 0]

    return mandatory + relevant
