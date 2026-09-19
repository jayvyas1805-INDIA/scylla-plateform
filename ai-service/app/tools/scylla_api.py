"""
Thin async wrapper around the EXISTING Express APIs. This module never
touches MongoDB directly and never re-implements authorization — every
function just calls a real Express route, forwarding the caller's JWT
when given one, and lets Express's own authUser/adminAuth/teamAuth
middleware make the actual allow/deny decision exactly as it does for
the normal frontend.

If Express returns 401/403, that's surfaced as a ScyllaApiError the
orchestrator turns into a plain "you don't have access to that" reply
— never as a raw stack trace or bypassed silently.
"""

import httpx

from app.config import settings

_client: httpx.AsyncClient | None = None


def _get_client() -> httpx.AsyncClient:
    global _client
    if _client is None:
        _client = httpx.AsyncClient(base_url=settings.SCYLLA_BACKEND_URL, timeout=10)
    return _client


class ScyllaApiError(Exception):
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message
        super().__init__(message)


def _headers(token: str | None) -> dict:
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


async def _get(path: str, token: str | None = None, params: dict | None = None):
    try:
        resp = await _get_client().get(path, headers=_headers(token), params=params)
    except httpx.RequestError as exc:
        # Connection refused, timeout, DNS failure, etc. — happens BEFORE
        # any HTTP response exists, so it's a different exception class
        # entirely from the status-code checks below. Previously this
        # propagated uncaught all the way to the router's generic
        # "Assistant is temporarily unavailable" 502 — which the model
        # never got a chance to respond to gracefully, since it wasn't a
        # tool result the model could react to, just a crash. Converting
        # it to the same ScyllaApiError type the tools already know how
        # to handle means the model can still give a normal, polite reply
        # ("that information isn't available right now") instead of the
        # whole turn failing.
        raise ScyllaApiError(
            503, "Scylla's backend isn't reachable right now."
        ) from exc

    if resp.status_code == 401 or resp.status_code == 403:
        raise ScyllaApiError(resp.status_code, "You don't have access to that information.")
    if resp.status_code == 404:
        raise ScyllaApiError(404, "That wasn't found.")
    if resp.status_code >= 400:
        raise ScyllaApiError(resp.status_code, "Scylla's backend couldn't complete that request.")

    try:
        return resp.json()
    except ValueError as exc:
        # A 2xx status doesn't guarantee a JSON body — a proxy/timeout
        # error page, an empty response, or a misconfigured route can all
        # return 200 with something that isn't JSON. Same reasoning as
        # the httpx.RequestError branch above: without this, resp.json()
        # raising here escapes every "except ScyllaApiError" the tools
        # already handle gracefully and crashes the whole turn instead of
        # letting the model give a normal "that's unavailable" reply.
        raise ScyllaApiError(
            502, "Scylla's backend returned something unexpected."
        ) from exc


# ---- Teams ----

async def list_teams() -> list:
    """Public. All approved teams (name, tagline, logo, category, achievements)."""
    return await _get("/api/teams")


async def get_team_profile(team_id: str) -> dict:
    """Public. Full public profile of one team: members, vehicles, achievements, sponsors, gallery."""
    return await _get(f"/api/teams/{team_id}")


# ---- Vendors ----

async def list_vendors() -> list:
    """Public. All approved vendors."""
    return await _get("/api/vendors")


async def get_vendor_profile(vendor_id: str) -> dict:
    """Public. Full public profile of one vendor: services, projects, business hours, gallery."""
    return await _get(f"/api/vendors/{vendor_id}")


# ---- Marketplace ----

async def get_marketplace_products(filters: dict | None = None) -> list:
    """Public. Approved marketplace products, optionally filtered (category/brand/etc.)."""
    return await _get("/api/products/marketplace", params=filters)


# ---- Events ----

async def list_events(page: int | None = None, limit: int | None = None) -> dict:
    """Public. Approved, upcoming-sorted events (name, date, location, organizer,
    entry fee, capacity, registration info), paginated. Mirrors the same public
    endpoint the Events page itself calls."""
    params = {}
    if page is not None:
        params["page"] = page
    if limit is not None:
        params["limit"] = limit
    return await _get("/api/public/events", params=params or None)


# ---- Authenticated, team-scoped (require the caller's own JWT) ----

async def get_my_team_profile(token: str) -> dict:
    """Requires TEAM_ADMIN or MEMBER token. The caller's own team's full (private) profile."""
    return await _get("/api/teams/profile", token=token)


async def get_my_team_vehicles(token: str) -> list:
    """Requires TEAM_ADMIN or MEMBER token. The caller's own team's vehicles."""
    return await _get("/api/vehicles", token=token)


async def get_my_team_members(token: str) -> list:
    """Requires TEAM_ADMIN or MEMBER token. The caller's own team's members."""
    return await _get("/api/member", token=token)


# ---- Admin-only ----

async def get_my_vendor_profile(token: str) -> dict:
    """Requires VENDOR token. The caller's own (private) vendor profile."""
    return await _get("/api/vendors/profile", token=token)


async def get_admin_dashboard_stats(token: str) -> dict:
    """Requires admin token. Platform-wide dashboard stats."""
    return await _get("/api/admin/dashboard", token=token)


async def get_pending_approvals(token: str) -> dict:
    """Requires admin token. Returns ALL teams/vendors — status filtering
    happens in the tool layer, matching what the real endpoint returns."""
    return await _get("/api/admin/pending", token=token)


# ---- Landing content ----

async def get_landing_content() -> list:
    """Public. Approved landing-page content items."""
    return await _get("/api/content")
