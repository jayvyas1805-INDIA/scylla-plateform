import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/landing-theme.css';
import './Footer.css';

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Teams', to: '/teams' },
  { label: 'Vendor', to: '/vendor' },
  { label: 'About Us', to: '/about' },
];

const RESOURCE_LINKS = [
  { label: 'Contact Us', to: '/contact' },
  { label: 'Motorsport Policy', to: '/motorsport-policy' },
  { label: 'Team Login', to: '/team/login' },
  { label: 'Vendor Login', to: '/vendor/login' },
];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer-content">
          <div className="lp-footer-section">
            <h4 className="lp-footer-brand">SCYLLA</h4>
            <p className="lp-footer-description">
              The ultimate platform for motorsport enthusiasts, teams, and professionals.
            </p>
          </div>

          <div className="lp-footer-section">
            <h5 className="lp-footer-heading">Quick Links</h5>
            <ul className="lp-footer-links">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <button onClick={() => navigate(link.to)}>{link.label}</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lp-footer-section">
            <h5 className="lp-footer-heading">Resources</h5>
            <ul className="lp-footer-links">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.label}>
                  <button onClick={() => navigate(link.to)}>{link.label}</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lp-footer-section">
            <h5 className="lp-footer-heading">Follow Us</h5>
            <div className="lp-social-links">
              <a href="#" className="lp-social-link" aria-label="Facebook">f</a>
              <a href="#" className="lp-social-link" aria-label="X (Twitter)">𝕏</a>
              <a href="#" className="lp-social-link" aria-label="YouTube">▶</a>
            </div>
          </div>
        </div>

        <div className="lp-footer-bottom">
          <p className="lp-footer-copyright">
            © {new Date().getFullYear()} Motorsport Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
