import { useNavigate } from "react-router-dom";
import "../../styles/landing-theme.css";
import "./EventsNotification.css";

const NOTIFICATIONS = [
  {
    id: 1,
    title: "Winter Championship Series",
    description: "Formula racing • Multi-day event",
    remaining: "5 days remaining",
    icon: "🏁",
    buttonText: "Register",
  },
  {
    id: 2,
    title: "Karting World Cup Qualifier",
    description: "Karting • Single day event",
    remaining: "12 days remaining",
    icon: "🏎",
    buttonText: "View",
  },
];

function EventsNotification() {
  const navigate = useNavigate();

  return (
    <section className="lp-section lp-events-notification">
      <div className="lp-container">
        <div className="lp-section-heading">
          <h2 className="lp-section-title">Don't Miss These Events</h2>
          <p className="lp-section-subtitle">Time-sensitive events open for registration now</p>
        </div>

        <div className="lp-notifications-grid">
          {NOTIFICATIONS.map((notification) => (
            <div key={notification.id} className="lp-card lp-notification-card">
              <div className="lp-notification-icon">{notification.icon}</div>

              <div className="lp-notification-content">
                <h3 className="lp-notification-title">{notification.title}</h3>
                <p className="lp-notification-description">{notification.description}</p>
                <p className="lp-notification-remaining">{notification.remaining}</p>
              </div>

              <button className="lp-btn lp-btn-primary" onClick={() => navigate("/teams")}>
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
