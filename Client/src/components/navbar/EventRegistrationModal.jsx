import { useState } from "react";
import { registerForEvent } from "../../api/event.api";
import "./UpcomingEvents.css";

export default function EventRegistrationModal({ event, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", vehicleClass: "", participationType: "team", memberCount: 1, memberNames: "" });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (field) => (inputEvent) => {
    setForm((current) => ({ ...current, [field]: inputEvent.target.value }));
  };

  const handleSubmit = async (inputEvent) => {
    inputEvent.preventDefault();
    setError("");
    setSaving(true);
    try {
      await registerForEvent(event.id, form);
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="lp-event-modal-overlay" onClick={onClose}>
      <div className="lp-event-modal lp-event-submit-modal" onClick={(inputEvent) => inputEvent.stopPropagation()}>
        <button className="lp-event-modal-close" onClick={onClose} aria-label="Close registration">X</button>
        <div className="lp-event-modal-body">
          {submitted ? (
            <>
              <span className="lp-event-badge">CONFIRMED</span>
              <h3 className="lp-event-modal-title">You are registered</h3>
              <p className="lp-event-modal-desc">Your registration for {event.title} has been recorded.</p>
              <button className="lp-btn lp-btn-primary" onClick={onClose}>Done</button>
            </>
          ) : (
            <>
              <span className="lp-event-badge">REGISTRATION</span>
              <h3 className="lp-event-modal-title">Register for {event.title}</h3>
              <form className="lp-event-form" onSubmit={handleSubmit}>
                <input className="lp-event-form-input" value={form.name} onChange={update("name")} placeholder="Full name" required />
                <input className="lp-event-form-input" type="email" value={form.email} onChange={update("email")} placeholder="Email address" required />
                <input className="lp-event-form-input" value={form.phone} onChange={update("phone")} placeholder="Mobile number" required />
                <input className="lp-event-form-input" value={form.vehicleClass} onChange={update("vehicleClass")} placeholder="Vehicle class (optional)" />
                <select className="lp-event-form-input" value={form.participationType} onChange={update("participationType")}>
                  <option value="team">Team</option>
                  <option value="vendor">Vendor</option>
                </select>
                <input className="lp-event-form-input" type="number" min="1" value={form.memberCount} onChange={update("memberCount")} placeholder="Number of members" />
                <textarea className="lp-event-form-input lp-event-form-wide" value={form.memberNames} onChange={update("memberNames")} placeholder="Team member names (optional)" rows="2" />
                {error && <p className="lp-event-form-error lp-event-form-wide">{error}</p>}
                <div className="lp-event-form-actions lp-event-form-wide">
                  <button type="button" className="lp-btn lp-btn-outline" onClick={onClose}>Cancel</button>
                  <button type="submit" className="lp-btn lp-btn-primary" disabled={saving}>{saving ? "Registering..." : "Register"}</button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
