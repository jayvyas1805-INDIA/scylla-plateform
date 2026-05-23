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
        <h2 className="section-title">Achievements & Awards</h2>
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
                style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '1.2rem', padding: '0.5rem' }}
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
