import { useState } from 'react';
import '../../styles/SectionStyles.css';

const getPlatformIcon = (platform) => {
  const icons = {
    Instagram: '📷',
    YouTube: '📺',
    LinkedIn: '💼',
    Facebook: '👍',
    Twitter: '🐦'
  };
  return icons[platform] || '🔗';
};

const ConnectWithUs = ({ socialLinks = [], onAddClick, onDelete }) => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="content-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="section-icon-badge" style={{ '--badge-color': 'var(--quaternary)' }}>🔗</span>
          <h2 className="section-title">Connect With Us</h2>
        </div>
        <button className="add-btn" onClick={onAddClick} aria-label="Add social link">
          + Add Link
        </button>
      </div>

      <div className="social-links-container">
        {socialLinks.map((social) => (
          <div
            key={social.id}
            className="social-link-card"
            title={social.platform}
            onMouseEnter={() => setHoveredId(social.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {hoveredId === social.id && (
              <button
                className="delete-btn card-delete-btn"
                onClick={() => onDelete(social.id)}
                aria-label="Delete social link"
              >
                ✕
              </button>
            )}
            <div className="social-icon-wrapper">
              <span>{getPlatformIcon(social.platform)}</span>
            </div>
            <div className="social-info">
              <p className="social-platform">{social.platform}</p>
              <a className="social-handle" href={social.url} target="_blank" rel="noopener noreferrer">
                {social.handle}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ConnectWithUs;
