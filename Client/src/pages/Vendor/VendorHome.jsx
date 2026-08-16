import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/vendor/Header';
import { getVendorProfile } from '../../api/vendor.api';
import { getMyProduct } from '../../api/product.api';
import './VendorHome.css';

const SKILL_BADGES = ['Race Parts', 'Custom Fab', 'Chassis Work', 'Performance'];

const VendorHome = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVendor = async () => {
      try {
        setLoading(true);
        const res = await getVendorProfile();
        setVendor(res.data);
      } catch (err) {
        console.error('Failed to load vendor profile', err);
      } finally {
        setLoading(false);
      }
    };

    loadVendor();
  }, []);

  useEffect(() => {
    if (!vendor) {
      navigate('/vendor/login');
    }
  }, [vendor, navigate]);

  useEffect(() => {
    const loadProductCount = async () => {
      try {
        const res = await getMyProduct();
        const list = res?.data?.data || res?.data?.products || res?.data || [];
        setProductCount(Array.isArray(list) ? list.length : 0);
      } catch (err) {
        console.error('Failed to load product count', err);
      }
    };

    loadProductCount();
  }, []);

  if (loading) {
    return (
      <div className="vendor-home">
        <Header currentPath={location.pathname} />
        <p className="vendor-home-loading">Loading your dashboard…</p>
      </div>
    );
  }

  if (!vendor) return null;

  return (
    <div className="vendor-home">
      <Header currentPath={location.pathname} />

      <main className="vendor-home-main">
        {/* Hero */}
        <section className="vendor-home-hero">
          <div className="vendor-home-hero-content">
            <div className="vendor-home-hero-text">
              <div className="vendor-home-title-row">
                <h1 className="vendor-home-title">{vendor.businessName || 'Your Business'}</h1>
                <div className="vendor-home-title-icon">
                  {vendor?.logo ? (
                    <img src={vendor.logo} alt="Vendor Logo" />
                  ) : (
                    <span>🏎️</span>
                  )}
                </div>
              </div>

              <p className="vendor-home-subtitle">{vendor.category || 'Vendor'}</p>

              <p className={`vendor-home-description ${!vendor.description ? 'vendor-home-empty' : ''}`}>
                {vendor.description || 'Add a description so teams know what you offer.'}
              </p>

              <div className="vendor-home-meta">
                <span className="vendor-home-meta-item">📍 {vendor.location || 'Location not set'}</span>
                <span className="vendor-home-meta-item">
                  📅 Since {vendor?.createdAt ? vendor.createdAt.slice(0, 4) : '—'}
                </span>
              </div>

              <div className="vendor-home-badges">
                {SKILL_BADGES.map((skill) => (
                  <span className="vendor-home-badge" key={skill}>{skill}</span>
                ))}
              </div>

              <div className="vendor-home-actions">
                <button
                  className="vendor-home-btn vendor-home-btn-primary"
                  onClick={() => navigate('/vendor/profile/edit')}
                >
                  ✏️ Edit Vendor Profile
                </button>

                <button
                  className="vendor-home-btn vendor-home-btn-primary"
                  onClick={() => navigate('/vendor/product')}
                >
                  ➕ Add New Product / Service
                </button>
              </div>
            </div>

            <div className="vendor-home-hero-icon">
              <div className="vendor-home-icon-circle">
                <div className="vendor-home-icon-inner">🏎️</div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="vendor-home-stats">
          <div className="vendor-home-stat-card">
            <div className="vendor-home-stat-icon">📦</div>
            <h3 className="vendor-home-stat-label">Products Listed</h3>
            <p className="vendor-home-stat-value">{productCount}</p>
          </div>

          <div className="vendor-home-stat-card">
            <div className="vendor-home-stat-icon">💬</div>
            <h3 className="vendor-home-stat-label">Active Quotes</h3>
            <p className="vendor-home-stat-value">{vendor.activeQuotes ?? 0}</p>
          </div>

          <div className="vendor-home-stat-card">
            <div className="vendor-home-stat-icon">⏱️</div>
            <h3 className="vendor-home-stat-label">Response Time</h3>
            <p className="vendor-home-stat-value">{vendor.avgResponseTime ?? '—'}</p>
          </div>

          <div className="vendor-home-stat-card">
            <div className="vendor-home-stat-icon">👁️</div>
            <h3 className="vendor-home-stat-label">Profile Views</h3>
            <p className="vendor-home-stat-value">{vendor.profileViews ?? 0}</p>
          </div>
        </section>

        {/* Products + Quotes */}
        <div className="vendor-home-grid">
          <section className="vendor-home-panel">
            <h2 className="vendor-home-panel-title">Your Products & Services</h2>

            {productCount > 0 ? (
              <p className="vendor-home-panel-summary">
                You have {productCount} listing{productCount === 1 ? '' : 's'} live in the marketplace.
              </p>
            ) : (
              <p className="vendor-home-panel-empty">
                You haven't listed any products or services yet.
              </p>
            )}

            <button
              className="vendor-home-btn vendor-home-btn-primary vendor-home-full-width"
              onClick={() => navigate('/vendor/product')}
            >
              Manage All Listings
            </button>
          </section>

          <section className="vendor-home-panel">
            <h2 className="vendor-home-panel-title">Recent Quotes & Inquiries</h2>

            <p className="vendor-home-panel-empty">
              No quotes or inquiries yet — they'll show up here once teams reach out.
            </p>

            <button
              className="vendor-home-btn vendor-home-btn-primary vendor-home-full-width"
              onClick={() => navigate('/vendor/quote')}
            >
              View All Quotes & Inquiries
            </button>
          </section>
        </div>

        {/* Quick Actions */}
        <section className="vendor-home-quick-actions">
          <h2 className="vendor-home-panel-title">Quick Actions</h2>
          <div className="vendor-home-quick-actions-grid">
            <button className="vendor-home-action-btn" onClick={() => navigate('/vendor/profile')}>
              <span className="vendor-home-action-icon">📝</span>
              <span className="vendor-home-action-label">Update Business Info</span>
            </button>

            <button className="vendor-home-action-btn" onClick={() => navigate('/vendor/profile/edit')}>
              <span className="vendor-home-action-icon">📄</span>
              <span className="vendor-home-action-label">Upload Verification Documents</span>
            </button>

            <button className="vendor-home-action-btn" onClick={() => navigate('/vendor/profile/edit')}>
              <span className="vendor-home-action-icon">🖼️</span>
              <span className="vendor-home-action-label">Add New Banner / Logo</span>
            </button>
          </div>
        </section>

        <footer className="vendor-home-footer">
          <div className="vendor-home-footer-content">
            <div className="vendor-home-footer-status">
              <span className="vendor-home-status-badge">● ONLINE</span>
              <span className="vendor-home-status-text">
                {vendor.connectedTeams ?? 0} Teams Connected
              </span>
            </div>
            <div className="vendor-home-footer-links">
              <a href="/contact" className="vendor-home-footer-link">Support / Help</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default VendorHome;
