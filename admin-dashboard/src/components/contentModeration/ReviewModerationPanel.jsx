import { useMemo, useState } from "react";
import { Check, X, Flag, Eye, EyeOff, Star } from "lucide-react";

const TYPES = ["All", "Products", "Services", "Teams", "Vendors"];
const STATUSES = ["All", "Pending", "Approved", "Hidden", "Flagged"];

const seedData = [
  {
    id: 1,
    reviewer: "Marcus Chen",
    avatar: "https://i.pravatar.cc/40?img=12",
    handle: "@marcuscc",
    target: "Apex Carbon Fiber Wing",
    targetId: "#PND-2847",
    type: "Products",
    rating: 5,
    review:
      "Exceptional quality and fitment. The carbon fiber construction is top-notch and really improved my car’s aerodynamics.",
    status: "Pending",
    date: new Date("2025-12-01"),
  },
  {
    id: 2,
    reviewer: "Sarah Rodriguez",
    avatar: "https://i.pravatar.cc/40?img=32",
    handle: "@sarahR",
    target: "Velocity Racing Team",
    targetId: "#TM-1543",
    type: "Teams",
    rating: 5,
    review:
      "Exceptional coordination and professionalism. The team delivered consistent results and maintained great communication throughout.",
    status: "Pending",
    date: new Date("2025-12-15"),
  },
  {
    id: 3,
    reviewer: "Jake Morrison",
    avatar: "https://i.pravatar.cc/40?img=45",
    handle: "@jakemoto",
    target: "Premium Detailing Service",
    targetId: "#DSV-9582",
    type: "Services",
    rating: 5,
    review:
      "Professional service with attention to detail. My car looked brand new after the ceramic coating application.",
    status: "Approved",
    date: new Date("2025-11-28"),
  },
  {
    id: 4,
    reviewer: "Emma Thompson",
    avatar: "https://i.pravatar.cc/40?img=5",
    handle: "@emmat1",
    target: "TurboTech Performance",
    targetId: "#VND-4721",
    type: "Vendors",
    rating: 2,
    review:
      "Disappointed with the service. Parts arrived damaged and customer support was unresponsive for days.",
    status: "Hidden",
    date: new Date("2025-12-20"),
  },
  {
    id: 5,
    reviewer: "Alex Kumar",
    avatar: "https://i.pravatar.cc/40?img=56",
    handle: "@alexk",
    target: "Titanium Exhaust System",
    targetId: "#PND-6324",
    type: "Products",
    rating: 5,
    review:
      "Amazing sound and noticeable performance gains. The titanium construction is lightweight and durable.",
    status: "Pending",
    date: new Date("2025-12-25"),
  },
];

