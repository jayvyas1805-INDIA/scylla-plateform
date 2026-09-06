"""
Route whitelists the navigate_to tool is allowed to emit.

Every path here was verified against the actual router files
(Client/src/routes/AppRoutes.jsx and admin-dashboard/src/App.jsx) —
not guessed. This is deliberately a closed whitelist rather than
letting the model construct arbitrary paths: the earlier "invented an
Admin Console link that doesn't exist" bug is exactly the failure mode
a free-form path would reproduce for navigation *actions* instead of
navigation *descriptions*. An action that silently routes the user
somewhere nonexistent is worse than a wrong sentence.
"""

import re

# Public + role-based routes inside the main Client app.
CLIENT_ROUTES = {
    "home": "/",
    "about": "/about",
    "contact": "/contact",
    "teams_directory": "/teams-directory",
    "vendors_directory": "/vendors-directory",
    "team_login": "/team/login",
    "team_register": "/team/register",
    "vendor_login": "/vendor/login",
    "vendor_register": "/vendor/register",
    # Authenticated team-portal pages (real, but only meaningful once logged in)
    "my_team_home": "/team/home",
    "my_team_profile": "/team/profile",
    "my_team_members": "/team/members",
    "my_team_vehicles": "/team/vehicles",
    "my_team_marketplace": "/team/marketplace",
    "my_team_messages": "/team/messages",
    # Authenticated vendor-portal pages
    "my_vendor_home": "/vendor/home",
    "my_vendor_profile": "/vendor/myProfile",
    "my_vendor_quotes": "/vendor/quote",
    "my_vendor_products": "/vendor/product",
}

# Routes inside the SEPARATE admin-dashboard app.
ADMIN_ROUTES = {
    "admin_dashboard": "/",
    "admin_approvals": "/approvals",
    "admin_events": "/events",
    "admin_payments": "/payments",
    "admin_category_management": "/category",
    "admin_content_moderation": "/content-moderation",
    "admin_analytics": "/analytics",
    "admin_edit_profile": "/edit",
}

_OBJECT_ID_RE = re.compile(r"^[a-f0-9]{24}$", re.IGNORECASE)


def routes_for_role(role: str | None) -> dict[str, str]:
    return ADMIN_ROUTES if role == "admin" else CLIENT_ROUTES


def resolve_route(role: str | None, destination_key: str, entity_id: str | None = None) -> str | None:
    """Returns a real route path, or None if destination_key isn't a known key
    for this caller's app (never falls back to constructing something plausible)."""
    routes = routes_for_role(role)
    base = routes.get(destination_key)
    if base is None:
        return None

    if entity_id is None:
        return base

    # Only the two directory pages actually take an :id in the real routes.
    if destination_key == "teams_directory" and _OBJECT_ID_RE.match(entity_id):
        return f"/teams-directory/{entity_id}"
    if destination_key == "vendors_directory" and _OBJECT_ID_RE.match(entity_id):
        return f"/vendors-directory/{entity_id}"

    return base
