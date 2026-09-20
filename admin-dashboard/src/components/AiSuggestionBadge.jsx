import { useState } from "react";
import clsx from "clsx";
import { CheckCircle2, XCircle, AlertTriangle, Loader2, CircleSlash, RotateCw } from "lucide-react";
import toast from "react-hot-toast";
import ApprovalHoverValue from "./ApprovalHoverValue";
import { rerunAiReview } from "../api/admin.api";

// Renders the cached `aiReview` field the backend writes ONCE per
// document version (see backend/utils/aiDocumentReview.js). Displaying
// it never triggers a model call — but if `ownerType`/`ownerId` are
// passed, this also renders a manual re-run control (admin-only action,
// hits POST /api/admin/rerun-ai-review) for testing/diagnosing a check
// without waiting on a team/vendor to re-upload their document.
export default function AiSuggestionBadge({ aiReview, ownerType, ownerId, onRerun }) {
  const [rerunning, setRerunning] = useState(false);

  const canRerun = ownerType && ownerId;

  const handleRerun = async (e) => {
    e.stopPropagation();
    if (!canRerun || rerunning) return;
    setRerunning(true);
    try {
      await rerunAiReview(ownerType, ownerId);
      toast.success("AI check re-run.");
      onRerun?.();
    } catch (err) {
      console.error("Failed to re-run AI check", err);
      toast.error(err?.response?.data?.error || "Could not re-run AI check.");
    } finally {
      setRerunning(false);
    }
  };

  const RerunButton = canRerun && (
    <button
      onClick={handleRerun}
      disabled={rerunning}
      title="Re-run AI check"
      className="text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
    >
      <RotateCw size={12} className={rerunning ? "animate-spin" : ""} />
    </button>
  );

  if (!aiReview || aiReview.status === "idle") {
    // Nothing has ever run for this document — still offer a manual
    // trigger so an admin isn't stuck waiting on a re-upload.
    return canRerun ? (
      <button
        onClick={handleRerun}
        disabled={rerunning}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-medium bg-slate-700/40 text-slate-400 border border-slate-600/40 hover:text-white disabled:opacity-50 transition-colors"
      >
        <RotateCw size={12} className={rerunning ? "animate-spin" : ""} />
        Run AI check
      </button>
    ) : null;
  }

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
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-medium bg-slate-600/30 text-slate-300 border border-slate-500/30">
        <ApprovalHoverValue
          value={aiReview.reasoning || "No error detail recorded."}
          className="inline-flex items-center gap-1.5"
        >
          <CircleSlash size={13} />
          AI check unavailable
        </ApprovalHoverValue>
        {RerunButton}
      </span>
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
    <span
      style={{ "--glow-color": config.glow }}
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-medium animate-fadeIn animate-pulse-glow-persistent",
        config.classes
      )}
    >
      <ApprovalHoverValue
        value={aiReview.reasoning || "No reasoning recorded."}
        className="inline-flex items-center gap-1.5"
      >
        <Icon size={13} />
        {config.label}
        {typeof aiReview.confidence === "number" && (
          <span className="opacity-70">({Math.round(aiReview.confidence * 100)}%)</span>
        )}
      </ApprovalHoverValue>
      {RerunButton}
    </span>
  );
}
