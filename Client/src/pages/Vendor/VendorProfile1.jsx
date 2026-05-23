import React from 'react';
import { useState, useEffect } from 'react';
import {
  getVendorProfile,
  uploadGallery,
  uploadVendorMedia,
  addProject
} from '../../api/vendor.api';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/vendor/Header';
import './VendorProfile1.css';
import '../team/TeamMembers.css';
import '../../../globle.css'
import '../../index.css'
import "../team/TeamProfile.css"
import {
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import AddProjectForm from './forms/AddProjectForm';


const VendorProfile1 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const maxLength = 2000;
  const businessHours = [
    { days: 'Monday', hours: '08:00 - 18:00', days2: 'Tuesday', hours2: '08:00 - 18:00' },
    { days: 'Wednesday', hours: '08:00 - 18:00', days2: 'Thursday', hours2: '08:00 - 18:00' },
    { days: 'Friday', hours: '08:00 - 18:00', days2: 'Saturday', hours2: '09:00 - 14:00' },
    { days: 'Sunday', hours: 'Closed', days2: '', hours2: '' },
  ];

  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState(null);
  // const [showAddModal, setShowAddModal] = useState(false);
  const [newCompanyDesc, setNewCompanyDesc] = useState("");
  const [uploading, setUploading] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [media, setMedia] = useState([]);
  const [isEditingHours, setIsEditingHours] = useState(false);

  const projects = vendor?.projects || [];
  const vendorData = async () => {
    try {
      setLoading(true);
      const res = await getVendorProfile();
      setVendor(res.data);
      setGallery(res.data.gallery || []);
      setMedia(res.data.media || []);
    } catch (err) {
      alert("something went wrong", err.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    vendorData();
  }, []);


  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed!");
      return;
    }

    const formData = new FormData();
    formData.append("media", file);

    try {
      await uploadVendorMedia(formData); // upload file
      const res = await getVendorProfile(); // 🔹 refresh full team data
      setMedia(res.data.media || []);      // update media state
      setVendor(res.data);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  // Trigger hidden file input

  const triggerFileInput = () => document.getElementById("mediaInput").click();


  // upload media gallery
  //   // select file
  const handleFileSelect1 = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed!");
      return;
    }

    const formData = new FormData();
    formData.append("gallery", file);

    try {
      setUploading(true)
      await uploadGallery(formData); // upload file
      const res = await getVendorProfile(); // 🔹 refresh full team data
      setGallery(res.data.gallery || []);      // update gallery state
    } catch (err) {
      console.error("Upload failed:", err);
    }
    finally {
      setUploading(false);
    }
  };

  const triggerFileInput1 = () => document.getElementById("galleryInput").click();


  const handleAddProject = async (project) => {
    try {
      const formData = new FormData();
      formData.append("title", project.title);
      formData.append("desc", project.desc);

      if (project.image) {
        formData.append("image", project.image);
      } else if (project.imageUrl) {
        formData.append("imageUrl", project.imageUrl);
      }

      await addProject(formData);

      // refresh vendor data
      const res = await getVendorProfile();
      setVendor(res.data);

      setShowAddModal(false); // 🔑 close modal

    } catch (err) {
      console.error(err);
      alert("Failed to add project");
    }
  };

  const isLong = vendor?.companyDesc.length > maxLength;
  const shortText = vendor?.companyDesc.slice(0, maxLength) + "...";

  if (loading) return <p>Loading...</p>;
  if (!vendor) [
    navigate("/vendor/login")
  ];

  return (
    <div className="vendor-profile1">
      <Header currentPath={location.pathname} />

      <main className="profile1-main">

        {/* HEADER */}
        <section className="profile-header">
          <div className="profile-header-content">
            <div className="header-info">
              <div className="company-badge">
                <span className="badge-icon">⚡</span>
              </div>
              <h1 className="profile-company-name">{vendor?.businessName}</h1>
              <p className="profile-meta">
                {vendor?.category} | Founded {vendor?.createdAt?.slice(0, 4)}
              </p>
              <p className="profile-location">📍 {vendor?.location}</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/vendor/profile/edit')}
            >
              ✏️ Edit Profile
            </button>
          </div>
        </section>

        {/* MEDIA */}
        <section className="team-media">
          {/* add media */}
          {media.map((url, i) => (
            <img
              key={i}
              src={url} // full URL from API
              alt="Team Media"
            />
          ))}

          <div className="add-media" onClick={triggerFileInput}>
            <FaPlus />
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            id="mediaInput"
            style={{ display: "none" }}
            onChange={handleFileSelect}
            accept="image/*"
          />
        </section>

        {/* ABOUT */}
        {/* <section className="about-section card">
          <div className="section-header">
            <h2 className="section-title">About the Company</h2>
            <button
              className="edit-btn"
              onClick={() => navigate('/vendor/profile/edit/about')}
            >
              ✏️
            </button>
          </div>
          <p className="about-text">{vendor?.companyDesc}</p>
        </section> */}
        <section className="about-section card">
      <div className="section-header">
        <h2 className="section-title">About the Company</h2>
        <button
          className="edit-btn"
          onClick={() => navigate("/vendor/profile/edit/about")}
        >
          ✏️
        </button>
      </div>

      {/* Top View More / View Less (optional for UX) */}
      {isLong && expanded && (
        <button className="view-toggle top" onClick={() => setExpanded(false)}>
          View Less ▲
        </button>
      )}

      <p className="about-text">
        {expanded || !isLong ? vendor?.companyDesc : shortText}
      </p>

      {/* Bottom View More / View Less */}
      {isLong && (
        <button className="view-toggle bottom" onClick={() => setExpanded(!expanded)}>
          {expanded ? "View Less ▼" : "View More ▼"}
        </button>
      )}
    </section>
        {/* SERVICES */}
        <section className="services-section card">
          <div className="section-header">
            <h2 className="section-title">Services Offered</h2>
            <button
              className="add-btn"
              onClick={() => navigate("/vendor/profile/edit/services/add")}
            >
              + Add New Service
            </button>
          </div>
          <div className="services-grid">
            {vendor?.services?.length > 0 ? (
              vendor.services.map((service, index) => (
                <div key={index} className="service-card">
                  <div className="service-icon">{service.icon}</div>
                  <p className="service-label">{service.name}</p>
                </div>
              ))
            ) : (
              <p>No services added yet</p>
            )}
          </div>
        </section>

        {/* BUSINESS HOURS */}
        <section className="business-hours-section card">
          <div className="section-header">
            <h2 className="section-title">Business Hours</h2>
            <button
              className="edit-btn"
              onClick={() => navigate('/vendor/profile/edit/hours')}
            >
              ✏️ Edit Hours
            </button>
          </div>

          <div className="business-hours-grid">
            {businessHours.map((row, index) => (
              <div key={index} className="hours-row">
                <div className="hours-item">
                  <span className="day-name">{row.days}</span>
                  <span className="hours-time">{row.hours}</span>
                </div>
                {row.days2 && (
                  <div className="hours-item">
                    <span className="day-name">{row.days2}</span>
                    <span className="hours-time">{row.hours2}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section className="projects-section card">
          <div className="section-header">
            <h2 className="section-title">Projects Completed</h2>
            <button
              className="add-btn"
              onClick={() => navigate("/vendor/profile/edit/projects/add")}
            >
              + Add Project
            </button>
          </div>

          <div className="projects-grid">
            {vendor?.projects?.length > 0 ? (
              vendor.projects.map((project, index) => (
                <div key={index} className="project-card">
                  {/* show image if exists */}
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="project-image"
                    />
                  )}
                  <h4 className="project-title">{project.title}</h4>
                  <p className="project-description">{project.desc}</p>
                </div>
              ))
            ) : (
              <p>No projects added yet</p>
            )}
          </div>
        </section>

        {/* GALLERY */}
        <section className="team-section">
          <h2>Media Gallery</h2>

          {/* 🔹 TOP ROW – 4 ITEMS */}
          <div className="gallery-grid top-row">
            {gallery.map((g, i) => (
              <img
                key={i}
                src={g}
                alt="gallery"
                className="gallery-item image-placeholder"
              />
            ))}
            <button className="upload-tile" onClick={triggerFileInput1}>
              <FaPlus />
              <span>Upload Media</span>
              <input
                type="file"
                name="gallery"
                id="galleryInput"
                style={{ display: "none" }}
                onChange={handleFileSelect1}
                accept="image/*"
              />
            </button>
          </div>
        </section>

        {/* ADD MODAL */}
        {/* {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Add Project</h3>
                <button
                  className="close-button"
                  onClick={() => setShowAddModal(false)}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <label htmlFor="projectTitle">Project Title</label>
                <input
                  type="text"
                  id="projectTitle"
                  placeholder="Enter project title"
                />
                <label htmlFor="projectDesc">Description</label>
                <textarea
                  id="projectDesc"
                  placeholder="Enter project description"
                ></textarea>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary">Add Project</button>
              </div>
            </div>
          </div>
        )} */}

      </main>
    </div>
  );
};

export default VendorProfile1;

