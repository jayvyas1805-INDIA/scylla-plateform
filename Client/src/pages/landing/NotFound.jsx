import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "700", marginBottom: "16px" }}>
          404
        </h1>
        <p style={{ fontSize: "18px", color: "#666", marginBottom: "24px" }}>
          Oops! Page not found
        </p>
        <a
          href="/"
          style={{
            color: "#3366ff",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "600",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.color = "#254fbf";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "#3366ff";
          }}
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}

export default NotFound;
