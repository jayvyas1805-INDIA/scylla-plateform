import clsx from "clsx";
import { CheckCircle2, XCircle, AlertTriangle, Loader2, CircleSlash } from "lucide-react";
import ApprovalHoverValue from "./ApprovalHoverValue";

// Renders the cached `aiReview` field the backend writes ONCE per
// document version (see backend/utils/aiDocumentReview.js). This
// component never triggers a model call itself — it only displays
// whatever is already sitting in the team/vendor/document record, so
// switching tabs or refreshing this page is free.
export default function AiSuggestionBadge({ aiReview }) {
  if (!aiReview || aiReview.status === "idle") return null;

  if (aiReview.status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-medium bg-slate-600/30 text-slate-300 border border-slate-500/30 animate-fadeIn">
        <Loader2 size={13} className="animate-spin" />
        AI reviewing…
      </span>
    );
  }

  if (aiReview.status === "failed") {
    return (
      <ApprovalHoverValue
        value={aiReview.reasoning || "No error detail recorded."}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-medium bg-slate-600/30 text-slate-300 border border-slate-500/30"
      >
        <CircleSlash size={13} />
        AI check unavailable
      </ApprovalHoverValue>
    );
  }

  if (!aiReview.suggestion) return null;

  const config = {
    approve: {
      label: "AI: Approve",
      icon: CheckCircle2,
      classes: "bg-green-500/15 text-green-400 border border-green-500/40",
      glow: "rgba(74, 222, 128, 0.55)",
    },
    reject: {
      label: "AI: Reject",
      icon: XCircle,
      classes: "bg-red-500/15 text-red-400 border border-red-500/40",
      glow: "rgba(248, 113, 113, 0.55)",
    },
    review: {
      label: "AI: Needs review",
      icon: AlertTriangle,
      classes: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/40",
      glow: "rgba(250, 204, 21, 0.55)",
    },
  }[aiReview.suggestion];

  if (!config) return null;
  const Icon = config.icon;

  return (
    <ApprovalHoverValue
      value={aiReview.reasoning || "No reasoning recorded."}
      style={{ "--glow-color": config.glow }}
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-medium animate-fadeIn animate-pulse-glow-persistent",
        config.classes
      )}
    >
      <Icon size={13} />
      {config.label}
      {typeof aiReview.confidence === "number" && (
        <span className="opacity-70">({Math.round(aiReview.confidence * 100)}%)</span>
      )}
    </ApprovalHoverValue>
  );
}
