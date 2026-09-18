import { useState } from "react";

export default function EventCreateModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: "",
    eventType: "race",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    venue: "",
    organizer: "",
    contactEmail: "",
    registrationUrl: "",
    capacity: "",
    entryFee: "",
    requirements: "",
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
      <div className="relative w-[min(720px,calc(100%-2rem))] max-h-[90vh] overflow-y-auto rounded-xl p-[2px] bg-gradient-to-r from-admin-accent to-admin-accent-dark shadow-[0_0_12px_rgba(0,128,255,0.4)]">
        <div className="bg-admin-surface-raised rounded-[0.95rem] p-6">
          <h2 className="text-xl font-semibold text-admin-accent mb-4">Create Event</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Event Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-admin-bg text-admin-text px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-admin-accent/40"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} className="w-full bg-admin-bg text-admin-text px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-admin-accent/40">
              <option value="race">Race / Competition</option>
              <option value="meetup">Car Meet / Community Meetup</option>
              <option value="track-day">Track Day</option>
              <option value="show">Auto Show / Expo</option>
              <option value="charity">Charity Drive</option>
              <option value="workshop">Workshop / Training</option>
              <option value="other">Other</option>
            </select>
            <div>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-admin-bg text-admin-text px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-admin-accent/40"
              />
              {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
            </div>
            <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="w-full bg-admin-bg text-admin-text px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-admin-accent/40" aria-label="Start time" />
            <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="w-full bg-admin-bg text-admin-text px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-admin-accent/40" aria-label="End time" />
            <div>
              <input
                type="text"
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full bg-admin-bg text-admin-text px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-admin-accent/40"
              />
            </div>
            <input type="text" placeholder="Venue or track name" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className="w-full bg-admin-bg text-admin-text px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-admin-accent/40" />
            <input type="text" placeholder="Organizer" value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} className="w-full bg-admin-bg text-admin-text px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-admin-accent/40" />
            <input type="email" placeholder="Contact email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className="w-full bg-admin-bg text-admin-text px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-admin-accent/40" />
            <input type="url" placeholder="Registration link (optional)" value={form.registrationUrl} onChange={(e) => setForm({ ...form, registrationUrl: e.target.value })} className="w-full bg-admin-bg text-admin-text px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-admin-accent/40" />
            <input type="number" min="0" placeholder="Participant capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="w-full bg-admin-bg text-admin-text px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-admin-accent/40" />
            <input type="text" placeholder="Entry fee (e.g. Free or $25)" value={form.entryFee} onChange={(e) => setForm({ ...form, entryFee: e.target.value })} className="w-full bg-admin-bg text-admin-text px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-admin-accent/40" />
            <textarea placeholder="Requirements (license, helmet, vehicle class, etc.)" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} rows={2} className="md:col-span-2 w-full bg-admin-bg text-admin-text px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-admin-accent/40" />
            <div>
              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full bg-admin-bg text-admin-text px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-admin-accent/40"
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
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
