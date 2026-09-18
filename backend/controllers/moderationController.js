const Event = require("../models/Event");
const Team = require("../models/Team");
const Vendor = require("../models/Vendor");
const Admin = require("../models/Admin");
const Moderation = require("../models/Moderation");
const ModerationHistory = require("../models/ModerationHistory");

const CONTENT_TYPES = ["EVENT", "TEAM", "VENDOR", "DRIVER", "ACTIVITY", "MEDIA"];
const ACTION_STATUS = {
  approve: "APPROVED",
  reject: "REJECTED",
  requestChanges: "CHANGES_REQUESTED",
};

const toModerationStatus = (status) => ({
  pending: "PENDING_REVIEW",
  approved: "APPROVED",
  rejected: "REJECTED",
  changes_requested: "CHANGES_REQUESTED",
}[status] || "PENDING_REVIEW");

const toEntityStatus = (status) => ({
  PENDING_REVIEW: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  CHANGES_REQUESTED: "changes_requested",
}[status]);

const normalizeType = (type) => String(type || "").toUpperCase();
const isValidType = (type) => CONTENT_TYPES.includes(type);

const getEntity = async (contentType, contentId) => {
  if (contentType === "EVENT") return Event.findById(contentId);
  if (contentType === "TEAM") return Team.findById(contentId);
  if (contentType === "VENDOR") return Vendor.findById(contentId);
  return null;
};

const entityTitle = (contentType, entity) => {
  if (contentType === "EVENT") return entity.name;
  if (contentType === "TEAM") return entity.name;
  if (contentType === "VENDOR") return entity.businessName;
  return "Unsupported content";
};

const submittedBy = (contentType, entity) => {
  if (contentType === "EVENT") {
    return {
      id: entity.organizerId || null,
      name: entity.submittedByName || entity.organizer || "Guest",
      email: entity.submittedByEmail || entity.contactEmail || "",
    };
  }
  return { id: entity._id, name: entity.name || entity.businessName, email: entity.email || "" };
};

const ensureRecord = async (contentType, entity, existing = null) => {
  const status = toModerationStatus(entity.status);
  if (existing) return existing;
  return Moderation.create({
    contentType,
    contentId: entity._id.toString(),
    title: entityTitle(contentType, entity),
    submittedBy: submittedBy(contentType, entity),
    status,
  });
};

const serialize = (contentType, entity, record) => ({
  contentType,
  contentId: entity._id,
  title: entityTitle(contentType, entity),
  description: entity.description || entity.companyDesc || entity.tagline || "",
  submittedBy: record?.submittedBy || submittedBy(contentType, entity),
  createdAt: entity.createdAt,
  updatedAt: entity.updatedAt,
  status: record?.status || toModerationStatus(entity.status),
  aiRisk: record?.aiRisk || "UNKNOWN",
  aiConfidence: record?.aiConfidence ?? null,
  aiIssues: record?.aiIssues || [],
  aiRecommendation: record?.aiRecommendation || "",
  entity,
  moderationId: record?._id || null,
});

const matchesSearch = (item, search) => {
  if (!search) return true;
  const value = [
    item.title,
    item.description,
    item.contentId,
    item.submittedBy?.name,
    item.submittedBy?.email,
    item.entity?.organizer,
    item.entity?.businessName,
    item.entity?.name,
  ].filter(Boolean).join(" ").toLowerCase();
  return value.includes(search.toLowerCase());
};

const loadItems = async () => {
  const [events, teams, vendors] = await Promise.all([
    Event.find().sort({ createdAt: -1 }).lean(),
    Team.find().sort({ createdAt: -1 }).lean(),
    Vendor.find().sort({ createdAt: -1 }).lean(),
  ]);
  const entities = [
    ...events.map((entity) => ["EVENT", entity]),
    ...teams.map((entity) => ["TEAM", entity]),
    ...vendors.map((entity) => ["VENDOR", entity]),
  ];
  const records = await Moderation.find({
    $or: entities.map(([contentType, entity]) => ({ contentType, contentId: entity._id.toString() })),
  }).lean();
  const recordMap = new Map(records.map((record) => [`${record.contentType}:${record.contentId}`, record]));
  return entities.map(([contentType, entity]) => {
    const record = recordMap.get(`${contentType}:${entity._id}`);
    return serialize(contentType, entity, record);
  });
};

