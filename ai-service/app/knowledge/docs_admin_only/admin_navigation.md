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
There's an Events page in the admin dashboard UI (`/events`), but as of
now it only holds local placeholder data in the frontend — it isn't
wired to a real backend endpoint. Don't describe it as tracking real,
persisted event data; if asked, say it's UI that's still in progress.

**Where do I edit my own admin profile?**
The Edit Profile page, at `/edit`.
