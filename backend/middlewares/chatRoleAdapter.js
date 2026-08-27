module.exports = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Preserve original role/id — useful for showing "sent by <member name>"
  // even though the conversation itself is owned by the team.
  req.user._originalRole = req.user.role;
  req.user._originalId = req.user._id;

  // Normalize ONLY for chat
  if (req.user.role === "admin") {
    req.user.role = "ADMIN";
  }

  if (req.user.role === "TEAM_ADMIN") {
    req.user.role = "TEAM";
  }

  // A team member acts as their team for messaging purposes — all
  // members and the team admin share one conversation thread with a
  // given seller/buyer, rather than each member having their own
  // separate thread. (Previously MEMBER wasn't handled here at all,
  // and chatAccess blocked the role outright — members couldn't use
  // chat at all.)
  if (req.user.role === "MEMBER") {
    req.user.role = "TEAM";
    req.user._id = req.user.team;
  }

  if (req.user.role === "VENDOR") {
    req.user.role = "VENDOR";
  }

  next();
};
