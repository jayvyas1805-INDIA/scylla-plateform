import React, { useState, useEffect } from "react";

export default function AddVehicleClassModal({ initialData, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "",
    powertrain: "",
    teams: 0,
    events: 0,
    status: true,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        type: initialData.type || "",
        powertrain: initialData.powertrain || "",
        teams: initialData.teams || 0,
        events: initialData.events || 0,
        status: initialData.status ?? true,
      });
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSave({
      ...form,
      teams: Number(form.teams),
      events: Number(form.events),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-[#0f141b] border border-white/10 rounded-lg p-4 w-full max-w-md">
        <h3 className="text-white text-sm font-semibold mb-3">
          {initialData ? "Edit Vehicle Class" : "Add Vehicle Class"}
        </h3>

        <div className="space-y-2">
          <input
            className="w-full bg-[#1a1f27] text-white text-xs p-2 rounded border border-white/10"
            placeholder="Class Name"
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
              placeholder="Type (e.g., Off-Road, Circuit Racing)"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
            <input
              className="bg-[#1a1f27] text-white text-xs p-2 rounded border border-white/10"
              placeholder="Powertrain (e.g., IC Engine, Electric, Autonomous)"
              value={form.powertrain}
              onChange={(e) => setForm({ ...form, powertrain: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              className="bg-[#1a1f27] text-white text-xs p-2 rounded border border-white/10"
              placeholder="Teams"
              type="number"
              value={form.teams}
              onChange={(e) => setForm({ ...form, teams: e.target.value })}
            />
            <input
              className="bg-[#1a1f27] text-white text-xs p-2 rounded border border-white/10"
              placeholder="Events"
              type="number"
              value={form.events}
              onChange={(e) => setForm({ ...form, events: e.target.value })}
            />
          </div>
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
            className="text-black bg-cyan-400 text-xs px-3 py-1 rounded hover:bg-cyan-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
