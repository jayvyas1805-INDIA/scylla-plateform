# Admin Dashboard Navigation (admin-only)

This document is only ever searched when the caller is an authenticated
admin. Never repeat this level of detail to a non-admin caller.

**Where do I approve pending teams and vendors?**
The Approvals page, at `/approvals` in the admin dashboard, lists
pending team and vendor registrations for review and approval or
rejection.

**Where do I see platform-wide stats?**
The Analytics page (`/analytics`) and the dashboard home (`/`) both
surface platform stats — the get_admin_dashboard_stats tool pulls the
same numbers directly, so prefer that tool over describing the page
for actual numbers.

**Where do I manage marketplace categories?**
The Category Management page, at `/category`.

**Where do I moderate content?**
The Content Moderation page, at `/content-moderation`.

**Where do I manage payments?**
The Payments page, at `/payments`.

**Is there a real events-management feature in the admin dashboard?**
Yes. The Events page (`/events` in the admin dashboard) is backed by a
real, working API (`/api/events`, admin-only): admins can list, view,
create, edit, delete, and approve/reject submitted events there. Only
events an admin approves become visible on the public `/events` page
and to the list_events tool.

**Are the Category Management, Content Moderation, and Analytics pages
backed by real data?**
No — as of now these three pages (`/category`, `/content-moderation`,
`/analytics`) have no dedicated backend API calls; they're UI-only.
The only admin-facing data actually backed by a real endpoint are the
Approvals page (`/approvals`) and the dashboard stats (`/`,
`/analytics`'s headline numbers come from get_admin_dashboard_stats,
not the analytics page's own charts).

**Where do I edit my own admin profile?**
The Edit Profile page, at `/edit`.
