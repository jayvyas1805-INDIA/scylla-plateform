import { useState } from 'react';
import '../../styles/SectionStyles.css';

const categoryIcons = {
  innovation: '🚀',
  performance: '⚡',
  design: '🏆',
  engineering: '🔧'
};

const AchievementsSection = ({ achievements, onAddClick, onDelete }) => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="content-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="section-icon-badge" style={{ '--badge-color': 'var(--quinary)' }}>🏆</span>
          <h2 className="section-title">Achievements & Awards</h2>
        </div>
        <button className="add-btn" onClick={onAddClick}>
          + Add Achievement
        </button>
      </div>
      <div className="achievements-list">
        {achievements 
        .filter(a => a.id)
        .map((achievement) => (
          <div
            key={achievement.id}
            className="achievement-card"
            onMouseEnter={() => setHoveredId(achievement.id)}
            onMouseLeave={() => setHoveredId(null)}
          >

            <div className="achievement-icon">{categoryIcons[achievement.category] || '🏆'}</div>
            <div className="achievement-content">
              <h3 className="achievement-title">{achievement.title}</h3>
              <p className="achievement-description">{achievement.description}</p>
              <span className="achievement-year">{achievement.year}</span>
            </div>
            {hoveredId === achievement.id && (
              <button
                className="delete-btn"
                onClick={() => onDelete(achievement.id)}
                aria-label="Delete achievement"
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

export default AchievementsSection;
