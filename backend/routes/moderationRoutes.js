const express = require("express");
const adminAuth = require("../middlewares/adminAuth");
const moderationController = require("../controllers/moderationController");

const router = express.Router();

router.use(adminAuth);
router.get("/", moderationController.getQueue);
router.get("/:contentType/:contentId", moderationController.getItem);
router.post("/:contentType/:contentId/approve", moderationController.approve);
router.post("/:contentType/:contentId/reject", moderationController.reject);
router.post("/:contentType/:contentId/request-changes", moderationController.requestChanges);

module.exports = router;
