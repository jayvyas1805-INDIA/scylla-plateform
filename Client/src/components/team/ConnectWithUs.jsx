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
        <h2 className="section-title">Connect With Us</h2>
        <button className="add-btn" onClick={onAddClick} aria-label="Add social link">
          + Add Link
        </button>
      </div>

      <div className="social-links-container">
        {socialLinks.map((social) => (
          <div
            key={social.id}
            className="social-link-card"
            style={{ position: 'relative' }}
            title={social.platform}
            onMouseEnter={() => setHoveredId(social.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {hoveredId === social.id && (
              <button
                className="delete-btn"
                onClick={() => onDelete(social.id)}
                aria-label="Delete social link"
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#ff6b6b',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            )}
            <div className="social-icon-wrapper">
              <span style={{ fontSize: '1.5rem' }}>{getPlatformIcon(social.platform)}</span>
            </div>
            <div className="social-info">
              <p className="social-platform">{social.platform}</p>
              <a href={social.url} target="_blank" rel="noopener noreferrer">{social.handle}</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ConnectWithUs;
