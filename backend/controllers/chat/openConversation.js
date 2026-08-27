const Conversation = require("../../models/Conversation");
const Product = require("../../models/Product");

exports.openConversation = async (req, res) => {
  try {
    const { targetUserId, targetRole, productId } = req.body;
    const myId = req.user._id;
    const myRole = req.user.role;

    let resolvedTargetId = targetUserId;
    let resolvedTargetRole = targetRole;
    let productRef = null;

    // "Message about this product" flow — the frontend only needs to
    // send productId; the seller is resolved here from the product's
    // own owner, so the button doesn't need to know who owns what.
    if (productId) {
      const product = await Product.findById(productId).lean();
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      resolvedTargetId = product.createdBy;
      // Product.creatorModel is "Team" or "Vendor" — matches the
      // normalized chat roles used here.
      resolvedTargetRole = product.creatorModel === "Vendor" ? "VENDOR" : "TEAM";
      productRef = product._id;
    }

    if (!resolvedTargetId || !resolvedTargetRole) {
      return res.status(400).json({ error: "targetUserId/targetRole or productId is required" });
    }

    if (String(resolvedTargetId) === String(myId)) {
      return res.status(400).json({ error: "You can't start a conversation with yourself" });
    }

    // One thread per (me, other party, product) — messaging the same
    // seller about a different product opens a separate, clearly-scoped
    // thread instead of mixing products into one conversation.
    const query = {
      $and: [
        { participants: { $elemMatch: { userId: myId } } },
        { participants: { $elemMatch: { userId: resolvedTargetId } } },
        { product: productRef },
      ],
    };

    let conversation = await Conversation.findOne(query);

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [
          { userId: myId, role: myRole },
          { userId: resolvedTargetId, role: resolvedTargetRole },
        ],
        product: productRef,
      });
    }

    res.json(conversation);
  } catch (err) {
    console.error("openConversation error:", err);
    res.status(500).json({ error: "Failed to open conversation" });
  }
};
