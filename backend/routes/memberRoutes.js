const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");
const teamAuth = require("../middlewares/teamAuth")
const authUser = require("../middlewares/authUser")
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/",teamAuth, memberController.addMember);
router.get("/",authUser(["TEAM_ADMIN", "MEMBER"]), memberController.getMembers);
router.delete("/:id",teamAuth, memberController.deleteMember);

// Set password from email link (NO AUTH)
router.post("/set-password/:token", memberController.setMemberPassword);

// member get own profile — MEMBER only. Team admins manage their own
// profile through /api/teams/profile, not through this member-facing
// route, so it's intentionally not shared between the two roles.
router.get("/myProfile", authUser(['MEMBER']), memberController.getMyProfile);

// update member profile
router.put("/myProfile", authUser(['MEMBER']), upload.single("profilePic"), memberController.updateMyProfile)


// upload certificate
// router.post("/uploadCertificate",authUser(["MEMBER"]),upload.single("certificate"), memberController.uploadCertificate
// );

module.exports = router;
