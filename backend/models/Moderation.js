const mongoose = require("mongoose");

const moderationSchema = new mongoose.Schema(
  {
    contentType: {
      type: String,
      enum: ["EVENT", "TEAM", "VENDOR", "DRIVER", "ACTIVITY", "MEDIA"],
      required: true,
    },
    contentId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    submittedBy: {
      id: { type: mongoose.Schema.Types.ObjectId, default: null },
      name: { type: String, default: "Unknown" },
      email: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["PENDING_REVIEW", "AI_FLAGGED", "APPROVED", "REJECTED", "CHANGES_REQUESTED"],
      default: "PENDING_REVIEW",
    },
    aiRisk: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "UNKNOWN"], default: "UNKNOWN" },
    aiConfidence: { type: Number, min: 0, max: 100, default: null },
    aiIssues: { type: [String], default: [] },
    aiRecommendation: { type: String, default: "" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
    reviewedAt: { type: Date, default: null },
    reason: { type: String, default: "" },
    feedback: { type: String, default: "" },
  },
  { timestamps: true }
);

moderationSchema.index({ contentType: 1, contentId: 1 }, { unique: true });
moderationSchema.index({ status: 1, updatedAt: -1 });

module.exports = mongoose.model("Moderation", moderationSchema);
