import "./EventsNotification.css";

function EventsNotification() {
  const notifications = [
    {
      id: 1,
      title: "Winter Championship Series",
      description: "Formula racing • Multi-day event",
      remaining: "5 days remaining",
      icon: "🏁",
      buttonText: "Register",
      buttonColor: "#ff4444",
    },
    {
      id: 2,
      title: "Karting World Cup Qualifier",
      description: "Karting • Single day event",
      remaining: "12 days remaining",
      icon: "🏎",
      buttonText: "View",
      buttonColor: "#3366ff",
    },
  ];

  return (
    <section className="land-events-notification">
      <div className="land-container">
        <h2 className="land-section-title">Don't Miss These Events</h2>

        <div className="land-notifications-grid">
          {notifications.map((notification) => (
            <div key={notification.id} className="land-notification-card">
              <div className="land-notification-icon">{notification.icon}</div>

              <div className="land-notification-content">
                <h3 className="land-notification-title">{notification.title}</h3>
                <p className="land-notification-description">
                  {notification.description}
                </p>
                <p className="land-notification-remaining">{notification.remaining}</p>
              </div>

              <button
                className="land-notification-btn"
                style={{ backgroundColor: notification.buttonColor }}
              >
                {notification.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EventsNotification;
