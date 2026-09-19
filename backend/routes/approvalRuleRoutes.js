const express = require("express");
const router = express.Router();

const adminAuth = require("../middlewares/adminAuth");
const ruleCtrl = require("../controllers/approvalRuleController");

// All of these are admin-only — this is the checklist the AI review
// (and the admin themselves) judges documents against.
router.get("/", adminAuth, ruleCtrl.listRules);
router.post("/", adminAuth, ruleCtrl.createRule);
router.put("/:id", adminAuth, ruleCtrl.updateRule);
router.delete("/:id", adminAuth, ruleCtrl.deleteRule);

module.exports = router;
