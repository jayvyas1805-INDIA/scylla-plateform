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
    <section className="events-notification">
      <div className="container">
        <h2 className="section-title">Don't Miss These Events</h2>

        <div className="notifications-grid">
          {notifications.map((notification) => (
            <div key={notification.id} className="notification-card">
              <div className="notification-icon">{notification.icon}</div>

              <div className="notification-content">
                <h3 className="notification-title">{notification.title}</h3>
                <p className="notification-description">
                  {notification.description}
                </p>
                <p className="notification-remaining">{notification.remaining}</p>
              </div>

              <button
                className="notification-btn"
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
