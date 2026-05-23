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
    <section className="top-riders">
      <div className="container">
        <h2 className="section-title">Top Riders</h2>

        <div className="riders-grid">
          {riders.map((rider) => (
            <div key={rider.id} className="rider-card">
              <div className="rider-avatar">
                <img src={rider.avatar} alt={rider.name} />
              </div>
              <h3 className="rider-name">{rider.name}</h3>
              <p className="rider-team">{rider.team}</p>
              <div className="rider-badges">
                <span className="badge badge-gold">★</span>
                <span className="badge badge-blue">★</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopRiders;
