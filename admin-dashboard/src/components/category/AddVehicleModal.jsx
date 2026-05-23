import React, { useState, useEffect } from "react";

export default function AddVehicleModal({ initialData, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    tags: "",
    frameworks: 0,
    entries: 0,
    status: true,
  });

  // Pre-fill form if editing
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        tags: (initialData.tags || []).join(", "),
        frameworks: initialData.frameworks || 0,
        entries: initialData.entries || 0,
        status: initialData.status ?? true,
      });
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSave({
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      frameworks: Number(form.frameworks),
      entries: Number(form.entries),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-[#0f141b] border border-white/10 rounded-lg p-4 w-full max-w-md">
        <h3 className="text-white text-sm font-semibold mb-3">
          {initialData ? "Edit Vehicle Class" : "Add Vehicle Class"}
        </h3>

        {/* FORM FIELDS */}
        <div className="space-y-2">
          <input
            className="w-full bg-[#1a1f27] text-white text-xs p-2 rounded border border-white/10"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <textarea
            className="w-full bg-[#1a1f27] text-white text-xs p-2 rounded border border-white/10"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            className="w-full bg-[#1a1f27] text-white text-xs p-2 rounded border border-white/10"
            placeholder="Tags (comma-separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              className="bg-[#1a1f27] text-white text-xs p-2 rounded border border-white/10"
              placeholder="Frameworks"
              type="number"
              value={form.frameworks}
              onChange={(e) =>
                setForm({ ...form, frameworks: e.target.value })
              }
            />
            <input
              className="bg-[#1a1f27] text-white text-xs p-2 rounded border border-white/10"
              placeholder="Entries"
              type="number"
              value={form.entries}
              onChange={(e) => setForm({ ...form, entries: e.target.value })}
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
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
