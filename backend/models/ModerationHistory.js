const mongoose = require("mongoose");

const moderationHistorySchema = new mongoose.Schema(
  {
    moderation: { type: mongoose.Schema.Types.ObjectId, ref: "Moderation", required: true },
    contentType: { type: String, required: true },
    contentId: { type: String, required: true },
    action: {
      type: String,
      enum: ["SUBMITTED", "APPROVED", "REJECTED", "CHANGES_REQUESTED"],
      required: true,
    },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    adminName: { type: String, default: "Admin" },
    previousStatus: { type: String, required: true },
    newStatus: { type: String, required: true },
    reason: { type: String, default: "" },
    feedback: { type: String, default: "" },
  },
  { timestamps: true }
);

moderationHistorySchema.index({ contentType: 1, contentId: 1, createdAt: -1 });

module.exports = mongoose.model("ModerationHistory", moderationHistorySchema);