function Badge({ children, tone }) {
  const map = {
    blue: "bg-blue-500/15 text-blue-400 ring-blue-400/30",
    purple: "bg-purple-500/15 text-purple-400 ring-purple-400/30",
    green: "bg-emerald-500/15 text-emerald-400 ring-emerald-400/30",
    amber: "bg-amber-500/15 text-amber-400 ring-amber-400/30",
    red: "bg-red-500/15 text-red-400 ring-red-400/30",
    slate: "bg-slate-500/15 text-slate-300 ring-slate-400/30",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ring-1 ${map[tone]}`}
    >
      {children}
    </span>
  );
}

function Stars({ value }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < value ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}
        />
      ))}
    </div>
  );
}

export default function ReviewModerationPanel() {
  const [rows, setRows] = useState(seedData);
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");
  const [minRating, setMinRating] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [dateRange, setDateRange] = useState("last30");

  const filtered = useMemo(() => {
    const now = new Date();
    return rows.filter((r) => {
      if (type !== "All" && r.type !== type) return false;
      if (status !== "All" && r.status !== status) return false;
      if (r.rating < minRating) return false;

      if (dateRange === "last30") {
        const cutoff = new Date(now);
        cutoff.setDate(cutoff.getDate() - 30);
        return r.date >= cutoff;
      }
      if (dateRange === "last7") {
        const cutoff = new Date(now);
        cutoff.setDate(cutoff.getDate() - 7);
        return r.date >= cutoff;
      }
      return true;
    });
  }, [rows, type, status, minRating, dateRange]);

  const toggleAll = (checked) => {
    setSelected(checked ? new Set(filtered.map((r) => r.id)) : new Set());
  };

  const toggleOne = (id) => {
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const updateStatus = (ids, next) => {
    setRows((prev) =>
      prev.map((r) => (ids.includes(r.id) ? { ...r, status: next } : r))
    );
    setSelected(new Set());
  };

 const toggleVisibility = (id) => {
  setRows((prev) =>
    prev.map((r) => {
      if (r.id !== id) return r;

      // Hidden → Approved (remove dash)
      if (r.status === "Hidden") {
        return { ...r, status: "Approved" };
      }

      // Approved → Hidden (add dash)
      if (r.status === "Approved") {
        return { ...r, status: "Hidden" };
      }

      return r;
    })
  );
};


  return (
    <div className="p-6 bg-[#0b0f14] rounded-2xl shadow-2xl">

      {/* Filters Responsive */}
      <div className="p-4 mb-6 bg-slate-800 rounded-xl grid gap-4 md:flex md:flex-wrap md:items-center">
        {/* Type */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <span className="text-slate-400 font-medium text-sm">Content Type:</span>
          <div className="flex gap-2 flex-wrap">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-full text-sm ring-1 transition ${
                  type === t
                    ? "bg-blue-600/20 text-blue-400 ring-blue-400/40"
                    : "bg-slate-700 text-slate-300 ring-slate-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <span className="text-slate-400 font-medium text-sm">Status:</span>
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-full text-sm ring-1 transition ${
                  status === s
                    ? "bg-blue-600/20 text-blue-400 ring-blue-400/40"
                    : "bg-slate-700 text-slate-300 ring-slate-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium text-sm">Rating:</span>
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="bg-slate-700 text-slate-200 ring-1 ring-slate-600 rounded-full px-3 py-1.5 text-sm"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                ★ {n}+
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span>Date:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-slate-700 text-slate-200 ring-1 ring-slate-600 rounded-full px-3 py-1.5 text-sm"
          >
            <option value="last30">Last 30 days</option>
            <option value="last7">Last 7 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* Responsive Table / Card */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#0e131a] text-slate-400">
            <tr>
              <th className="p-3 w-10">
                <input
                  type="checkbox"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={(e) => toggleAll(e.target.checked)}
                />
              </th>
              <th className="p-3 text-left">Reviewer</th>
              <th className="p-3 text-left">Target</th>
              <th className="p-3">Type</th>
              <th className="p-3">Rating</th>
              <th className="p-3 text-left">Review</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="border-t border-slate-800 hover:bg-slate-900/40"
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.has(r.id)}
                    onChange={() => toggleOne(r.id)}
                  />
                </td>
                <td className="p-3 flex items-center gap-3">
                  <img src={r.avatar} className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="text-slate-200 font-medium">{r.reviewer}</div>
                    <div className="text-xs text-slate-400">{r.handle}</div>
                  </div>
                </td>
                <td className="p-3 text-slate-200">
                  <div>{r.target}</div>
                  <div className="text-xs text-slate-400">{r.targetId}</div>
                </td>
                <td className="p-3 text-center">
                  <Badge
                    tone={
                      r.type === "Products"
                        ? "blue"
                        : r.type === "Teams"
                        ? "purple"
                        : r.type === "Services"
                        ? "green"
                        : "amber"
                    }
                  >
                    {r.type}
                  </Badge>
                </td>
                <td className="p-3">
                  <Stars value={r.rating} />
                </td>
                <td className="p-3 text-slate-300 max-w-[300px] truncate">
                  {r.review}
                </td>
                <td className="p-3">
                  <Badge
                    tone={
                      r.status === "Approved"
                        ? "green"
                        : r.status === "Pending"
                        ? "amber"
                        : r.status === "Flagged"
                        ? "red"
                        : "slate"
                    }
                  >
                    {r.status}
                  </Badge>
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => updateStatus([r.id], "Approved")}
                      className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400"
                    >
                      <Check size={16} />
                    </button>

                    <button
  disabled={r.status === "Pending" || r.status === "Flagged"}
  onClick={() => toggleVisibility(r.id)}
  className={`p-2 rounded-lg transition ${
    r.status === "Pending" || r.status === "Flagged"
      ? "bg-slate-800/50 text-slate-600 cursor-not-allowed"
      : r.status === "Hidden"
      ? "bg-slate-500/15 text-slate-300 hover:bg-slate-500/25"
      : "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
  }`}
  title={
    r.status === "Pending" || r.status === "Flagged"
      ? "Visibility unavailable"
      : r.status === "Hidden"
      ? "Show review"
      : "Hide review"
  }
>
  {r.status === "Hidden" ? (
    <EyeOff size={16} />
  ) : (
    <Eye size={16} />
  )}
</button>


                    <button
                      onClick={() => updateStatus([r.id], "Flagged")}
                      className="p-2 rounded-lg bg-red-500/15 text-red-400"
                    >
                      <Flag size={16} />
                    </button>
                    <button
                      onClick={() => updateStatus([r.id], "Pending")}
                      className="p-2 rounded-lg bg-slate-700/20 text-slate-300"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-4 lg:hidden">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="p-4 bg-slate-800 rounded-xl shadow border border-slate-700"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selected.has(r.id)}
                onChange={() => toggleOne(r.id)}
              />
              <img src={r.avatar} className="w-10 h-10 rounded-full" />
              <div>
                <div className="text-slate-200 font-medium">{r.reviewer}</div>
                <div className="text-xs text-slate-400">{r.handle}</div>
              </div>
            </div>

            <div className="mt-3 text-slate-200">
              {r.target}
              <div className="text-xs text-slate-400">{r.targetId}</div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <Badge
                tone={
                  r.type === "Products"
                    ? "blue"
                    : r.type === "Teams"
                    ? "purple"
                    : r.type === "Services"
                    ? "green"
                    : "amber"
                }
              >
                {r.type}
              </Badge>

              <Stars value={r.rating} />
            </div>

            <p className="mt-2 text-sm text-slate-300">{r.review}</p>

            <div className="mt-3 flex justify-between items-center">
              <Badge
                tone={
                  r.status === "Approved"
                    ? "green"
                    : r.status === "Pending"
                    ? "amber"
                    : r.status === "Flagged"
                    ? "red"
                    : "slate"
                }
              >
                {r.status}
              </Badge>

              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus([r.id], "Approved")}
                  className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400"
                >
                  <Check size={16} />
                </button>

                <button
  disabled={r.status === "Pending" || r.status === "Flagged"}
  onClick={() => toggleVisibility(r.id)}
  className={`p-2 rounded-lg transition ${
    r.status === "Pending" || r.status === "Flagged"
      ? "bg-slate-800/50 text-slate-600 cursor-not-allowed"
      : r.status === "Hidden"
      ? "bg-slate-500/15 text-slate-300 hover:bg-slate-500/25"
      : "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
  }`}
  title={
    r.status === "Pending" || r.status === "Flagged"
      ? "Visibility unavailable"
      : r.status === "Hidden"
      ? "Show review"
      : "Hide review"
  }
>
  {r.status === "Hidden" ? (
    <EyeOff size={16} />
  ) : (
    <Eye size={16} />
  )}
</button>



                <button
                  onClick={() => updateStatus([r.id], "Pending")}
                  className="p-2 rounded-lg bg-slate-700/20 text-slate-300"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="mt-4 flex gap-3 flex-wrap justify-end">
          <button
            onClick={() => updateStatus([...selected], "Approved")}
            className="px-3 py-2 rounded-lg bg-emerald-600/20 text-emerald-400"
          >
            Approve Selected
          </button>
          <button
            onClick={() => updateStatus([...selected], "Hidden")}
            className="px-3 py-2 rounded-lg bg-slate-600/20 text-slate-200"
          >
            Hide Selected
          </button>
          <button
            onClick={() => updateStatus([...selected], "Flagged")}
            className="px-3 py-2 rounded-lg bg-red-600/20 text-red-400"
          >
            Flag Selected
          </button>
        </div>
      )}
    </div>
  );
}
