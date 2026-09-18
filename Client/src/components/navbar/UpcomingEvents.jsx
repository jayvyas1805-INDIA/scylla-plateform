import { useEffect, useState } from "react";
import "../../styles/landing-theme.css";
import "./UpcomingEvents.css";
import { getApprovedEvents } from "../../api/event.api";
import EventSubmissionModal from "./EventSubmissionModal";
import EventRegistrationModal from "./EventRegistrationModal";
import { Link } from "react-router-dom";

const formatDate = (date) => new Date(date).toLocaleDateString(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const formatEvent = (event) => ({
  ...event,
  id: event._id,
  title: event.name,
  dateLabel: formatDate(event.date),
  badge: (event.eventType || "event").replace("-", " ").toUpperCase(),
  posterUrl: event.posterUrl || "",
});

function UpcomingEvents({ showOrganizer = false, compact = false }) {
  const [activeEvent, setActiveEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [showSubmission, setShowSubmission] = useState(false);
  const [registrationEvent, setRegistrationEvent] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  const loadEvents = async () => {
    try {
      const response = await getApprovedEvents({ page, limit: compact ? 3 : 6 });
      setEvents((response.data.events || []).map(formatEvent));
      setPagination(response.data.pagination || { totalPages: 1 });
    } catch (error) {
      console.error("Failed to load approved events:", error);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [compact, page]);

  return (
    <section className="lp-section">
      <div className="lp-container">
        <div className="lp-section-heading">
          <h2 className="lp-section-title">Upcoming Events</h2>
          <p className="lp-section-subtitle">Mark your calendar for these motorsport events</p>
          {showOrganizer && <button className="lp-btn lp-btn-primary" onClick={() => setShowSubmission(true)}>Organize an Event</button>}
          {!showOrganizer && <Link className="lp-btn lp-btn-outline" to="/events">View all events</Link>}
        </div>
        <div className="lp-events-grid">
          {events.map((event) => (
            <div key={event.id} className="lp-card lp-event-card">
              <div className={`lp-event-image-wrapper ${event.posterUrl ? "" : "lp-event-image-fallback"}`}>
                {event.posterUrl ? <img src={event.posterUrl} alt={event.title} className="lp-event-image" /> : <span className="lp-event-fallback-title">{event.title}</span>}
                <span className="lp-event-badge">{event.badge}</span>
              </div>

              <div className="lp-event-content">
                <h3 className="lp-event-title">{event.title}</h3>
                <p className="lp-event-date">{event.dateLabel}{event.startTime ? ` · ${event.startTime}` : ""}</p>
                <p className="lp-event-location">{event.location || event.venue || "Location to be announced"}</p>
                <button
                  className="lp-btn lp-btn-outline lp-full-width"
                  onClick={() => setActiveEvent(event)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        {pagination.totalPages > 1 && (
          <div className="lp-event-pagination" aria-label="Event pages">
            <button className="lp-btn lp-btn-outline" onClick={() => setPage((current) => current - 1)} disabled={page === 1}>Previous</button>
            <span>Page {page} of {pagination.totalPages}</span>
            <button className="lp-btn lp-btn-outline" onClick={() => setPage((current) => current + 1)} disabled={page === pagination.totalPages}>Next</button>
          </div>
        )}
      </div>

      {activeEvent && (
        <div className="lp-event-modal-overlay" onClick={() => setActiveEvent(null)}>
          <div className="lp-event-modal" onClick={(e) => e.stopPropagation()}>
            <button className="lp-event-modal-close" onClick={() => setActiveEvent(null)}>✕</button>
            {activeEvent.posterUrl ? <img src={activeEvent.posterUrl} alt={activeEvent.title} className="lp-event-modal-image" /> : <div className="lp-event-modal-image lp-event-image-fallback"><span className="lp-event-fallback-title">{activeEvent.title}</span></div>}
            <div className="lp-event-modal-body">
              <span className="lp-event-badge">{activeEvent.badge}</span>
              <h3 className="lp-event-modal-title">{activeEvent.title}</h3>
              <p className="lp-event-modal-meta">{activeEvent.dateLabel} · {activeEvent.location || activeEvent.venue || "Location to be announced"}</p>
              <p className="lp-event-modal-desc">{activeEvent.description}</p>
              {(activeEvent.startTime || activeEvent.endTime || activeEvent.venue) && (
                <p className="lp-event-modal-meta">
                  {activeEvent.startTime || ""}{activeEvent.startTime && activeEvent.endTime ? " - " : ""}{activeEvent.endTime || ""}
                  {activeEvent.venue ? ` · ${activeEvent.venue}` : ""}
                </p>
              )}
              {(activeEvent.entryFee || activeEvent.capacity) && (
                <p className="lp-event-modal-meta">
                  {activeEvent.entryFee ? `Entry: ${activeEvent.entryFee}` : ""}
                  {activeEvent.entryFee && activeEvent.capacity ? " · " : ""}
                  {activeEvent.capacity ? `Capacity: ${activeEvent.capacity}` : ""}
                </p>
              )}
              {activeEvent.requirements && <p className="lp-event-modal-desc">Requirements: {activeEvent.requirements}</p>}
              {activeEvent.registrationUrl && (
                <a className="lp-btn lp-btn-outline" href={activeEvent.registrationUrl} target="_blank" rel="noreferrer">External registration</a>
              )}
              <button className="lp-btn lp-btn-primary" onClick={() => setRegistrationEvent(activeEvent)}>Register for event</button>
            </div>
          </div>
        </div>
      )}
      {showSubmission && (
        <EventSubmissionModal
          onClose={() => setShowSubmission(false)}
          onSubmitted={loadEvents}
        />
      )}
      {registrationEvent && (
        <EventRegistrationModal
          event={registrationEvent}
          onClose={() => setRegistrationEvent(null)}
        />
      )}
    </section>
  );
}

export default UpcomingEvents;
