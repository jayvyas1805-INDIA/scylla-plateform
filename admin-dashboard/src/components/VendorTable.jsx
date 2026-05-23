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

export default function VendorTable({ vendors, onApprove, onReject, onView }) {
  return (
    <div className="bg-[#0b0f14] border border-gray-800 rounded-2xl overflow-hidden">
      {/* Table header */}
      <div className="hidden md:grid grid-cols-12 px-4 sm:px-6 py-3 bg-[#0f141b] border-b border-gray-800 text-sm text-cyan-400/90 font-medium drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
        <div className="col-span-3">Vendor</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-2">GST/Tax ID</div>
        <div className="col-span-2">Location</div>
        <div className="col-span-1">Submitted</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Actions</div>
      </div>

      {/* Table rows */}
      <div>
        {vendors.map((v) => (
          <div
            key={v.id}
            className="grid md:grid-cols-12 gap-y-3 md:gap-y-0 items-start md:items-center px-4 sm:px-6 py-4 border-t border-gray-800 hover:bg-white/[0.03] transition-colors"
          >
            {/* Vendor */}
            <div className="md:col-span-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white">
                {v.initials}
              </div>
              <div className="leading-tight flex flex-col">
                <div className="text-white font-medium">{v.name}</div>
                <div className="text-white/60 text-xs">{v.email}</div>
              </div>
            </div>

            {/* Category */}
            <div className="md:col-span-2 text-white/80">
              <span className="md:hidden font-semibold text-cyan-400">Category: </span>
              {v.category}
            </div>

            {/* GST */}
            <div className="md:col-span-2 text-white/80 break-words">
              <span className="md:hidden font-semibold text-cyan-400">GST/Tax ID: </span>
              {v.gst}
            </div>

            {/* Location */}
            <div className="md:col-span-2 text-white/80">
              <span className="md:hidden font-semibold text-cyan-400">Location: </span>
              {v.location}
            </div>

            {/* Submitted */}
            <div className="md:col-span-1 text-white/70 text-sm">
              <span className="md:hidden font-semibold text-cyan-400">Submitted: </span>
              {v.submitted}
            </div>

            {/* Status */}
            <div className="md:col-span-1">
              <span className="md:hidden font-semibold text-cyan-400">Status: </span>
              <StatusBadge status={v.status} />
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
                  className="px-3 py-1 text-xs rounded-lg bg-green-600/80 text-white hover:bg-green-600 transition-colors"
                >
                  Approve
                </button>
              )}

              {v.status !== "Rejected" && (
                <button
                  onClick={() => onReject(v.id)}
                  className="px-3 py-1 text-xs rounded-lg bg-red-600/80 text-white hover:bg-red-600 transition-colors"
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
