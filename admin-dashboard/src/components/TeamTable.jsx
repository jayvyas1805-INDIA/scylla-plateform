import clsx from "clsx";

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

export default function TeamTable({ teams, onApprove, onReject, onView, categoryBadge }) {
  return (
    <div className="bg-[#0b0f14] border border-gray-800 rounded-2xl overflow-hidden">
      {/* Table header (desktop only) */}
      <div className="hidden md:grid grid-cols-12 px-4 sm:px-6 py-3 bg-[#0f141b] border-b border-gray-800 text-sm text-cyan-400/90 font-medium drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
        <div className="col-span-1">Term</div>
        <div className="col-span-2">Team</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-3">University</div>
        <div className="col-span-2">Submitted</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Actions</div>
      </div>

      {/* Table rows */}
      {teams.map((team) => (
        <div
          key={team.id}
          className="grid md:grid-cols-12 gap-y-3 md:gap-y-0 items-start md:items-center px-4 sm:px-6 py-4 border-t border-gray-800 hover:bg-white/[0.03] transition-colors"
        >
          {/* Term */}
          <div className="md:col-span-1 flex justify-center md:justify-start">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white">
              {team.term}
            </div>
          </div>

          {/* Team */}
          <div className="md:col-span-2 text-white font-medium">
            <span className="md:hidden text-cyan-400 font-semibold">Team: </span>
            {team.team}
          </div>

          {/* Category */}
          <div className="md:col-span-2">
            <span className="md:hidden text-cyan-400 font-semibold">Category: </span>
            <span className={`px-3 py-1 text-xs rounded-full ${categoryBadge(team.category)}`}>
              {team.category}
            </span>
          </div>

          {/* University */}
          <div className="md:col-span-3 text-white/80">
            <span className="md:hidden text-cyan-400 font-semibold">University: </span>
            {team.university}
          </div>

          {/* Submitted */}
          <div className="md:col-span-2 text-white/70 text-sm">
            <span className="md:hidden text-cyan-400 font-semibold">Submitted: </span>
            {team.submitted}
          </div>

          {/* Status */}
          <div className="md:col-span-1">
            <span className="md:hidden text-cyan-400 font-semibold">Status: </span>
            <StatusBadge status={team.status} />
          </div>

          {/* Actions */}
          <div className="md:col-span-1 flex md:flex-col gap-2 mt-2 md:mt-0">
            <button
              onClick={() => onView(team.id)}
              className="px-3 py-1 text-xs rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              View
            </button>

            {team.status !== "Approved" && (
              <button
                onClick={() => onApprove(team.id)}
                className="px-3 py-1 text-xs rounded-lg bg-green-600/80 text-white hover:bg-green-600 transition-colors"
              >
                Approve
              </button>
            )}

            {team.status !== "Rejected" && (
              <button
                onClick={() => onReject(team.id)}
                className="px-3 py-1 text-xs rounded-lg bg-red-600/80 text-white hover:bg-red-600 transition-colors"
              >
                Reject
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
