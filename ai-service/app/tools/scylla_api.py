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
    url = f"{settings.SCYLLA_BACKEND_URL}{path}"
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(url, headers=_headers(token), params=params)

    if resp.status_code == 401 or resp.status_code == 403:
        raise ScyllaApiError(resp.status_code, "You don't have access to that information.")
    if resp.status_code == 404:
        raise ScyllaApiError(404, "That wasn't found.")
    if resp.status_code >= 400:
        raise ScyllaApiError(resp.status_code, "Scylla's backend couldn't complete that request.")

    return resp.json()


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

async def get_admin_dashboard_stats(token: str) -> dict:
    """Requires admin token. Platform-wide dashboard stats."""
    return await _get("/api/admin/dashboard", token=token)


# ---- Landing content ----

async def get_landing_content() -> list:
    """Public. Approved landing-page content items."""
    return await _get("/api/content")
