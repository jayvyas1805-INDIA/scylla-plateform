import "./MotorsportTeams.css";

function MotorsportTeams() {
  const teams = [
    {
      id: 1,
      name: "Velocity Racing",
      icon: "🚀",
      iconBg: "#ff6b6b",
      members: 12,
      events: 8,
    },
    {
      id: 2,
      name: "Thunder Bikes",
      icon: "⚡",
      iconBg: "#4c6ef5",
      members: 9,
      events: 6,
    },
    {
      id: 3,
      name: "Rally Masters",
      icon: "🏁",
      iconBg: "#12b886",
      members: 15,
      events: 10,
    },
  ];

  return (
    <section className="land-motorsport-teams">
      <div className="land-container">
        <h2 className="land-section-title">Motorsport Teams</h2>
        <p className="land-section-description">
          Among teams can use our platform to manage their operations, connect with verified vendors, coordinate with event organizers, and showcase their achievements to the motorsports community.
        </p>

        <div className="land-teams-showcase">
          {teams.map((team) => (
            <div key={team.id} className="land-team-showcase-card">
              <div className="land-team-icon-circle" style={{ backgroundColor: team.iconBg }}>
                {team.icon}
              </div>
              <h3 className="land-team-name">{team.name}</h3>
              <div className="land-team-stats">
                <div className="land-stat">
                  <span className="land-stat-number">{team.members}</span>
                  <span className="land-stat-label">Teams</span>
                </div>
                <div className="land-stat">
                  <span className="land-stat-number">{team.events}</span>
                  <span className="land-stat-label">Events</span>
                </div>
              </div>
              <button className="land-view-profile-btn">View Team Profile</button>
            </div>
          ))}
        </div>

        <button className="land-view-all-btn">View All Teams</button>
      </div>
    </section>
  );
}

export default MotorsportTeams;
