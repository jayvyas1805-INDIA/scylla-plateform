import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="not-found">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1 className="error-title">Page Not Found</h1>
        <p className="error-description">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn btn-primary">
          ← Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
