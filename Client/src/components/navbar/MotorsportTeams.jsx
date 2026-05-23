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
    <section className="motorsport-teams">
      <div className="container">
        <h2 className="section-title">Motorsport Teams</h2>
        <p className="section-description">
          Among teams can use our platform to manage their operations, connect with verified vendors, coordinate with event organizers, and showcase their achievements to the motorsports community.
        </p>

        <div className="teams-showcase">
          {teams.map((team) => (
            <div key={team.id} className="team-showcase-card">
              <div className="team-icon-circle" style={{ backgroundColor: team.iconBg }}>
                {team.icon}
              </div>
              <h3 className="team-name">{team.name}</h3>
              <div className="team-stats">
                <div className="stat">
                  <span className="stat-number">{team.members}</span>
                  <span className="stat-label">Teams</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{team.events}</span>
                  <span className="stat-label">Events</span>
                </div>
              </div>
              <button className="view-profile-btn">View Team Profile</button>
            </div>
          ))}
        </div>

        <button className="view-all-btn">View All Teams</button>
      </div>
    </section>
  );
}

export default MotorsportTeams;
