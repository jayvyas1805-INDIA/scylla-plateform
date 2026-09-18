const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: "" },
    attendeeType: {
      type: String,
      enum: ["guest", "team", "vendor"],
      default: "guest",
    },
    memberCount: { type: Number, min: 1, default: 1 },
    memberNames: { type: String, trim: true, default: "" },
    vehicleClass: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    eventType: {
      type: String,
      enum: ["race", "meetup", "track-day", "show", "charity", "workshop", "other"],
      default: "other",
    },
    date: { type: Date, required: true },
    startTime: { type: String, trim: true, default: "" },
    endTime: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    venue: { type: String, trim: true, default: "" },
    organizer: { type: String, trim: true, default: "" },
    contactEmail: { type: String, trim: true, lowercase: true, default: "" },
    registrationUrl: { type: String, trim: true, default: "" },
    capacity: { type: Number, min: 0, default: null },
    entryFee: { type: String, trim: true, default: "" },
    requirements: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    posterUrl: { type: String, trim: true, default: "" },
    organizerType: {
      type: String,
      enum: ["guest", "team", "vendor", "admin"],
      default: "guest",
    },
    organizerId: { type: mongoose.Schema.Types.ObjectId, default: null },
    submittedByName: { type: String, trim: true, default: "" },
    submittedByEmail: { type: String, trim: true, lowercase: true, default: "" },
    registrations: { type: [registrationSchema], default: [] },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);