import { useState } from "react";
import { FaCalendarAlt, FaEdit, FaTrashAlt, FaEye, FaCheck, FaTimes } from "react-icons/fa";

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
    approved: "bg-green-500/15 text-green-400 border border-green-500/30",
    rejected: "bg-red-500/15 text-red-400 border border-red-500/30",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium capitalize ${
        styles[status] || "bg-slate-700 text-slate-300 border border-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

// Helper to highlight search matches
function HighlightedText({ text, searchTerm }) {
  if (!searchTerm) return <>{text}</>;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span
            key={i}
            className="bg-yellow-500/30 text-yellow-200 font-semibold rounded px-1"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function ManageEvents({ events, onView, onEdit, onDelete, onApprove, onReject }) {
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = events.filter((e) => {
    const matchesStatus = filterStatus === "All" ? true : e.status === filterStatus;
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-admin-bg border border-admin-border rounded-2xl overflow-hidden">
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-3 bg-admin-surface-raised border-b border-admin-border sticky top-0 z-10">
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-admin-bg text-admin-text text-sm rounded-xl px-3 py-2 outline-none border border-admin-border"
        />

        {/* Status dropdown */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-admin-bg text-admin-text text-sm rounded-xl px-3 py-2 outline-none border border-admin-border md:w-[200px]"
        >
          <option value="All">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-12 px-6 py-3 bg-admin-surface-raised border-b border-admin-border text-sm text-admin-accent/90 font-medium">
        <div className="col-span-1 text-left">Icon</div>
        <div className="col-span-3">Event Name</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-4">Actions</div>
      </div>

      {/* Table rows */}
      <div>
        {filtered.length === 0 ? (
          <div className="px-6 py-6 text-admin-muted col-span-12 text-center">
            No events found.
          </div>
        ) : (
          filtered.map((event) => (
            <div
              key={event.id}
              className="grid md:grid-cols-12 gap-y-3 md:gap-y-0 items-start md:items-center px-6 py-4 border-t border-admin-border hover:bg-white/[0.03] transition-colors"
            >
              {/* Icon */}
              <div className="md:col-span-1 flex items-center justify-start">
                <div className="w-8 h-8 flex items-center justify-center rounded-md bg-admin-surface-raised text-admin-accent">
                  <FaCalendarAlt size={16} />
                </div>
              </div>

              {/* Name with highlight */}
              <div className="md:col-span-3 font-semibold text-admin-text">
                <HighlightedText text={event.name} searchTerm={searchTerm} />
              </div>

              {/* Date */}
              <div className="md:col-span-2 text-admin-muted text-sm">
                {event.date}
              </div>

              {/* Status */}
              <div className="md:col-span-2">
                <StatusBadge status={event.status} />
              </div>

              {/* Actions */}
              <div className="md:col-span-4 flex flex-wrap gap-2">
                {event.status === "pending" && (
                  <>
                    <button
                      onClick={() => onApprove(event.id)}
                      className="px-2 py-1 text-xs rounded-lg bg-green-600/80 text-white hover:bg-green-600 transition-colors flex items-center gap-1"
                    >
                      <FaCheck size={12} /> Approve
                    </button>
                    <button
                      onClick={() => onReject(event.id)}
                      className="px-2 py-1 text-xs rounded-lg bg-red-600/80 text-white hover:bg-red-600 transition-colors flex items-center gap-1"
                    >
                      <FaTimes size={12} /> Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => onView(event.id)}
                  className="px-2 py-1 text-xs rounded-lg bg-white/10 text-admin-text hover:bg-white/20 transition-colors flex items-center gap-1"
                >
                  <FaEye size={12} /> View
                </button>
                <button
                  onClick={() => onEdit(event.id)}
                  className="px-2 py-1 text-xs rounded-lg bg-admin-accent/80 text-white hover:bg-admin-accent transition-colors flex items-center gap-1"
                >
                  <FaEdit size={12} /> Edit
                </button>
                <button
                  onClick={() => onDelete(event.id)}
                  className="px-2 py-1 text-xs rounded-lg bg-red-600/80 text-white hover:bg-red-600 transition-colors flex items-center gap-1"
                >
                  <FaTrashAlt size={12} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
