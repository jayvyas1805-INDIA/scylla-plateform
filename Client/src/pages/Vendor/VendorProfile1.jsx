import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getVendorProfile,
  uploadGallery,
  uploadVendorMedia,
} from '../../api/vendor.api';
import Header from '../../components/vendor/Header';
import { FaPlus } from 'react-icons/fa';
import './VendorProfile1.css';

const DESCRIPTION_LIMIT = 400;

const VendorProfile1 = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [media, setMedia] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const fetchVendor = async () => {
    try {
      setLoading(true);
      const res = await getVendorProfile();
      setVendor(res.data);
      setGallery(res.data?.gallery || []);
      setMedia(res.data?.media || []);
    } catch (err) {
      console.error('Failed to load vendor profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, []);

  useEffect(() => {
    if (!loading && !vendor) {
      navigate('/vendor/login');
    }
  }, [loading, vendor, navigate]);

  const handleMediaSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed!');
      return;
    }

    const formData = new FormData();
    formData.append('media', file);

    try {
      setUploadingMedia(true);
      await uploadVendorMedia(formData);
      const res = await getVendorProfile();
      setMedia(res.data?.media || []);
      setVendor(res.data);
    } catch (err) {
      console.error('Media upload failed', err);
      alert('Failed to upload media');
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleGallerySelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed!');
      return;
    }

    const formData = new FormData();
    formData.append('gallery', file);

    try {
      setUploadingGallery(true);
      await uploadGallery(formData);
      const res = await getVendorProfile();
      setGallery(res.data?.gallery || []);
    } catch (err) {
      console.error('Gallery upload failed', err);
      alert('Failed to upload image');
    } finally {
      setUploadingGallery(false);
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="vendor-profile-page">
        <Header currentPath={location.pathname} />
        <p className="vendor-profile-loading">Loading profile…</p>
      </div>
    );
  }

  if (!vendor) return null;

  const description = vendor.companyDesc || vendor.description || '';
  const isLong = description.length > DESCRIPTION_LIMIT;
  const visibleDescription = expanded || !isLong
    ? description
    : `${description.slice(0, DESCRIPTION_LIMIT)}...`;

  const businessHours = Array.isArray(vendor.businessHours) && vendor.businessHours.length > 0
    ? vendor.businessHours
    : null;

  return (
    <div className="vendor-profile-page">
      <Header currentPath={location.pathname} />

      <main className="vendor-profile-main">
        {/* HEADER */}
        <section className="vendor-profile-hero">
          <div className="vendor-profile-hero-content">
            <div className="vendor-profile-hero-info">
              <div className="vendor-profile-badge">
                {vendor.logo ? <img src={vendor.logo} alt={vendor.businessName} /> : <span>⚡</span>}
              </div>
              <h1 className="vendor-profile-name">{vendor.businessName || 'Your Business'}</h1>
              <p className="vendor-profile-meta">
                {vendor.category || 'Vendor'}
                {vendor.createdAt && ` · Founded ${vendor.createdAt.slice(0, 4)}`}
              </p>
              <p className="vendor-profile-location">📍 {vendor.location || 'Location not set'}</p>
            </div>
            <button className="vendor-profile-btn vendor-profile-btn-primary" onClick={() => navigate('/vendor/profile/edit')}>
              ✏️ Edit Profile
            </button>
          </div>
        </section>

        {/* MEDIA STRIP */}
        <section className="vendor-profile-media-strip">
          {media.map((url, i) => (
            <img key={i} src={url} alt={`Media ${i + 1}`} className="vendor-profile-media-thumb" />
          ))}

          <input
            type="file"
            id="vendorMediaInput"
            style={{ display: 'none' }}
            onChange={handleMediaSelect}
            accept="image/*"
          />
          <button
            className="vendor-profile-add-media"
            onClick={() => document.getElementById('vendorMediaInput').click()}
            disabled={uploadingMedia}
            aria-label="Add media"
          >
            <FaPlus />
          </button>
        </section>

        {/* ABOUT */}
        <section className="vendor-profile-card">
          <div className="vendor-profile-card-header">
            <h2 className="vendor-profile-card-title">About the Company</h2>
            <button className="vendor-profile-edit-link" onClick={() => navigate('/vendor/profile/edit/about')}>
              ✏️ Edit
            </button>
          </div>

          <p className={`vendor-profile-about-text ${!description ? 'vendor-profile-empty' : ''}`}>
            {description ? visibleDescription : 'No company description added yet.'}
          </p>

          {isLong && (
            <button className="vendor-profile-view-toggle" onClick={() => setExpanded(!expanded)}>
              {expanded ? 'View Less ▲' : 'View More ▼'}
            </button>
          )}
        </section>

        {/* SERVICES */}
        <section className="vendor-profile-card">
          <div className="vendor-profile-card-header">
            <h2 className="vendor-profile-card-title">Services Offered</h2>
            <button className="vendor-profile-add-link" onClick={() => navigate('/vendor/profile/edit/services/add')}>
              + Add New Service
            </button>
          </div>

          {vendor.services?.length > 0 ? (
            <div className="vendor-profile-services-grid">
              {vendor.services.map((service, index) => (
                <div key={index} className="vendor-profile-service-card">
                  <div className="vendor-profile-service-icon">{service.icon || '🔧'}</div>
                  <p className="vendor-profile-service-label">{service.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="vendor-profile-empty-note">No services added yet.</p>
          )}
        </section>

        {/* BUSINESS HOURS */}
        <section className="vendor-profile-card">
          <div className="vendor-profile-card-header">
            <h2 className="vendor-profile-card-title">Business Hours</h2>
            <button className="vendor-profile-edit-link" onClick={() => navigate('/vendor/profile/edit/hours')}>
              ✏️ Edit Hours
            </button>
          </div>

          {businessHours ? (
            <div className="vendor-profile-hours-grid">
              {businessHours.map((h, i) => (
                <div key={i} className="vendor-profile-hours-item">
                  <span className="vendor-profile-day-name">{h.days || h.day || `Day ${i + 1}`}</span>
                  <span className="vendor-profile-hours-time">
                    {h.hours || (h.start && h.end ? `${h.start} - ${h.end}` : 'Closed')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="vendor-profile-empty-note">
              No business hours set yet — click "Edit Hours" to add them.
            </p>
          )}
        </section>

        {/* PROJECTS */}
        <section className="vendor-profile-card">
          <div className="vendor-profile-card-header">
            <h2 className="vendor-profile-card-title">Projects Completed</h2>
            <button className="vendor-profile-add-link" onClick={() => navigate('/vendor/profile/edit/projects/add')}>
              + Add Project
            </button>
          </div>

          {vendor.projects?.length > 0 ? (
            <div className="vendor-profile-projects-grid">
              {vendor.projects.map((project, index) => (
                <div key={index} className="vendor-profile-project-card">
                  {project.image && (
                    <img src={project.image} alt={project.title} className="vendor-profile-project-image" />
                  )}
                  <h4 className="vendor-profile-project-title">{project.title}</h4>
                  <p className="vendor-profile-project-desc">{project.desc}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="vendor-profile-empty-note">No projects added yet.</p>
          )}
        </section>

        {/* GALLERY */}
        <section className="vendor-profile-card">
          <h2 className="vendor-profile-card-title">Media Gallery</h2>

          <div className="vendor-profile-gallery-grid">
            {gallery.map((src, i) => (
              <img key={i} src={src} alt={`Gallery ${i + 1}`} className="vendor-profile-gallery-item" />
            ))}

            <input
              type="file"
              id="vendorGalleryInput"
              style={{ display: 'none' }}
              onChange={handleGallerySelect}
              accept="image/*"
            />
            <button
              className="vendor-profile-upload-tile"
              onClick={() => document.getElementById('vendorGalleryInput').click()}
              disabled={uploadingGallery}
            >
              <FaPlus />
              <span>{uploadingGallery ? 'Uploading…' : 'Upload Media'}</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VendorProfile1;
