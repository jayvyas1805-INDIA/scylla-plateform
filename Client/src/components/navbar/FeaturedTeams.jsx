import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/landing-theme.css";
import "./FeaturedTeams.css";
import { getAllTeams } from "../../api/team.api";

function FeaturedTeams() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await getAllTeams();
        setTeams(res.data);
      } catch (error) {
        console.error("Failed to fetch teams", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  if (loading || teams.length === 0) return null;

  // Homepage only teases a handful of teams — the full roster lives on
  // the dedicated directory page.
  const featured = teams.slice(0, 6);

  return (
    <section className="lp-section lp-featured-teams">
      <div className="lp-container">
        <div className="lp-featured-teams-header">
          <div>
            <h2 className="lp-section-title">Featured Teams</h2>
            <p className="lp-section-subtitle lp-featured-teams-subtitle">
              Teams making waves in the community right now
            </p>
          </div>
          <button className="lp-btn lp-btn-outline" onClick={() => navigate("/teams-directory")}>
            Explore All Teams →
          </button>
        </div>

        <div className="lp-teams-grid">
          {featured.map((team) => (
            <button
              key={team._id}
              className="lp-card lp-team-card"
              onClick={() => navigate(`/teams-directory/${team._id}`)}
            >
              <div className="lp-team-icon">
                {team.logo ? (
                  <img src={team.logo} alt={team.name} />
                ) : (
                  <span>🏁</span>
                )}
              </div>

              <h3 className="lp-team-name">{team.name}</h3>
              <p className="lp-team-category">
                {team.tagline || team.location?.address || team.category || "Racing Team"}
              </p>

              <span className="lp-team-card-cta">View Team Page →</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedTeams;
