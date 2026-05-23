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

  if (loading) return <p>Loading...</p>;
 if (!vendor)[
    navigate("/vendor/Not-Found")
  ]; 

  return (
    <header className="header">
      <div className="header-container">

        {/* Logo */}
        <Link to="/" className="logo">
          <div className="logo-icon">⚡</div>
          <span className="logo-text">SCYLLA</span>
        </Link>

        {/* Company Name */}
        <div className="company-name">{vendor?.businessName}</div>

        {/* Hamburger Button (Mobile) */}
        <button
          className="hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation */}
        <nav className={`nav-links ${mobileMenuOpen ? "show" : ""}`}>
          <Link
            to="/vendor/home"
            className={`nav-link ${currentPath === '/' ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/vendor/profile"
            className={`nav-link ${currentPath === '/vendor-profile' ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Vendor Profile
          </Link>

          <Link
            to="/vendor/product"
            className={`nav-link ${currentPath === '/product-listing' ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Product / Service Listing
          </Link>

          <Link
            to="/vendor/quote"
            className={`nav-link ${currentPath === '/quotes-inquiries' ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Quotes & Inquiries
          </Link>
        </nav>

        {/* Profile Dropdown */}
        <div className="profile-section">
          <button
            className="profile-avatar"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img className="avatar-initials" src={vendor?.logo} alt="logo" />
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Link
                to="/vendor/myProfile"
                className="dropdown-item"
                onClick={() => setIsDropdownOpen(false)}
              >
                My Profile
              </Link>

              <button
                className="dropdown-item logout"
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
