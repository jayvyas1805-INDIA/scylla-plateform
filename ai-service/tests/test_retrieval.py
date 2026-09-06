from app.knowledge.retrieval import retriever


def test_generic_scylla_query_ranks_the_about_page_first():
    """
    Regression test for the original bug: 'What is Scylla?' should rank
    its own topical answer (About Scylla) #1. It's expected — and fine —
    that a tangential chunk (e.g. the departments FAQ, which also
    mentions "Scylla") can still appear lower in the candidate list;
    BM25 on a small corpus can't be made to exclude every tangential
    candidate (see retrieval.py's retrieve() docstring for a worked
    proof that no single threshold can do this). What actually matters
    is (a) the right answer ranks first, and (b) the system prompt
    tells the model not to volunteer whatever tangential candidates
    happen to also come back — that's tested at the prompt level in
    test_security.py.
    """
    chunks = retriever.retrieve("What is Scylla?")
    assert chunks[0].heading == "About Scylla"


def test_targeted_department_query_ranks_the_faq_entry_first():
    chunks = retriever.retrieve("departments engineering")
    assert "department" in chunks[0].heading.lower()


def test_targeted_events_query_ranks_the_faq_entry_first():
    chunks = retriever.retrieve("does scylla have upcoming events")
    assert "events" in chunks[0].heading.lower()


def test_teams_query_ranks_the_teams_answer_first_not_vendors():
    """
    Regression test: an earlier (reverted) version of this module
    stopworded 'team'/'teams' as "too common in this corpus", which
    broke exactly this — a teams question nearly tying with, or losing
    to, the vendors answer. 'team' and 'teams' must never be treated as
    non-discriminative stopwords here.
    """
    chunks = retriever.retrieve("Where can I see the teams?")
    assert chunks[0].heading == "Where can I see all teams?"


def test_vendors_query_ranks_the_vendors_answer_first_not_teams():
    chunks = retriever.retrieve("Where can I see the vendors?")
    assert chunks[0].heading == "Where can I see all vendors?"


def test_admin_approval_navigation_query_surfaces_the_real_fact():
    """
    Regression test: 'where can admin approve teams' previously had
    nothing grounded to retrieve, so the model invented a fabricated
    step-by-step UI flow. The real fact now needs to be SOMEWHERE in
    the candidate set (not necessarily ranked #1, since the query
    literally contains the word "teams" which legitimately matches the
    teams-directory FAQ too) so the model has the real fact available
    to ground its answer in.
    """
    chunks = retriever.retrieve("where can admin approve teams", top_k=5)
    headings = [c.heading.lower() for c in chunks]
    assert any("approve team" in h for h in headings)
