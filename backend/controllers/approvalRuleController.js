const ApprovalRule = require("../models/ApprovalRule");

// List rules, optionally filtered by docType (?docType=team|vendor).
// Used by both the admin dashboard's Rule Management page and (via
// scylla_api.py) by ai-service when it builds context for a review.
exports.listRules = async (req, res) => {
  try {
    const { docType } = req.query;
    const filter = docType ? { docType } : {};
    const rules = await ApprovalRule.find(filter).sort({ createdAt: -1 });
    res.json({ rules });
  } catch (err) {
    console.error("Error listing approval rules:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.createRule = async (req, res) => {
  try {
    const { docType, ruleText, mandatory } = req.body;

    if (!docType || !ruleText) {
      return res.status(400).json({ error: "docType and ruleText are required" });
    }
    if (!["team", "vendor"].includes(docType)) {
      return res.status(400).json({ error: "docType must be 'team' or 'vendor'" });
    }

    const rule = await ApprovalRule.create({
      docType,
      ruleText: ruleText.trim(),
      mandatory: mandatory !== undefined ? !!mandatory : true,
      createdBy: req.user?.id
    });

    res.status(201).json({ rule });
  } catch (err) {
    console.error("Error creating approval rule:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateRule = async (req, res) => {
  try {
    const { ruleText, mandatory, active } = req.body;
    const update = {};
    if (ruleText !== undefined) update.ruleText = ruleText.trim();
    if (mandatory !== undefined) update.mandatory = !!mandatory;
    if (active !== undefined) update.active = !!active;

    const rule = await ApprovalRule.findByIdAndUpdate(req.params.id, update, {
      new: true
    });
    if (!rule) return res.status(404).json({ error: "Rule not found" });

    res.json({ rule });
  } catch (err) {
    console.error("Error updating approval rule:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteRule = async (req, res) => {
  try {
    const rule = await ApprovalRule.findByIdAndDelete(req.params.id);
    if (!rule) return res.status(404).json({ error: "Rule not found" });
    res.json({ message: "Rule deleted" });
  } catch (err) {
    console.error("Error deleting approval rule:", err);
    res.status(500).json({ error: "Server error" });
  }
};
