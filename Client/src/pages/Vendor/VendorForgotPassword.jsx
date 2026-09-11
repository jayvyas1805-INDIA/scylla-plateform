import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VendorLogin.css";

function VendorForgotPassword() {

  const navigate = useNavigate();

  // ✅ EMAIL STATE
  const [email, setEmail] = useState("");

  // ✅ LATENCY STATE
  const [latency, setLatency] = useState(12);

  // ✅ REAL-TIME LATENCY EFFECT
  useEffect(() => {
    const interval = setInterval(() => {
      const randomLatency = Math.floor(10 + Math.random() * 25);
      setLatency(randomLatency);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="login-page">
      {/* LEFT VISUAL */}
      <div className="login-visual">
        <div className="speedometer-container">
          <img
            src="/images/speedometer-image.png"
            alt="Speedometer"
            className="login-speedometer"
          />
          <div className="speedometer-needle"></div>
        </div>

        <div className="sector-box">
          <span>SECTOR TIME</span>
          <strong>1:23.456</strong>
        </div>
      </div>

      {/* RIGHT CARD */}
      <div className="login-card">
        <h1>Reset Password</h1>
        <p className="subtitle">Vendor Account Recovery</p>

        <p className="reset-info">
          Enter your registered email address and we’ll send you a secure
          password reset link. The link will expire in 1 hour.
        </p>

        {/* FORM */}
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="vendor@business.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="login-btn">
          ✉ Send Reset Link
        </button>

        <div className="login-links center">
          <span
            className="link"
            onClick={() => navigate("/vendor/login")}
          >
            Back to Login
          </span>
        </div>

        {/* STATUS BAR */}
        <div className="status-bar">
          <div>
            <span className="green">ONLINE</span>
            <small>SYSTEM STATUS</small>
          </div>

          <div>
            <span className="blue">847</span>
            <small>ACTIVE USERS</small>
          </div>

          <div>
            <span
              className={`latency ${
                latency < 20
                  ? "latency-green"
                  : latency < 30
                  ? "latency-yellow"
                  : "latency-red"
              }`}
            >
              {latency}ms
            </span>
            <small>LATENCY</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorForgotPassword;
