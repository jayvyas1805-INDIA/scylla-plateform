import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/vendor/Header';
import { getVendorProfile } from "../../api/vendor.api";
import { getMyProduct } from "../../api/product.api";
import './VendorHome.css';

const VendorHome = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVendor = async () => {
      try {
        setLoading(true);
        const res = await getVendorProfile();
        setVendor(res.data);
      } catch (err) {
        console.error("Failed to load vendor profile", err);
        setError("Failed to load vendor data");
      } finally {
        setLoading(false);
      }
    };

    loadVendor();
  }, []);

  useEffect(() => {
    if (!loading && !vendor && !error) {
      navigate("/vendor/login");
    }
  }, [loading, vendor, error, navigate]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await getMyProduct();
        setProducts(res.data?.products || []);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };

    loadProducts();
  }, []);

  if (loading) return <p className="vendor-home-loading">Loading...</p>;
  if (error) return <p className="vendor-home-loading">{error}</p>;
  if (!vendor) return null;

  const previewProducts = products.slice(0, 3);

  return (
    <div className="vendor-home">
      <Header currentPath={location.pathname} />

      <main className="vendor-home-main">

        {/* Hero Section */}
        <section className="vendor-hero-section">
          <div className="vendor-hero-content">
            <div className="vendor-hero-text">

              <div className="vendor-title-row">
                <div className="vendor-title-icon">
                  {vendor.logo ? (
                    <img src={vendor.logo} alt="Vendor Logo" />
                  ) : (
                    <span>🏎️</span>
                  )}
                </div>
                <h1 className="vendor-title">{vendor.businessName}</h1>
                {vendor.category && (
                  <p className="vendor-subtitle-badge">{vendor.category}</p>
                )}
              </div>

              <p className={`vendor-description ${!vendor.companyDesc && !vendor.description ? 'vendor-description-empty' : ''}`}>
                {vendor.companyDesc || vendor.description || "Add a description so teams know what you offer."}
              </p>

              <div className="vendor-meta">
                <span className="vendor-meta-item">📍 {vendor?.location || 'Location not set'}</span>
                <span className="vendor-meta-item">
                  📅 Since {vendor?.createdAt ? vendor.createdAt.slice(0, 4) : '—'}
                </span>
              </div>

              {vendor.services?.length > 0 && (
                <div className="vendor-skills-badges">
                  {vendor.services.slice(0, 4).map((s, i) => (
                    <span className="vendor-skill-badge" key={i}>{s.name}</span>
                  ))}
                </div>
              )}

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
            <p className="vendor-stat-value">{products.length}</p>
          </div>

          <div className="vendor-stat-card">
            <div className="vendor-stat-icon">💬</div>
            <h3 className="vendor-stat-label">Active Quotes</h3>
            <p className="vendor-stat-value">—</p>
            <span className="vendor-stat-note">Coming soon</span>
          </div>

          <div className="vendor-stat-card">
            <div className="vendor-stat-icon">⏱️</div>
            <h3 className="vendor-stat-label">Response Time</h3>
            <p className="vendor-stat-value">—</p>
            <span className="vendor-stat-note">Coming soon</span>
          </div>

          <div className="vendor-stat-card">
            <div className="vendor-stat-icon">👁️</div>
            <h3 className="vendor-stat-label">Profile Views</h3>
            <p className="vendor-stat-value">{vendor.profileViews ?? 0}</p>
          </div>
        </section>

        {/* Products and Quotes Section */}
        <div className="vendor-main-content-grid">

          {/* Products */}
          <section className="vendor-products-section">
            <h2 className="vendor-section-title">Your Products & Services</h2>

            <div className="vendor-products-list">
              {previewProducts.map((product) => (
                <div className="product-card" key={product._id}>
                  <div className="product-header">
                    <h4 className="product-name">{product.title}</h4>
                    <span className={`badge badge-${product.status === 'approved' ? 'active' : 'pending'}`}>
                      {product.status === 'approved' ? 'Active' : 'Pending'}
                    </span>
                  </div>
                  <p className="product-category">{product.category || 'Uncategorized'}</p>
                  <p className="product-price">${product.price}</p>
                </div>
              ))}
            </div>

            <button
              className="vendor-btn vendor-btn-primary vendor-btn-full-width"
              onClick={() => navigate('/vendor/product')}
            >
              Manage All Listings
            </button>
          </section>

          {/* Quotes */}
          <section className="vendor-quotes-section">
            <h2 className="vendor-section-title">Recent Quotes & Inquiries</h2>

            <div className="vendor-quotes-list vendor-quotes-list-placeholder">
              <p className="vendor-coming-soon-note">
                Quote and inquiry tracking is coming soon — this section is a preview of what's planned.
              </p>
            </div>

            <button
              className="vendor-btn vendor-btn-primary vendor-btn-full-width"
              onClick={() => navigate('/vendor/quote')}
            >
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
            </div>
            <div className="vendor-footer-links">
              <button className="vendor-footer-link" onClick={() => navigate('/contact')}>
                Support / Help
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default VendorHome;
