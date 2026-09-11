import { useState } from 'react';
import '../../styles/SectionStyles.css';

const MediaGallery = ({ mediaItems, onAddClick, onDelete }) => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="content-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="section-icon-badge" style={{ '--badge-color': 'var(--senary)' }}>📸</span>
          <h2 className="section-title">Media Gallery</h2>
        </div>
        <button className="add-btn" onClick={onAddClick}>
          + Add Media
        </button>
      </div>

      <div className="media-grid">
        {mediaItems.map((item) => (
          <div
            key={item.id}
            className="media-item"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <img src={item.url} alt={item.title} className="media-image" />
            <div className="media-overlay">
              <p className="media-title">{item.title}</p>
            </div>
            {hoveredId === item.id && (
              <button
                className="delete-btn card-delete-btn"
                onClick={() => onDelete(item.id)}
                aria-label="Delete media"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default MediaGallery;
