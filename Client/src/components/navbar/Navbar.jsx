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
    <nav className="land-navbar">
      <div className="land-navbar-container">
        <div className="land-navbar-logo">
          <span className="land-logo-text">SCYLLA</span>
        </div>

        <ul className="land-nav-menu">
          <li className="land-nav-item">
            <NavLink
              to="/"
              className={`land-nav-link ${activeNav === "home" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              Home
            </NavLink>
          </li>

          <li className="land-nav-item">
            <NavLink
              to="/about"
              className={`land-nav-link ${activeNav === "about" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                navigate("/about");
              }}
            >
              About Us
            </NavLink>
          </li>

          <li className="land-nav-item">
            <NavLink
              to="/teams"
              className={`land-nav-link ${activeNav === "contact" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                navigate("/teams");
              }}
            >
              Teams
            </NavLink>
          </li>

          <li className="land-nav-item">
            <NavLink
              to="/vendor"
              className={`land-nav-link ${activeNav === "events" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                navigate("/vendor");
              }}
            >
              Vendor
            </NavLink>
          </li>

          <li className="land-nav-item">
            <NavLink
              to="/contact"
              className={`land-nav-link ${activeNav === "teams" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                navigate("/contact");
              }}
            >
              Contact Us
            </NavLink>
          </li>
        </ul>

        <div className="land-signin-container">
          <button
            className="land-signin-button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Sign In
          </button>

          {showDropdown && (
            <div className="land-signin-dropdown">
              <NavLink
                to="/team/login"
                className="land-signin-option"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/team/login");
                }}
              >
                Team Login
              </NavLink>

              <NavLink
                to="/vendor/login"
                className="land-signin-option"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/vendor/login");
                }}
              >
                Vendor Login
              </NavLink>

              <button
                className="land-signin-option"
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
