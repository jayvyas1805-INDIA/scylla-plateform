import "./UpcomingEvents.css";

function UpcomingEvents() {
  const events = [
    {
      id: 1,
      title: "Grand Prix Championship",
      date: "December 15, 2024",
      location: "Shanghai Circuit",
      image:
        "https://images.unsplash.com/photo-1494976848903-87f37330b435?w=400&h=250&fit=crop",
      badge: "F1",
      badgeColor: "#ff4444",
    },
    {
      id: 2,
      title: "Karting Masters",
      date: "December 18, 2024",
      location: "Monaco Karting",
      image:
        "https://images.unsplash.com/photo-1518611505868-48abc8a5c1c4?w=400&h=250&fit=crop",
      badge: "KARTING",
      badgeColor: "#ffaa00",
    },
    {
      id: 3,
      title: "MX Championship",
      date: "January 5, 2025",
      location: "Desert Park",
      image:
        "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=250&fit=crop",
      badge: "MX",
      badgeColor: "#ff6600",
    },
  ];

  return (
    <section className="upcoming-events">
      <div className="container">
        <h2 className="section-title">Upcoming Events</h2>

        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-image-wrapper">
                <img src={event.image} alt={event.title} className="event-image" />
                <span className="event-badge" style={{ backgroundColor: event.badgeColor }}>
                  {event.badge}
                </span>
              </div>

              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-date">{event.date}</p>
                <p className="event-location">{event.location}</p>
                <button className="view-details-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default UpcomingEvents;
