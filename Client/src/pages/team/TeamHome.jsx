import { useState, useEffect } from "react";
import "./TeamHome.css";
import TeamNavbar from "../../components/team/TeamNavbar";
import { getTeamProfile, getTeamActivities } from "../../api/team.api";
import { getMember } from "../../api/member.api";
import { getVehicle } from "../../api/vehicle.api";
import { useNavigate } from "react-router-dom"


import {
  FaUsers,
  FaCar,
  FaFlagCheckered,
  FaCheckCircle,
  FaArrowRight,
  FaUpload,
  FaChartLine,
  FaCalendarAlt,
  FaHeadset,
  FaTrash,
  FaEdit,
  FaMoneyBillWave,
  FaPlus,
  FaTrophy
} from "react-icons/fa";

function TeamHome() {
  const navigate = useNavigate()
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)

  const [members, setMembers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [showAll, setShowAll] = useState(false);


  useEffect(() => {

    const teamData = async () => {
      try {
        setLoading(true)
        const res = await getTeamProfile();
        setTeam(res.data);
        // setMembers(res.data.team.members || []);
      } catch (err) {
        // alert("cannot be fetched" + err.message);
        console.log(err.message)
        // navigate('team/login');
      } finally {
        setLoading(false)
      }
    };

    teamData();
  }, []);




  useEffect(() => {
    memberData();
  }, []);

  const memberData = async () => {
    try {
      setLoading(true);
      const res = await getMember();
      setMembers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      // alert(err.message);
      console.log(err.message + err.status);
    } finally {
      setLoading(false)
    }
  }

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getVehicle();
      setVehicles(res.data.vehicles);
    } catch (err) {
      // alert("Failed to load vehicles");
      console.error(err);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const driverCount = members.filter(member => {
    // If role is string with multiple roles
    return member.role.toLowerCase().includes("driver");
  }).length;


  const visibleActivities = showAll
    ? activities
    : activities.slice(0, 5);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);

        // ✅ THIS LINE WAS MISSING OR BROKEN
        const res = await getTeamActivities();

        const list = Array.isArray(res.data) ? res.data : [];

        setActivities(list);

        setActivities(list);
      } catch (err) {
        console.error("Failed to fetch activities:", err);
        setActivities([])
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const activityMeta = {
    TEAM_APPROVED: { icon: <FaCheckCircle />, color: "green" },
    MEMBER_ADDED: { icon: <FaUsers />, color: "purple" },
    MEMBER_REMOVED: { icon: <FaTrash />, color: "orange" },
    VEHICLE_ADDED: { icon: <FaCar />, color: "blue" },
    VEHICLE_REMOVED: { icon: <FaCar />, color: "orange" },
    TEAM_UPDATED: { icon: <FaEdit />, color: "blue" },
    DELETE_MEDIA: { icon: <FaTrash />, color: "red" },
    SPONSOR_ADDED: { icon: <FaMoneyBillWave />, color: "green" },
    ACHIVEMENT_ADDED: { icon: <FaTrophy />, color: "gold" },
    GALLERY_UPDATED: { icon: <FaPlus />, color: "orange" },
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };


  // ✅ REAL-TIME LATENCY STATE
  const [latency, setLatency] = useState(12);

  // ✅ LATENCY ANIMATION EFFECT
  useEffect(() => {
    const interval = setInterval(() => {
      const randomLatency = Math.floor(8 + Math.random() * 30);
      setLatency(randomLatency);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading...</p>;
  // if (!team) return null; 



  return (
    <div className="team-home">

      {/* HERO / DASHBOARD HEADER */}
      <section className="team-hero">
        <div className="team-hero-left">
          <span className="team-badge">TEAM DASHBOARD</span>

          <h1>
            {team?.name} Racing Motorsports <br />
            <span>(event registration)</span>
          </h1>

          <span className="team-category">{team?.category}</span>

          <p className="team-description">
            {team?.tagline}
          </p>

          <div className="team-meta">
            <div>
              <small>LOCATION</small>
              {/* <strong>  {team?.location?.address}</strong> */}
              {team?.location?.address
                ? team.location.address.split(",").slice(-4).join(", ")
                : ""}
            </div>
            <div>
              <small>SEASON</small>
              {/* <strong> 2025</strong> */}
              <strong> {new Date().getFullYear()}</strong>
            </div>
            <div>
              <small>PRIMARY VEHICLE</small>
              <strong> Moto</strong>
            </div>
          </div>

          <button className="primary-action" >
            Register <FaArrowRight />
          </button>
        </div>

        <div className="team-hero-right">
          <div className="radar-ring"></div>
        </div>
      </section>

      {/* STATS */}
      <section className="team-stats">
        <div className="stat-card">
          <FaUsers />
          <h3>{driverCount}</h3>
          <p>Team Drivers</p>
        </div>

        <div className="stat-card">
          <FaCar />
          <h3>{vehicles.length}</h3>
          <p>Registered Vehicles</p>
        </div>

        <div className="stat-card">
          <FaFlagCheckered />
          <h3>8</h3>
          <p>Events Participated</p>
        </div>

        <div className="stat-card verified">
          <FaCheckCircle />
          <h3>100%</h3>
          <p>All Verified</p>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="team-main-grid">

        {/* ACTIVITY */}
        <div className="team-activity">
          <div className="section-header">
            <h2>Team Activity</h2>
            {activities.length > 5 && (
              <span
                className="link"
                style={{ cursor: "pointer" }}
                onClick={() => setShowAll((prev) => !prev)}
              >
                {showAll ? "View Less" : "View All"}
              </span>
            )}
          </div>
          {loading ? (
            <p>Loading activities...</p>
          ) : activities.length === 0 ? (
            <p>No activities yet</p>
          ) : (
            <ul>
              {visibleActivities.map((activity) => {
                const meta = activityMeta[activity.type] || {};
                return (
                  <li key={activity._id}>
                    <span className={`icon ${meta.color || "blue"}`}>
                      {meta.icon}
                    </span>
                    <div>
                      <strong>{activity.title}</strong>
                      <p>{activity.message}</p>
                      <small>{timeAgo(activity.createdAt)}</small>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {activities.length > 5 && (
            <span
              className="link"
              style={{ cursor: "pointer" }}
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "View Less" : "View All"}
            </span>
          )}

        </div>

        {/* QUICK ACTIONS */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>

          <button className="action-btn primary" onClick={() => navigate("/team/profile")}>
            Manage Team Profile <FaArrowRight />
          </button>

          <button className="action-btn primary" onClick={() => navigate("/team/members")}>
            Edit Team Members <FaArrowRight />
          </button>

          <button className="action-btn primary" onClick={() => navigate("/team/vehicles")}>
            Open Vehicle Module <FaArrowRight />
          </button>

          <button className="action-btn outline">
            Upload Documents <FaUpload />
          </button>

          <button className="action-btn outline">
            View Analytics <FaChartLine />
          </button>

          <button className="action-btn outline">
            Events all around <FaCalendarAlt />
          </button>

          <div className="support-box">
            <small>NEED HELP?</small>
            <button className="support-btn">
              <FaHeadset /> Contact Support
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER STATUS */}
      <footer className="system-footer">
        <span className="online">● ONLINE</span>
        <span>Active Users: <strong>1,247</strong></span>

        <span>
          Latency:{" "}
          <strong
            className={
              latency < 15
                ? "latency-green"
                : latency < 25
                  ? "latency-yellow"
                  : "latency-red"
            }
          >
            {latency}ms
          </strong>
        </span>
      </footer>

    </div>
  );
}

export default TeamHome;
