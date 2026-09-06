import pytest
from unittest.mock import AsyncMock, patch

from app.orchestrator.tools_factory import build_tools
from app.security import Caller
from app.tools.scylla_api import ScyllaApiError


def _tool(tools, name):
    return next(t for t in tools if t.name == name)


# ---------- Grounding: missing/unavailable data is reported, not invented ----------

@pytest.mark.asyncio
async def test_get_team_profile_reports_no_sponsors_rather_than_inventing():
    caller = Caller(raw_token=None, role=None, user_id=None)
    tools = build_tools(caller)

    fake_team = {
        "name": "Alpha Racing",
        "category": "Rally",
        "tagline": "",
        "description": "",
        "members": [],
        "vehicles": [],
        "achievements": [],
        "sponsors": [],  # real schema field, genuinely empty for this team
    }

    with patch("app.tools.scylla_api.get_team_profile", new=AsyncMock(return_value=fake_team)):
        result = await _tool(tools, "get_team_profile").ainvoke({"team_id": "123"})

    assert "This team has not listed any sponsors" in result
    # Must not contain a plausible-looking invented sponsor name.
    assert "Sponsors: This team has not listed any sponsors." in result


@pytest.mark.asyncio
async def test_unavailable_data_surfaces_as_explicit_unavailable_message():
    caller = Caller(raw_token=None, role=None, user_id=None)
    tools = build_tools(caller)

    with patch(
        "app.tools.scylla_api.get_team_profile",
        new=AsyncMock(side_effect=ScyllaApiError(404, "That wasn't found.")),
    ):
        result = await _tool(tools, "get_team_profile").ainvoke({"team_id": "does-not-exist"})

    assert "[unavailable:" in result


# ---------- Authorization: private tools aren't even offered without proper caller ----------

def test_public_caller_does_not_get_authenticated_tools():
    public_caller = Caller(raw_token=None, role=None, user_id=None)
    tools = build_tools(public_caller)
    names = {t.name for t in tools}

    assert "get_my_team_profile" not in names
    assert "get_my_team_vehicles" not in names
    assert "get_admin_dashboard_stats" not in names


def test_logged_in_member_gets_own_team_tools_but_not_admin_tools():
    member_caller = Caller(raw_token="fake.jwt.token", role="MEMBER", user_id="u1")
    tools = build_tools(member_caller)
    names = {t.name for t in tools}

    assert "get_my_team_profile" in names
    assert "get_my_vendor_profile" not in names
    assert "get_admin_dashboard_stats" not in names


def test_logged_in_vendor_gets_own_vendor_tool_but_not_team_tools():
    vendor_caller = Caller(raw_token="fake.jwt.token", role="VENDOR", user_id="v1")
    tools = build_tools(vendor_caller)
    names = {t.name for t in tools}

    assert "get_my_vendor_profile" in names
    assert "get_my_team_profile" not in names
    assert "get_my_team_vehicles" not in names


def test_admin_role_gets_admin_tool():
    admin_caller = Caller(raw_token="fake.jwt.token", role="admin", user_id="a1")
    tools = build_tools(admin_caller)
    names = {t.name for t in tools}

    assert "get_admin_dashboard_stats" in names


def test_no_tool_exposes_the_caller_token_as_an_llm_settable_argument():
    """
    The actual authorization boundary: the model can choose WHICH tool
    and WHICH public args (team_id, etc.), but must never be able to
    supply or override whose token a tool call runs as.
    """
    admin_caller = Caller(raw_token="fake.jwt.token", role="admin", user_id="a1")
    tools = build_tools(admin_caller)

    for t in tools:
        schema_fields = set(t.args_schema.model_fields.keys()) if t.args_schema else set()
        assert "token" not in schema_fields
        assert "raw_token" not in schema_fields
        assert "role" not in schema_fields
