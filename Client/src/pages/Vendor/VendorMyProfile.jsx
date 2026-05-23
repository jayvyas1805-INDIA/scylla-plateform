import React, { useState, useEffect } from 'react';

import { getVendorProfile, editVendorProfile, businessHours, uploadGallery } from '../../api/vendor.api';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/vendor/Header';
import './VendorMyProfile.css';

const VendorMyProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(null)
    const [vendor, setVendor] = useState(null)
    const location = useLocation();
    const [uploadedFiles, setUploadedFiles] = useState({
        workshopSafety: null,
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCompanyDesc, setNewCompanyDesc] = useState("");
    const [uploading, setUploading] = useState(false);
    const [gallery, setGallery] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileUpload = (e, docType) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedFiles({
                ...uploadedFiles,
                [docType]: file.name,
            });
        }
    };

    const vendorData = async () => {
        try {
            setLoading(true);
            const res = await getVendorProfile();
            setVendor(res.data)
            setGallery(res.data.gallery || [])
        } catch (err) {
            alert("something went wrong", err.message)
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        vendorData();

    }, [])




    const handleSubmit = async () => {
        const newDesc = {
            companyDesc: newCompanyDesc || "",
        };

        try {
            const res = await editVendorProfile(newDesc);
            setVendor([res.data.vendor]);
            setShowAddModal(false);

            setNewCompanyDesc("");
            vendorData();
        } catch (err) {
            console.error("cannot edit the description of company:", err.data);
            console.error(err.message)
            alert("Failed to edit company Desc");
        }
    };

    // edit Business Hour
    const handleHourChange = (day, field, value) => {
        setHours(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value
            }
        }));
    };


    const handleSaveHours = async () => {
        try {
            const formattedHours = Object.entries(hours).map(
                ([day, value]) => ({
                    day,
                    start: value.start,
                    end: value.end
                })
            );

            await businessHours(formattedHours);
            setIsEditingHours(false);
        } catch (err) {
            console.error("Failed to save hours", err);
        }
    };





    // upload media gallery
    // select file
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
            alert("cannot upload:", err.status)
        }
        finally {
            setUploading(false);
        }
    };


    const triggerFileInput1 = () => document.getElementById("galleryInput").click();

    if (loading) return <p>Loading...</p>
    if (!vendor)[
    navigate("/vendor/login")
  ]; 


    //   return (
    //     <div className="vendor-profile1">
    //       <Header currentPath={location.pathname} />

    //       <main className="profile1-main">
    //         {/* Profile Header */}
    //         <div className="profile-header-section">
    //           <div className="profile-header-content">
    //             <div className="profile-title-area">
    //               <h1 className="profile-title">Vendor Profile & Business Settings</h1>
    //               <p className="profile-subtitle">Manage business info, verification documents, certifications, and product listings.</p>
    //             </div>
    //             <div className="profile-header-actions">
    //               <div className="profile-avatar-header">👤</div>
    //               <button className="btn btn-primary">Edit Profile</button>
    //             </div>
    //           </div>
    //         </div>

    //         <div className="profile-container">
    //           {/* LEFT COLUMN */}
    //           <aside className="profile-left-column">
    //             {/* Business Information Card */}
    //             <div className="profile-card business-info-card">
    //               <div className="card-image-header">
    //                 <div className="company-image-placeholder">
    //                   <span className="company-icon">🏢</span>
    //                 </div>
    //               </div>

    //               <div className="card-content">
    //                 <h2 className="card-title">Business Information</h2>

    //                 {/* Business Name & Category */}
    //                 <div className="info-grid">
    //                   <div className="info-item">
    //                     <label className="info-label">Business Name</label>
    //                     <p className="info-value">Apex Racing Solutions</p>
    //                   </div>
    //                   <div className="info-item">
    //                     <label className="info-label">Category</label>
    //                     <div className="category-select">
    //                       <select className="select-input">
    //                         <option>Fabrication & Engineering</option>
    //                         <option>Services</option>
    //                         <option>Products</option>
    //                       </select>
    //                     </div>
    //                   </div>
    //                 </div>

    //                 {/* Tagline */}
    //                 <div className="info-item">
    //                   <label className="info-label">Tagline</label>
    //                   <p className="info-value">Precision Engineering for Championship Performance</p>
    //                 </div>

    //                 {/* GST & Phone */}
    //                 <div className="info-grid">
    //                   <div className="info-item">
    //                     <label className="info-label">GST Number</label>
    //                     <p className="info-value">29GGGGG0G1314826</p>
    //                   </div>
    //                   <div className="info-item">
    //                     <label className="info-label">Phone</label>
    //                     <p className="info-value">+91 98765 43210</p>
    //                   </div>
    //                 </div>

    //                 {/* Business Address */}
    //                 <div className="info-item">
    //                   <label className="info-label">Business Address</label>
    //                   <p className="info-value">Workshop 12, Industrial Estate, Coimbatore, Tamil Nadu 641014</p>
    //                 </div>
    //               </div>
    //             </div>

    //             {/* Business Hours Card */}
    //             <div className="profile-card">
    //               <div className="card-header">
    //                 <h2 className="card-title">Business Hours</h2>
    //                 <a href="#" className="edit-link">Edit Hours</a>
    //               </div>

    //               <div className="business-hours">
    //                 <div className="hours-row">
    //                   <div className="hours-col">
    //                     <span className="day-label">Monday -</span>
    //                     <span className="time-label">9:00 AM - 6:00 PM</span>
    //                   </div>
    //                   <div className="hours-col">
    //                     <span className="day-label">Saturday</span>
    //                     <span className="time-label">9:00 AM - 2:00 PM</span>
    //                   </div>
    //                 </div>
    //                 <div className="hours-row">
    //                   <div className="hours-col">
    //                     <span className="day-label">Sunday</span>
    //                     <span className="time-label">Closed</span>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>

    //             {/* Social Media Card */}
    //             <div className="profile-card">
    //               <div className="card-header">
    //                 <h2 className="card-title">Social Media</h2>
    //                 <a href="#" className="edit-link">Edit Links</a>
    //               </div>

    //               <div className="social-media-icons">
    //                 <a href="#" className="social-icon instagram" title="Instagram">📷</a>
    //                 <a href="#" className="social-icon youtube" title="YouTube">▶️</a>
    //                 <a href="#" className="social-icon linkedin" title="LinkedIn">in</a>
    //                 <a href="#" className="social-icon whatsapp" title="WhatsApp">💬</a>
    //                 <a href="#" className="social-icon website" title="Website">🌐</a>
    //               </div>
    //             </div>

    //             {/* Products & Services Summary */}
    //             <div className="profile-card">
    //               <h2 className="card-title">Products & Services Summary</h2>

    //               <div className="summary-stats">
    //                 <div className="stat-item">
    //                   <span className="stat-label">Total Products</span>
    //                   <span className="stat-value">24</span>
    //                 </div>
    //                 <div className="stat-item">
    //                   <span className="stat-label">Active Services</span>
    //                   <span className="stat-value">8</span>
    //                 </div>
    //               </div>

    //               <div className="summary-stats">
    //                 <div className="stat-item">
    //                   <span className="stat-label">Draft Listings</span>
    //                   <span className="stat-value">3</span>
    //                 </div>
    //                 <div className="stat-item">
    //                   <span className="stat-label">Requests Received</span>
    //                   <span className="stat-value">12</span>
    //                 </div>
    //               </div>

    //               <button className="btn btn-primary full-width">Manage Listings</button>
    //             </div>
    //           </aside>

    //           {/* RIGHT COLUMN */}
    //           <section className="profile-right-column">
    //             {/* Document & Compliance Management */}
    //             <div className="profile-card">
    //               <h2 className="card-title">Document & Compliance Management</h2>

    //               {/* Verification Documents */}
    //               <div className="compliance-section">
    //                 <h3 className="compliance-title">Verification Documents</h3>

    //                 {/* Business Registration Certificate */}
    //                 <div className="document-item">
    //                   <div className="document-header">
    //                     <div className="document-icon">📄</div>
    //                     <div className="document-info">
    //                       <h4 className="document-name">Business Registration Certificate</h4>
    //                       <p className="document-meta">business_registration_v2.pdf • Uploaded: 2024-01-15 | Version 2.0</p>
    //                     </div>
    //                   </div>
    //                   <div className="document-actions">
    //                     <span className="status-badge verified">✓ Verified</span>
    //                     <button className="action-btn" title="Download">⬇️</button>
    //                     <button className="action-btn" title="Preview">👁️</button>
    //                     <button className="action-btn delete" title="Delete">🗑️</button>
    //                   </div>
    //                 </div>

    //                 {/* GST Certificate */}
    //                 <div className="document-item">
    //                   <div className="document-header">
    //                     <div className="document-icon">📄</div>
    //                     <div className="document-info">
    //                       <h4 className="document-name">GST Certificate</h4>
    //                       <p className="document-meta">gst_certificate_2024.pdf • Uploaded: 2024-01-10 | Version 1.0</p>
    //                     </div>
    //                   </div>
    //                   <div className="document-actions">
    //                     <span className="status-badge expiring">⚠️ Expires in 80 days</span>
    //                     <button className="action-btn" title="Download">⬇️</button>
    //                     <button className="action-btn" title="Preview">👁️</button>
    //                     <button className="action-btn delete" title="Delete">🗑️</button>
    //                   </div>
    //                 </div>

    //                 {/* Workshop Safety Certificate - Upload Area */}
    //                 <div className="document-item upload-placeholder">
    //                   <div className="upload-area">
    //                     <div className="upload-icon">⬆️</div>
    //                     <h4 className="upload-title">Click to upload or drag and drop</h4>
    //                     <p className="upload-subtitle">PDF, JPG, PNG or other formats</p>
    //                     <button className="btn btn-secondary">Browse Files</button>
    //                   </div>
    //                   <input
    //                     type="file"
    //                     className="file-input"
    //                     onChange={(e) => handleFileUpload(e, 'workshopSafety')}
    //                     style={{ display: 'none' }}
    //                   />
    //                 </div>
    //               </div>
    //             </div>

    //             {/* Expiry Reminders */}
    //             <div className="profile-card">
    //               <div className="card-header">
    //                 <h2 className="card-title">Expiry Reminders</h2>
    //                 <label className="checkbox-toggle">
    //                   <input type="checkbox" defaultChecked />
    //                   <span className="toggle-label">Enable Renewal Alerts</span>
    //                 </label>
    //               </div>

    //               <div className="expiry-items">
    //                 <div className="expiry-item critical">
    //                   <span className="expiry-name">Workshop Safety Certificate</span>
    //                   <span className="expiry-date">Expires in 12 days</span>
    //                 </div>
    //                 <div className="expiry-item warning">
    //                   <span className="expiry-name">GST Certificate</span>
    //                   <span className="expiry-date">Expires in 80 days</span>
    //                 </div>
    //                 <div className="expiry-item info">
    //                   <span className="expiry-name">Business Registration</span>
    //                   <span className="expiry-date">Valid for 2 years</span>
    //                 </div>
    //               </div>
    //             </div>

    //             {/* Professional Certifications */}
    //             <div className="profile-card">
    //               <h2 className="card-title">Professional Certifications</h2>

    //               <div className="certifications-grid">
    //                 <div className="certification-card">
    //                   <div className="cert-icon">●</div>
    //                   <h4 className="cert-name">FMSCI Scrutineer Training</h4>
    //                   <p className="cert-status">Level 2 Certified</p>
    //                   <p className="cert-date">Valid until: Dec 2025</p>
    //                 </div>

    //                 <div className="certification-card">
    //                   <div className="cert-icon">●</div>
    //                   <h4 className="cert-name">ISO Workshop Safety</h4>
    //                   <p className="cert-status">ISO 45001:2018</p>
    //                   <p className="cert-date">Valid until: Jan 2025</p>
    //                 </div>
    //               </div>
    //             </div>

    //             {/* Marketplace Activity */}
    //             <div className="profile-card">
    //               <h2 className="card-title">Marketplace Activity</h2>

    //               <div className="activity-stats">
    //                 <div className="activity-stat">
    //                   <span className="stat-number">7</span>
    //                   <span className="stat-name">Pending Inquiries</span>
    //                 </div>
    //                 <div className="activity-stat">
    //                   <span className="stat-number">3</span>
    //                   <span className="stat-name">Open Chats</span>
    //                 </div>
    //                 <div className="activity-stat">
    //                   <span className="stat-number">5</span>
    //                   <span className="stat-name">Quotes Sent</span>
    //                 </div>
    //                 <div className="activity-stat">
    //                   <span className="stat-number">2</span>
    //                   <span className="stat-name">Flagged Items</span>
    //                 </div>
    //               </div>

    //               <button className="btn btn-primary full-width">Open Marketplace Dashboard</button>
    //             </div>

    //             {/* Add New Document Type */}
    //             <div className="profile-card add-document-card">
    //               <div className="add-document-content">
    //                 <span className="add-icon">+</span>
    //                 <h3 className="add-title">Add New Document Type</h3>
    //                 <p className="add-subtitle">Upload additional compliance documents</p>
    //               </div>
    //             </div>
    //           </section>
    //         </div>
    //       </main>
    //     </div>
    //   );
    // };



    return (
        <div className="vendor-profile1">
            <Header currentPath={location.pathname} />

            <main className="profile1-main">
                {/* Profile Header */}
                <div className="profile-header-section">
                    <div className="profile-header-content">
                        <div className="profile-title-area">
                            <h1 className="profile-title">Vendor Profile & Business Settings</h1>
                            <p className="profile-subtitle">Manage business info, verification documents, certifications, and product listings.</p>
                        </div>
                        <div className="profile-header-actions">
                            <div className="profile-avatar-header">👤</div>
                            <button className="btn btn-primary" onClick={() => navigate('/vendor/profile/edit')}>Edit Profile</button>
                        </div>
                    </div>
                </div>

                <div className="profile-container">
                    {/* LEFT COLUMN */}
                    <aside className="profile-left-column">
                        {/* Business Information Card */}
                        <div className="profile-card business-info-card">
                            <div className="card-image-header">
                                <div className="company-image-placeholder">
                                    <span className="company-icon">🏢</span>
                                </div>
                            </div>

                            <div className="card-content">
                                <h2 className="card-title">Business Information</h2>

                                {/* Business Name & Category */}
                                <div className="info-grid">
                                    <div className="info-item">
                                        <label className="info-label">Business Name</label>
                                        <p className="info-value">{vendor?.businessName}</p>
                                    </div>
                                    <div className="info-item">
                                        <label className="info-label">Category</label>
                                        <div className="category-select">
                                            <select className="select-input">
                                                <option>Fabrication & Engineering</option>
                                                <option>Services</option>
                                                <option>Products</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Tagline */}
                                <div className="info-item">
                                    <label className="info-label">Tagline</label>
                                    <p className="info-value">{vendor?.description}</p>
                                </div>

                                {/* GST & Phone */}
                                <div className="info-grid">
                                    <div className="info-item">
                                        <label className="info-label">GST Number</label>
                                        <p className="info-value">{vendor?.gstNumber}</p>
                                    </div>
                                    <div className="info-item">
                                        <label className="info-label">Phone</label>
                                        <p className="info-value">{vendor?.phone}</p>
                                    </div>
                                </div>

                                {/* Business Address */}
                                <div className="info-item">
                                    <label className="info-label">Business Address</label>
                                    <p className="info-value">{vendor?.location}</p>
                                </div>
                            </div>
                        </div>

                        {/* Business Hours Card */}
                        <div className="profile-card">
                            <div className="card-header">
                                <h2 className="card-title">Business Hours</h2>
                                <a href="#" className="edit-link">Edit Hours</a>
                            </div>

                            <div className="business-hours">
                                <div className="hours-row">
                                    <div className="hours-col">
                                        <span className="day-label">Monday -</span>
                                        <span className="time-label">9:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className="hours-col">
                                        <span className="day-label">Saturday</span>
                                        <span className="time-label">9:00 AM - 2:00 PM</span>
                                    </div>
                                </div>
                                <div className="hours-row">
                                    <div className="hours-col">
                                        <span className="day-label">Sunday</span>
                                        <span className="time-label">Closed</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media Card */}
                        <div className="profile-card">
                            <div className="card-header">
                                <h2 className="card-title">Social Media</h2>
                                <a href="#" className="edit-link">Edit Links</a>
                            </div>

                            <div className="social-media-icons">
                                <a href="#" className="social-icon instagram" title="Instagram">📷</a>
                                <a href="#" className="social-icon youtube" title="YouTube">▶️</a>
                                <a href="#" className="social-icon linkedin" title="LinkedIn">in</a>
                                <a href="#" className="social-icon whatsapp" title="WhatsApp">💬</a>
                                <a href="#" className="social-icon website" title="Website">🌐</a>
                            </div>
                        </div>

                        {/* Products & Services Summary */}
                        <div className="profile-card">
                            <h2 className="card-title">Products & Services Summary</h2>

                            <div className="summary-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Total Products</span>
                                    <span className="stat-value">24</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Active Services</span>
                                    <span className="stat-value">8</span>
                                </div>
                            </div>

                            <div className="summary-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Draft Listings</span>
                                    <span className="stat-value">3</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Requests Received</span>
                                    <span className="stat-value">12</span>
                                </div>
                            </div>

                            <button className="btn btn-primary full-width">Manage Listings</button>
                        </div>
                    </aside>

                    {/* RIGHT COLUMN */}
                    <section className="profile-right-column">
                        {/* Document & Compliance Management */}
                        <div className="profile-card">
                            <h2 className="card-title">Document & Compliance Management</h2>

                            {/* Verification Documents */}
                            <div className="compliance-section">
                                <h3 className="compliance-title">Verification Documents</h3>

                                {/* Business Registration Certificate */}
                                <div className="document-item">
                                    <div className="document-header">
                                        <div className="document-icon">📄</div>
                                        <div className="document-info">
                                            <h4 className="document-name">Business Registration Certificate</h4>
                                            <p className="document-meta">business_registration_v2.pdf • Uploaded: 2024-01-15 | Version 2.0</p>
                                        </div>
                                    </div>
                                    <div className="document-actions">
                                        <span className="status-badge verified">✓ Verified</span>
                                        <button className="action-btn" title="Download">⬇️</button>
                                        <button className="action-btn" title="Preview">👁️</button>
                                        <button className="action-btn delete" title="Delete">🗑️</button>
                                    </div>
                                </div>

                                {/* GST Certificate */}
                                <div className="document-item">
                                    <div className="document-header">
                                        <div className="document-icon">📄</div>
                                        <div className="document-info">
                                            <h4 className="document-name">GST Certificate</h4>
                                            <p className="document-meta">gst_certificate_2024.pdf • Uploaded: 2024-01-10 | Version 1.0</p>
                                        </div>
                                    </div>
                                    <div className="document-actions">
                                        <span className="status-badge expiring">⚠️ Expires in 80 days</span>
                                        <button className="action-btn" title="Download">⬇️</button>
                                        <button className="action-btn" title="Preview">👁️</button>
                                        <button className="action-btn delete" title="Delete">🗑️</button>
                                    </div>
                                </div>

                                {/* Workshop Safety Certificate - Upload Area */}
                                <div className="document-item upload-placeholder">
                                    <div className="upload-area">
                                        <div className="upload-icon">⬆️</div>
                                        <h4 className="upload-title">Click to upload or drag and drop</h4>
                                        <p className="upload-subtitle">PDF, JPG, PNG or other formats</p>
                                        <button className="btn btn-secondary">Browse Files</button>
                                    </div>
                                    <input
                                        type="file"
                                        className="file-input"
                                        onChange={(e) => handleFileUpload(e, 'workshopSafety')}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Expiry Reminders */}
                        <div className="profile-card">
                            <div className="card-header">
                                <h2 className="card-title">Expiry Reminders</h2>
                                <label className="checkbox-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-label">Enable Renewal Alerts</span>
                                </label>
                            </div>

                            <div className="expiry-items">
                                <div className="expiry-item critical">
                                    <span className="expiry-name">Workshop Safety Certificate</span>
                                    <span className="expiry-date">Expires in 12 days</span>
                                </div>
                                <div className="expiry-item warning">
                                    <span className="expiry-name">GST Certificate</span>
                                    <span className="expiry-date">Expires in 80 days</span>
                                </div>
                                <div className="expiry-item info">
                                    <span className="expiry-name">Business Registration</span>
                                    <span className="expiry-date">Valid for 2 years</span>
                                </div>
                            </div>
                        </div>

                        {/* Professional Certifications */}
                        <div className="profile-card">
                            <h2 className="card-title">Professional Certifications</h2>

                            <div className="certifications-grid">
                                <div className="certification-card">
                                    <div className="cert-icon">●</div>
                                    <h4 className="cert-name">FMSCI Scrutineer Training</h4>
                                    <p className="cert-status">Level 2 Certified</p>
                                    <p className="cert-date">Valid until: Dec 2025</p>
                                </div>

                                <div className="certification-card">
                                    <div className="cert-icon">●</div>
                                    <h4 className="cert-name">ISO Workshop Safety</h4>
                                    <p className="cert-status">ISO 45001:2018</p>
                                    <p className="cert-date">Valid until: Jan 2025</p>
                                </div>
                            </div>
                        </div>

                        {/* Marketplace Activity */}
                        <div className="profile-card">
                            <h2 className="card-title">Marketplace Activity</h2>

                            <div className="activity-stats">
                                <div className="activity-stat">
                                    <span className="stat-number">7</span>
                                    <span className="stat-name">Pending Inquiries</span>
                                </div>
                                <div className="activity-stat">
                                    <span className="stat-number">3</span>
                                    <span className="stat-name">Open Chats</span>
                                </div>
                                <div className="activity-stat">
                                    <span className="stat-number">5</span>
                                    <span className="stat-name">Quotes Sent</span>
                                </div>
                                <div className="activity-stat">
                                    <span className="stat-number">2</span>
                                    <span className="stat-name">Flagged Items</span>
                                </div>
                            </div>

                            <button className="btn btn-primary full-width">Open Marketplace Dashboard</button>
                        </div>

                        {/* Add New Document Type */}
                        <div className="profile-card add-document-card">
                            <div className="add-document-content">
                                <span className="add-icon">+</span>
                                <h3 className="add-title">Add New Document Type</h3>
                                <p className="add-subtitle">Upload additional compliance documents</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default VendorMyProfile;
