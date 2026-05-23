import { useState } from "react";
import clsx from "clsx";
import { FaBuilding, FaUserGraduate } from "react-icons/fa";

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

function TypeBadge({ type }) {
  const styles = {
    Vendor: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    Team: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  };
  return (
    <span className={clsx("px-2 py-1 text-xs rounded-full font-medium", styles[type])}>
      {type}
    </span>
  );
}

function TypeIcon({ type }) {
  return (
    <div className="w-8 h-8 flex items-center justify-center rounded-md bg-slate-800 text-cyan-400">
      {type === "Vendor" ? <FaBuilding size={16} /> : <FaUserGraduate size={16} />}
    </div>
  );
}

export default function DocumentTable({ documents, onApprove, onReject, onView }) {
  const [filterType, setFilterType] = useState("All");

  const filteredDocs = documents.filter((doc) =>
    filterType === "All" ? true : doc.type === filterType
  );

  return (
    <div className="bg-[#0b0f14] border border-gray-800 rounded-2xl overflow-hidden">
      {/* Filter dropdown */}
      <div className="flex justify-end px-6 py-3 bg-[#0f141b] border-b border-gray-800 sticky top-0 z-10">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-slate-700 text-white text-sm rounded-xl px-3 py-2 outline-none"
        >
          <option value="All">All Types</option>
          <option value="Vendor">Vendor</option>
          <option value="Team">Team</option>
        </select>
      </div>

      {/* Table header (desktop only) */}
      <div className="hidden md:grid grid-cols-12 px-6 py-3 bg-[#0f141b] border-b border-gray-800 text-sm text-cyan-400/90 font-medium drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
        <div className="col-span-1">Type</div>
        <div className="col-span-2">Title</div>
        <div className="col-span-2">Badge</div>
        <div className="col-span-3">Owner</div>
        <div className="col-span-2">Submitted</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Actions</div>
      </div>

      {/* Table rows */}
      <div>
        {filteredDocs.length === 0 ? (
          <div className="px-6 py-6 text-white/60 col-span-12 text-center">
            No documents found.
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="grid md:grid-cols-12 gap-y-3 md:gap-y-0 items-start md:items-center px-6 py-4 border-t border-gray-800 hover:bg-white/[0.03] transition-colors"
            >
              {/* Type */}
              <div className="md:col-span-1 flex items-center gap-2">
                <TypeIcon type={doc.type} />
                <span className="md:hidden text-cyan-400 font-semibold">Type: </span>

              </div>

              {/* Title */}
              <div className="md:col-span-2 font-semibold text-white">
                <span className="md:hidden text-cyan-400 font-semibold">Title: </span>
                {/* {doc.title.replace(/^(Team|Vendor)\s+/i, "")} */}
                Verification Document
              </div>

              {/* Badge (desktop only, already shown inline on mobile) */}
              <div className="hidden md:block md:col-span-2">
                <TypeBadge type={doc.type} />
              </div>

              {/* Owner */}
              <div className="md:col-span-3 flex flex-col leading-tight">
                <span className="md:hidden text-cyan-400 font-semibold">Owner: </span>
                <div className="text-white font-medium">{doc.owner}</div>
                {doc.email && <div className="text-white/60 text-xs">{doc.email}</div>}
              </div>

              {/* Submitted */}
              <div className="md:col-span-2 text-white/70 text-sm">
                <span className="md:hidden text-cyan-400 font-semibold">Submitted: </span>
                {doc.submitted}
              </div>

              {/* Status */}
              <div className="md:col-span-1">
                <span className="md:hidden text-cyan-400 font-semibold">Status: </span>
                <StatusBadge status={doc.status} />
              </div>

              {/* Actions */}
              <div className="md:col-span-1 flex md:flex-col gap-2 mt-2 md:mt-0">
                <button
                  onClick={() =>
                    onView({
                      pdfUrl: doc.pdfUrl, // ✅ NOW IT EXISTS
                      title: "Verification Document",
                      owner: doc.owner,
                      type: doc.type,
                      status: doc.status,
                      refId: doc.id,
                      model: doc.type,
                    })
                  }

                  className="px-3 py-1 text-xs rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  View
                </button>

                {doc.status !== "Approved" && (
                  <button
                   onClick={() => onApprove(doc)}
                    className="px-3 py-1 text-xs rounded-lg bg-green-600/80 text-white hover:bg-green-600 transition-colors"
                  >
                    Approve
                  </button>
                )}

                {doc.status !== "Rejected" && (
                  <button
                   onClick={() => onReject(doc)}
                    className="px-3 py-1 text-xs rounded-lg bg-red-600/80 text-white hover:bg-red-600 transition-colors"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
