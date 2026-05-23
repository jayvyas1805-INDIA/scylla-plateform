import { useState } from "react";
import { Users } from "lucide-react";
import toast from "react-hot-toast";

export default function GroupModerationSidebar({ onSelectTeam }) {

  /* =======================================================
     ✅ 1. MAKE TEAMS DATA STATE (THIS IS THE KEY FIX)
  ======================================================= */
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: "Thunder Racing Team",
      status: "Under Review",
      reports: 5,
      reason: "Fake reviews",
      color: "blue",
    },
    {
      id: 2,
      name: "Apex Tyres Co.",
      status: "Under Review",
      reports: 3,
      reason: "Spam content",
      color: "purple",
    },
    {
      id: 3,
      name: "Velocity Motorsports",
      status: "Approved",
      reports: 2,
      reason: "Misleading content",
      color: "green",
    },
    {
      id: 4,
      name: "FastTrack Solutions",
      status: "Suspended",
      reports: 8,
      reason: "Abuse",
      color: "red",
    },
  ]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTeam, setActiveTeam] = useState(null);

  /* =======================================================
     2. SELECT LOGIC
  ======================================================= */

  const selectAll = () => {
    if (selectedIds.length === teams.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(teams.map(t => t.id));
    }
  };

  const toggleOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  /* =======================================================
     ✅ 3. BULK ACTIONS — ACTUALLY UPDATE STATE HERE
  ======================================================= */

  const bulkDismiss = () => {
    if (!selectedIds.length) {
      toast.error("Select teams first");
      return;
    }

    setTeams(prev =>
      prev.map(team =>
        selectedIds.includes(team.id)
          ? { ...team, reports: 0, status: "Dismissed" }
          : team
      )
    );

    toast.success(`Dismissed reports for ${selectedIds.length} teams`);
    setSelectedIds([]);
  };

  const bulkWarn = () => {
    if (!selectedIds.length) {
      toast.error("Select teams first");
      return;
    }

    setTeams(prev =>
      prev.map(team =>
        selectedIds.includes(team.id)
          ? { ...team, status: "Warned" }
          : team
      )
    );

    toast.success(`Warnings sent to ${selectedIds.length} teams`);
    setSelectedIds([]);
  };

  const bulkSuspend = () => {
    if (!selectedIds.length) {
      toast.error("Select teams first");
      return;
    }

    const ok = window.confirm(
      `Suspend ${selectedIds.length} selected teams?`
    );

    if (!ok) return;

    setTeams(prev =>
      prev.map(team =>
        selectedIds.includes(team.id)
          ? { ...team, status: "Suspended" }
          : team
      )
    );

    toast.success(`${selectedIds.length} teams suspended`);
    setSelectedIds([]);
  };

  /* =======================================================
     4. UI
  ======================================================= */

  return (
    <div className="w-[260px] h-full bg-[#e7e5e5] border-r border-gray-800 flex flex-col">


      {/* TOP ACTIONS */}
      <div className="p-3 border-b border-gray-800 bg-[#3c3c3c]">

        <label className="flex items-center gap-2 text-sm text-white">
          <input
            type="checkbox"
            checked={selectedIds.length === teams.length && teams.length > 0}
            onChange={selectAll}
          />
          Select All
        </label>

        <div className="flex gap-2 mt-3">
          <button
            onClick={bulkDismiss}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 rounded"
          >
            Bulk Dismiss
          </button>

          <button
            onClick={bulkWarn}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black text-xs py-1 rounded"
          >
            Bulk Warn
          </button>

          <button
            onClick={bulkSuspend}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1 rounded"
          >
            Bulk Suspend
          </button>
        </div>
      </div>

      {/* TEAM LIST */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {teams.map(team => (
          <div
            key={team.id}
            onClick={() => {
              setActiveTeam(team.id);
              onSelectTeam?.(team);
            }}
            className={`p-3 rounded-lg cursor-pointer border transition
              ${activeTeam === team.id
                ? "bg-[#0f172a] text-white shadow-[0_0_18px_rgba(59,130,246,0.9)] ring-1 ring-blue-500/40"
                : "bg-[#10151d] hover:bg-[#151b25] text-white/80"
              }`}
          >
            <div className="flex gap-2 items-start">
              <input
                type="checkbox"
                checked={selectedIds.includes(team.id)}
                onClick={(e) => e.stopPropagation()}
                onChange={() => toggleOne(team.id)}
              />

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <TeamIcon color={team.color} />
                  <span className="font-semibold text-sm">
                    {team.name}
                  </span>
                </div>

                <div className="text-xs mt-1">
                  Status: <b>{team.status}</b>
                </div>

                <div className="text-xs">
                  Reports:{" "}
                  <span className="text-red-500 font-semibold">
                    {team.reports}
                  </span>
                </div>

                <div className="text-xs text-white/50">
                  {team.reason}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =======================================================
   ICON
======================================================= */

function TeamIcon({ color }) {
  const map = {
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    green: "bg-green-500",
    red: "bg-red-500",
  };

  return (
    <div className={`w-7 h-7 rounded-md ${map[color]} text-white flex items-center justify-center`}>
      <Users size={14} />
    </div>
  );
}
