from app.orchestrator.navigation import (
    PUBLIC_ROUTES,
    TEAM_ONLY_ROUTES,
    VENDOR_ONLY_ROUTES,
    ADMIN_ROUTES,
    resolve_route,
    routes_for_role,
)


def test_known_public_destination_resolves_for_any_caller():
    assert resolve_route(None, "teams_directory") == "/teams-directory"
    assert resolve_route("MEMBER", "teams_directory") == "/teams-directory"
    assert resolve_route("vendor", "teams_directory") == "/teams-directory"


def test_known_admin_destination_resolves_to_its_real_route():
    assert resolve_route("admin", "admin_approvals") == "/approvals"


def test_made_up_destination_key_resolves_to_none():
    assert resolve_route(None, "admin_console") is None
    assert resolve_route(None, "totally_made_up") is None


def test_admin_caller_cannot_reach_client_only_destinations():
    assert resolve_route("admin", "teams_directory") is None


def test_non_admin_caller_cannot_reach_admin_only_destinations():
    assert resolve_route(None, "admin_approvals") is None
    assert resolve_route("MEMBER", "admin_approvals") is None


# --- Regression tests for the real access-control bug reported ---
#
# An earlier version returned the full team-portal + vendor-portal route
# set to ANY non-admin caller, including an unauthenticated guest — so
# the assistant would happily navigate_to a guest into '/vendor/quote'
# or '/team/messages', private pages meant only for a logged-in
# team/vendor. These tests lock in that a caller only ever gets the
# route tier matching their REAL authenticated role.

def test_unauthenticated_guest_cannot_navigate_to_any_private_team_page():
    for key in TEAM_ONLY_ROUTES:
        assert resolve_route(None, key) is None, f"guest should not reach {key}"


def test_unauthenticated_guest_cannot_navigate_to_any_private_vendor_page():
    for key in VENDOR_ONLY_ROUTES:
        assert resolve_route(None, key) is None, f"guest should not reach {key}"


def test_team_caller_can_reach_team_pages_but_not_vendor_pages():
    assert resolve_route("MEMBER", "my_team_vehicles") == "/team/vehicles"
    assert resolve_route("TEAM_ADMIN", "my_team_messages") == "/team/messages"
    for key in VENDOR_ONLY_ROUTES:
        assert resolve_route("MEMBER", key) is None, f"team caller should not reach {key}"


def test_vendor_caller_can_reach_vendor_pages_but_not_team_pages():
    assert resolve_route("vendor", "my_vendor_quotes") == "/vendor/quote"
    for key in TEAM_ONLY_ROUTES:
        assert resolve_route("vendor", key) is None, f"vendor caller should not reach {key}"


def test_guest_route_set_contains_no_private_pages_at_all():
    guest_routes = routes_for_role(None)
    for key in list(TEAM_ONLY_ROUTES) + list(VENDOR_ONLY_ROUTES) + list(ADMIN_ROUTES):
        assert key not in guest_routes


def test_valid_object_id_is_appended_for_directory_pages():
    route = resolve_route(None, "teams_directory", "507f1f77bcf86cd799439011")
    assert route == "/teams-directory/507f1f77bcf86cd799439011"


def test_malformed_entity_id_is_ignored_not_injected_into_the_path():
    """
    The entity_id comes from the LLM's tool-call arguments — never trust
    it to be a safe path segment. A non-ObjectId-shaped string must fall
    back to the base route rather than being concatenated in.
    """
    route = resolve_route(None, "teams_directory", "../../etc/passwd")
    assert route == "/teams-directory"
    assert ".." not in route


def test_every_route_value_starts_with_a_slash():
    all_routes = {**PUBLIC_ROUTES, **TEAM_ONLY_ROUTES, **VENDOR_ONLY_ROUTES, **ADMIN_ROUTES}
    for path in all_routes.values():
        assert path.startswith("/")
