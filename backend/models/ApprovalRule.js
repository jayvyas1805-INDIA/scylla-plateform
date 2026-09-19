const mongoose = require("mongoose");

// One checklist item an admin has defined for a document type. These are
// what ai-service retrieves and hands to the LLM when it reviews a
// team/vendor's verificationDoc — see backend/utils/aiDocumentReview.js
// and ai-service/app/document_review/.
const approvalRuleSchema = new mongoose.Schema(
  {
    docType: {
      type: String,
      enum: ["team", "vendor"],
      required: true
    },

    // Plain-language rule text, e.g. "Document must show a valid GST
    // number matching the format 22AAAAA0000A1Z5" or "University ID must
    // show an expiry date that has not passed". This is what gets shown
    // to the LLM verbatim, so keep it specific and checkable.
    ruleText: {
      type: String,
      required: true,
      trim: true
    },

    // Mandatory rules are ALWAYS included in the LLM's context, regardless
    // of BM25 relevance to the document text — this is what stops "the
    // document doesn't even mention X" cases from silently missing a
    // hard requirement. Non-mandatory rules are retrieved only when
    // they're actually relevant to the document's content.
    mandatory: {
      type: Boolean,
      default: true
    },

    active: {
      type: Boolean,
      default: true
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ApprovalRule", approvalRuleSchema);
