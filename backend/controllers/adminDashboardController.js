const Team = require("../models/Team");
const Vendor = require("../models/Vendor");
const Product = require("../models/Product");
const Event = require("../models/Event");
const Conversation = require("../models/Conversation");
const Member = require("../models/Member");
const RegistrationInvitation = require("../models/RegistrationInvitation");

exports.getAdminDashboardStats = async (req, res) => {
  try {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const activeSince = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [totalInvitations, convertedInvitations, pendingInvitations, teamInvites, vendorInvites] = await Promise.all([
      RegistrationInvitation.countDocuments(),
      RegistrationInvitation.countDocuments({ status: "converted" }),
      RegistrationInvitation.countDocuments({ status: "pending" }),
      RegistrationInvitation.find({ type: "team" }).select("status").lean(),
      RegistrationInvitation.find({ type: "vendor" }).select("status").lean(),
    ]);
    const invitationMetrics = (items) => ({
      total: items.length,
      converted: items.filter((item) => item.status === "converted").length,
      conversionRate: items.length ? Math.round((items.filter((item) => item.status === "converted").length / items.length) * 100) : 0,
    });

    const [
      totalTeams,
      pendingTeams,
      newTeams,
      totalVendors,
      pendingVendors,
      newVendors,
      totalProducts,
      pendingProducts,
      approvedProducts,
      totalEvents,
      pendingEvents,
      activeChats,
      teams,
      vendors,
      eventRegistrationRows,
    ] = await Promise.all([
      Team.countDocuments(),
      Team.countDocuments({ status: "pending" }),
      Team.countDocuments({ createdAt: { $gte: monthStart } }),
      Vendor.countDocuments(),
      Vendor.countDocuments({ status: "pending" }),
      Vendor.countDocuments({ createdAt: { $gte: monthStart } }),
      Product.countDocuments(),
      Product.countDocuments({ status: "pending" }),
      Product.countDocuments({ status: "approved" }),
      Event.countDocuments(),
      Event.countDocuments({ status: "pending" }),
      Conversation.countDocuments({ updatedAt: { $gte: activeSince } }),
      Team.find({ status: "approved" }).select("name category profileViews").sort({ profileViews: -1 }).limit(4).lean(),
      Vendor.find({ status: "approved" }).select("businessName category profileViews").sort({ profileViews: -1 }).limit(4).lean(),
      Event.find({ "registrations.createdAt": { $gte: monthStart } }).select("registrations").lean(),
    ]);

    const mostViewedProfiles = [
      ...teams.map((team) => ({ name: team.name, type: team.category || "Team", views: team.profileViews || 0, kind: "team" })),
      ...vendors.map((vendor) => ({ name: vendor.businessName, type: vendor.category || "Vendor", views: vendor.profileViews || 0, kind: "vendor" })),
    ].sort((a, b) => b.views - a.views).slice(0, 4);

    const registrationRows = eventRegistrationRows.flatMap((event) => event.registrations)
      .filter((registration) => registration.createdAt && new Date(registration.createdAt) >= monthStart);
    const registrationEmails = [...new Set(registrationRows.map((registration) => registration.email?.toLowerCase()).filter(Boolean))];
    const [registeredTeams, registeredVendors, registeredMembers] = await Promise.all([
      Team.find({ email: { $in: registrationEmails } }).select("email").lean(),
      Vendor.find({ email: { $in: registrationEmails } }).select("email").lean(),
      Member.find({ email: { $in: registrationEmails } }).select("email").lean(),
    ]);
    const teamEmails = new Set([...registeredTeams, ...registeredMembers].map((account) => account.email.toLowerCase()));
    const vendorEmails = new Set(registeredVendors.map((account) => account.email.toLowerCase()));
    const eventRegistrationStats = registrationRows.reduce((counts, registration) => {
      const email = registration.email?.toLowerCase();
      const type = teamEmails.has(email) ? "team" : vendorEmails.has(email) ? "vendor" : "guest";
      counts[type] = (counts[type] || 0) + 1;
      return counts;
    }, {});
    const registrationsThisMonth = registrationRows.length;
    const registrationsByType = {
      guests: eventRegistrationStats.guest || 0,
      teams: eventRegistrationStats.team || 0,
      vendors: eventRegistrationStats.vendor || 0,
    };

    res.json({
      teams: { total: totalTeams, pending: pendingTeams },
      vendors: { total: totalVendors, pending: pendingVendors },
      products: {
        total: totalProducts,
        pending: pendingProducts,
        approved: approvedProducts
      },
      events: { total: totalEvents, pending: pendingEvents },
      newThisMonth: {
        teams: newTeams,
        vendors: newVendors,
        guests: registrationsByType.guests,
        registrations: registrationsThisMonth,
      },
      registrations: registrationsByType,
      invitations: {
        total: totalInvitations,
        converted: convertedInvitations,
        pending: pendingInvitations,
        conversionRate: totalInvitations ? Math.round((convertedInvitations / totalInvitations) * 100) : 0,
        team: invitationMetrics(teamInvites),
        vendor: invitationMetrics(vendorInvites),
      },
      activeChats,
      mostViewedProfiles,
      payments: {
        available: false,
        collected: 0,
        pending: 0,
        refunded: 0,
        monthly: Array(12).fill(0),
        quarterly: Array(4).fill(0),
        yearly: [0],
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Dashboard fetch failed" });
  }
};
