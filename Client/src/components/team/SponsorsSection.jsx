import { useState } from 'react';
import '../../styles/SectionStyles.css';

const SponsorsSection = ({ sponsors = [], onUploadClick, onDelete }) => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="content-section">
      <div className="section-header">
        <h2 className="section-title">Our Sponsors</h2>
        <button className="upload-btn" onClick={onUploadClick}>
          📤 Upload Logo
        </button>
      </div>

      <div className="sponsors-tiers">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor._id}
            className="sponsor-card-new"
            onMouseEnter={() => setHoveredId(sponsor.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {hoveredId === sponsor.id && (
              <button
                className="delete-btn card-delete-btn"
                onClick={() => onDelete(sponsor.id)}
                aria-label="Delete sponsor"
              >
                ✕
              </button>
            )}
            <div className="sponsor-logo">
              {sponsor.logo ? (
                <img src={sponsor.logo} alt={sponsor.name} className="sponsor-img" />
              ) : (
                <div className="sponsor-initial">{sponsor.initials || sponsor.name.charAt(0)}</div>
              )}
            </div>
            <p className="sponsor-name">{sponsor.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SponsorsSection;
