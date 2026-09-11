import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/landing-theme.css";
import "./Navbar.css";
import { adminUrl } from "../../api/api";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About Us" },
  { to: "/teams", label: "Teams" },
  { to: "/vendor", label: "Vendor" },
  { to: "/contact", label: "Contact Us" },
];

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="lp-navbar">
      <div className="lp-navbar-container">
        <NavLink to="/" className="lp-navbar-logo">
          <span className="lp-logo-mark">⚡</span>
          <span className="lp-logo-text">SCYLLA</span>
        </NavLink>

        <ul className="lp-nav-menu">
          {NAV_LINKS.map((link) => (
            <li className="lp-nav-item" key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) => `lp-nav-link ${isActive ? "active" : ""}`}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="lp-signin-container">
          <button
            className="lp-btn lp-btn-primary lp-signin-button"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            Sign In
          </button>

          {showDropdown && (
            <>
              <div className="lp-signin-backdrop" onClick={() => setShowDropdown(false)} />
              <div className="lp-signin-dropdown">
                <NavLink
                  to="/team/login"
                  className="lp-signin-option"
                  onClick={() => setShowDropdown(false)}
                >
                  Team Login
                </NavLink>

                <NavLink
                  to="/vendor/login"
                  className="lp-signin-option"
                  onClick={() => setShowDropdown(false)}
                >
                  Vendor Login
                </NavLink>

                <button
                  className="lp-signin-option"
                  onClick={() => {
                    window.location.href = `${adminUrl}/admin/login`;
                  }}
                >
                  Admin Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
