"""
Lightweight RAG retrieval over Scylla's own static knowledge docs
(About, FAQ, etc. — see app/knowledge/docs/*.md).

Deliberately NOT using a vector DB or an embeddings API here: the
knowledge base is small and mostly static, and pulling in another paid
API call or another piece of infrastructure for this would violate the
"avoid unnecessary infrastructure" principle for something this size.
BM25 (keyword/frequency based) is a well-understood, dependency-light
retrieval method that works well for exactly this kind of small,
FAQ-shaped corpus. If the knowledge base grows much larger or needs
semantic matching beyond keyword overlap, swap this module for an
embeddings-based retriever without touching any of its callers.
"""

import re
from dataclasses import dataclass
from pathlib import Path

from rank_bm25 import BM25Okapi

DOCS_DIR = Path(__file__).parent / "docs"

_GENERIC_STOPWORDS = {
    "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
    "what", "which", "who", "whom", "this", "that", "these", "those",
    "do", "does", "did", "doing", "have", "has", "had", "having",
    "of", "at", "by", "for", "with", "about", "against", "between",
    "into", "through", "during", "before", "after", "to", "from", "in",
    "on", "off", "over", "under", "and", "or", "if", "than", "so", "not",
}

# NOTE on an earlier (reverted) approach: a prior version of this module
# also stopworded the platform's own brand name ("scylla"), reasoning
# that it appears in nearly every chunk and adds no signal. That fixed
# one bug (a generic "what is Scylla" query surfacing an unrelated FAQ
# entry) but broke another: for a single-topic-word query like "What is
# Scylla?", stripping the ONE content word it has left zero query tokens,
# so retrieval returned nothing at all. Absolute score thresholds have
# the same fragility from the other direction — a value tuned against
# one query's score scale doesn't transfer to another query's scale (see
# retrieve()'s min_relative_score below for the actual fix).


@dataclass
class Chunk:
    source: str
    heading: str
    text: str


def _raw_tokenize(text: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", text.lower())


def _load_chunks() -> list[Chunk]:
    chunks: list[Chunk] = []
    for path in sorted(DOCS_DIR.glob("*.md")):
        content = path.read_text(encoding="utf-8")
        # Split on blank lines: this matches both markdown-heading-delimited
        # sections AND the FAQ's "**Question?**\nanswer" blocks separated
        # by blank lines, giving BM25 many small, specific chunks to score
        # against instead of a couple of huge whole-file chunks.
        blocks = re.split(r"\n\s*\n", content)
        current_heading = path.stem
        for block in blocks:
            block = block.strip()
            if not block:
                continue
            heading_match = re.match(r"#{1,3}\s*(.+)", block)
            bold_q_match = re.match(r"\*\*(.+?)\*\*", block, re.DOTALL)
            if heading_match:
                current_heading = heading_match.group(1)
                continue  # heading line alone isn't useful as its own chunk
            heading = bold_q_match.group(1) if bold_q_match else current_heading
            chunks.append(Chunk(source=path.stem, heading=heading, text=block))
    return chunks


class KnowledgeRetriever:
    def __init__(self) -> None:
        self._chunks = _load_chunks()
        corpus = [self._tokenize(_raw_tokenize(c.text)) for c in self._chunks]
        self._bm25 = BM25Okapi(corpus) if corpus else None

    def _tokenize(self, raw_tokens: list[str]) -> list[str]:
        return [t for t in raw_tokens if t not in _GENERIC_STOPWORDS]

    def retrieve(self, query: str, top_k: int = 3) -> list[Chunk]:
        """
        Returns the top_k chunks by BM25 rank (score > 0 only — no real
        term overlap at all means no result). Deliberately NOT filtered
        by any score threshold, relative or absolute: testing this
        module found a real case where excluding one tangential match
        (a "departments" FAQ entry leaking into a "What is Scylla?"
        query) required threshold > 0.87 of the top score, while
        correctly including another genuinely relevant match (an
        "admin approves teams" entry for a "where can admin approve
        teams" query) required threshold <= 0.79 — a direct, provable
        contradiction. No single number can satisfy both on a small,
        single-topic keyword corpus like this one.

        The realistic fix, and the one actually used here: retrieval's
        job is recall (surface plausible candidates), not precision.
        Precision — ignoring a candidate that's tangential to what was
        actually asked — is the LLM's job, per the system prompt's
        explicit "don't volunteer unrelated facts" rule. This is also
        how production RAG systems are usually split. A corpus this
        small with true semantic ambiguity (not just keyword overlap)
        would need embedding-based retrieval instead of BM25 — see the
        README for why that wasn't done here.
        """
        if not self._bm25 or not self._chunks:
            return []

        query_tokens = self._tokenize(_raw_tokenize(query))
        if not query_tokens:
            return []

        scores = self._bm25.get_scores(query_tokens)
        ranked = sorted(zip(scores, self._chunks), key=lambda x: x[0], reverse=True)
        return [chunk for score, chunk in ranked[:top_k] if score > 0]


# Loaded once at import time — the knowledge base is small and static
# within a running process; restart the service to pick up doc edits.
retriever = KnowledgeRetriever()
