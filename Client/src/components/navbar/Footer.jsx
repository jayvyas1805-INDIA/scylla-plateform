import React from 'react';
import '../../styles/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
           <section className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4 className="footer-title">SCYLLA</h4>
              <p className="footer-description">
                The ultimate platform for motorsport enthusiasts, teams, and professionals.
              </p>
            </div>

            <div className="footer-section">
              <h5 className="footer-heading">Quick Links</h5>
              <ul className="footer-links">
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

            <div className="footer-section">
              <h5 className="footer-heading">Categories</h5>
              <ul className="footer-links">
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

            <div className="footer-section">
              <h5 className="footer-heading">Follow Us</h5>
              <div className="social-links">
                <a href="#" className="social-link">
                  f
                </a>
                <a href="#" className="social-link">
                  𝕏
                </a>
                <a href="#" className="social-link">
                  ▶
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © 2024 Motorsport Platform. All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
}
