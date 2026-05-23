import { useState, useEffect } from "react";

export default function EventModal({ event, onClose, onSave }) {
  const [form, setForm] = useState({ name: "", date: "", status: "Upcoming" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      setForm({
        name: event.name,
        date: event.date,
        status: event.status,
      });
    }
  }, [event]);

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

    onSave({ ...event, ...form });
    onClose();
  };

  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#0f141b] border border-gray-800 rounded-xl p-6 w-[400px]">
        <h2 className="text-xl font-semibold text-cyan-400 mb-4">Edit Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg outline-none"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg outline-none"
            />
            {errors.date && (
              <p className="text-red-400 text-xs mt-1">{errors.date}</p>
            )}
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
