import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getVendorProfile } from "../../api/vendor.api";
import './Header.css';

const Header = ({ currentPath }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // ✅ ADDED
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logout clicked');
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const vendorData = async () => {
      try {
        setLoading(true);
        const res = await getVendorProfile();
        setVendor(res.data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    vendorData();
  }, []);

  // Always render the header shell — even before the vendor profile has
  // loaded, or if it fails to load — so navigation never disappears.

  return (
    <header className="vendor-header">
      <div className="vendor-header-container">

        {/* Logo */}
        <Link to="/" className="vendor-header-logo">
          <div className="vendor-header-logo-icon">⚡</div>
          <span className="vendor-header-logo-text">SCYLLA</span>
        </Link>

        {/* Company Name */}
        <div className="vendor-header-company">{loading ? '' : (vendor?.businessName || '')}</div>

        {/* Hamburger Button (Mobile) */}
        <button
          className={`vendor-header-hamburger ${mobileMenuOpen ? "vendor-header-hamburger-open" : ""
            }`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation */}
        <nav className={`vendor-header-nav ${mobileMenuOpen ? "vendor-header-nav-show" : ""}`}>
          <Link
            to="/vendor/home"
            className={`vendor-header-nav-link ${currentPath === '/vendor/home' ? 'vendor-header-nav-active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/vendor/profile"
            className={`vendor-header-nav-link ${currentPath === '/vendor/profile' ? 'vendor-header-nav-active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Vendor Profile
          </Link>

          <Link
            to="/vendor/product"
            className={`vendor-header-nav-link ${currentPath === '/vendor/product' ? 'vendor-header-nav-active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Product / Service Listing
          </Link>

          <Link
            to="/vendor/quote"
            className={`vendor-header-nav-link ${currentPath === '/vendor/quote' ? 'vendor-header-nav-active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Quotes & Inquiries
          </Link>
        </nav>

        {/* Profile Dropdown */}
        <div className="vendor-header-profile">
          <button
            className="vendor-header-avatar-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {vendor?.logo ? (
              <img className="vendor-header-avatar-img" src={vendor.logo} alt="logo" />
            ) : (
              <span>👤</span>
            )}
          </button>

          {isDropdownOpen && (
            <div className="vendor-header-dropdown">
              <Link
                to="/vendor/myProfile"
                className="vendor-header-dropdown-item"
                onClick={() => setIsDropdownOpen(false)}
              >
                My Profile
              </Link>

              <button
                className="vendor-header-dropdown-item vendor-header-dropdown-logout"
                onClick={() => {
                  handleLogout();
                  localStorage.removeItem("token");
                  navigate("/vendor/login");
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
