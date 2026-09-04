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
from app.security import Caller
from app.tools import scylla_api


def _fmt(items, empty_msg: str) -> str:
    return "\n".join(items) if items else empty_msg


def build_tools(caller: Caller) -> list:
    token = caller.raw_token
    role = caller.role

    @tool
    async def search_scylla_knowledge(query: str) -> str:
        """Search Scylla's own knowledge base (what Scylla is, how registration/
        approval works, navigation help, known platform limitations) for
        conceptual/how-things-work questions. NOT for live data like specific
        teams/vehicles/vendors — use the other tools for that."""
        chunks = retriever.retrieve(query, top_k=3)
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

    tools = [
        search_scylla_knowledge,
        list_teams,
        get_team_profile,
        list_vendors,
        get_vendor_profile,
        search_marketplace,
    ]

    # Authenticated-only tools: only offered to the model at all when we
    # actually have a token to forward. Even then, Express independently
    # re-checks the token on every call — this is a UX/relevance filter,
    # not the security boundary.
    if token:

        @tool
        async def get_my_team_profile() -> str:
            """Get the CALLING team admin/member's own (private) team profile.
            Only usable when the caller is logged in as a team admin or member."""
            try:
                data = await scylla_api.get_my_team_profile(token)
            except scylla_api.ScyllaApiError as e:
                return f"[unavailable: {e.message}]"
            return f"Your team: {data.get('name')}, status: {data.get('status')}"

        @tool
        async def get_my_team_vehicles() -> str:
            """List the CALLING team's own vehicles. Only usable when the caller
            is logged in as a team admin or member."""
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
            """List the CALLING team's own members. Only usable when the caller
            is logged in as a team admin or member."""
            try:
                members = await scylla_api.get_my_team_members(token)
            except scylla_api.ScyllaApiError as e:
                return f"[unavailable: {e.message}]"
            return _fmt(
                [f"- {m.get('name')} - {m.get('role')}" for m in members],
                "Your team hasn't added any members yet.",
            )

        tools += [get_my_team_profile, get_my_team_vehicles, get_my_team_members]

    if role == "admin":

        @tool
        async def get_admin_dashboard_stats() -> str:
            """Get platform-wide admin dashboard stats. Only usable by an admin."""
            try:
                data = await scylla_api.get_admin_dashboard_stats(token)
            except scylla_api.ScyllaApiError as e:
                return f"[unavailable: {e.message}]"
            return str(data)

        tools.append(get_admin_dashboard_stats)

    return tools
