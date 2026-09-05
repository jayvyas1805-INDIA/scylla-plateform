from app.knowledge.retrieval import retriever


def test_generic_query_does_not_surface_unrelated_department_faq():
    """
    Regression test: 'What is Scylla?' previously retrieved the tangential
    'no formal departments' FAQ entry just because the word 'Scylla'
    appears in nearly every chunk, and the model then reported it
    unprompted. Corpus-specific stopword filtering (dropping words that
    appear in most chunks, since they carry no discriminative signal)
    is what fixes this.
    """
    chunks = retriever.retrieve("What is Scylla?")
    headings = [c.heading for c in chunks]
    assert not any("department" in h.lower() for h in headings)


def test_targeted_department_query_still_finds_the_faq_entry():
    chunks = retriever.retrieve("departments engineering")
    headings = [c.heading for c in chunks]
    assert any("department" in h.lower() for h in headings)


def test_targeted_events_query_still_finds_the_faq_entry():
    chunks = retriever.retrieve("does scylla have upcoming events")
    headings = [c.heading for c in chunks]
    assert any("events" in h.lower() for h in headings)
