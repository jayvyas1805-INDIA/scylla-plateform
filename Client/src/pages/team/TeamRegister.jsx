import React from "react";
import { useNavigate } from "react-router-dom";
import "./TeamRegister.css";
import { teamRegister } from "../../api/team.api";
import { useState } from "react";
import { useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";



function TeamRegister() {

  // ✅ ADD NAVIGATE
  const navigate = useNavigate();

  const [location, setLocation] = useState({
    address: "",
    lat: null,
    lng: null
  });


  const [showMap, setShowMap] = useState(false);


  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    email: "",
    contactNo: "",
    category: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);


  const [logo, setLogo] = useState(null);
  const [verificationDoc, setVerificationDoc] = useState(null);
  const logoInputRef = useRef(null);
  const docInputRef = useRef(null);
  // const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(false)


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async () => {
    if (loading) return; // ✅ prevent multiple clicks
    if (
      location.lat === null ||
      location.lng === null ||
      location.address.trim() === ""
    ) {
      alert("Please select your location from the map");
      return;
    }

    if (!formData.category) {
      alert("Please select team category");
      return;
    }


    if (!logo) {
      alert("Please upload team logo");
      return;
    }

    if (!verificationDoc) {
      alert("Please upload verification document");
      return;
    }

    setLoading(true);
    try {

      const data = new FormData();

      // append text fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // append files
      data.append("logo", logo);
      data.append("verificationDoc", verificationDoc);
      data.append("location", JSON.stringify({
        address: location.address,
        lat: location.lat,
        lng: location.lng
      }));


      console.log("LOCATION STATE:", location);

      for (let pair of data.entries()) {
        console.log(pair[0], pair[1]);
      }


      await teamRegister(data);

      alert("Team registered successfully");
      navigate("/team/login");
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);
      console.log("MESSAGE:", err.message);

      alert(
        err.response?.data?.error ||
        err.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false)
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();

        setLocation({
          address: data.display_name || "",
          lat,
          lng
        });



      }
    });

    return null;
  };



  return (
    <div className="team-register-page">
      <div className="team-register-glow"></div>

      <div className="team-register-card">
        {/* HEADER */}
        <h1 className="team-title">Team Registration</h1>
        <p className="team-subtitle">
          Join the future of motorsport analytics
        </p>

        {/* TEAM DETAILS */}
        <div className="form-group">
          <label>Team Name</label>
          <input type="text" name='name' placeholder="Enter your team name" onChange={handleChange} />
        </div>
        {/* 
        <div className="form-group">
          <label>Upload Team Logo</label>
          <div className="upload-box">
            <span className="upload-icon">☁</span>
            <p>Click to upload or drag and drop</p>
            <small>PNG, JPG up to 5MB</small>
          </div>
        </div> */}
        <div className="form-group">
          <label>Upload Team Logo</label>
          <div className="upload-box" onClick={() => logoInputRef.current.click()}>
            <label>Upload Team Logo</label>
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
                ? logo.name
                : "Click to upload or drag and drop"}
            </p>
            <small>PNG, JPG up to 5MB</small>
          </div>
        </div>


        <div className="form-group">
          <label>Team Tagline</label>
          <input type="text" name="tagline" placeholder="Enter your team tagline" onChange={handleChange} />
        </div>

        {/* CONTACT INFO */}
        <h2 className="section-title">Contact Information</h2>

        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" placeholder="team@example.com" onChange={handleChange} />
        </div>

        {/* password input start */}
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
        {/* password input closed */}

        <div className="form-group">
          <label>Mobile Number</label>
          <input type="tel" name="contactNo" placeholder="+1 (555) 123-4567" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Team Address</label>

          <textarea
            name="address"
            placeholder="Select address from map"
            value={location.address}
            readOnly
          />


          <button
            type="button"
            className="map-toggle-btn"
            onClick={() => setShowMap(!showMap)}
          >
            📍 Pick from Map
          </button>

          {showMap && (
            <MapContainer
              center={[23.0225, 72.5714]}
              zoom={13}
              style={{ height: "300px", marginTop: "10px" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <MapClickHandler />   {/* ✅ THIS IS IMPORTANT */}

              {location.lat && (
                <Marker position={[location.lat, location.lng]} />
              )}
            </MapContainer>
          )}

        </div>


        <div className="form-group">
          <label>Team Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="">Select your category</option>
            <option value="Formula Racing">Formula Racing</option>
            <option value="Rally">Rally</option>
            <option value="Endurance">Endurance</option>
            <option value="Motocross">Motocross</option>
          </select>

          {/* <option value="FSAE">FSAE</option>
            <option value="EV">EV</option>
            <option value="BAJA">BAJA</option>
            <option value="Moto">Moto</option>
            <option value="GoKart">GoKart</option>
            <option value="Drag">Drag</option>
            <option value="Drift">Drift</option>
            <option value="RC">RC</option>
            <option value="Karting">Karting</option>
            <option value="Robotics">Robotics</option>
            <option value="Other">Other</option> */}

        </div>

        {/* VERIFICATION */}
        <h2 className="section-title">Team Verification</h2>

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
            Documents will be verified by the admin before approval
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
            onClick={() => navigate("/team/login")}
          >
            Sign in
          </span>
        </p>

      </div>
    </div>
  );
}

export default TeamRegister;
