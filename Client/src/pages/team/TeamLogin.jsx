import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { teamLogin } from "../../api/team.api";
import "./TeamLogin.css";

function TeamLogin() {
  const [role, setRole] = useState("team");

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  // ✅ ADD NAVIGATE
  const navigate = useNavigate();

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

const handleLogin = async () => {
  try {
    const res = await teamLogin({ email, password });

    localStorage.setItem("token", res.data.token);
    console.log(res.data.token)

    alert("Login successful");
    navigate("/team/home");

  } catch (err) {
    console.log(err)
    alert(err.response?.data?.error || "Login failed");
  }
};

  return (
    <div className="login-page">
      {/* LEFT VISUAL */}
      <div className="login-visual">
        <img
          src="/images/speedometer-image.png"
          alt="Speedometer"
          className="login-speedometer"
        />

        <div className="sector-box">
          <span>SECTOR TIME</span>
          <strong>1:23.456</strong>
        </div>
      </div>

      {/* RIGHT CARD */}
      <div className="login-card">
        <h1>Team Scylla Racing Motorsports</h1>
        <p className="subtitle">Racing Analytics Platform</p>

        {/* ROLE SWITCH */}
        <div className="role-switch">
          <button
            className={role === "team" ? "active" : ""}
            onClick={() => {
              setRole("team");
              navigate("/team/login");
            }}
          >
            TEAM
          </button>

          <button
            className={role === "vendor" ? "active" : ""}
            onClick={() => {
              setRole("vendor");
              navigate("/vendor/login");
            }}
          >
            VENDOR
          </button>
        </div>

        {/* FORM */}
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" placeholder="driver@racing.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="login-links">
          <span
            className="link"
            onClick={() => navigate("/team/register")}
          >
            New User
          </span>

                  <span
                      className="link"
                      onClick={() => navigate("/team/forgot-password")}
                  >
                      Forgot Password?
                  </span>

        </div>

        <button className="login-btn" onClick={handleLogin}>
          ⚡ Start Session
        </button>

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

export default TeamLogin;
