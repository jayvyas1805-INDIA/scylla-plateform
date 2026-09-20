import clsx from "clsx";
import ApprovalHoverValue from "./ApprovalHoverValue";
import AiSuggestionBadge from "./AiSuggestionBadge";
import { aiRowAccentClasses } from "../utils/aiRowAccent";

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
    Approved: "bg-green-500/15 text-green-400 border border-green-500/30",
    Rejected: "bg-red-500/15 text-red-400 border border-red-500/30",
  };
  return (
    <span
      className={clsx(
        "px-3 py-1 text-xs rounded-full font-medium",
        styles[status] || "bg-gray-700 text-gray-300 border border-gray-600"
      )}
    >
      {status}
    </span>
  );
}

export default function VendorTable({ vendors, onApprove, onReject, onView, onRerunAi }) {
  return (
    <div className="bg-admin-bg border border-gray-800 rounded-2xl overflow-visible">
      {/* Table header */}
      <div className="hidden md:grid grid-cols-12 px-4 sm:px-6 py-3 bg-admin-surface-raised border-b border-gray-800 text-sm text-admin-accent/90 font-medium drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
        <div className="col-span-2">Vendor</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-1">GST/Tax ID</div>
        <div className="col-span-1">Location</div>
        <div className="col-span-2">Submitted</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-2">AI Suggestion</div>
        <div className="col-span-1">Actions</div>
      </div>

      {/* Table rows */}
      <div>
        {vendors.map((v) => (
          <div
            key={v.id}
            className={`grid min-w-0 md:grid-cols-12 gap-y-3 md:gap-y-0 items-start md:items-center px-4 sm:px-6 py-4 border-t border-gray-800 hover:bg-white/[0.03] transition-colors ${aiRowAccentClasses(v.aiReview)}`}
          >
            {/* Vendor */}
            <div className="md:col-span-2 min-w-0 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white">
                {v.logo ? <img src={v.logo} alt={`${v.name} logo`} className="w-full h-full rounded-full object-cover" /> : (v.initials || v.name?.slice(0, 2).toUpperCase())}
              </div>
              <div className="leading-tight flex flex-col">
                <ApprovalHoverValue value={v.name} className="text-white font-medium truncate" />
                <ApprovalHoverValue value={v.email} className="text-white/60 text-xs truncate" />
              </div>
            </div>

            {/* Category */}
            <ApprovalHoverValue value={v.category} className="md:col-span-2 min-w-0 text-white/80 truncate">
              <span className="md:hidden font-semibold text-admin-accent">Category: </span>
              {v.category}
            </ApprovalHoverValue>

            {/* GST */}
            <ApprovalHoverValue value={v.gst} className="md:col-span-1 min-w-0 text-white/80 truncate">
              <span className="md:hidden font-semibold text-admin-accent">GST/Tax ID: </span>
              {v.gst}
            </ApprovalHoverValue>

            {/* Location */}
            <ApprovalHoverValue value={v.location} className="md:col-span-1 min-w-0 text-white/80 truncate">
              <span className="md:hidden font-semibold text-admin-accent">Location: </span>
              {v.location}
            </ApprovalHoverValue>

            {/* Submitted */}
            <ApprovalHoverValue value={v.submitted} className="md:col-span-2 min-w-0 text-white/70 text-sm truncate">
              <span className="md:hidden font-semibold text-admin-accent">Submitted: </span>
              {v.submitted}
            </ApprovalHoverValue>

            {/* Status */}
            <div className="md:col-span-1">
              <span className="md:hidden font-semibold text-admin-accent">Status: </span>
              <StatusBadge status={v.status} />
            </div>

            {/* AI Suggestion */}
            <div className="md:col-span-2">
              <span className="md:hidden font-semibold text-admin-accent">AI Suggestion: </span>
              <AiSuggestionBadge
                aiReview={v.aiReview}
                ownerType="vendor"
                ownerId={v.id}
                onRerun={onRerunAi}
              />
            </div>

            {/* Actions */}
            <div className="md:col-span-1 flex md:flex-col gap-2 mt-2 md:mt-0">
              <button
                onClick={() => onView(v.id)}
                className="px-3 py-1 text-xs rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                View
              </button>

              {v.status !== "Approved" && (
                <button
                  onClick={() => onApprove(v.id)}
                  style={{ "--glow-color": "rgba(34, 197, 94, 0.6)" }}
                  className="px-3 py-1 text-xs rounded-lg bg-green-600/80 text-white hover:bg-green-600 hover:scale-105 hover:animate-pulse-glow transition-all"
                >
                  Approve
                </button>
              )}

              {v.status !== "Rejected" && (
                <button
                  onClick={() => onReject(v.id)}
                  style={{ "--glow-color": "rgba(239, 68, 68, 0.6)" }}
                  className="px-3 py-1 text-xs rounded-lg bg-red-600/80 text-white hover:bg-red-600 hover:scale-105 hover:animate-pulse-glow transition-all"
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
