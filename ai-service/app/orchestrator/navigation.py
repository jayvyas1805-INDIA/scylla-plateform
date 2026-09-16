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

SECURITY NOTE: routes are split into tiers gated by the caller's REAL
authenticated role — not just "admin vs everyone else". An earlier
version put every team-portal and vendor-portal page in one flat dict
available to any non-admin caller, which meant an unauthenticated
guest could ask the assistant to navigate them to '/vendor/quote' or
'/team/messages' and it would comply, since nothing there checked
whether the caller was actually logged in as that team/vendor at all.
Whether the destination PAGE itself then shows real data depends on
its own client-side guard, but the assistant should never be the one
routing an unauthenticated visitor toward a private page in the first
place. Each tier below is only ever returned to a caller whose real
role matches it.
"""

import re

# Available to literally anyone, including an unauthenticated guest.
PUBLIC_ROUTES = {
    "home": "/",
    "about": "/about",
    "contact": "/contact",
    "teams_directory": "/teams-directory",
    "vendors_directory": "/vendors-directory",
    "team_login": "/team/login",
    "team_register": "/team/register",
    "vendor_login": "/vendor/login",
    "vendor_register": "/vendor/register",
}

# Only when the caller is actually logged in as a team admin/member.
TEAM_ONLY_ROUTES = {
    "my_team_home": "/team/home",
    "my_team_profile": "/team/profile",
    "my_team_members": "/team/members",
    "my_team_vehicles": "/team/vehicles",
    "my_team_marketplace": "/team/marketplace",
    "my_team_messages": "/team/messages",
}

# Only when the caller is actually logged in as a vendor.
VENDOR_ONLY_ROUTES = {
    "my_vendor_home": "/vendor/home",
    "my_vendor_profile": "/vendor/myProfile",
    "my_vendor_quotes": "/vendor/quote",
    "my_vendor_products": "/vendor/product",
}

# Routes inside the SEPARATE admin-dashboard app. Only when role == "admin".
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
    if role == "admin":
        return dict(ADMIN_ROUTES)
    if role in ("TEAM_ADMIN", "MEMBER"):
        return {**PUBLIC_ROUTES, **TEAM_ONLY_ROUTES}
    if role == "vendor":
        return {**PUBLIC_ROUTES, **VENDOR_ONLY_ROUTES}
    return dict(PUBLIC_ROUTES)  # unauthenticated guest: public pages ONLY


def resolve_route(role: str | None, destination_key: str, entity_id: str | None = None) -> str | None:
    """Returns a real route path, or None if destination_key isn't a known key
    for THIS caller's actual authenticated role (never falls back to
    constructing something plausible, and never leaks a role-gated
    destination to a caller who isn't actually that role)."""
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
