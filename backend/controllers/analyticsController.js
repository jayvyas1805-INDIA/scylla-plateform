const Team = require("../models/Team");
const Vendor = require("../models/Vendor");
const Event = require("../models/Event");
const Product = require("../models/Product");
const Conversation = require("../models/Conversation");

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const monthKey = (date) => date.toLocaleString("en-US", { month: "short", year: "numeric" });

const buildMonthSeries = (rows, since) => {
  const now = new Date();
  const firstMonth = startOfMonth(since || new Date(now.getFullYear(), now.getMonth() - 5, 1));
  const months = [];
  for (let cursor = new Date(firstMonth); cursor <= now; cursor.setMonth(cursor.getMonth() + 1)) {
    months.push(monthKey(cursor));
  }
  const counts = new Map(months.map((month) => [month, 0]));
  rows.forEach((row) => {
    const date = row.createdAt && new Date(row.createdAt);
    if (date && counts.has(monthKey(date))) counts.set(monthKey(date), counts.get(monthKey(date)) + 1);
  });
  return months.map((month) => ({ month, value: counts.get(month) }));
};

const countBy = (rows, key, fallback = "Unknown") => {
  const counts = rows.reduce((result, row) => {
    const value = row[key] || fallback;
    result[value] = (result[value] || 0) + 1;
    return result;
  }, {});
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

exports.getAdminAnalytics = async (req, res) => {
  try {
    const range = String(req.query.range || "all");
    const days = range === "30d" ? 30 : range === "90d" ? 90 : null;
    const since = days ? new Date(Date.now() - days * 24 * 60 * 60 * 1000) : new Date(new Date().getFullYear(), 0, 1);

    const [teams, vendors, events, products, recentConversations] = await Promise.all([
      Team.find().select("name category status profileViews createdAt").lean(),
      Vendor.find().select("businessName category status profileViews createdAt").lean(),
      Event.find().select("name eventType organizerType status registrations createdAt date").lean(),
      Product.find().select("status createdAt").lean(),
      Conversation.countDocuments({ updatedAt: { $gte: since } }),
    ]);

    const registrations = events.flatMap((event) => event.registrations || [])
      .filter((registration) => registration.createdAt && new Date(registration.createdAt) >= since);
    const eventRows = events.filter((event) => event.createdAt && new Date(event.createdAt) >= since);
    const teamEvents = eventRows.filter((event) => event.organizerType === "team").length;
    const vendorEvents = eventRows.filter((event) => event.organizerType === "vendor").length;
    const teamRegistrations = registrations.filter((registration) => registration.attendeeType === "team").length;
    const vendorRegistrations = registrations.filter((registration) => registration.attendeeType === "vendor").length;
    const platformViews = teams.reduce((total, team) => total + (team.profileViews || 0), 0) + vendors.reduce((total, vendor) => total + (vendor.profileViews || 0), 0);

    const profiles = [
      ...teams.map((team) => ({ name: team.name, type: "Team", views: team.profileViews || 0 })),
      ...vendors.map((vendor) => ({ name: vendor.businessName, type: "Vendor", views: vendor.profileViews || 0 })),
    ].sort((a, b) => b.views - a.views).slice(0, 8);

    res.json({
      range,
      generatedAt: new Date().toISOString(),
      metrics: {
        teams: {
          total: teams.length,
          approved: teams.filter((team) => team.status === "approved").length,
          profileViews: teams.reduce((total, team) => total + (team.profileViews || 0), 0),
          events: teamEvents,
          registrations: teamRegistrations,
        },
        vendors: {
          total: vendors.length,
          approved: vendors.filter((vendor) => vendor.status === "approved").length,
          profileViews: vendors.reduce((total, vendor) => total + (vendor.profileViews || 0), 0),
          events: vendorEvents,
          registrations: vendorRegistrations,
        },
        platform: {
          profileViews: platformViews,
          events: eventRows.length,
          approvedEvents: eventRows.filter((event) => event.status === "approved").length,
          pendingEvents: eventRows.filter((event) => event.status === "pending").length,
          rejectedEvents: eventRows.filter((event) => event.status === "rejected").length,
          registrations: registrations.length,
          activeChats: recentConversations,
          products: products.filter((product) => !product.createdAt || new Date(product.createdAt) >= since).length,
        },
      },
      charts: {
        registrationsOverTime: buildMonthSeries(registrations, since),
        eventsByType: countBy(eventRows, "eventType"),
        vendorCategories: countBy(vendors, "category"),
        profileViews: profiles,
      },
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    res.status(500).json({ error: "Failed to load analytics" });
  }
};
