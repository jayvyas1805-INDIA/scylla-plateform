import React, { useState, useEffect } from "react";
import {  Edit, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";

// ---------------- Modal ----------------
function DisciplineModal({ initialData, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    vehicleType: "",
    driveType: "",
    fuelType: "",
    linkedClasses: "",
    status: "Active",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        description: initialData.description,
        vehicleType: initialData.vehicleType,
        driveType: initialData.driveType,
        fuelType: initialData.fuelType,
        linkedClasses: initialData.linkedClasses.join(", "),
        status: initialData.status,
      });
    }
  }, [initialData]);

  const handleSubmit = () => {
    const data = {
      ...form,
      linkedClasses: form.linkedClasses.split(",").map((c) => c.trim()),
    };
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-[#0f141b] border border-white/10 rounded-lg p-4 w-full max-w-md">
        <h3 className="text-blue-400 text-sm font-semibold mb-3">
          {initialData ? "Edit Discipline" : "Add Discipline"}
        </h3>
        <div className="space-y-2">
          <input
            className="w-full bg-[#1a1f27] text-white text-xs p-2 rounded border border-white/10"
            placeholder="Category Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <textarea
            className="w-full bg-[#1a1f27] text-white text-xs p-2 rounded border border-white/10"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              className="bg-[#1a1f27] text-white text-xs p-2 rounded border border-white/10"
              placeholder="Vehicle Type"
              value={form.vehicleType}
              onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
            />
            <input
              className="bg-[#1a1f27] text-white text-xs p-2 rounded border border-white/10"
              placeholder="Drive Type"
              value={form.driveType}
              onChange={(e) => setForm({ ...form, driveType: e.target.value })}
            />
          </div>
          <input
            className="bg-[#1a1f27] text-white text-xs p-2 rounded border border-white/10"
            placeholder="Fuel Type"
            value={form.fuelType}
            onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
          />
          <input
            className="bg-[#1a1f27] text-white text-xs p-2 rounded border border-white/10"
            placeholder="Linked Classes (comma separated)"
            value={form.linkedClasses}
            onChange={(e) => setForm({ ...form, linkedClasses: e.target.value })}
          />
        </div>
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={onClose}
            className="text-gray-300 text-xs px-3 py-1 rounded hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="text-black bg-blue-400 text-xs px-3 py-1 rounded hover:bg-blue-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- Main Section ----------------
const statusStyles = {
  Active: "bg-green-500/10 text-green-400",
  Paused: "bg-yellow-500/10 text-yellow-400",
  Draft: "bg-gray-500/10 text-gray-400",
};

export default function MotorsportDisciplinesSection() {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Quad Bike",
      description:
        "Four-wheeled off-road motorsport vehicle commonly used in endurance, rally, and BAJA-style competitions.",
      vehicleType: "Quad / ATV",
      driveType: "2WD / 4WD",
      fuelType: "Petrol / Electric",
      linkedClasses: ["BAJA", "Off-Road", "Endurance"],
      status: "Paused",
    },
    {
      id: 2,
      name: "Motocross Bike",
      description:
        "Two-wheeled off-road motorcycle designed for motocross racing on closed circuits.",
      vehicleType: "Motorcycle",
      driveType: "2WD",
      fuelType: "Petrol",
      linkedClasses: ["Motocross", "Supercross"],
      status: "Active",
    },
  ]);

  
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");

  const toggleStatus = (id) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const next =
          i.status === "Active"
            ? "Paused"
            : i.status === "Paused"
            ? "Draft"
            : "Active";
        toast.success(`Status changed to ${next}`);
        return { ...i, status: next };
      })
    );
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.error("Discipline deleted");
  };

  const handleSave = (data) => {
    if (editing) {
      setItems((prev) =>
        prev.map((i) => (i.id === editing.id ? { ...data, id: editing.id } : i))
      );
      toast.success("Discipline updated");
    } else {
      setItems((prev) => [...prev, { ...data, id: Date.now() }]);
      toast.success("Discipline added");
    }
    setModalOpen(false);
    setEditing(null);
  };


  const filteredItems = items.filter((i) => {
    const statusMatch = filterStatus === "All" || i.status === filterStatus;
    const typeMatch = filterType === "All" || i.vehicleType === filterType;
    return statusMatch && typeMatch;
  });

  return (
    <section className="bg-[#0c1016] border border-white/10 rounded-xl shadow">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <h2 className="text-sm font-semibold text-blue-400">Motorsport Disciplines</h2>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
        >
          <Plus size={14} />
          Add Discipline
        </button>
      </div>

     <div className="flex justify-end items-center px-6 py-3 border-b border-white/10 text-xs">
  <div className="flex gap-2">
    <select
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
      className="bg-[#1a1f27] text-white text-xs p-1 rounded border border-white/10"
    >
      <option value="All">All Status</option>
      <option value="Active">Active</option>
      <option value="Paused">Paused</option>
      <option value="Draft">Draft</option>
    </select>

    <select
      value={filterType}
      onChange={(e) => setFilterType(e.target.value)}
      className="bg-[#1a1f27] text-white text-xs p-1 rounded border border-white/10"
    >
      <option value="All">All Types</option>
      <option value="Quad / ATV">Quad / ATV</option>
      <option value="Motorcycle">Motorcycle</option>
    </select>
  </div>
</div>


      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-gray-300">
          <thead className="bg-black/40 text-gray-400">
            <tr>
              
              <th className="px-4 py-3 text-left">Category Name</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Vehicle Type</th>
              <th className="px-4 py-3 text-left">Drive Type</th>
              <th className="px-4 py-3 text-left">Fuel Type</th>
              <th className="px-4 py-3 text-left">Linked Classes</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                
                <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                  
                  {item.name}
                </td>
                <td className="px-4 py-3 text-gray-400">{item.description}</td>
                <td className="px-4 py-3">{item.vehicleType}</td>
                <td className="px-4 py-3">{item.driveType}</td>
                <td className="px-4 py-3">{item.fuelType}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {item.linkedClasses.map((cls, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] bg-blue-500/10 text-blue-300 border border-blue-400/20"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleStatus(item.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium ${statusStyles[item.status]} hover:brightness-125`}
                  >
                    {item.status}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditing(item);
                        setModalOpen(true);
                      }}
                      className="text-blue-400 hover:bg-blue-400/10 p-1.5 rounded"
                    >
                      <Edit size={14} />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:bg-red-500/10 p-1.5 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mapping Panel */}
      <div className="border-t border-white/10 mt-4 px-6 py-4">
        <h3 className="text-xs font-semibold text-blue-400 mb-3">
          Motorsport → Vehicle Class Mapping
        </h3>
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-[#0f141b] border border-white/10 rounded px-4 py-2"
            >
              <div className="flex items-center gap-2">
  <span className="text-xs text-white font-medium">
    {item.name}
  </span>

  {/* Arrow */}
  <span className="text-gray-500 text-sm">→</span>

  <div className="flex flex-wrap gap-1">
    {item.linkedClasses.map((cls, idx) => (
      <span
        key={idx}
        className="px-2 py-0.5 rounded text-[11px]
                   bg-blue-500/10 text-blue-300
                   border border-blue-400/20"
      >
        {cls}
      </span>
    ))}
  </div>
</div>

             <button
  onClick={() => {
    setEditing(item);
    setModalOpen(true);
  }}
  className="
    flex items-center justify-center
    w-7 h-7
    rounded-md
    bg-blue-500/10
    border border-blue-400/20
    text-blue-400
    hover:bg-blue-500/20
    transition
  "
>
  <Edit size={14} />
</button>

            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <DisciplineModal
          initialData={editing}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
    </section>
  );
}
