import { useState } from "react";

export default function EventCreateModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Event name is required.";
    if (!form.date) newErrors.date = "Event date is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    // New events always start as "pending" until an admin approves them.
    await onCreate(form);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative w-[400px] rounded-xl p-[2px] bg-gradient-to-r from-admin-accent to-admin-accent-dark shadow-[0_0_12px_rgba(0,128,255,0.4)]">
        <div className="bg-admin-surface-raised rounded-[0.95rem] p-6">
          <h2 className="text-xl font-semibold text-admin-accent mb-4">Create Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Event Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-admin-bg text-admin-text px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-admin-accent/40"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-admin-bg text-admin-text px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-admin-accent/40"
              />
              {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full bg-admin-bg text-admin-text px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-admin-accent/40"
              />
            </div>
            <div>
              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full bg-admin-bg text-admin-text px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-admin-accent/40"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/10 text-admin-text hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-admin-accent-dark text-white hover:bg-admin-accent disabled:opacity-60"
              >
                {submitting ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