exports.getQueue = async (req, res) => {
  try {
    const requestedType = normalizeType(req.query.type || "ALL");
    const requestedStatus = String(req.query.status || "ALL").toUpperCase();
    if (requestedType !== "ALL" && !isValidType(requestedType)) {
      return res.status(400).json({ error: "Invalid moderation content type" });
    }

    const allItems = await loadItems();
    const items = allItems.filter((item) =>
      (requestedType === "ALL" || item.contentType === requestedType) &&
      (requestedStatus === "ALL" || item.status === requestedStatus) &&
      matchesSearch(item, req.query.search?.trim())
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [approvedToday, rejectedToday] = await Promise.all([
      ModerationHistory.countDocuments({ action: "APPROVED", createdAt: { $gte: today } }),
      ModerationHistory.countDocuments({ action: "REJECTED", createdAt: { $gte: today } }),
    ]);
    const summary = {
      pendingReview: allItems.filter((item) => item.status === "PENDING_REVIEW").length,
      aiFlagged: allItems.filter((item) => item.status === "AI_FLAGGED").length,
      approvedToday,
      rejectedToday,
    };

    res.json({ items, summary });
  } catch (error) {
    console.error("Get moderation queue error:", error);
    res.status(500).json({ error: "Failed to load moderation queue" });
  }
};

exports.getItem = async (req, res) => {
  try {
    const contentType = normalizeType(req.params.contentType);
    if (!isValidType(contentType)) return res.status(400).json({ error: "Invalid content type" });
    const entity = await getEntity(contentType, req.params.contentId);
    if (!entity) return res.status(404).json({ error: "Moderation content not found" });
    const record = await ensureRecord(contentType, entity, await Moderation.findOne({ contentType, contentId: req.params.contentId }));
    const history = await ModerationHistory.find({ moderation: record._id }).sort({ createdAt: -1 }).lean();
    res.json({ item: serialize(contentType, entity, record), history });
  } catch (error) {
    console.error("Get moderation item error:", error);
    res.status(500).json({ error: "Failed to load moderation item" });
  }
};

const decide = (action) => async (req, res) => {
  try {
    const contentType = normalizeType(req.params.contentType);
    if (!isValidType(contentType)) return res.status(400).json({ error: "Invalid content type" });
    if (!["EVENT", "TEAM", "VENDOR"].includes(contentType)) {
      return res.status(400).json({ error: "This content type is not supported by the current data model" });
    }
    const reason = String(req.body?.reason || "").trim();
    const feedback = String(req.body?.feedback || "").trim();
    if ((action === "reject" || action === "requestChanges") && !reason && !feedback) {
      return res.status(400).json({ error: "A reason or feedback is required" });
    }
    if (action === "requestChanges" && contentType !== "EVENT") {
      return res.status(400).json({ error: "Request changes is currently supported for events only" });
    }

    const entity = await getEntity(contentType, req.params.contentId);
    if (!entity) return res.status(404).json({ error: "Moderation content not found" });
    const existing = await Moderation.findOne({ contentType, contentId: req.params.contentId });
    const record = await ensureRecord(contentType, entity, existing);
    const nextStatus = ACTION_STATUS[action];
    const previousStatus = record.status;
    const entityStatus = toEntityStatus(nextStatus);

    entity.status = entityStatus;
    await entity.save();

    const admin = await Admin.findById(req.user.id).select("name").lean();
    record.status = nextStatus;
    record.reviewedBy = req.user.id;
    record.reviewedAt = new Date();
    record.reason = reason;
    record.feedback = feedback;
    record.title = entityTitle(contentType, entity);
    record.submittedBy = submittedBy(contentType, entity);
    await record.save();

    await ModerationHistory.create({
      moderation: record._id,
      contentType,
      contentId: entity._id.toString(),
      action: nextStatus === "APPROVED" ? "APPROVED" : nextStatus === "REJECTED" ? "REJECTED" : "CHANGES_REQUESTED",
      admin: req.user.id,
      adminName: admin?.name || "Admin",
      previousStatus,
      newStatus: nextStatus,
      reason,
      feedback,
    });

    res.json({ message: `Content ${nextStatus.toLowerCase()}`, item: serialize(contentType, entity, record) });
  } catch (error) {
    console.error("Moderation decision error:", error);
    res.status(500).json({ error: "Failed to update moderation status" });
  }
};

exports.approve = decide("approve");
exports.reject = decide("reject");
exports.requestChanges = decide("requestChanges");
