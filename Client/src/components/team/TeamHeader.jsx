import '../../styles/TeamHeader.css';

const TeamHeader = ({ teamData,onEditClick }) => {
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
