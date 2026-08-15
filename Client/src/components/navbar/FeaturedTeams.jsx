// import "./FeaturedTeams.css";

// function FeaturedTeams() {
//   const teams = [
//     {
//       id: 1,
//       name: "Team Thunder",
//       category: "F1 Racing",
//       icon: "⚡",
//       iconBg: "#ff4444",
//     },
//     {
//       id: 2,
//       name: "Velocity Racing",
//       category: "Karting",
//       icon: "●",
//       iconBg: "#ffaa00",
//     },
//     {
//       id: 3,
//       name: "Apex Motors",
//       category: "Motorsports",
//       icon: "✦",
//       iconBg: "#ff6600",
//     },
//     {
//       id: 4,
//       name: "Desert Hawks",
//       category: "Rally Racing",
//       icon: "▲",
//       iconBg: "#00cc44",
//     },
//   ];

//   return (
//     <section className="featured-teams">
//       <div className="container">
//         <h2 className="section-title">Featured Teams</h2>

//         <div className="teams-grid">
//           {teams.map((team) => (
//             <div key={team.id} className="team-card">
//               <div className="team-icon" style={{ backgroundColor: team.iconBg }}>
//                 {team.icon}
//               </div>
//               <h3 className="team-name">{team.name}</h3>
//               <p className="team-category">{team.category}</p>
//               <button className="view-team-btn">View Team Page</button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default FeaturedTeams;

import { useEffect, useState } from "react";
import "./FeaturedTeams.css";
import { getAllTeams } from "../../api/team.api";

function FeaturedTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

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

  if (loading) return null;
  if (teams.length === 0) return null;

  return (
    <section className="land-featured-teams">
      <div className="land-container">
        <h2 className="land-section-title">Featured Teams</h2>

        <div className="land-teams-grid">
          {teams.map((team) => (
            <div key={team._id} className="land-team-card">

              {/* TEAM LOGO */}
              <div className="land-team-icon">
                {team.logo ? (
                  <img
                    src={team.logo}
                    alt={team.name}
                    style={{ width: "80px", border: "2px solid red" }}
                  />

                ) : (
                  <span className="land-team-placeholder">🏁</span>
                )}
              </div>

              <h3 className="land-team-name">{team.name}</h3>

              <p className="land-team-category">
                {team.tagline || team.location}
              </p>

              <button className="land-view-team-btn">
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
