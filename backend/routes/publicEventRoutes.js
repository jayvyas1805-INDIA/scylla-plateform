const express = require("express");
const router = express.Router();
const optionalAuth = require("../middlewares/optionalAuth");
const eventController = require("../controllers/publicEventController");
const multer = require("multer");
const upload = multer({ dest: "uploads/events/" });

router.get("/", eventController.getApprovedEvents);
router.post("/", optionalAuth, upload.single("poster"), eventController.submitEvent);
router.post("/:id/register", optionalAuth, eventController.registerForEvent);

module.exports = router;