import "../../styles/landing-theme.css";
import "./TopRiders.css";

const RIDERS = [
  {
    id: 1,
    name: "Alex Rodriguez",
    team: "Team Velocity",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Sarah Chen",
    team: "Thunder Racing",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Marcus Johnson",
    team: "Apex Motors",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
  },
  {
    id: 4,
    name: "Emma Wilson",
    team: "Speed Demons",
    avatar: "https://images.unsplash.com/photo-1517841905240-74f67b4d4d44?w=200&h=200&fit=crop",
  },
];

function TopRiders() {
  return (
    <section className="lp-section">
      <div className="lp-container">
        <div className="lp-section-heading">
          <h2 className="lp-section-title">Top Riders</h2>
          <p className="lp-section-subtitle">The community's standout performers this season</p>
        </div>

        <div className="lp-riders-grid">
          {RIDERS.map((rider) => (
            <div key={rider.id} className="lp-card lp-rider-card">
              <div className="lp-rider-avatar">
                <img src={rider.avatar} alt={rider.name} />
              </div>
              <h3 className="lp-rider-name">{rider.name}</h3>
              <p className="lp-rider-team">{rider.team}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopRiders;
