import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../../components/vendor/Header";
import { getVendorProfile, editVendorProfile } from "../../../api/vendor.api";
import "./EditVendorProfile.css";

const EditVendorProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

 const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    foundedYear: "",
    location: "",
    logo: "",
    logoFile: null, // store actual file
  });

  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getVendorProfile();
        setVendor(res.data);

        setFormData({
          businessName: res.data.businessName || "",
          description: res.data.description || "",
          foundedYear: res.data?.createdAt?.slice(0, 10) || "",
          location: res.data.location || "",
          logo: res.data.logo || "",
          logoFile: null,
        });
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const previewUrl = URL.createObjectURL(file);
    setFormData({
      ...formData,
      logo: previewUrl,     // UI preview
      logoFile: file        // REAL FILE
    });
  }
};


  /* ================= SAVE PROFILE ================= */
  const handleSaveProfile = async () => {
    try {
      const data = new FormData();
      data.append("businessName", formData.businessName);
      data.append("description", formData.description);
      data.append("location", formData.location);
      data.append("foundedYear", formData.foundedYear);

      if (formData.logoFile) {
        data.append("logo", formData.logoFile); // send file if updated
      }

      const res = await editVendorProfile(data);
      console.log("Vendor updated:", res.data);

      // Optionally update localStorage
      localStorage.setItem("vendorProfile", JSON.stringify(res.data.vendor));

      // Navigate back to Vendor Home
      navigate("/vendor/home");
    } catch (err) {
      console.error("Failed to save profile:", err.response?.data || err.message);
      alert("Failed to save profile. Please try again.");
    }
  };

  
  if (loading) return <p>Loading...</p>;

  return (
    <div className="edit-vendor-page">
      <Header currentPath={location.pathname} />

      <main className="edit-vendor-main">
        <section className="edit-card">

          <h2 className="edit-title">Edit Vendor Profile</h2>

          {/* Logo Preview */}
          <div className="logo-preview">
            {formData.logo ? (
              <img src={formData.logo} alt="Vendor Logo" />
            ) : (
              <div className="logo-placeholder">LOGO</div>
            )}
          </div>

          {/* File Picker */}
          <input
            type="file"
            accept="image/*"
            className="input"
            onChange={handleLogoChange}
          />

          <input
            type="text"
            name="businessName"
            placeholder="Business Name"
            className="input"
            value={formData.businessName}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Business Description"
            className="input"
            rows="4"
            value={formData.description}
            onChange={handleChange}
          />

          
          <input
            type="text"
            name="location"
            className="input"
            value={formData.location}
            onChange={handleChange}
          />

         
          
          <div className="action-row">
            <button
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={handleSaveProfile}
            >
              Save Changes
            </button>
          </div>

        </section>
      </main>
    </div>
  );
};

export default EditVendorProfile;
