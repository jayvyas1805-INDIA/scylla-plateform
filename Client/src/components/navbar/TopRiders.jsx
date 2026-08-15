import "./TopRiders.css";

function TopRiders() {
  const riders = [
    {
      id: 1,
      name: "Alex Rodriguez",
      team: "Team Velocity",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    },
    {
      id: 2,
      name: "Sarah Chen",
      team: "Thunder Racing",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    },
    {
      id: 3,
      name: "Marcus Johnson",
      team: "Apex Motors",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    },
    {
      id: 4,
      name: "Emma Wilson",
      team: "Speed Demons",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-74f67b4d4d44?w=200&h=200&fit=crop",
    },
  ];

  return (
    <section className="land-top-riders">
      <div className="land-container">
        <h2 className="land-section-title">Top Riders</h2>

        <div className="land-riders-grid">
          {riders.map((rider) => (
            <div key={rider.id} className="land-rider-card">
              <div className="land-rider-avatar">
                <img src={rider.avatar} alt={rider.name} />
              </div>
              <h3 className="land-rider-name">{rider.name}</h3>
              <p className="land-rider-team">{rider.team}</p>
              <div className="land-rider-badges">
                <span className="land-badge land-badge-gold">★</span>
                <span className="land-badge land-badge-blue">★</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopRiders;
