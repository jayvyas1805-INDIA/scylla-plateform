"""
Builds the list of LangChain tools available for ONE specific request.

Deliberately built fresh per-request (not module-level) because each
tool closes over the caller's own JWT and role. The LLM can choose
WHICH tool to call and with what public-facing arguments (e.g. a
team_id), but it can never choose or override WHOSE token is used —
that's fixed by us before the LLM ever sees a tool. This is the actual
prompt-injection defense for the "call the admin API on my behalf"
class of attack: there is no parameter the model could set that changes
whose identity a tool call runs as.
"""

from langchain_core.tools import tool

from app.knowledge.retrieval import retriever
from app.orchestrator.navigation import resolve_route, routes_for_role
from app.security import Caller
from app.tools import scylla_api


def _fmt(items, empty_msg: str) -> str:
    return "\n".join(items) if items else empty_msg


def build_tools(caller: Caller, events: list | None = None) -> list:
    """
    events: an optional mutable list that navigate_to/compare_* tools
    append structured side-channel payloads to (e.g.
    {"type": "navigate", "route": "/teams-directory"}), for the
    orchestrator to surface to the frontend alongside the model's text
    reply. Kept separate from the tool's own return string (which goes
    back to the LLM) because a route path or a comparison table is
    meant for the FRONTEND to render/act on, not for the model to
    recite back verbatim.
    """
    if events is None:
        events = []

    token = caller.raw_token
    role = caller.role

    @tool
    async def search_scylla_knowledge(query: str) -> str:
        """Search Scylla's own knowledge base (what Scylla is, how registration/
        approval works, navigation help, known platform limitations) for
        conceptual/how-things-work questions. NOT for live data like specific
        teams/vehicles/vendors — use the other tools for that."""
        chunks = retriever.retrieve(query)
        if not chunks:
            return "No matching knowledge found."
        return "\n\n---\n\n".join(c.text for c in chunks)

    @tool
    async def list_teams() -> str:
        """List all approved racing teams (name, tagline, category, and id).
        Call this first if you need a team's id and don't already have one
        from the current page context."""
        try:
            teams = await scylla_api.list_teams()
        except scylla_api.ScyllaApiError as e:
            return f"[unavailable: {e.message}]"
        return _fmt(
            [f"- {t.get('name')} (id: {t.get('_id')}, category: {t.get('category')})" for t in teams],
            "No approved teams found.",
        )

    @tool
    async def get_team_profile(team_id: str) -> str:
        """Get one team's full public profile by its exact id: members, vehicles,
        achievements, sponsors, gallery, description. The id MUST come from
        list_teams or the current page context — never invent one."""
        try:
            data = await scylla_api.get_team_profile(team_id)
        except scylla_api.ScyllaApiError as e:
            return f"[unavailable: {e.message}]"

        members = data.get("members", [])
        vehicles = data.get("vehicles", [])
        achievements = data.get("achievements", [])
        sponsors = data.get("sponsors", [])

        member_lines = [f"{m.get('name')} - {m.get('role')}" for m in members]
        vehicle_lines = [f"{v.get('name')} {v.get('model')}" for v in vehicles]

        return (
            f"Team: {data.get('name')}\n"
            f"Category: {data.get('category')}\n"
            f"Tagline: {data.get('tagline', '')}\n"
            f"Description: {data.get('description', '')}\n"
            f"Members: {_fmt(member_lines, 'No members listed.')}\n"
            f"Vehicles: {_fmt(vehicle_lines, 'No vehicles listed.')}\n"
            f"Achievements: {_fmt([a.get('title') for a in achievements], 'No achievements listed.')}\n"
            f"Sponsors: {_fmt([s.get('name') for s in sponsors], 'This team has not listed any sponsors.')}"
        )

    @tool
    async def list_vendors() -> str:
        """List all approved vendors (business name, category, id)."""
        try:
            vendors = await scylla_api.list_vendors()
        except scylla_api.ScyllaApiError as e:
            return f"[unavailable: {e.message}]"
        return _fmt(
            [f"- {v.get('businessName')} (id: {v.get('_id')}, category: {v.get('category')})" for v in vendors],
            "No approved vendors found.",
        )

    @tool
    async def get_vendor_profile(vendor_id: str) -> str:
        """Get one vendor's full public profile by its exact id: services, past
        projects, business hours, gallery. The id MUST come from list_vendors
        or the current page context — never invent one."""
        try:
            data = await scylla_api.get_vendor_profile(vendor_id)
        except scylla_api.ScyllaApiError as e:
            return f"[unavailable: {e.message}]"

        services = data.get("services", [])
        projects = data.get("projects", [])

        return (
            f"Vendor: {data.get('businessName')}\n"
            f"Category: {data.get('category')}\n"
            f"Description: {data.get('companyDesc', '')}\n"
            f"Services: {_fmt([s.get('name') for s in services], 'No services listed.')}\n"
            f"Projects: {_fmt([p.get('title') for p in projects], 'No past projects listed.')}"
        )

    @tool
    async def search_marketplace(category: str | None = None) -> str:
        """Search approved marketplace products, optionally by category."""
        try:
            products = await scylla_api.get_marketplace_products(
                {"category": category} if category else None
            )
        except scylla_api.ScyllaApiError as e:
            return f"[unavailable: {e.message}]"
        return _fmt(
            [f"- {p.get('title')} — ₹{p.get('price')} ({p.get('condition')})" for p in products],
            "No matching marketplace products found.",
        )

    @tool
    async def navigate_to(destination_key: str, entity_id: str | None = None) -> str:
        """
        Take the user to a real page in THIS app. destination_key MUST be one
        of the exact keys below (never invent a key or a raw path) — pick the
        one matching what the user asked for:
        {allowed_keys}
        entity_id is only used with 'teams_directory'/'vendors_directory' to
        go straight to one team/vendor's page, and only if you already have
        its real id from list_teams/list_vendors/get_team_profile — never
        guess an id.
        """
        route = resolve_route(role, destination_key, entity_id)
        if route is None:
            return (
                f"[navigation unavailable: '{destination_key}' isn't a real page "
                f"for this app/role — don't tell the user you're navigating them there]"
            )
        events.append({"type": "navigate", "route": route})
        return f"Navigating to {route}."

    navigate_to.description = navigate_to.description.format(
        allowed_keys=", ".join(sorted(routes_for_role(role).keys()))
    )

    def _team_summary_row(data: dict) -> dict:
        return {
            "name": data.get("name"),
            "category": data.get("category"),
            "members": len(data.get("members", [])),
            "vehicles": len(data.get("vehicles", [])),
            "achievements": len(data.get("achievements", [])),
            "sponsors": len(data.get("sponsors", [])),
        }

    def _vendor_summary_row(data: dict) -> dict:
        return {
            "name": data.get("businessName"),
            "category": data.get("category"),
            "services": len(data.get("services", [])),
            "projects": len(data.get("projects", [])),
        }

    @tool
    async def compare_teams(team_id_a: str, team_id_b: str) -> str:
        """Compare two teams side by side by their exact ids (from list_teams,
        get_my_team_profile, or page context — never invent an id). If the
        user means "my team" as one side, call get_my_team_profile first to
        get its real id."""
        try:
            data_a = await scylla_api.get_team_profile(team_id_a)
            data_b = await scylla_api.get_team_profile(team_id_b)
        except scylla_api.ScyllaApiError as e:
            return f"[unavailable: {e.message}]"

        row_a, row_b = _team_summary_row(data_a), _team_summary_row(data_b)
        events.append({"type": "comparison", "entity_type": "team", "a": row_a, "b": row_b})
        return f"Comparison ready: {row_a['name']} vs {row_b['name']}."

    @tool
    async def compare_vendors(vendor_id_a: str, vendor_id_b: str) -> str:
        """Compare two vendors side by side by their exact ids (from
        list_vendors, get_my_vendor_profile, or page context — never invent
        an id)."""
        try:
            data_a = await scylla_api.get_vendor_profile(vendor_id_a)
            data_b = await scylla_api.get_vendor_profile(vendor_id_b)
        except scylla_api.ScyllaApiError as e:
            return f"[unavailable: {e.message}]"

        row_a, row_b = _vendor_summary_row(data_a), _vendor_summary_row(data_b)
        events.append({"type": "comparison", "entity_type": "vendor", "a": row_a, "b": row_b})
        return f"Comparison ready: {row_a['name']} vs {row_b['name']}."

    tools = [
        search_scylla_knowledge,
        list_teams,
        get_team_profile,
        list_vendors,
        get_vendor_profile,
        search_marketplace,
        navigate_to,
        compare_teams,
        compare_vendors,
    ]

    # Authenticated-only tools: gated by the CALLER'S ACTUAL ROLE, not just
    # "has a token" — a vendor's token shouldn't even be offered team-only
    # tools (Express would reject the call anyway, but offering the wrong
    # tool set wastes a call and can confuse the model about who it's
    # talking to). Express still independently re-checks the token on every
    # call regardless — this is a UX/relevance filter, not the security
    # boundary.
    if token and role in ("TEAM_ADMIN", "MEMBER"):

        @tool
        async def get_my_team_profile() -> str:
            """Get the CALLING team admin/member's own (private) team profile,
            including its id (use this id for compare_teams or navigate_to
            when the user says "my team")."""
            try:
                data = await scylla_api.get_my_team_profile(token)
            except scylla_api.ScyllaApiError as e:
                return f"[unavailable: {e.message}]"
            return f"Your team: {data.get('name')} (id: {data.get('_id')}), status: {data.get('status')}"

        @tool
        async def get_my_team_vehicles() -> str:
            """List the CALLING team's own vehicles."""
            try:
                vehicles = await scylla_api.get_my_team_vehicles(token)
            except scylla_api.ScyllaApiError as e:
                return f"[unavailable: {e.message}]"
            return _fmt(
                [f"- {v.get('name')} {v.get('model')}" for v in vehicles],
                "Your team hasn't added any vehicles yet.",
            )

        @tool
        async def get_my_team_members() -> str:
            """List the CALLING team's own members."""
            try:
                members = await scylla_api.get_my_team_members(token)
            except scylla_api.ScyllaApiError as e:
                return f"[unavailable: {e.message}]"
            return _fmt(
                [f"- {m.get('name')} - {m.get('role')}" for m in members],
                "Your team hasn't added any members yet.",
            )

        tools += [get_my_team_profile, get_my_team_vehicles, get_my_team_members]

    if token and role == "VENDOR":

        @tool
        async def get_my_vendor_profile() -> str:
            """Get the CALLING vendor's own (private) profile, including its id
            (use this id for compare_vendors or navigate_to when the user
            says "my business"/"my profile")."""
            try:
                data = await scylla_api.get_my_vendor_profile(token)
            except scylla_api.ScyllaApiError as e:
                return f"[unavailable: {e.message}]"
            return (
                f"Your business: {data.get('businessName')} (id: {data.get('_id')}), "
                f"status: {data.get('status')}"
            )

        tools.append(get_my_vendor_profile)

    if role == "admin":

        @tool
        async def get_admin_dashboard_stats() -> str:
            """Get platform-wide admin dashboard stats."""
            try:
                data = await scylla_api.get_admin_dashboard_stats(token)
            except scylla_api.ScyllaApiError as e:
                return f"[unavailable: {e.message}]"
            return str(data)

        @tool
        async def get_pending_approvals_summary() -> str:
            """Get a summary of teams/vendors currently awaiting admin approval
            (status = 'pending'). Use this when the admin asks what needs their
            attention, or for a quick digest of open approvals."""
            try:
                data = await scylla_api.get_pending_approvals(token)
            except scylla_api.ScyllaApiError as e:
                return f"[unavailable: {e.message}]"

            pending_teams = [t for t in data.get("teams", []) if t.get("status") == "pending"]
            pending_vendors = [v for v in data.get("vendors", []) if v.get("status") == "pending"]

            team_lines = [f"- {t.get('name')}" for t in pending_teams[:5]]
            vendor_lines = [f"- {v.get('businessName')}" for v in pending_vendors[:5]]

            return (
                f"{len(pending_teams)} team(s) pending approval"
                + (f":\n{_fmt(team_lines, '')}" if team_lines else ".")
                + f"\n{len(pending_vendors)} vendor(s) pending approval"
                + (f":\n{_fmt(vendor_lines, '')}" if vendor_lines else ".")
            )

        tools += [get_admin_dashboard_stats, get_pending_approvals_summary]

    return tools
