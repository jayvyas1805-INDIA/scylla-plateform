import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/navbar/Navbar';
import Footer from '../../../components/navbar/Footer';
import { getPublicTeamProfile } from '../../../api/team.api';
import '../../../styles/landing-theme.css';
import './PublicTeamProfile.css';

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'vehicles', label: 'Vehicles' },
  { key: 'members', label: 'Members' },
];

export default function PublicTeamProfile() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const res = await getPublicTeamProfile(teamId);
        setTeam(res.data);
      } catch (err) {
        console.error('Failed to load team profile', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (teamId) fetchTeam();
  }, [teamId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="lp-page ptp-page">
          <div className="lp-container ptp-loading">
            <div className="skeleton ptp-skeleton-header" />
            <div className="skeleton ptp-skeleton-block" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (notFound || !team) {
    return (
      <>
        <Navbar />
        <main className="lp-page ptp-page">
          <div className="lp-container ptp-notfound">
            <h1 className="lp-section-title">Team Not Found</h1>
            <p className="lp-section-subtitle">
              This team profile doesn't exist or isn't public yet.
            </p>
            <button className="lp-btn lp-btn-primary" onClick={() => navigate('/teams-directory')}>
              ← Back to Teams
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="lp-page ptp-page">
        {/* HEADER */}
        <section className="lp-section ptp-header">
          <div className="lp-container">
            <div className="lp-card ptp-header-card">
              <div className="ptp-header-content">
                <div className="ptp-logo">
                  {team.logo ? <img src={team.logo} alt={team.name} /> : <span>🏁</span>}
                </div>
                <div className="ptp-header-info">
                  <h1 className="ptp-name">{team.name}</h1>
                  {team.tagline && <p className="ptp-tagline">{team.tagline}</p>}
                  <div className="ptp-meta-row">
                    {team.category && <span className="ptp-tag">{team.category}</span>}
                    {team.location?.address && (
                      <span className="ptp-meta-item">📍 {team.location.address}</span>
                    )}
                    <span className="ptp-meta-item">
                      🏆 {team.achievements?.length || 0} Achievements
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TABS */}
        <section className="ptp-tabs-section">
          <div className="lp-container ptp-tabs-bar">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`ptp-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                {tab.key === 'vehicles' && ` (${team.vehicles?.length || 0})`}
                {tab.key === 'members' && ` (${team.members?.length || 0})`}
              </button>
            ))}
          </div>
        </section>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <section className="lp-section">
            <div className="lp-container ptp-profile-grid">
              <div className="ptp-profile-main">
                <div className="lp-card ptp-block">
                  <h2 className="ptp-block-title">About</h2>
                  <p className={`ptp-about-text ${!team.description ? 'ptp-empty' : ''}`}>
                    {team.description || 'This team hasn\'t added a description yet.'}
                  </p>
                </div>

                <div className="lp-card ptp-block">
                  <h2 className="ptp-block-title">Achievements</h2>
                  {team.achievements?.length > 0 ? (
                    <div className="ptp-achievements-list">
                      {team.achievements.map((a, i) => (
                        <div className="ptp-achievement-item" key={i}>
                          <span className={`ptp-achievement-dot ptp-dot-${a.type || 'gold'}`} />
                          <div>
                            <p className="ptp-achievement-title">{a.title} {a.year ? `· ${a.year}` : ''}</p>
                            {a.description && <p className="ptp-achievement-desc">{a.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="ptp-empty">No achievements listed yet.</p>
                  )}
                </div>

                <div className="lp-card ptp-block">
                  <h2 className="ptp-block-title">Media Gallery</h2>
                  {team.gallery?.length > 0 ? (
                    <div className="ptp-gallery-grid">
                      {team.gallery.map((src, i) => (
                        <img key={i} src={src} alt={`Gallery ${i + 1}`} className="ptp-gallery-item" />
                      ))}
                    </div>
                  ) : (
                    <p className="ptp-empty">No media uploaded yet.</p>
                  )}
                </div>
              </div>

              <aside className="ptp-profile-side">
                <div className="lp-card ptp-block">
                  <h2 className="ptp-block-title">Sponsors</h2>
                  {team.sponsors?.length > 0 ? (
                    <div className="ptp-sponsors-list">
                      {team.sponsors.map((s, i) => (
                        <div className="ptp-sponsor-item" key={i}>
                          {s.logo ? (
                            <img src={s.logo} alt={s.name} className="ptp-sponsor-logo" />
                          ) : (
                            <span className="ptp-sponsor-initials">{s.initials || s.name?.[0]}</span>
                          )}
                          <span className="ptp-sponsor-name">{s.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="ptp-empty">No sponsors listed yet.</p>
                  )}
                </div>

                <div className="lp-card ptp-block">
                  <h2 className="ptp-block-title">Connect</h2>
                  {team.socialLinks?.length > 0 ? (
                    <div className="ptp-social-list">
                      {team.socialLinks.map((link) => (
                        <a
                          key={link._id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ptp-social-link"
                        >
                          {link.platform}: {link.handle || link.url}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="ptp-empty">No social links added yet.</p>
                  )}
                </div>
              </aside>
            </div>
          </section>
        )}

        {/* VEHICLES TAB */}
        {activeTab === 'vehicles' && (
          <section className="lp-section">
            <div className="lp-container">
              {team.vehicles?.length > 0 ? (
                <div className="ptp-vehicles-grid">
                  {team.vehicles.map((v) => (
                    <div className="lp-card ptp-vehicle-card" key={v._id}>
                      <div className="ptp-vehicle-image-wrapper">
                        <img src={v.mainImage} alt={v.name} className="ptp-vehicle-image" />
                      </div>
                      <div className="ptp-vehicle-body">
                        <h3 className="ptp-vehicle-name">{v.name}</h3>
                        <p className="ptp-vehicle-model">{v.model}</p>

                        {v.performance?.length > 0 && (
                          <div className="ptp-vehicle-stats">
                            {v.performance.map((p, i) => (
                              <div className="ptp-vehicle-stat" key={i}>
                                <span className="ptp-vehicle-stat-value">{p.value}</span>
                                <span className="ptp-vehicle-stat-label">{p.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="ptp-empty ptp-empty-section">This team hasn't added any vehicles yet.</p>
              )}
            </div>
          </section>
        )}

        {/* MEMBERS TAB */}
        {activeTab === 'members' && (
          <section className="lp-section">
            <div className="lp-container">
              {team.members?.length > 0 ? (
                <div className="ptp-members-grid">
                  {team.members.map((m) => (
                    <div className="lp-card ptp-member-card" key={m._id}>
                      <div className="ptp-member-avatar">
                        {m.profilePic ? (
                          <img src={m.profilePic} alt={m.name} />
                        ) : (
                          <span>{m.name?.[0] || '?'}</span>
                        )}
                      </div>
                      <h3 className="ptp-member-name">{m.name}</h3>
                      <p className="ptp-member-role">{m.role}</p>
                      {m.bio && <p className="ptp-member-bio">{m.bio}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="ptp-empty ptp-empty-section">This team hasn't listed any members yet.</p>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
