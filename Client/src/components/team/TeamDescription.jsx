import '../../styles/SectionStyles.css';

const TeamDescription = ({ teamData, onEditClick }) => {
  return (
    <section className="content-section">
      <div className="section-header">
        <h2 className="section-title">Team Description</h2>
        <button className="edit-icon-btn" onClick={onEditClick} aria-label="Edit team description">
          ✏️
        </button>
      </div>
      <p className="section-description">{teamData?.description || "No description available"}</p>
    </section>
  );
};

export default TeamDescription;
