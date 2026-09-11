import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api"; // your axios instance

function SetMemberPassword() {
  const { token } = useParams(); // token from URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      return alert("Please fill both fields");
    }
    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);
      const res = await api.post(`/api/member/set-password/${token}`, {
        password,
        confirmPassword,
      });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/team/login"); // redirect to team login page
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h2>Set Your Team Password</h2>
      {message && <p>{message}</p>}
      {!message && (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 15 }}>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: 10 }}
            />
          </div>
          <div style={{ marginBottom: 15 }}>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: "100%", padding: 10 }}
            />
          </div>
          <button type="submit" disabled={loading} style={{ padding: "10px 20px" }}>
            {loading ? "Setting..." : "Set Password"}
          </button>
        </form>
      )}
    </div>
  );
}

export default SetMemberPassword;
