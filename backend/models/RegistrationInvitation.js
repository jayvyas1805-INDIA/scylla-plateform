const mongoose = require("mongoose");

const registrationInvitationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    type: { type: String, enum: ["team", "vendor"], required: true },
    tokenHash: { type: String, required: true, unique: true },
    status: { type: String, enum: ["pending", "converted", "expired"], default: "pending" },
    convertedAt: { type: Date, default: null },
    accountId: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RegistrationInvitation", registrationInvitationSchema);
