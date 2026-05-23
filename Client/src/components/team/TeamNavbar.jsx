import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { getTeamProfile } from "../../api/team.api";
import {getMyProfile} from "../../api/member.api";
import "./TeamNavbar.css";

function TeamNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true);
  const [member,setMember] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  // ✅ AUTO-CLOSE MENU ON ROUTE CHANGE
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {

    const getData = async () => {
      try {
        setLoading(true)
        const teamRes = await getTeamProfile();
        setTeam(teamRes.data);

        const memberRes = await getMyProfile();
        setMember(memberRes.data.member);
      } catch (err) {
        // alert("cannot be fetched" + err.message);
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    };

    getData();
  }, [location.pathname]);

  if (loading) return <p>Loading...</p>; // show loading
  if (!team)[
    navigate("/team/login")
  ]; // show fallback

  return (
    <header className="team-navbar">
      {/* LEFT */}
      <div
        className="team-nav-left"
        onClick={() => {
          navigate("/team/home");
          handleNavClick();
        }}
      >
        <h1 className="team-logo" onClick={()=>navigate("/")}>SCYLLA</h1>
        <span className="team-subtitle">
          
        </span>
      </div>

      {/* CENTER NAV */}
      <nav className={`team-nav-center ${menuOpen ? "open" : ""}`}>
        <NavLink
          to="/team/home"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={handleNavClick}
        >
          Home
        </NavLink>

        <NavLink
          to="/team/profile"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={handleNavClick}
        >
          Team Profile
        </NavLink>

        <NavLink
          to="/team/members"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={handleNavClick}
        >
          Team Members
        </NavLink>

        <NavLink
          to="/team/vehicles"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={handleNavClick}
        >
          Vehicle Module
        </NavLink>


        <NavLink
          to="/team/marketplace"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={handleNavClick}
        >
          Market Place & Events
        </NavLink>

        {/* <NavLink
          to="/team/profilee"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={handleNavClick}
        >
          Profile
        </NavLink> */}
      </nav>

      {/* RIGHT PROFILE */}
      <div className="team-nav-right">
        <div
          className="profile-wrapper"
          onClick={() => setProfileOpen(!profileOpen)}
        >
          <img
            src={team.logo}
            alt="Profile"
            className="profile-avatar"
          />

          {profileOpen && (
            <div className="profile-dropdown">
              <button
                onClick={() => {
                  navigate("/team/profilee");
                  handleNavClick();
                }}
              >

                My Profile
              </button>

              <button
                className="logout"
                onClick={() => {
                  handleNavClick();
                  // Frontend logout
                  localStorage.removeItem("token");
                  navigate("/team/login");
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* HAMBURGER */}
        <button
          className="hamburger"
          onClick={() => {
            setMenuOpen(!menuOpen);
            setProfileOpen(false);
          }}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
}

export default TeamNavbar;
