const Message = require("../../models/Message");
const Conversation = require("../../models/Conversation");

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const isParticipant = conversation.participants.some(
      (p) => String(p.userId) === String(req.user._id)
    );

    if (!isParticipant) {
      return res.status(403).json({ error: "Not allowed" });
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }).lean();

    res.json(messages);
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
