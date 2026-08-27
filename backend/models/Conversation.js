const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        role: {
          type: String,
          enum: ["ADMIN", "TEAM", "VENDOR", "MEMBER"],
          required: true
        }
      }
    ],

    // The product this conversation was started about — set when a buyer
    // clicks "View Product" / "Message Seller" from the marketplace.
    // Optional so general (non-product) conversations still work.
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    }
  },
  { timestamps: true }
);

// Prevent duplicate 1-to-1 conversations
conversationSchema.index(
  { "participants.userId": 1 },
  { unique: false }
);

module.exports = mongoose.model("Conversation", conversationSchema);
