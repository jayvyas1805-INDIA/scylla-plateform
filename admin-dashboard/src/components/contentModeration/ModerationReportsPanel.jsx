import { useState } from "react";
import { XCircle, ShieldX, Ban } from "lucide-react";
import toast from "react-hot-toast";

export default function ModerationReportsPanel() {
  const [adminNotes, setAdminNotes] = useState(
    "Internal review of the team’s activities is underway. No decisions have been made yet."
  );

  const handleAction = (label) => {
    toast.success(label);
  };

  return (
    <aside className="w-full bg-[#0d1218] border border-[#1f2937] rounded-xl p-4 sm:p-5 space-y-6">

      {/* ================= REPORT SUMMARY ================= */}
      <div>
        <h3 className="text-sm sm:text-base font-semibold mb-3">
          Reports Summary
        </h3>

        <p className="text-xs sm:text-sm mb-3">Total Reports: 5</p>

        <div className="flex flex-wrap gap-2 text-xs">
          <Tag label="Safe" count="1" color="green" />
          <Tag label="Under Review" count="2" color="yellow" />
          <Tag label="Flagged" count="2" color="red" />
        </div>
      </div>

      {/* ================= INDIVIDUAL REPORTS ================= */}
      <div>
        <h3 className="text-sm sm:text-base font-semibold mb-3">
          Individual Reports
        </h3>

        <div className="space-y-2">
          <Report
            id="#12890"
            text="Suspicious vehicle part transactions."
            status="Under Review"
          />
          <Report
            id="#8923"
            text="Shared confidential data with vendors."
            status="Flagged"
          />
          <Report
            id="#15678"
            text="No issues found."
            status="Safe"
          />
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div>
        <h3 className="text-sm sm:text-base font-semibold mb-3">
          Moderation Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <ActionBtn
            icon={<XCircle size={14} />}
            label="Dismiss Reports"
            color="green"
            onClick={() => handleAction("Reports dismissed")}
          />
          <ActionBtn
            icon={<ShieldX size={14} />}
            label="Send Warning"
            color="orange"
            onClick={() => handleAction("Warning sent")}
          />
          <ActionBtn
            icon={<Ban size={14} />}
            label="Suspend"
            color="red"
            onClick={() => handleAction("Team suspended")}
          />
          <ActionBtn
            icon={<Ban size={14} />}
            label="Ban User"
            color="dark"
            onClick={() => handleAction("User banned")}
          />
        </div>
      </div>

      {/* ================= ADMIN NOTES ================= */}
      <div>
        <h3 className="text-sm sm:text-base font-semibold mb-2">
          Admin Notes
        </h3>

        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          className="w-full h-24 sm:h-28 text-xs sm:text-sm bg-[#0b0f14] border border-[#1f2937] rounded p-2 resize-none"
        />

        <button
          onClick={() => toast.success("Notes saved")}
          className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm py-2 rounded transition"
        >
          Save Notes
        </button>
      </div>
    </aside>
  );
}

/* ================= SMALL COMPONENTS ================= */

const Tag = ({ label, count, color }) => {
  const colors = {
    green: "bg-green-600/20 text-green-400",
    yellow: "bg-yellow-600/20 text-yellow-400",
    red: "bg-red-600/20 text-red-400",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${colors[color]}`}
    >
      {count} {label}
    </span>
  );
};

const Report = ({ id, text, status }) => {
  const statusColors = {
    Safe: "text-green-400",
    "Under Review": "text-yellow-400",
    Flagged: "text-red-400",
  };

  return (
    <div className="border border-[#1f2937] rounded-lg p-3 text-xs sm:text-sm">
      <div className="font-semibold">{id}</div>
      <div className="text-white/60 mt-1 leading-snug">{text}</div>
      <div className={`mt-1 font-medium ${statusColors[status]}`}>
        {status}
      </div>
    </div>
  );
};

const ActionBtn = ({ icon, label, color, onClick }) => {
  const colors = {
    green: "bg-green-700/20 text-green-400",
    orange: "bg-orange-700/20 text-orange-400",
    red: "bg-red-700/20 text-red-400",
    dark: "bg-red-900/30 text-red-300",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 py-2 text-xs sm:text-sm rounded border border-[#1f2937] transition hover:opacity-90 ${colors[color]}`}
    >
      {icon} {label}
    </button>
  );
};
