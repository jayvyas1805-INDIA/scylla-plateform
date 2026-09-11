const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const authUser = require("../middlewares/authUser");
const Admin = require("../models/Admin");
const chatAccess = require("../middlewares/chatAccess");

const { searchUsers } = require("../controllers/chat/search");
const { openConversation } = require("../controllers/chat/openConversation");
const { sendMessage } = require("../controllers/chat/sendMessage");
const { getConversations } = require("../controllers/chat/getConversations");
const { getMessages } = require("../controllers/chat/getMessages");
const chatRoleAdapter = require("../middlewares/chatRoleAdapter");



/**
 * AUTH (admin OR authenticated user — Team/Member/Vendor)
 *
 * BUG FIX: this used to call the `adminAuth` middleware and treat its
 * third argument as a Node-style `next(err)` callback — but `adminAuth`
 * always sends its own res.status(401/403) response directly on failure
 * and never calls that callback. That meant every non-admin request
 * (i.e. every real Team/Vendor user) got rejected with "Admin access
 * only" before the intended `authUser()` fallback could ever run.
 *
 * This decodes the token once, checks the role, and only then decides
 * whether to treat the caller as an admin or hand off to `authUser()`
 * — neither path can short-circuit the other by writing its own
 * response early.
 */
router.use(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === "admin") {
      const admin = await Admin.findById(decoded.id).select("-password").lean();
      if (!admin) return res.status(404).json({ error: "Admin not found" });

      req.user = admin;
      req.user.role = "admin";
      return next();
    }

    // Not an admin token — authenticate as a regular platform user
    // (Team admin, Member, or Vendor). No role restriction here; the
    // later `chatAccess` middleware is what actually gates access.
    return authUser()(req, res, next);
  } catch (err) {
    console.error("Chat auth error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
});

/**
 * CHAT ROLE NORMALIZATION (SAFE)
 */
router.use(chatRoleAdapter);

/**
 * PUBLIC CHAT ROUTES (auth only)
 */
router.get("/conversations", getConversations);

/**
 * RESTRICTED CHAT ROUTES
 */
router.use(chatAccess);

router.get("/search", searchUsers);
router.post("/open", openConversation);
router.post("/message", sendMessage);
router.get("/conversations/:conversationId/messages", getMessages);

module.exports = router;
