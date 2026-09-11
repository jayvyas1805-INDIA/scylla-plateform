import '../../styles/TeamHeader.css';

const TeamHeader = ({ teamData, onEditClick, stats }) => {
  const statItems = [
    { icon: '🏆', label: 'Achievements', value: stats?.achievements ?? 0, color: 'var(--quinary)' },
    { icon: '🤝', label: 'Sponsors', value: stats?.sponsors ?? 0, color: 'var(--secondary)' },
    { icon: '📸', label: 'Media', value: stats?.media ?? 0, color: 'var(--senary)' },
    { icon: '🔗', label: 'Socials', value: stats?.socials ?? 0, color: 'var(--tertiary)' },
  ];

  return (
    <div className="team-header1">
      <div className="team-header-content1">
        <div className="team-logo-section1">
          <div className="team-logo1">
            <img src={teamData?.logo} alt="Thunder Racing Team" />
          </div>
          <div className="team-info1">
            <h1 className="team-name1">{teamData?.name}</h1>
            <p className="team-subtitle1">{teamData?.tagline}</p>
            <p className="team-location1">📍 {teamData?.location?.address}</p>

            <div className="team-stats-row">
              {statItems.map((item) => (
                <div className="team-stat-chip" key={item.label} style={{ '--chip-color': item.color }}>
                  <span className="team-stat-icon">{item.icon}</span>
                  <span className="team-stat-value">{item.value}</span>
                  <span className="team-stat-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="edit-profile-btn1" onClick={onEditClick}>
          ✏️ Edit Profile
        </button>
      </div>
    </div>
  );
};

export default TeamHeader;
