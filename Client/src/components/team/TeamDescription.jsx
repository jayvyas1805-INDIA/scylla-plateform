import '../../styles/SectionStyles.css';

const TeamDescription = ({ teamData, onEditClick }) => {
  return (
    <section className="content-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="section-icon-badge" style={{ '--badge-color': 'var(--primary)' }}>📝</span>
          <h2 className="section-title">Team Description</h2>
        </div>
        <button className="edit-icon-btn" onClick={onEditClick} aria-label="Edit team description">
          ✏️
        </button>
      </div>
      <p className={`section-description${!teamData?.description ? ' is-empty' : ''}`}>
        {teamData?.description || "No description available yet — click the edit icon to add one."}
      </p>
    </section>
  );
};

export default TeamDescription;
