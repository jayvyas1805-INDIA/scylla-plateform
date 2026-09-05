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


def _build_corpus_stopwords(token_lists: list[list[str]], doc_freq_threshold: float = 0.5) -> set[str]:
    """
    Words that show up in a large fraction of chunks (like a platform's
    own brand name, which naturally appears almost everywhere) carry
    almost no discriminative signal for BM25 and can dominate scores on
    a small corpus purely through raw overlap. Drop anything appearing
    in more than `doc_freq_threshold` of chunks.
    """
    if not token_lists:
        return set()

    doc_count = len(token_lists)
    freq: dict[str, int] = {}
    for tokens in token_lists:
        for tok in set(tokens):
            freq[tok] = freq.get(tok, 0) + 1

    return {tok for tok, count in freq.items() if count / doc_count > doc_freq_threshold}


class KnowledgeRetriever:
    def __init__(self) -> None:
        self._chunks = _load_chunks()
        raw_token_lists = [_raw_tokenize(c.text) for c in self._chunks]

        self._corpus_stopwords = _build_corpus_stopwords(raw_token_lists) | _GENERIC_STOPWORDS

        corpus = [self._tokenize(toks) for toks in raw_token_lists]
        self._bm25 = BM25Okapi(corpus) if corpus else None

    def _tokenize(self, raw_tokens: list[str]) -> list[str]:
        return [t for t in raw_tokens if t not in self._corpus_stopwords]

    def retrieve(self, query: str, top_k: int = 2, min_score: float = 0.35) -> list[Chunk]:
        if not self._bm25 or not self._chunks:
            return []

        query_tokens = self._tokenize(_raw_tokenize(query))
        if not query_tokens:
            return []

        scores = self._bm25.get_scores(query_tokens)
        ranked = sorted(zip(scores, self._chunks), key=lambda x: x[0], reverse=True)
        return [chunk for score, chunk in ranked[:top_k] if score > min_score]


# Loaded once at import time — the knowledge base is small and static
# within a running process; restart the service to pick up doc edits.
retriever = KnowledgeRetriever()
