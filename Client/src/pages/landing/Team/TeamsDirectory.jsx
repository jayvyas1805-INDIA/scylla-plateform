import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/navbar/Navbar';
import Footer from '../../../components/navbar/Footer';
import { getAllTeams } from '../../../api/team.api';
import '../../../styles/landing-theme.css';
import './TeamsDirectory.css';

export default function TeamsDirectory() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const res = await getAllTeams();
        setTeams(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to load teams', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const filteredTeams = teams.filter((team) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      team.name?.toLowerCase().includes(q) ||
      team.tagline?.toLowerCase().includes(q) ||
      team.category?.toLowerCase().includes(q) ||
      team.location?.address?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <Navbar />
      <main className="lp-page">
        <section className="lp-section teams-dir-hero">
          <div className="lp-container">
            <span className="lp-eyebrow">Community</span>
            <h1 className="teams-dir-title">Browse Racing Teams</h1>
            <p className="lp-section-subtitle teams-dir-subtitle">
              Explore public profiles of teams on the platform — see their achievements,
              vehicles, and members.
            </p>

            <input
              type="text"
              className="teams-dir-search"
              placeholder="Search teams by name, category, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        <section className="lp-section teams-dir-list-section">
          <div className="lp-container">
            {loading && (
              <div className="teams-dir-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div className="lp-card teams-dir-skeleton-card" key={i}>
                    <div className="skeleton teams-dir-skeleton-logo" />
                    <div className="skeleton teams-dir-skeleton-line" />
                    <div className="skeleton teams-dir-skeleton-line" style={{ width: '60%' }} />
                  </div>
                ))}
              </div>
            )}

            {!loading && error && (
              <p className="teams-dir-empty">
                Couldn't load teams right now — please try again shortly.
              </p>
            )}

            {!loading && !error && filteredTeams.length === 0 && (
              <p className="teams-dir-empty">
                {teams.length === 0
                  ? 'No teams have joined the platform yet.'
                  : 'No teams match your search.'}
              </p>
            )}

            {!loading && !error && filteredTeams.length > 0 && (
              <div className="teams-dir-grid">
                {filteredTeams.map((team) => (
                  <button
                    key={team._id}
                    className="lp-card teams-dir-card"
                    onClick={() => navigate(`/teams-directory/${team._id}`)}
                  >
                    <div className="teams-dir-card-logo">
                      {team.logo ? (
                        <img src={team.logo} alt={team.name} />
                      ) : (
                        <span>🏁</span>
                      )}
                    </div>
                    <h3 className="teams-dir-card-name">{team.name}</h3>
                    {team.tagline && <p className="teams-dir-card-tagline">{team.tagline}</p>}

                    <div className="teams-dir-card-meta">
                      {team.category && <span className="teams-dir-card-tag">{team.category}</span>}
                      {team.location?.address && (
                        <span className="teams-dir-card-location">📍 {team.location.address}</span>
                      )}
                    </div>

                    <div className="teams-dir-card-footer">
                      <span className="teams-dir-card-achievements">
                        🏆 {team.achievements?.length || 0} Achievement{team.achievements?.length === 1 ? '' : 's'}
                      </span>
                      <span className="teams-dir-card-view">View Profile →</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
