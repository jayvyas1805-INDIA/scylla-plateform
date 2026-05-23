import { useState } from "react";
import {
  Truck,
  Pencil,
  Trash2,
  Check,
  X,
  Plus,
} from "lucide-react";

export default function VehicleClasses() {
  const [rows, setRows] = useState([
  {
    id: 1,
    name: "Karting",
    desc: "Karting and Sprint Racing",
    type: "4-Wheeler",
    power: "IC Engine",
    tags: ["Karting", "Sprint Racing"],
    teams: 24,
     events: 8, 
     status: "Active", 
     selected: false },
  {
    id: 2,
    name: "Off-road Endurance",
    desc: "Mechanical off-road endurance racing",
    type: "4-Wheeler",
    power: "IC Engine",
    tags: ["Off-road Endurance"],
    teams: 18,  
    events: 5, 
    status: "Active", 
    selected: false },
  {
    id: 3,
    name: "Electric Off-road",
    desc: "Electric-powered off-road racing",
    type: "4-Wheeler",
    power: "Electric",
    tags: ["Electric Off-road"],
    teams: 12, 
    events: 3, 
    status: "Active", 
    selected: false },
  {
    id: 4,
    name: "aBAJA",
    desc: "Autonomous off-road challenges",
    type: "4-Wheeler",
    power: "Autonomous",
    tags: ["Autonomous Challenges"],
    teams: 6,  
    events: 2, 
    status: "Disabled", 
    elected: false },
  {
    id: 5,
    name: "Formula",
    desc: "Formula-style circuit racing",
    type: "4-Wheeler",
    power: "IC Engine",
    tags: ["Circuit Racing", "Formula Racing"],
    teams: 32, 
    events: 12, 
    status: "Active", 
    selected: false },
  {
    id: 6,
    name: "SUPRA",
    desc: "GT and circuit racing",
    type: "4-Wheeler",
    power: "Hybrid",
    tags: ["GT Racing", "Circuit Racing"],
   teams: 15,  
   events: 6, 
   status: "Active",
    selected: false },
]);


  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [drawer, setDrawer] = useState(null); // "edit"
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: "", desc: "" });
  const [confirm, setConfirm] = useState(null); // single | bulk

  const selectedRows = rows.filter(r => r.selected);
  const allSelected = rows.length > 0 && rows.every(r => r.selected);

  /* ---------------- Selection ---------------- */
  const toggleAll = () =>
    setRows(rows.map(r => ({ ...r, selected: !allSelected })));
  const toggleRow = id =>
    setRows(rows.map(r => r.id === id ? { ...r, selected: !r.selected } : r));

  /* ---------------- Bulk Actions ---------------- */
  const bulkUpdate = status => {
    if (!selectedRows.length) return;
    setRows(rows.map(r => r.selected ? { ...r, status } : r));
  };
  const bulkDelete = () => {
    if (!selectedRows.length) return;
    setRows(rows.filter(r => !r.selected));
    setConfirm(null);
  };

  /* ---------------- Single Actions ---------------- */
  const toggleStatus = id =>
    setRows(rows.map(r =>
      r.id === id ? { ...r, status: r.status === "Active" ? "Disabled" : "Active" } : r
    ));
  const deleteOne = () => {
    setRows(rows.filter(r => r.id !== confirm.id));
    setConfirm(null);
  };

  /* ---------------- Search & Filter ---------------- */
  const visibleRows = rows.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  /* ---------------- Badges ---------------- */
  const badge = (label, cls) => (
    <span className={`px-2 py-0.5 text-xs rounded-full ring-1 ${cls}`}>{label}</span>
  );
  const typeBadge = (type) =>
    badge(type, "bg-sky-500/10 text-sky-400 ring-sky-400/30 shadow-[0_0_10px_#38bdf830]");
  const powerBadge = power => {
    if (power === "Electric") return badge("Electric", "bg-emerald-500/10 text-emerald-400 ring-emerald-400/30 shadow-[0_0_10px_#34d39930]");
    if (power === "Hybrid") return badge("Hybrid", "bg-yellow-500/10 text-yellow-400 ring-yellow-400/30 shadow-[0_0_10px_#facc1530]");
    if (power === "Autonomous") return badge("Autonomous", "bg-fuchsia-500/10 text-fuchsia-400 ring-fuchsia-400/30 shadow-[0_0_10px_#d946ef30]");
    return badge("IC Engine", "bg-orange-500/10 text-orange-400 ring-orange-400/30 shadow-[0_0_10px_#fb923c30]");
  };

  /* ---------------- Save Edit ---------------- */
  const saveEdit = () => {
    if (!form.name.trim()) return;
    setRows(rows.map(r => r.id === form.id ? { ...r, name: form.name, desc: form.desc } : r));
    setDrawer(null);
    setAddOpen(false);
  };

  return (
    <div className="p-6 bg-gradient-to-b from-[#0b0f14] to-[#070a0f] rounded-xl border border-white/5 text-white">

      {/* Top Controls */}
      <div className="flex flex-wrap gap-3 justify-between mb-4">
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input type="checkbox" checked={allSelected} onChange={toggleAll} />
          Select All · {rows.length} classes total
        </label>

        <div className="flex gap-2 flex-wrap">
          <input
            placeholder="Search class…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-1.5 text-sm bg-black/40 border border-white/10 rounded"
          />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-sm bg-black/40 border border-white/10 rounded"
          >
            <option>All</option>
            <option>Active</option>
            <option>Disabled</option>
          </select>

          <button onClick={() => bulkUpdate("Active")} className="btn-emerald">✓ Bulk Enable</button>
          <button onClick={() => bulkUpdate("Disabled")} className="btn-zinc">✕ Bulk Disable</button>
          <button onClick={() => setConfirm({ type: "bulk" })} className="btn-red">🗑 Bulk Delete</button>

          <button
            onClick={() => { setForm({ name: "", desc: "" }); setAddOpen(true); }}
            className="btn-cyan flex items-center gap-1"
          >
            <Plus size={14}/> Add Class
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-white/5 rounded-lg">
        <table className="min-w-[1200px] w-full text-sm">
          <thead className="bg-white/5 text-white/70">
            <tr>
              <th className="p-2"><input type="checkbox" checked={allSelected} onChange={toggleAll} /></th>
              <th className="p-2 text-left">Class</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-center">Type</th>
              <th className="p-2 text-center">Powertrain</th>
              <th className="p-2 text-center">Teams</th>
              <th className="p-2 text-center">Events</th>
              <th className="p-2 text-center">Status</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {visibleRows.map(r => (
              <tr key={r.id} className="hover:bg-white/5">
                <td className="p-2"><input type="checkbox" checked={r.selected} onChange={() => toggleRow(r.id)} /></td>
                <td className="p-2 flex items-center gap-2 text-cyan-400 font-medium">
                  <Truck size={14}/> {r.name}
                </td>
                <td className="p-2 text-white/60 max-w-[320px] truncate">{r.desc}</td>
                <td className="p-2 text-center">{typeBadge(r.type)}</td>
                <td className="p-2 text-center">{powerBadge(r.power)}</td>
                <td className="p-2 text-center text-cyan-400">{r.teams}</td>
                <td className="p-2 text-center text-cyan-400">{r.events}</td>
                <td className="p-2 text-center">
                  {r.status === "Active"
                    ? badge("Active", "bg-emerald-500/10 text-emerald-400 ring-emerald-400/30")
                    : badge("Disabled", "bg-zinc-500/10 text-zinc-400 ring-zinc-400/30")}
                </td>
                <td className="p-2">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => toggleStatus(r.id)} className="text-emerald-400">
                      {r.status === "Active" ? <X size={14}/> : <Check size={14}/>}
                    </button>
                    <button onClick={() => { setDrawer("edit"); setForm(r); }} className="text-cyan-400">
                      <Pencil size={14}/>
                    </button>
                    <button onClick={() => setConfirm({ type: "single", id: r.id })} className="text-red-400">
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        
        {/* Vehicle Class → Motorsport Mapping */}
<div className="mt-10 p-5 rounded-xl border border-white/5 bg-gradient-to-br from-[#0b0f14] to-[#070a0f]">
  <h3 className="text-sm font-semibold mb-4 text-white/80">
    Vehicle Class → Motorsport Mapping
  </h3>

  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {rows.map(r => (
      <div
        key={r.id}
        className="p-4 bg-[#0b0f14] border border-white/10 rounded-xl hover:shadow-[0_0_10px_#22d3ee30] transition-shadow"
      >
        {/* Title */}
        <h4 className="text-cyan-400 font-semibold mb-2">{r.name}</h4>

        {/* Description */}
        <p className="text-white/70 text-sm mb-3">{r.desc}</p>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap">
          {r.tags.map((tag, i) => (
            <span
              key={i}
              className={`px-2 py-1 text-xs rounded border ${
                tag.includes("Karting") || tag.includes("Sprint")
                  ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                  : tag.includes("Off-road")
                  ? "bg-green-500/10 text-green-300 border-green-500/30"
                  : tag.includes("Autonomous")
                  ? "bg-purple-500/10 text-purple-300 border-purple-500/30"
                  : tag.includes("Formula")
                  ? "bg-red-500/10 text-red-300 border-red-500/30"
                  : tag.includes("GT")
                  ? "bg-yellow-500/10 text-yellow-300 border-yellow-500/30"
                  : "bg-white/10 text-white/60 border-white/20"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
</div>

      {/* Confirmation Modal */}
      {confirm && (
        <div className="fixed inset-0 bg-black/60 grid place-items-center z-50">
          <div className="bg-[#0b0f14] p-6 rounded-xl border border-white/10 w-[320px]">
            <p className="mb-4">Are you sure you want to delete?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirm(null)} className="btn-zinc">Cancel</button>
              <button onClick={confirm.type === "bulk" ? bulkDelete : deleteOne} className="btn-red">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/60 grid place-items-center z-50">
          <div className="w-[340px] bg-[#0b0f14] border border-white/10 rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-4">Add New Class</h3>
            <input
              placeholder="Class name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full mb-3 px-3 py-2 bg-black/40 border border-white/10 rounded"
            />
            <textarea
              placeholder="Description"
              rows={3}
              value={form.desc}
              onChange={e => setForm({ ...form, desc: e.target.value })}
              className="w-full mb-4 px-3 py-2 bg-black/40 border border-white/10 rounded"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setAddOpen(false)} className="btn-zinc">Cancel</button>
              <button
                onClick={() => {
                  if (!form.name.trim()) return;
                  setRows([...rows, {
                    id: Date.now(),
                    name: form.name,
                    desc: form.desc,
                    type: "4-Wheeler",
                    power: "IC Engine",
                    teams: 0,
                    events: 0,
                    status: "Active",
                    selected: false
                  }]);
                  setAddOpen(false);
                }}
                className="btn-emerald"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {drawer === "edit" && (
        <div className="fixed inset-0 bg-black/60 grid place-items-center z-50">
          <div className="w-[340px] bg-[#0b0f14] border border-white/10 rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-4">Edit Class</h3>
            <input
              placeholder="Class name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full mb-3 px-3 py-2 bg-black/40 border border-white/10 rounded"
            />
            <textarea
              placeholder="Description"
              rows={3}
              value={form.desc}
              onChange={e => setForm({ ...form, desc: e.target.value })}
              className="w-full mb-4 px-3 py-2 bg-black/40 border border-white/10 rounded"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setDrawer(null)} className="btn-zinc">Cancel</button>
              <button onClick={saveEdit} className="btn-emerald">Save</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .btn-emerald{background:#10b9811a;color:#34d399;padding:6px 10px;border-radius:6px}
        .btn-zinc{background:#71717a1a;color:#a1a1aa;padding:6px 10px;border-radius:6px}
        .btn-red{background:#ef44441a;color:#f87171;padding:6px 10px;border-radius:6px}
        .btn-cyan{background:#06b6d41a;color:#22d3ee;padding:6px 10px;border-radius:6px}
      `}</style>
    </div>
  );
}
