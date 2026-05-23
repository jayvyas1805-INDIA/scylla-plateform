import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { adminUrl } from "../../api/api";

function Navbar() {
  const [activeNav, setActiveNav] = useState("home");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setActiveNav("home");
    } else if (location.pathname === "/about") {
      setActiveNav("about");
    } else if (location.pathname === "/teams") {
      setActiveNav("contact");
    } else if (location.pathname === "/vendor") {
      setActiveNav("events");
    } else if (location.pathname === "/contact") {
      setActiveNav("teams");
    }
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-text">SCYLLA</span>
        </div>

        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink
              to="/"
              className={`nav-link ${activeNav === "home" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              Home
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/about"
              className={`nav-link ${activeNav === "about" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                navigate("/about");
              }}
            >
              About Us
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/teams"
              className={`nav-link ${activeNav === "contact" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                navigate("/teams");
              }}
            >
              Teams
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/vendor"
              className={`nav-link ${activeNav === "events" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                navigate("/vendor");
              }}
            >
              Vendor
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/contact"
              className={`nav-link ${activeNav === "teams" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                navigate("/contact");
              }}
            >
              Contact Us
            </NavLink>
          </li>
        </ul>

        <div className="signin-container">
          <button
            className="signin-button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Sign In
          </button>

          {showDropdown && (
            <div className="signin-dropdown">
              <NavLink
                to="/team/login"
                className="signin-option"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/team/login");
                }}
              >
                Team Login
              </NavLink>

              <NavLink
                to="/vendor/login"
                className="signin-option"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/vendor/login");
                }}
              >
                Vendor Login
              </NavLink>

              <button
                className="signin-option"
                onClick={() => {
                  window.location.href = `${adminUrl}/admin/login`;
                }}
              >
                Admin Login
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
