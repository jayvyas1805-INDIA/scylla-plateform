import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/vendor/Header';
import { getVendorProfile } from "../../api/vendor.api";
import { getMyProduct } from "../../api/product.api";
import './VendorHome.css';

const VendorHome = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const vendorData = async () => {
      try {
        setLoading(true);

        // ✅ Read updated data first
        const storedVendor = localStorage.getItem("vendorProfile");

        if (storedVendor) {
          const parsed = JSON.parse(storedVendor);
          if (parsed && parsed.logo) {
            setVendor(parsed);
            setLoading(false);
            return;
          }
        }

      } catch (err) {
        console.log(err.message);
        setError("Failed to load vendor data");
      } finally {
        setLoading(false);
      }
    };

    vendorData();
  }, []);

  // useEffect(() => {
  //   if (!vendor) {
  //     navigate("/vendor/login");
  //   }
  // }, [vendor, navigate]);


   
  


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="vendor-home">
      <Header currentPath={location.pathname} />

      <main className="vendor-home-main">

        {/* Hero Section */}
        <section className="vendor-hero-section">
          <div className="vendor-hero-content">
            <div className="vendor-hero-text">

              {/* ✅ TITLE + FORMULA ICON */}
              <div className="vendor-title-row">
                <h1 className="vendor-title">{vendor?.businessName}</h1>
                <div className="vendor-title-icon">
                  {vendor?.logo ? (
                    <img
                      src={vendor.logo}
                      alt="Vendor Logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <span>🏎️</span>
                  )}

                </div>
              </div>

              <p className="vendor-subtitle">{vendor?.category}</p>

              <p className="vendor-description">
                {vendor?.description}
              </p>

              <div className="vendor-meta">
                <span className="vendor-meta-item">📍 {vendor?.location}</span>
                <span className="vendor-meta-item">📅 Since {vendor?.createdAt?.slice(0, 4)}</span>
              </div>

              <div className="vendor-skills-badges">
                <span className="vendor-skill-badge">Race Parts</span>
                <span className="vendor-skill-badge">Custom Fab</span>
                <span className="vendor-skill-badge">Chassis Work</span>
                <span className="vendor-skill-badge">Performance</span>
              </div>

              <div className="vendor-action-buttons">
                <button
                  className="vendor-btn vendor-btn-primary"
                  onClick={() => navigate('/vendor/profile/edit')}
                >
                  ✏️ Edit Vendor Profile
                </button>

                <button
                  className="vendor-btn vendor-btn-primary"
                  onClick={() => navigate('/vendor/product')}
                >
                  ➕ Add New Product / Service
                </button>
              </div>
            </div>

            {/* Hero icon (kept for glow balance) */}
            <div className="vendor-hero-icon">
              <div className="vendor-icon-circle">
                <div className="vendor-icon-inner">🏎️</div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="vendor-stats-section">
          <div className="vendor-stat-card">
            <div className="vendor-stat-icon">📦</div>
            <h3 className="vendor-stat-label">Products Listed</h3>
            <p className="vendor-stat-value">{productCount}</p>
          </div>

          <div className="vendor-stat-card">
            <div className="vendor-stat-icon">💬</div>
            <h3 className="vendor-stat-label">Active Quotes</h3>
            <p className="vendor-stat-value">0</p>
          </div>

          <div className="vendor-stat-card">
            <div className="vendor-stat-icon">⏱️</div>
            <h3 className="vendor-stat-label">Response Time</h3>
            <p className="vendor-stat-value">0h</p>
          </div>

          <div className="vendor-stat-card">
            <div className="vendor-stat-icon">👁️</div>
            <h3 className="vendor-stat-label">Profile Views</h3>
            <p className="vendor-stat-value">0</p>
          </div>
        </section>

        {/* Products and Quotes Section */}
        <div className="vendor-main-content-grid">

          {/* Products */}
          <section className="vendor-products-section">
            <h2 className="vendor-section-title">Your Products & Services</h2>

            <div className="vendor-products-list">
              {/* <div className="product-card"> */}
              {/* <div className="product-header"> */}
              {/* <h4 className="product-name">Carbon Fiber Splitter Kit</h4>
                  <span className="badge badge-active">Active</span> */}
            </div>
            {/* <p className="product-category">Aerodynamics / Body Parts</p>
                <p className="product-price">$0</p>
                <button className="btn btn-secondary btn-small">Request Quote</button> */}
            {/* </div> */}
            {/* </div> */}

            <button className="vendor-btn vendor-btn-primary vendor-btn-full-width">
              Manage All Listings
            </button>
          </section>

          {/* Quotes */}
          <section className="vendor-quotes-section">
            <h2 className="vendor-section-title">Recent Quotes & Inquiries</h2>

            <div className="vendor-quotes-list">
              {/* <div className="quote-card"> */}
              {/* <div className="quote-header"> */}
              {/* <h4 className="quote-client">Thunder Racing Team</h4>
                  <span className="badge badge-new">New</span> */}
            </div>
            {/* <p className="quote-product">Carbon Fiber Splitter Kit</p>
                <p className="quote-date">2 hours ago</p> */}
            {/* </div> */}
            {/* </div> */}

            <button className="vendor-btn vendor-btn-primary vendor-btn-full-width">
              View All Quotes & Inquiries
            </button>
          </section>
        </div>

        {/* Quick Actions */}
        <section className="vendor-quick-actions-section">
          <h2 className="vendor-section-title">Quick Actions</h2>
          <div className="vendor-quick-actions-grid">
            <button className="vendor-action-btn" onClick={() => navigate('/vendor/profile')}>
              <span className="vendor-action-icon">📝</span>
              <span className="vendor-action-label">Update Business Info</span>
            </button>

            <button className="vendor-action-btn" onClick={() => navigate('/vendor/profile/edit')}>
              <span className="vendor-action-icon">📄</span>
              <span className="vendor-action-label">Upload Verification Documents</span>
            </button>

            <button className="vendor-action-btn" onClick={() => navigate('/vendor/profile/edit')}>
              <span className="vendor-action-icon">🖼️</span>
              <span className="vendor-action-label">Add New Banner / Logo</span>
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="vendor-footer">
          <div className="vendor-footer-content">
            <div className="vendor-footer-status">
              <span className="vendor-status-badge online">● ONLINE</span>
              <span className="vendor-status-text">0 Teams Connected</span>
            </div>
            <div className="vendor-footer-links">
              <a href="#support" className="vendor-footer-link">Support / Help</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default VendorHome;
