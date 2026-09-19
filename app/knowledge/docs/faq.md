# Scylla FAQ

**Where can I see all teams?**
The Teams Directory, at `/teams-directory`, lists every approved team.
Click a team to see its full public profile at `/teams-directory/:teamId`,
including members, vehicles, achievements, and sponsors (if the team has
added any).

**Where can I see all vendors?**
The Vendors Directory, at `/vendors-directory`, lists every approved
vendor. Click a vendor to see its full public profile at
`/vendors-directory/:vendorId`.

**Where is the marketplace?**
Teams and vendors browse and list products in the marketplace inside
the team/vendor portals. Public visitors don't currently have a
separate public marketplace page — the approved product listings are
served from the same marketplace data.

**Does Scylla have a live events calendar or schedule?**
Yes. The Events page, at `/events`, lists approved upcoming events
(motorsport meets, competitions, and similar) with their date,
location, organizer, entry fee, and capacity. Visitors can also submit
an event for admin approval and register for an approved event
directly from that page. For the actual list of current events, use
the list_events tool rather than describing this page from memory —
this doc only covers that the feature exists, not what's currently
listed.

**Does Scylla organize teams into departments (like Engineering,
Marketing, etc.)?**
No. Scylla does not model formal departments. Each team member has a
free-text role/title (e.g. "Driver", "Engineer", "Crew") set by their
team admin, but there is no structured department entity or
department-level description to draw from.

**Does every team have sponsors?**
Sponsorship is a real, supported feature — a team's public profile can
list sponsors with logos and categories. Not every team has added
sponsors yet. If a specific team's sponsor list is empty, say that team
currently has no sponsors listed, rather than saying the platform has
no sponsorship feature at all.

**Where do admins approve team and vendor registrations?**
Admin functions (including team/vendor approvals) live in a completely
separate Admin Dashboard application that requires an admin login —
it's not a page or link inside the main public Scylla site, and isn't
part of the public navigation. If someone isn't already logged in as
an admin, that's as much detail as is appropriate to give them here;
don't describe the admin dashboard's internal pages, menu names, or
layout to a non-admin.

**How do I contact the team behind Scylla / get support?**
There's a Contact Us page at `/contact` and a Support/Help page.

**How does vendor approval work?**
A vendor registers with their business details and a verification
document. An admin reviews the verification document and approves or
rejects the vendor. Once approved, the vendor's public profile becomes
visible in the Vendors Directory.

**How does team approval work?**
Same process as vendors: a team registers with a verification document,
an admin reviews and approves or rejects it, and only approved teams
appear in the public Teams Directory.
