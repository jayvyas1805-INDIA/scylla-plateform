import React from 'react';
import '../../styles/footer.css';

export default function Footer() {
  return (
    <footer className="land-footer">
           <section className="land-footer">
        <div className="land-container">
          <div className="land-footer-content">
            <div className="land-footer-section">
              <h4 className="land-footer-title">SCYLLA</h4>
              <p className="land-footer-description">
                The ultimate platform for motorsport enthusiasts, teams, and professionals.
              </p>
            </div>

            <div className="land-footer-section">
              <h5 className="land-footer-heading">Quick Links</h5>
              <ul className="land-footer-links">
                <li>
                  <a href="#">Events</a>
                </li>
                <li>
                  <a href="#">Teams</a>
                </li>
                <li>
                  <a href="#">Riders</a>
                </li>
                <li>
                  <a href="#">Marketplace</a>
                </li>
              </ul>
            </div>

            <div className="land-footer-section">
              <h5 className="land-footer-heading">Categories</h5>
              <ul className="land-footer-links">
                <li>
                  <a href="#">Formula Racing</a>
                </li>
                <li>
                  <a href="#">Karting</a>
                </li>
                <li>
                  <a href="#">Motorsports</a>
                </li>
                <li>
                  <a href="#">Rally Racing</a>
                </li>
              </ul>
            </div>

            <div className="land-footer-section">
              <h5 className="land-footer-heading">Follow Us</h5>
              <div className="land-social-links">
                <a href="#" className="land-social-link">
                  f
                </a>
                <a href="#" className="land-social-link">
                  𝕏
                </a>
                <a href="#" className="land-social-link">
                  ▶
                </a>
              </div>
            </div>
          </div>

          <div className="land-footer-bottom">
            <p className="land-footer-copyright">
              © 2024 Motorsport Platform. All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
}
