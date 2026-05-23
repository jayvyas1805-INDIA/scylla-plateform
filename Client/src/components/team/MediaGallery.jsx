import { useState } from 'react';
import '../../styles/SectionStyles.css';

const MediaGallery = ({ mediaItems, onAddClick, onDelete }) => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="content-section">
      <div className="section-header">
        <h2 className="section-title">Media Gallery</h2>
        <button className="add-btn" onClick={onAddClick}>
          + Add Media
        </button>
      </div>

      <div className="media-grid">
        {mediaItems.map((item) => (
          <div
            key={item.id}
            className="media-item"
            style={{ position: 'relative' }}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <img src={item.url} alt={item.title} className="media-image" />
            <div className="media-overlay">
              <p className="media-title">{item.title}</p>
            </div>
            {hoveredId === item.id && (
              <button
                className="delete-btn"
                onClick={() => onDelete(item.id)}
                aria-label="Delete media"
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: '#ff6b6b',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
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
