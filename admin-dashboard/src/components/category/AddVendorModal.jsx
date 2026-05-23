import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AddVendorModal({ initialData, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [count, setCount] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setCount(initialData.count);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSave({
      title,
      description,
      count: Number(count) || 0,
      status: "Active",
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div
        className="bg-[#0c1016] border border-white/10 rounded-xl w-full max-w-md
        shadow-[0_0_30px_rgba(0,191,255,0.25)]"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white">
            {initialData ? "Edit Vendor Nature" : "Add Vendor Nature"}
          </h3>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-gray-400">Nature Name</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded bg-black/40
              border border-white/10 text-white text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded bg-black/40
              border border-white/10 text-white text-sm outline-none"
              rows={3}
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">Vendor Count</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded bg-black/40
              border border-white/10 text-white text-sm outline-none"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-gray-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded text-xs text-cyan-300
            bg-cyan-500/10 border border-cyan-400/40
            hover:bg-cyan-400/20 shadow-[0_0_12px_rgba(0,191,255,0.35)]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
