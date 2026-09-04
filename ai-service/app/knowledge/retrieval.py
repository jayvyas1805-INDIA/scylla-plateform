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


@dataclass
class Chunk:
    source: str
    heading: str
    text: str


def _tokenize(text: str) -> list[str]:
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
            bold_q_match = re.match(r"\*\*(.+?)\*\*", block)
            if heading_match:
                current_heading = heading_match.group(1)
                continue  # heading line alone isn't useful as its own chunk
            heading = bold_q_match.group(1) if bold_q_match else current_heading
            chunks.append(Chunk(source=path.stem, heading=heading, text=block))
    return chunks


class KnowledgeRetriever:
    def __init__(self) -> None:
        self._chunks = _load_chunks()
        corpus = [_tokenize(c.text) for c in self._chunks]
        self._bm25 = BM25Okapi(corpus) if corpus else None

    def retrieve(self, query: str, top_k: int = 3, min_score: float = 0.05) -> list[Chunk]:
        if not self._bm25 or not self._chunks:
            return []

        scores = self._bm25.get_scores(_tokenize(query))
        ranked = sorted(zip(scores, self._chunks), key=lambda x: x[0], reverse=True)
        return [chunk for score, chunk in ranked[:top_k] if score > min_score]


# Loaded once at import time — the knowledge base is small and static
# within a running process; restart the service to pick up doc edits.
retriever = KnowledgeRetriever()
