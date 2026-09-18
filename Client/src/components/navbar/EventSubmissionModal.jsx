import { useState } from "react";
import { submitEvent } from "../../api/event.api";
import "./UpcomingEvents.css";

const initialForm = {
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
  poster: null,
};

const inputClass = "lp-event-form-input";

export default function EventSubmissionModal({ onClose, onSubmitted }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== "") payload.append(key, value);
      });
      await submitEvent(payload);
      onSubmitted();
      onClose();
    } catch (requestError) {
      setError(requestError.response?.data?.error || "We could not submit this event.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lp-event-modal-overlay" onClick={onClose}>
      <div className="lp-event-modal lp-event-submit-modal" onClick={(event) => event.stopPropagation()}>
        <button className="lp-event-modal-close" onClick={onClose} aria-label="Close event submission">X</button>
        <div className="lp-event-modal-body">
          <span className="lp-event-badge">EVENT SUBMISSION</span>
          <h3 className="lp-event-modal-title">Organize an event</h3>
          <p className="lp-event-modal-desc">Submit your race, meetup, track day, or motorsport gathering for admin approval.</p>

          <form className="lp-event-form" onSubmit={handleSubmit}>
            <input className={inputClass} value={form.name} onChange={update("name")} placeholder="Event name" required />
            <select className={inputClass} value={form.eventType} onChange={update("eventType")}>
              <option value="race">Race / Competition</option>
              <option value="meetup">Car Meet / Community Meetup</option>
              <option value="track-day">Track Day</option>
              <option value="show">Auto Show / Expo</option>
              <option value="charity">Charity Drive</option>
              <option value="workshop">Workshop / Training</option>
              <option value="other">Other</option>
            </select>
            <input className={inputClass} type="date" value={form.date} onChange={update("date")} required />
            <input className={inputClass} type="time" value={form.startTime} onChange={update("startTime")} aria-label="Start time" />
            <input className={inputClass} type="time" value={form.endTime} onChange={update("endTime")} aria-label="End time" />
            <input className={inputClass} value={form.location} onChange={update("location")} placeholder="City or location" />
            <input className={inputClass} value={form.venue} onChange={update("venue")} placeholder="Venue or track name" />
            <input className={inputClass} value={form.organizer} onChange={update("organizer")} placeholder="Organizer name" required />
            <input className={inputClass} type="email" value={form.contactEmail} onChange={update("contactEmail")} placeholder="Contact email" required />
            <input className={inputClass} type="url" value={form.registrationUrl} onChange={update("registrationUrl")} placeholder="Registration link (optional)" />
            <input className={inputClass} type="number" min="0" value={form.capacity} onChange={update("capacity")} placeholder="Participant capacity" />
            <input className={inputClass} value={form.entryFee} onChange={update("entryFee")} placeholder="Entry fee (Free, $25, etc.)" />
            <input className={inputClass} type="file" accept="image/*" onChange={(event) => setForm((current) => ({ ...current, poster: event.target.files?.[0] || null }))} aria-label="Event poster" />
            <textarea className={`${inputClass} lp-event-form-wide`} value={form.requirements} onChange={update("requirements")} placeholder="Requirements: license, helmet, vehicle class, etc." rows="2" />
            <textarea className={`${inputClass} lp-event-form-wide`} value={form.description} onChange={update("description")} placeholder="Tell the community what to expect" rows="3" />
            {error && <p className="lp-event-form-error lp-event-form-wide">{error}</p>}
            <div className="lp-event-form-actions lp-event-form-wide">
              <button type="button" className="lp-btn lp-btn-outline" onClick={onClose}>Cancel</button>
              <button type="submit" className="lp-btn lp-btn-primary" disabled={submitting}>{submitting ? "Submitting..." : "Submit for approval"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
