import { useState } from "react";
import "../../styles/landing-theme.css";
import "./UpcomingEvents.css";

const EVENTS = [
  {
    id: 1,
    title: "Grand Prix Championship",
    date: "December 15, 2024",
    location: "Shanghai Circuit",
    image: "https://images.unsplash.com/photo-1494976848903-87f37330b435?w=400&h=250&fit=crop",
    badge: "F1",
    description: "The season finale brings the world's top teams to Shanghai for a high-stakes showdown.",
  },
  {
    id: 2,
    title: "Karting Masters",
    date: "December 18, 2024",
    location: "Monaco Karting",
    image: "https://images.unsplash.com/photo-1518611505868-48abc8a5c1c4?w=400&h=250&fit=crop",
    badge: "KARTING",
    description: "Rising karting talent competes for a shot at the international circuit.",
  },
  {
    id: 3,
    title: "MX Championship",
    date: "January 5, 2025",
    location: "Desert Park",
    image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=250&fit=crop",
    badge: "MX",
    description: "Motocross riders tackle the toughest desert terrain of the season.",
  },
];

function UpcomingEvents() {
  const [activeEvent, setActiveEvent] = useState(null);

  return (
    <section className="lp-section">
      <div className="lp-container">
        <div className="lp-section-heading">
          <h2 className="lp-section-title">Upcoming Events</h2>
          <p className="lp-section-subtitle">Mark your calendar for these motorsport events</p>
        </div>

        <div className="lp-events-grid">
          {EVENTS.map((event) => (
            <div key={event.id} className="lp-card lp-event-card">
              <div className="lp-event-image-wrapper">
                <img src={event.image} alt={event.title} className="lp-event-image" />
                <span className="lp-event-badge">{event.badge}</span>
              </div>

              <div className="lp-event-content">
                <h3 className="lp-event-title">{event.title}</h3>
                <p className="lp-event-date">📅 {event.date}</p>
                <p className="lp-event-location">📍 {event.location}</p>
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
      </div>

      {activeEvent && (
        <div className="lp-event-modal-overlay" onClick={() => setActiveEvent(null)}>
          <div className="lp-event-modal" onClick={(e) => e.stopPropagation()}>
            <button className="lp-event-modal-close" onClick={() => setActiveEvent(null)}>✕</button>
            <img src={activeEvent.image} alt={activeEvent.title} className="lp-event-modal-image" />
            <div className="lp-event-modal-body">
              <span className="lp-event-badge">{activeEvent.badge}</span>
              <h3 className="lp-event-modal-title">{activeEvent.title}</h3>
              <p className="lp-event-modal-meta">📅 {activeEvent.date} &nbsp;·&nbsp; 📍 {activeEvent.location}</p>
              <p className="lp-event-modal-desc">{activeEvent.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default UpcomingEvents;
