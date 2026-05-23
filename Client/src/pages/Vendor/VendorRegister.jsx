import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { vendorRegister } from "../../api/vendor.api";
import "./VendorRegister.css";

function VendorRegister() {

  // ✅ ADD NAVIGATE
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: "",
    category: "",
    email: "",
    gstNumber: "",
    password: "",
    location: "",
    description: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [verificationDoc, setVerificationDoc] = useState(null);
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null)
  const docInputRef = useRef(null);
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (loading) return; // ✅ prevent multiple clicks
    setLoading(true);
    try {
      const data = new FormData();

      // append text fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // append files
      data.append("logo", logo);
      data.append("banner", banner);
      data.append("verificationDoc", verificationDoc);

      await vendorRegister(data);

      alert("Vendor registered successfully");
      navigate("/vendor/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Registration failed");
    }
    finally {
      setLoading(false)
    }
  };


  return (
    <div className="vendor-register-page">
      <div className="vendor-register-glow"></div>

      <div className="vendor-register-card">
        {/* HEADER */}
        <h1 className="vendor-title">Vendor Registration</h1>
        <p className="vendor-subtitle">
          Join the Scylla Racing ecosystem as a verified vendor
        </p>

        {/* BUSINESS INFO */}
        <h2 className="section-title">Business Information</h2>

        <div className="form-group">
          <label>Business Name</label>
          <input type="text" name="businessName" placeholder="Enter your business name" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" placeholder="abc@scylla.com" onChange={handleChange} />
        </div>

        <div className="form-group password-group">
          <label>Password</label>

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a strong password"
              onChange={handleChange}
            />

            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <small className="password-hint">
            Must be at least 6 characters
          </small>
        </div>

        {/* upload logo and banner */}

        <div className="upload-row">
          {/* upload logo */}
          <div className="form-group">

            <div className="upload-box" onClick={() => logoInputRef.current.click()}>

              <input
                type="file"
                name="logo"
                ref={logoInputRef}
                hidden
                accept="image/png,image/jpeg"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setLogo(file);

                  }
                }}

              />


              {/* <span className="upload-icon">☁</span> */}
              <span className="upload-icon">
                {logo
                  ? "✅"
                  : "☁"}
              </span>
              {/* <p>Click to upload or drag and drop</p> */}
              <p>
                {logo
                  ? "logo uploaded"
                  : "Click to upload logo"
                }
              </p>
              <small>PNG, JPG up to 5MB</small>
            </div>
          </div>


          {/* <div className="upload-box">
            <span className="upload-icon">🖼</span>
            <p>Click to upload banner</p>
            <small>Recommended ratio 16:9</small>
          </div> */}

          <div className="form-group">

            <div className="upload-box" onClick={() => bannerInputRef.current.click()}>

              <input
                type="file"
                name="banner"
                ref={bannerInputRef}
                hidden
                accept="image/png,image/jpeg"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setBanner(file);

                  }
                }}

              />


              {/* <span className="upload-icon">☁</span> */}
              <span className="upload-icon">
                {banner
                  ? "✅"
                  : "🖼"}
              </span>
              {/* <p>Click to upload or drag and drop</p> */}
              <p>
                {banner
                  ? "banner uploaded"
                  : "Click to upload banner"}
              </p>
              <small>PNG, JPG up to 5MB</small>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Business Address</label>
          <textarea name="location" placeholder="city/state" onChange={handleChange}></textarea>
        </div>

        <div className="form-group">
          <label>Business Category</label>
          <select name="category" onChange={handleChange}>
            <option>Select a category</option>
            <option>Automotive Parts</option>
            <option>Racing Equipment</option>
            <option>Telemetry Solutions</option>
            <option>Maintenance Services</option>
          </select>
        </div>

        {/* GST / TAX */}
        <h2 className="section-title">GST / Tax Information</h2>

        <div className="form-group">
          <label>GST Number / Tax ID</label>
          <input type="text" name="gstNumber" placeholder="Enter GST number or Tax ID" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Business Discription</label>
          <textarea name="description" placeholder="your business desc" onChange={handleChange}></textarea>
        </div>

        {/* VERIFICATION */}
        <h2 className="section-title">Vendor Verification Documents</h2>

        {/* <div className="upload-box full">
          <span className="upload-icon">📄</span>
          <p>Upload Verification Documents</p>
          <small>
            Business registration, licenses, certifications<br />
            Documents will be reviewed and approved by the platform admin.
          </small>
        </div> */}

        <div className="upload-box secondary" onClick={() => docInputRef.current.click()}>
          <input
            type="file"
            name="verificationDoc"
            ref={docInputRef}
            hidden
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setVerificationDoc(e.target.files[0]);
              }
            }}
          />
          <span className="upload-icon">📄</span>
          {/* <p>Upload team verification documents</p> */}
          <p>
            {verificationDoc
              ? verificationDoc.name
              : "Upload team verification documents"}
          </p>
          <small>
            Business registration, licenses, certifications<br />
            Documents will be reviewed and approved by the platform admin.
          </small>
        </div>

        {/* SUBMIT */}
        <button
          className={`submit-btn ${loading ? "loading" : ""}`}
          onClick={handleSubmit}
          disabled={loading} // prevents clicks
        >
          {loading ? "⏳ Please wait..." : "🚀 Continue & Create Profile"}
        </button>

        <p className="login-link">
          Already have an account?{" "}
          <span
            className="link"
            onClick={() => navigate("/vendor/login")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default VendorRegister;
