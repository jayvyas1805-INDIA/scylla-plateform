import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getVendorProfile, editVendorProfile, uploadGallery } from '../../api/vendor.api';
import Header from '../../components/vendor/Header';
import './VendorMyProfile.css';

const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SOCIAL_ICONS = [
  { key: 'instagram', icon: '📷', label: 'Instagram' },
  { key: 'youtube', icon: '▶️', label: 'YouTube' },
  { key: 'linkedin', icon: 'in', label: 'LinkedIn' },
  { key: 'whatsapp', icon: '💬', label: 'WhatsApp' },
  { key: 'website', icon: '🌐', label: 'Website' },
];

const VendorMyProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState(null);
  const [gallery, setGallery] = useState([]);

  const [showDescModal, setShowDescModal] = useState(false);
  const [descDraft, setDescDraft] = useState('');
  const [savingDesc, setSavingDesc] = useState(false);

  const [uploading, setUploading] = useState(false);

  const fetchVendor = async () => {
    try {
      setLoading(true);
      const res = await getVendorProfile();
      setVendor(res.data);
      setGallery(res.data?.gallery || []);
    } catch (err) {
      console.error('Failed to load vendor profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, []);

  // Redirect to login only after we've confirmed there's no vendor —
  // done in an effect, not during render, so it doesn't fight React's render cycle.
  useEffect(() => {
    if (!loading && !vendor) {
      navigate('/vendor/login');
    }
  }, [loading, vendor, navigate]);

  const openDescModal = () => {
    setDescDraft(vendor?.description || '');
    setShowDescModal(true);
  };

  const handleSaveDescription = async () => {
    if (savingDesc) return;
    setSavingDesc(true);
    try {
      const res = await editVendorProfile({ companyDesc: descDraft });
      setVendor((prev) => ({ ...prev, description: res.data?.vendor?.companyDesc ?? descDraft }));
      setShowDescModal(false);
    } catch (err) {
      console.error('Failed to update company description', err);
      alert('Failed to update company description');
    } finally {
      setSavingDesc(false);
    }
  };

  const handleGalleryFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('gallery', file);

    try {
      setUploading(true);
      await uploadGallery(formData);
      const res = await getVendorProfile();
      setGallery(res.data?.gallery || []);
    } catch (err) {
      console.error('Gallery upload failed', err);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="vendor-page">
        <Header currentPath={location.pathname} />
        <p className="vendor-loading">Loading your profile…</p>
      </div>
    );
  }

  if (!vendor) return null;

  const businessHours = Array.isArray(vendor.businessHours) && vendor.businessHours.length > 0
    ? vendor.businessHours
    : null;

  return (
    <div className="vendor-page">
      <Header currentPath={location.pathname} />

      <main className="vendor-main">
        {/* Page header */}
        <section className="vendor-page-header">
          <div className="vendor-page-header-content">
            <div>
              <h1 className="vendor-page-title">Vendor Profile & Business Settings</h1>
              <p className="vendor-page-subtitle">
                Manage business info, verification documents, certifications, and product listings.
              </p>
            </div>
            <div className="vendor-page-header-actions">
              <div className="vendor-avatar-lg">
                {vendor.logo ? <img src={vendor.logo} alt={vendor.businessName} /> : '👤'}
              </div>
              <button className="vendor-btn vendor-btn-primary" onClick={() => navigate('/vendor/profile/edit')}>
                Edit Profile
              </button>
            </div>
          </div>
        </section>

        <div className="vendor-grid">
          {/* LEFT COLUMN */}
          <aside className="vendor-col vendor-col-left">
            {/* Business Information */}
            <div className="vendor-card" style={{border:"1px solid white",borderRadius:"20px"}}>
              <div className="vendor-card-banner">
                <span className="vendor-card-banner-icon">🏢</span>
              </div>

              <div className="vendor-card-body">
                <h2 className="vendor-card-title">Business Information</h2>

                <div className="vendor-info-grid">
                  <div className="vendor-info-item">
                    <span className="vendor-info-label">Business Name</span>
                    <p className="vendor-info-value">{vendor.businessName || '—'}</p>
                  </div>
                  <div className="vendor-info-item">
                    <span className="vendor-info-label">Category</span>
                    <p className="vendor-info-value">{vendor.category || 'Not specified'}</p>
                  </div>
                </div>

                <div className="vendor-info-item">
                  <div className="vendor-info-label-row">
                    <span className="vendor-info-label">Description</span>
                    <button className="vendor-edit-link" onClick={openDescModal}>Edit</button>
                  </div>
                  <p className={`vendor-info-value ${!vendor.description ? 'vendor-info-empty' : ''}`}>
                    {vendor.description || 'No description added yet.'}
                  </p>
                </div>

                <div className="vendor-info-grid">
                  <div className="vendor-info-item">
                    <span className="vendor-info-label">GST Number</span>
                    <p className="vendor-info-value">{vendor.gstNumber || '—'}</p>
                  </div>
                  <div className="vendor-info-item">
                    <span className="vendor-info-label">Phone</span>
                    <p className="vendor-info-value">{vendor.phone || '—'}</p>
                  </div>
                </div>

                <div className="vendor-info-item">
                  <span className="vendor-info-label">Business Address</span>
                  <p className="vendor-info-value">{vendor.location || '—'}</p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="vendor-card"style={{border:"1px solid white",borderRadius:"20px"}}>
              <div className="vendor-card-header" style={{borderBottom:"1px solid white"}}>
                <h2 className="vendor-card-title">Business Hours</h2>
                <button className="vendor-edit-link" onClick={() => navigate('/vendor/profile/edit/hours')}>
                  Edit Hours
                </button>
              </div>

              {businessHours ? (
                <div className="vendor-hours">
                  {businessHours.map((h, i) => (
                    <div className="vendor-hours-row" key={i}>
                      <span className="vendor-day-label">{h.days || h.day || DAY_LABELS[i] || '—'}</span>
                      <span className="vendor-time-label">
                        {h.hours || (h.start && h.end ? `${h.start} - ${h.end}` : 'Closed')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="vendor-empty-note">
                  No business hours set yet — click "Edit Hours" to add them.
                </p>
              )}
            </div>

            {/* Social Media */}
            <div className="vendor-card"style={{border:"1px solid white",borderRadius:"20px"}}>
              <div className="vendor-card-header"style={{borderBottom:"1px solid white"}}>
                <h2 className="vendor-card-title">Social Media</h2>
                <button className="vendor-edit-link" onClick={() => navigate('/vendor/profile/edit')}>
                  Edit Links
                </button>
              </div>

              <div className="vendor-social-icons">
                {SOCIAL_ICONS.map(({ key, icon, label }) => {
                  const url = vendor.socialLinks?.[key];
                  return url ? (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`vendor-social-icon vendor-social-${key}`}
                      title={label}
                    >
                      {icon}
                    </a>
                  ) : (
                    <span
                      key={key}
                      className={`vendor-social-icon vendor-social-${key} vendor-social-disabled`}
                      title={`${label} not linked yet`}
                    >
                      {icon}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Gallery */}
            <div className="vendor-card"style={{border:"1px solid white",borderRadius:"20px"}}>
              <div className="vendor-card-header">
                <h2 className="vendor-card-title">Gallery</h2>
              </div>

              {gallery.length > 0 && (
                <div className="vendor-gallery-grid">
                  {gallery.map((src, i) => (
                    <img key={i} src={src} alt={`Gallery item ${i + 1}`} className="vendor-gallery-thumb" />
                  ))}
                </div>
              )}

              <input
                type="file"
                id="vendorGalleryInput"
                accept="image/*"
                onChange={handleGalleryFile}
                style={{ display: 'none' }}
              />
              <button
                className="vendor-btn vendor-btn-secondary vendor-full-width"
                onClick={() => document.getElementById('vendorGalleryInput').click()}
                disabled={uploading}
                style={{border:"1px solid white", borderRadius:"10px"}}
              >
                {uploading ? 'Uploading…' : '+ Add Photo'}
              </button>
            </div>

            {/* Products & Services Summary */}
            <div className="vendor-card"style={{border:"1px solid white",borderRadius:"20px"}}>
              <h2 className="vendor-card-title">Products & Services Summary</h2>

              <div className="vendor-summary-stats">
                <div className="vendor-stat-item">
                  <span className="vendor-stat-label">Total Products</span>
                  <span className="vendor-stat-value">{vendor.productCount ?? '—'}</span>
                </div>
                <div className="vendor-stat-item">
                  <span className="vendor-stat-label">Active Services</span>
                  <span className="vendor-stat-value">{vendor.serviceCount ?? '—'}</span>
                </div>
              </div>

              <button
                className="vendor-btn vendor-btn-primary vendor-full-width"
                onClick={() => navigate('/vendor/product')}
              >
                Manage Listings
              </button>
            </div>
          </aside>

          {/* RIGHT COLUMN */}
          <section className="vendor-col vendor-col-right">
            {/* Document & Compliance Management */}
            <div className="vendor-card"style={{border:"1px solid white",borderRadius:"20px"}}>
              <h2 className="vendor-card-title">Document & Compliance Management</h2>
              <p className="vendor-card-hint">
                Compliance document tracking is coming soon — this section is a preview of what's planned.
              </p>

              <div className="vendor-compliance-section">
                <h3 className="vendor-compliance-title">Verification Documents</h3>

                <div className="vendor-document-item">
                  <div className="vendor-document-header">
                    <div className="vendor-document-icon">📄</div>
                    <div className="vendor-document-info">
                      <h4 className="vendor-document-name">Business Registration Certificate</h4>
                      <p className="vendor-document-meta">No file uploaded yet</p>
                    </div>
                  </div>
                  <div className="vendor-document-actions">
                    <span className="vendor-status-badge vendor-status-pending">Not uploaded</span>
                  </div>
                </div>

                <div className="vendor-document-item vendor-upload-placeholder">
                  <div className="vendor-upload-area">
                    <div className="vendor-upload-icon">⬆️</div>
                    <h4 className="vendor-upload-title">Click to upload or drag and drop</h4>
                    <p className="vendor-upload-subtitle">PDF, JPG, PNG or other formats</p>
                    <button className="vendor-btn vendor-btn-secondary" disabled>Browse Files</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Marketplace Activity */}
            <div className="vendor-card"style={{border:"1px solid white",borderRadius:"20px"}}>
              <h2 className="vendor-card-title">Marketplace Activity</h2>

              <div className="vendor-activity-stats">
                <div className="vendor-activity-stat"style={{border:"1px solid white",borderRadius:"20px"}}>
                  <span className="vendor-activity-number">{vendor.pendingInquiries ?? 0}</span>
                  <span className="vendor-activity-name">Pending Inquiries</span>
                </div>
                <div className="vendor-activity-stat"style={{border:"1px solid white",borderRadius:"20px"}}>
                  <span className="vendor-activity-number">{vendor.openChats ?? 0}</span>
                  <span className="vendor-activity-name">Open Chats</span>
                </div>
              </div>

              <button
                className="vendor-btn vendor-btn-primary vendor-full-width"
                onClick={() => navigate('/vendor/quote')}
              >
                Open Quotes & Inquiries
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Edit Description Modal */}
      {showDescModal && (
        <div className="vendor-modal-overlay" onClick={() => setShowDescModal(false)}>
          <div className="vendor-modal" onClick={(e) => e.stopPropagation()}>
            <div className="vendor-modal-header">
              <h2>Edit Company Description</h2>
              <button className="vendor-modal-close" onClick={() => setShowDescModal(false)}>✕</button>
            </div>

            <textarea
              className="vendor-modal-textarea"
              rows={6}
              value={descDraft}
              onChange={(e) => setDescDraft(e.target.value)}
              placeholder="Describe your business…"
            />

            <div className="vendor-modal-footer">
              <button className="vendor-btn vendor-btn-secondary" onClick={() => setShowDescModal(false)}>
                Cancel
              </button>
              <button className="vendor-btn vendor-btn-primary" onClick={handleSaveDescription} disabled={savingDesc}>
                {savingDesc ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorMyProfile;
