import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import "../../styles/landing-theme.css";
import "./CTAFooter.css";

function CTAFooter() {
  const navigate = useNavigate();

  return (
    <div>
      <section className="lp-section lp-cta-section">
        <div className="lp-container lp-cta-content">
          <h2 className="lp-section-title">Ready to Join the Action?</h2>
          <p className="lp-section-subtitle">
            Connect with the motorsport community and showcase your talent
          </p>

          <div className="lp-cta-buttons">
            <button className="lp-btn lp-btn-primary lp-btn-lg" onClick={() => navigate("/teams")}>
              Register Your Team
            </button>
            <button className="lp-btn lp-btn-outline lp-btn-lg" onClick={() => navigate("/vendor")}>
              Become a Vendor
            </button>
          </div>
        </div>
      </section>

      {/* Reuses the same Footer used across About/Contact/Team/Vendor
          landing pages, so the footer looks identical everywhere
          instead of duplicating the whole implementation here. */}
      <Footer />
    </div>
  );
}

export default CTAFooter;
