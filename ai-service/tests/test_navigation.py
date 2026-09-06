from app.orchestrator.navigation import CLIENT_ROUTES, ADMIN_ROUTES, resolve_route


def test_known_client_destination_resolves_to_its_real_route():
    assert resolve_route(None, "teams_directory") == "/teams-directory"
    assert resolve_route("MEMBER", "my_team_vehicles") == "/team/vehicles"


def test_known_admin_destination_resolves_to_its_real_route():
    assert resolve_route("admin", "admin_approvals") == "/approvals"


def test_made_up_destination_key_resolves_to_none():
    assert resolve_route(None, "admin_console") is None
    assert resolve_route(None, "totally_made_up") is None


def test_admin_caller_cannot_reach_client_only_destinations():
    # 'teams_directory' is a CLIENT_ROUTES key, not in ADMIN_ROUTES
    assert resolve_route("admin", "teams_directory") is None


def test_non_admin_caller_cannot_reach_admin_only_destinations():
    assert resolve_route(None, "admin_approvals") is None
    assert resolve_route("MEMBER", "admin_approvals") is None


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
    for path in list(CLIENT_ROUTES.values()) + list(ADMIN_ROUTES.values()):
        assert path.startswith("/")
