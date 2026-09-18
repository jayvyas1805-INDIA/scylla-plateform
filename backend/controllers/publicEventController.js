const Event = require("../models/Event");
const Team = require("../models/Team");
const Vendor = require("../models/Vendor");
const Member = require("../models/Member");
const sendMail = require("../utils/mailer");
const logTeamActivity = require("../utils/activityLogger");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.getApprovedEvents = async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 6, 1), 24);
    const filter = { status: "approved" };
    const [events, total] = await Promise.all([
      Event.find(filter).sort({ date: 1 }).skip((page - 1) * limit).limit(limit).lean(),
      Event.countDocuments(filter),
    ]);
    res.json({
      success: true,
      events,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("Get public events error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch events" });
  }
};

exports.submitEvent = async (req, res) => {
  try {
    const {
      name, eventType, date, startTime, endTime, location, venue, organizer,
      contactEmail, registrationUrl, capacity, entryFee, requirements, description,
    } = req.body;

    if (!name?.trim() || !date || !organizer?.trim() || !contactEmail?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Event name, date, organizer name, and contact email are required",
      });
    }

    const user = req.user;
    const organizerType = user?.role === "TEAM"
      ? "team"
      : user?.role === "VENDOR"
        ? "vendor"
        : "guest";

    let posterUrl = "";
    if (req.file) {
      const posterUpload = await cloudinary.uploader.upload(req.file.path, { folder: "events/posters" });
      posterUrl = posterUpload.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const event = await Event.create({
      name, eventType, date, startTime, endTime, location, venue, organizer,
      contactEmail, registrationUrl, capacity: capacity === "" ? null : capacity,
      entryFee, requirements, description, posterUrl, status: "pending", organizerType,
      organizerId: user?._id || null,
      submittedByName: user?.name || user?.businessName || organizer,
      submittedByEmail: user?.email || contactEmail,
    });

    res.status(201).json({
      success: true,
      message: "Event submitted for admin approval",
      event,
    });
  } catch (err) {
    console.error("Submit public event error:", err);
    res.status(400).json({ success: false, error: err.message || "Failed to submit event" });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const {
      name, email, phone, vehicleClass, participationType, memberCount, memberNames,
    } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPhone = phone?.replace(/[^\d+]/g, "").trim();
    if (!name?.trim() || !normalizedEmail || !normalizedPhone) {
      return res.status(400).json({ success: false, error: "Name, email, and mobile number are required" });
    }

    const event = await Event.findOne({ _id: req.params.id, status: "approved" });
    if (!event) return res.status(404).json({ success: false, error: "Event not found" });
    const requestedMemberCount = Math.max(Number.parseInt(memberCount, 10) || 1, 1);
    const registeredParticipants = event.registrations.length;
    if (event.capacity !== null && registeredParticipants + 1 > event.capacity) {
      return res.status(409).json({ success: false, error: "This event has reached its capacity" });
    }
    const duplicateEmail = event.registrations.some(
      (registration) => registration.email === normalizedEmail
    );
    const duplicatePhone = event.registrations.some(
      (registration) => registration.phone && registration.phone.replace(/[^\d+]/g, "") === normalizedPhone
    );
    if (duplicateEmail || duplicatePhone) {
      return res.status(409).json({
        success: false,
        error: duplicateEmail
          ? "This email is already registered for the event"
          : "This mobile number is already registered for the event",
      });
    }

    const role = req.user?.role;
    const [teamAccount, vendorAccount, memberAccount] = await Promise.all([
      Team.findOne({ email: normalizedEmail }).select("_id").lean(),
      Vendor.findOne({ email: normalizedEmail }).select("_id").lean(),
      Member.findOne({ email: normalizedEmail }).select("_id team").lean(),
    ]);
    const attendeeType = teamAccount || memberAccount || role === "TEAM" || role === "MEMBER"
      ? "team"
      : vendorAccount || role === "VENDOR"
        ? "vendor"
        : "guest";
    event.registrations.push({
      name, email: normalizedEmail, phone: normalizedPhone, vehicleClass, attendeeType,
      memberCount: requestedMemberCount,
      memberNames,
    });
    await event.save();

    const eventDate = new Date(event.date).toLocaleDateString();
    try {
      await sendMail({
        to: normalizedEmail,
        subject: `Registration confirmed: ${event.name}`,
        text: `Your registration for ${event.name} on ${eventDate} has been received. Participants: ${requestedMemberCount}.`,
        html: `<p>Your registration for <strong>${event.name}</strong> on ${eventDate} has been received.</p><p>Participants: ${requestedMemberCount}</p>`,
      });
      if (event.contactEmail && event.contactEmail.toLowerCase() !== normalizedEmail) {
        await sendMail({
          to: event.contactEmail,
          subject: `New registration for ${event.name}`,
          text: `${name} registered for ${event.name}. Participation: ${attendeeType}. Participants: ${requestedMemberCount}. Contact: ${normalizedEmail}.`,
        });
      }
    } catch (mailError) {
      console.error("Event registration email failed:", mailError.message);
    }

    const teamId = teamAccount?._id || memberAccount?.team || (role === "TEAM" || role === "MEMBER" ? req.user?._id : null);
    if (attendeeType === "team" && teamId) {
      await logTeamActivity(
        teamId,
        "EVENT_REGISTERED",
        "Event registration submitted",
        `${name} registered ${requestedMemberCount} participant(s) for ${event.name}`
      );
    }

    res.status(201).json({
      success: true,
      message: "Registration submitted successfully",
      registrationCount: event.registrations.length,
      participantCount: registeredParticipants + 1,
    });
  } catch (err) {
    console.error("Register for event error:", err);
    res.status(400).json({ success: false, error: err.message || "Failed to register" });
  }
};