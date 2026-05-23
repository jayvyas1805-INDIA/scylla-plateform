import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/MarketPlaceNavbar.css';

const NavBar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        {/* Desktop Navigation */}
        <div className="navbar-links navbar-links-centered">
          <Link
            to="/team/marketplace"
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 21H3v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2M16 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/>
            </svg>
            Marketplace
          </Link>

          <Link
            to="/team/messages"
            className={`navbar-link ${location.pathname === '/messages' ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Messages
          </Link>
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          className="hamburger-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}/>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}/>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}/>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)} />
          <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
            <Link
              to="/team/marketplace"
              className={`mobile-menu-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 21H3v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2M16 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/>
              </svg>
              Marketplace
            </Link>

            <Link
              to="/team/messages"
              className={`mobile-menu-link ${location.pathname === '/messages' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Messages
            </Link>
          </div>
        </>
      )}
    </nav>
  );
};

export default NavBar;
