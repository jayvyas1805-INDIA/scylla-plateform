/**
 * Fires the AI compliance check EXACTLY ONCE for a given verificationDoc
 * version, and caches the verdict on the Team/Vendor record itself.
 *
 * This is intentionally called from ONE place per model: right after
 * registerTeam/registerVendor (first upload) and right after
 * updateTeamProfile/editVendorProfile actually change verificationDoc
 * (re-upload). It is NEVER called from a GET route — the Approvals page
 * in admin-dashboard only ever reads the cached `aiReview` field that
 * this function writes, so opening/refreshing the page never re-runs
 * the model.
 *
 * Fire-and-forget by design: the calling controller does NOT await this
 * (see teamController/vendorController) so a slow or failed AI call
 * never blocks or breaks team/vendor registration. Failures are caught
 * and recorded as aiReview.status = "failed" so the admin dashboard can
 * show "AI check unavailable" instead of hanging forever on "pending".
 */

const Team = require("../models/Team");
const Vendor = require("../models/Vendor");
const ApprovalRule = require("../models/ApprovalRule");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";
const INTERNAL_SERVICE_SECRET = process.env.INTERNAL_SERVICE_SECRET || "";

const MODELS = { team: Team, vendor: Vendor };

async function triggerDocumentReview({ ownerType, ownerId, docUrl }) {
  const Model = MODELS[ownerType];
  if (!Model || !docUrl) return;

  try {
    // Mark as pending immediately so the admin dashboard can show "AI
    // reviewing…" instead of a stale/empty badge while the call is in flight.
    await Model.findByIdAndUpdate(ownerId, {
      "aiReview.status": "pending",
      "aiReview.docVersion": docUrl
    });

    const rules = await ApprovalRule.find({ docType: ownerType, active: true })
      .select("ruleText mandatory -_id")
      .lean();

    const resp = await fetch(`${AI_SERVICE_URL}/api/assistant/review-document`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": INTERNAL_SERVICE_SECRET
      },
      body: JSON.stringify({
        docType: ownerType,
        docUrl,
        rules: rules.map(r => ({ text: r.ruleText, mandatory: !!r.mandatory }))
      }),
      // ai-service does extraction + an LLM call; give it real headroom.
      signal: AbortSignal.timeout(60_000)
    });

    if (!resp.ok) {
      throw new Error(`ai-service responded ${resp.status}`);
    }

    const verdict = await resp.json();

    // Guard against a slower-earlier-call/faster-later-call race: only
    // persist this verdict if the doc hasn't changed again since we
    // read it (i.e. no newer re-upload has already overwritten docVersion).
    const current = await Model.findById(ownerId).select("verificationDoc").lean();
    if (!current || current.verificationDoc !== docUrl) return;

    await Model.findByIdAndUpdate(ownerId, {
      aiReview: {
        suggestion: verdict.suggestion,
        confidence: verdict.confidence,
        reasoning: verdict.reasoning,
        flaggedRules: verdict.flaggedRules || [],
        reviewedAt: new Date(),
        docVersion: docUrl,
        status: "done"
      }
    });
  } catch (err) {
    console.error(`AI document review failed for ${ownerType} ${ownerId}:`, err.message);
    await Model.findByIdAndUpdate(ownerId, {
      "aiReview.status": "failed",
      "aiReview.docVersion": docUrl,
      // Stored so the admin dashboard can show the actual cause on hover
      // instead of "unavailable" with no detail — saves a trip to the
      // server logs for every failure.
      "aiReview.reasoning": err.message?.slice(0, 500) || "Unknown error"
    }).catch(() => {});
  }
}

module.exports = { triggerDocumentReview };
