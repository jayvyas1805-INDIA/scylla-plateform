import { useState } from "react";
import { FaCalendarAlt, FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";

function StatusBadge({ status }) {
  const styles = {
    Upcoming: "bg-green-500/15 text-green-400 border border-green-500/30",
    Ongoing: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
    Completed: "bg-gray-500/15 text-gray-400 border border-gray-500/30",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${
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

export default function ManageEvents({ events, onView, onEdit, onDelete }) {
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = events.filter((e) => {
    const matchesStatus = filterStatus === "All" ? true : e.status === filterStatus;
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-[#0b0f14] border border-gray-800 rounded-2xl overflow-hidden">
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-3 bg-[#0f141b] border-b border-gray-800 sticky top-0 z-10">
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-slate-700 text-white text-sm rounded-xl px-3 py-2 outline-none"
        />

        {/* Status dropdown */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-700 text-white text-sm rounded-xl px-3 py-2 outline-none md:w-[200px]"
        >
          <option value="All">All Statuses</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-12 px-6 py-3 bg-[#0f141b] border-b border-gray-800 text-sm text-cyan-400/90 font-medium drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
        <div className="col-span-1 text-left">Icon</div>
        <div className="col-span-3">Event Name</div>
        <div className="col-span-3">Date</div>
        <div className="col-span-3">Status</div>
        <div className="col-span-2">Actions</div>
      </div>

      {/* Table rows */}
      <div>
        {filtered.length === 0 ? (
          <div className="px-6 py-6 text-white/60 col-span-12 text-center">
            No events found.
          </div>
        ) : (
          filtered.map((event) => (
            <div
              key={event.id}
              className="grid md:grid-cols-12 gap-y-3 md:gap-y-0 items-start md:items-center px-6 py-4 border-t border-gray-800 hover:bg-white/[0.03] transition-colors"
            >
              {/* Icon (left-aligned now) */}
              <div className="md:col-span-1 flex items-center justify-start">
                <div className="w-8 h-8 flex items-center justify-center rounded-md bg-slate-800 text-cyan-400">
                  <FaCalendarAlt size={16} />
                </div>
              </div>

              {/* Name with highlight */}
              <div className="md:col-span-3 font-semibold text-white">
                <HighlightedText text={event.name} searchTerm={searchTerm} />
              </div>

              {/* Date */}
              <div className="md:col-span-3 text-white/70 text-sm">
                {event.date}
              </div>

              {/* Status */}
              <div className="md:col-span-3">
                <StatusBadge status={event.status} />
              </div>

              {/* Actions */}
              <div className="md:col-span-2 flex gap-2">
                <button
                  onClick={() => onView(event.id)}
                  className="px-2 py-1 text-xs rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center gap-1"
                >
                  <FaEye size={12} /> View
                </button>
                <button
                  onClick={() => onEdit(event.id)}
                  className="px-2 py-1 text-xs rounded-lg bg-green-600/80 text-white hover:bg-green-600 transition-colors flex items-center gap-1"
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
