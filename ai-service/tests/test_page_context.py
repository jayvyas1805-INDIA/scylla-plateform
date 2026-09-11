from app.orchestrator.chain import _page_context_note
from app.schemas import ChatRequest, PageContext


def _req(entity_type=None, entity_id=None, route="/somewhere"):
    ctx = PageContext(route=route, entity_type=entity_type, entity_id=entity_id) if entity_type else None
    return ChatRequest(message="x", page_context=ctx)


def test_no_page_context_gives_no_note():
    assert _page_context_note(ChatRequest(message="x")) is None


def test_team_profile_with_id_gives_id_specific_note():
    note = _page_context_note(_req("team", "abc123"))
    assert "abc123" in note
    assert "team" in note


def test_vendor_profile_with_id_gives_id_specific_note():
    note = _page_context_note(_req("vendor", "xyz789"))
    assert "xyz789" in note


def test_self_context_page_names_the_relevant_tool():
    """
    Regression/feature test: a user on their own Vehicles page asking
    something ambiguous should get a hint pointing at get_my_team_vehicles
    without needing an entity id at all — this is the "richer page
    context" gap that was reported.
    """
    note = _page_context_note(_req("my_team_vehicles"))
    assert "get_my_team_vehicles" in note


def test_admin_approvals_page_names_the_pending_summary_tool():
    note = _page_context_note(_req("admin_approvals"))
    assert "get_pending_approvals_summary" in note


def test_unmapped_but_known_route_still_gets_a_generic_note():
    """Better than silence: even without a curated hint, the model should
    still know roughly where the user is."""
    note = _page_context_note(_req("some_future_page", route="/some/new/page"))
    assert "/some/new/page" in note
