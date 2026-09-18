const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");
const eventCtrl = require("../controllers/eventController");

router.use(adminAuth);
router.get("/", eventCtrl.getEvents);
router.get("/:id", eventCtrl.getEvent);
router.post("/", eventCtrl.createEvent);
router.put("/:id", eventCtrl.updateEvent);
router.delete("/:id", eventCtrl.deleteEvent);
router.put("/:id/approve", eventCtrl.approveEvent);
router.put("/:id/reject", eventCtrl.rejectEvent);

module.exports = router;