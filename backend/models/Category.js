const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    group: {
      type: String,
      enum: ["vendor-categories", "vehicle-classes", "motorsport-disciplines"],
      required: true,
    },
    kind: {
      type: String,
      enum: ["vendor-type", "company-type", "vendor-nature", "vehicle-class", "motorsport-discipline"],
      required: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["ACTIVE", "DISABLED"],
      default: "ACTIVE",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true }
);

categorySchema.index({ group: 1, kind: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
