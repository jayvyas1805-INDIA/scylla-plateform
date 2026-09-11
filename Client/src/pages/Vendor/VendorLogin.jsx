import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { vendorLogin } from "../../api/vendor.api"
import "./VendorLogin.css";

function VendorLogin() {
  const [role, setRole] = useState("vendor");
  const[email,setEmail]= useState("");
  const [password,setPassword] = useState("")


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
      const res = await vendorLogin({ email, password });
  
      localStorage.setItem("token", res.data.token);
      console.log(res.data.token)
  
      alert("Login successful");
      navigate("/vendor/home");
  
    } catch (err) {
      console.log(err)
      alert(err.response?.data?.error || "Login failed");
    }
  };

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
        <h1>Scylla Vendor Racing Network</h1>
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
          <input type="email" placeholder="abc@scylla.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="login-links">
          <span
            className="link"
            onClick={() => navigate("/vendor/register")}
          >
            New Vendor
          </span>

                  <span
                      className="link"
                      onClick={() => navigate("/vendor/forgot-password")}
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

export default VendorLogin;
