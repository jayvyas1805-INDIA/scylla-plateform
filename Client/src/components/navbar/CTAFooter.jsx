import "./CTAFooter.css";
import {useNavigate} from "react-router-dom";

function CTAFooter() {
  const navigate = useNavigate();
  return (
    <footer className="cta-footer">
      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Join the Action?</h2>
            <p className="cta-subtitle">
              Connect with the motorsport community and showcase your talent
            </p>

            <div className="cta-buttons">
              <button className="cta-btn cta-btn-primary" onClick={()=>navigate("/team/register")}>Register Your Team</button>
              <button className="cta-btn cta-btn-secondary" onClick={()=>navigate("/vendor/register")}>Become a Vendor</button>
              <button className="cta-btn cta-btn-tertiary">Explore Events</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
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

export default CTAFooter;
