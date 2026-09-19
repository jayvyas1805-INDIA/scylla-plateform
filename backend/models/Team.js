const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],

    tagline: {
      type: String,
      trim: true
    },

    description: {
      type: String,
      trim: true,
      default: ""
    },


    logo: {
      type: String,
      default: "" // Cloudinary URL
    },

    verificationDoc: {
      type: String,
      default: "" // Cloudinary URL
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    contactNo: {
      type: String,
      required: true
    },

    location: {
      address: { type: String },
      lat: { type: Number },
      lng: { type: Number }
    },


    category: {
      type: String,
      enum: [
        // "FSAE",
        // "EV",
        // "BAJA",
        // "Moto",
        // "GoKart",
        // "Drag",
        // "Drift",
        // "RC",
        // "Karting",
        // "Robotics",
        // "Other"
        "Formula Racing",
        "Rally",
        "Endurance",
        "Motocross"
      ],
      required: true
    },

    achievements: [
      {
        title: { type: String, required: true },
        description: { type: String },
        type: { type: String, enum: ["gold", "blue", "green"], default: "gold" }, // for icon color
        year: { type: Number, default: new Date().getFullYear() }
      }
    ],


    password: {
      type: String,
      required: true,
      select: false // 🔐 security best practice
    },

    role: {
      type: String,
      enum: ["team"],
      default: "team"
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    profileViews: {
      type: Number,
      default: 0,
    },

    // AI document-review verdict for `verificationDoc`. Written EXACTLY
    // ONCE per document version by ai-service (see
    // backend/utils/aiDocumentReview.js) right after the doc is
    // uploaded/re-uploaded — never recomputed just because an admin opens
    // the Approvals page. `docVersion` is what verificationDoc looked
    // like when this verdict was produced; a re-upload changes
    // verificationDoc, which makes docVersion stale and triggers exactly
    // one fresh review.
    aiReview: {
      suggestion: {
        type: String,
        enum: ["approve", "reject", "review", null],
        default: null
      },
      confidence: { type: Number, default: null }, // 0-1
      reasoning: { type: String, default: "" },
      flaggedRules: [{ type: String }], // rule text(s) the doc failed/triggered
      reviewedAt: { type: Date, default: null },
      docVersion: { type: String, default: null }, // verificationDoc value this verdict covers
      status: {
        type: String,
        enum: ["idle", "pending", "done", "failed"],
        default: "idle"
      }
    },

    // media: [{ type: String }],

    sponsors: [
      {
        name: { type: String, trim: true, required: true }, // sponsor name
        logo: { type: String, trim: true, required: true }, // Cloudinary URL
        category: { type: String, trim: true, default: "title" }, // title/platinum/gold/silver
        website: { type: String, trim: true, default: "" },
        initials: { type: String, trim: true } // first letter of name
      },
    ],
    // socialMedia: {
    //   instagram: { type: String, trim: true, default: "" },
    //   youtube: { type: String, trim: true, default: "" },
    //   linkedin: { type: String, trim: true, default: "" },
    //   twitter: { type: String, trim: true, default: "" },
    // },

    gallery: {
      type: [String],
      default: []
    },



  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
