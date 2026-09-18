const jwt = require("jsonwebtoken");
const Team = require("../models/Team");
const Member = require("../models/Member");
const Vendor = require("../models/Vendor");

module.exports = async (req, _res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = null;
    let role = String(decoded.role || "").toUpperCase();

    if (role === "TEAM" || role === "TEAM_ADMIN") {
      user = await Team.findById(decoded.id).lean();
      role = "TEAM";
    } else if (role === "VENDOR") {
      user = await Vendor.findById(decoded.id).lean();
    } else if (role === "MEMBER") {
      user = await Member.findById(decoded.id).lean();
    }

    if (user) req.user = { ...user, role, id: user._id };
  } catch (_error) {}

  next();
};