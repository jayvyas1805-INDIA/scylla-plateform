const Event = require("../models/Event");
const Team = require("../models/Team");
const Vendor = require("../models/Vendor");
const Member = require("../models/Member");

const normalizeRegistrationTypes = async (events) => {
  const emails = [...new Set(events.flatMap((event) => event.registrations.map((registration) => registration.email?.toLowerCase()).filter(Boolean)))];
  if (!emails.length) return events;
  const [teams, vendors, members] = await Promise.all([
    Team.find({ email: { $in: emails } }).select("email").lean(),
    Vendor.find({ email: { $in: emails } }).select("email").lean(),
    Member.find({ email: { $in: emails } }).select("email").lean(),
  ]);
  const teamEmails = new Set([...teams, ...members].map((account) => account.email.toLowerCase()));
  const vendorEmails = new Set(vendors.map((account) => account.email.toLowerCase()));
  return events.map((event) => ({
    ...event,
    registrations: event.registrations.map((registration) => ({
      ...registration,
      attendeeType: teamEmails.has(registration.email?.toLowerCase())
        ? "team"
        : vendorEmails.has(registration.email?.toLowerCase())
          ? "vendor"
          : "guest",
    })),
  }));
};

exports.getEvents = async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const events = await normalizeRegistrationTypes(await Event.find(filter).sort({ date: 1 }).lean());
    res.json({ events });
  } catch (err) {
    console.error("Get events error:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const eventRecord = await Event.findById(req.params.id).lean();
    if (!eventRecord) return res.status(404).json({ error: "Event not found" });
    const [event] = await normalizeRegistrationTypes([eventRecord]);
    res.json({ event });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, status: "pending" });
    res.status(201).json({ event });
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to create event" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ event });
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to update event" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event" });
  }
};

const setEventStatus = (status) => async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ event });
  } catch (err) {
    res.status(500).json({ error: `Failed to ${status} event` });
  }
};

exports.approveEvent = setEventStatus("approved");
exports.rejectEvent = setEventStatus("rejected");