import { useState } from "react";

export default function EventCreateModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ name: "", date: "", status: "Upcoming" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Event name is required.";
    if (!form.date) newErrors.date = "Event date is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newEvent = {
      id: Date.now().toString(),
      name: form.name,
      date: form.date,
      status: form.status,
    };

    onCreate(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative w-[400px] rounded-xl p-[2px] bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_12px_rgba(0,255,255,0.4)]">
        <div className="bg-[#0f141b] rounded-[0.95rem] p-6">
          <h2 className="text-xl font-semibold text-cyan-400 mb-4">Create Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Event Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
              {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
            </div>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg outline-none"
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
