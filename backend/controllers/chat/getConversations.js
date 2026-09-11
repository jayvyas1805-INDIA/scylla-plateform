const Conversation = require("../../models/Conversation");
const Team = require("../../models/Team");
const Vendor = require("../../models/Vendor");
const Admin = require("../../models/Admin");

// participants.userId is polymorphic (Team / Vendor / Member-as-Team /
// Admin) with no `ref`/`refPath` on the schema, so it can't use
// Mongoose's .populate() — resolve display info manually instead.
const resolveParticipant = async (participant) => {
  const { userId, role } = participant;

  if (role === "TEAM") {
    const team = await Team.findById(userId).select("name logo").lean();
    return { userId, role, name: team?.name || "Unknown Team", avatar: team?.logo || null };
  }

  if (role === "VENDOR") {
    const vendor = await Vendor.findById(userId).select("businessName logo").lean();
    return { userId, role, name: vendor?.businessName || "Unknown Vendor", avatar: vendor?.logo || null };
  }

  if (role === "ADMIN") {
    const admin = await Admin.findById(userId).select("name").lean();
    return { userId, role, name: admin?.name || "Admin", avatar: null };
  }

  return { userId, role, name: "Unknown", avatar: null };
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // BUG FIX: `participants` is an array of `{ userId, role }`
    // subdocuments, not an array of raw ObjectIds — querying
    // `{ participants: userId }` never matched anything, so this
    // endpoint always returned an empty list regardless of how many
    // real conversations existed.
    const conversations = await Conversation.find({
      "participants.userId": userId,
    })
      .populate("lastMessage")
      .populate("product", "title images price")
      .sort({ updatedAt: -1 })
      .lean();

    const enriched = await Promise.all(
      conversations.map(async (conv) => {
        const resolvedParticipants = await Promise.all(
          conv.participants.map(resolveParticipant)
        );
        const otherParty = resolvedParticipants.find(
          (p) => String(p.userId) !== String(userId)
        );

        return {
          ...conv,
          participants: resolvedParticipants,
          otherParty,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error("getConversations error:", err);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};
