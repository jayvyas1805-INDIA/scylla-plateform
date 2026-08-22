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

        console.log(res.data);
        setTeams(res.data);
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

  return (
    <section className="lp-section lp-featured-teams">
      <div className="lp-container">
        <div className="lp-section-heading">
          <h2 className="lp-section-title">Featured Teams</h2>
          <p className="lp-section-subtitle">Teams making waves in the community right now</p>
        </div>

        <div className="lp-teams-grid">
          {teams.map((team) => (
            <div key={team._id} className="lp-card lp-team-card">
              <div className="lp-team-icon">
                {team.logo ? (
                  <img src={team?.logo} />
                ) : (
                  <span>🏁</span>
                )}
              </div>

              <h3 className="lp-team-name">{team.name}</h3>
              <p className="lp-team-category">{team.tagline || team.location}</p>

              <button className="lp-btn lp-btn-outline lp-full-width" onClick={() => navigate("/teams")}>
                View Team Page
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedTeams;
