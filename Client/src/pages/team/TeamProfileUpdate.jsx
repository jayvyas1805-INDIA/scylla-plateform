import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TeamRegister.css";
import { getTeamProfile, updateTeamProfile } from "../../api/team.api";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";


function TeamUpdate() {
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
    contactNo: "",

    category: "",
  });

  const [socialMedia, setSocialMedia] = useState({
    instagram: "",
    youtube: "",
    linkedin: "",
    twitter: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [logo, setLogo] = useState(null);
  const [verificationDoc, setVerificationDoc] = useState(null);
  const logoInputRef = useRef(null);
  const docInputRef = useRef(null);
  const [loading, setLoading] = useState(false);




  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getTeamProfile();
        const team = res.data.team || res.data;


        setFormData({
          name: team.name || "",
          tagline: team.tagline || "",
          contactNo: team.contactNo || "",
          address: team.address || "",
          category: team.category || "",
          description: team.description || "",
        });

        setSocialMedia({
          instagram: team.socialMedia?.instagram || "",
          youtube: team.socialMedia?.youtube || "",
          linkedin: team.socialMedia?.linkedin || "",
          twitter: team.socialMedia?.twitter || "",
        });

        setLocation({
          address: team?.location?.address || "",
          lat: team.lat || null,
          lng: team.lng || null,
        });
      } catch (err) {
        console.error(err);
        alert("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);

  // Handle text change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSocialChange = (e) => {
    setSocialMedia({ ...socialMedia, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const data = new FormData();

      // Append only non-empty fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "") data.append(key, formData[key]);
      });

      // Append social media if filled
      const socialObj = {};
      Object.keys(socialMedia).forEach((key) => {
        if (socialMedia[key] !== "") socialObj[key] = socialMedia[key];
      });
      if (Object.keys(socialObj).length > 0) {
        data.append("socialMedia", JSON.stringify(socialObj));
      }

      // Append files if selected
      if (logo) data.append("logo", logo);
      if (verificationDoc) data.append("verificationDoc", verificationDoc);
      if (location.lat && location.lng) {
        data.append("location", JSON.stringify({
          address: location.address,
          lat: location.lat,
          lng: location.lng
        }));
      }


      const res = await updateTeamProfile(data);

      const updatedTeam = res.data.team;


      setFormData({
        name: updatedTeam.name || "",
        tagline: updatedTeam.tagline || "",
        contactNo: updatedTeam.contactNo || "",
        category: updatedTeam.category || "",
        description: updatedTeam.description || "",
      });

      setSocialMedia(updatedTeam.socialMedia || {});

      alert("Profile updated successfully!");
      navigate("/team/home");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
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
        <h1 className="team-title">Update Team Profile</h1>
        <p className="team-subtitle">Join the future of motorsport analytics</p>

        {/* TEAM DETAILS */}
        <div className="form-group">
          <label>Team Name</label>
          <input type="text" name="name" value={formData.name} placeholder="Enter your team name" onChange={handleChange} />
        </div>

        {/* Logo Upload */}
        <div className="form-group">
          <label>Upload Team Logo</label>
          <div className="upload-box" onClick={() => logoInputRef.current.click()}>
            <input type="file" name="logo" ref={logoInputRef} hidden accept="image/png,image/jpeg"
              onChange={(e) => setLogo(e.target.files[0])} />
            <span className="upload-icon">{logo ? "✅" : "☁"}</span>
            <p>{logo ? logo.name : "Click to upload or drag and drop"}</p>
            <small>PNG, JPG up to 5MB</small>
          </div>
        </div>

        <div className="form-group">
          <label>Team Tagline</label>
          <input type="text" name="tagline" value={formData.tagline} placeholder="Enter your team tagline" onChange={handleChange} />
        </div>

        {/* CONTACT INFO */}
        {/* <h2 className="section-title">Contact Information</h2>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" placeholder="team@example.com" onChange={handleChange} />
        </div> */}

        {/* <div className="form-group password-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Create a strong password" onChange={handleChange} />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          <small className="password-hint">Must be at least 6 characters</small>
        </div> */}

        <div className="form-group">
          <label>Mobile Number</label>
          <input type="tel" name="contactNo" value={formData.contactNo} placeholder="+1 (555) 123-4567" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Team Address</label>

          <textarea
            name="address"
            placeholder="Select address from map"
            value={location.address || formData.address}
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
              center={[location.lat || 23.0225, location.lng || 72.5714]}
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
            <option>Formula Racing</option>
            <option>Rally</option>
            <option>Endurance</option>
            <option>Motocross</option>
          </select>
        </div>

        <div className="form-group">
          <label>Team Description</label>
          <textarea name="description" value={formData.description} placeholder="Enter your team's description" onChange={handleChange}></textarea>
        </div>

        {/* SOCIAL MEDIA LINKS */}
        <h2 className="section-title">Social Media</h2>
        <div className="form-group">
          <label>Instagram</label>
          <input type="url" name="instagram" value={socialMedia.instagram} placeholder="Instagram URL" onChange={handleSocialChange} />
        </div>
        <div className="form-group">
          <label>YouTube</label>
          <input type="url" name="youtube" value={socialMedia.youtube} placeholder="YouTube URL" onChange={handleSocialChange} />
        </div>
        <div className="form-group">
          <label>LinkedIn</label>
          <input type="url" name="linkedin" value={socialMedia.linkedin} placeholder="LinkedIn URL" onChange={handleSocialChange} />
        </div>
        <div className="form-group">
          <label>Twitter</label>
          <input type="url" name="twitter" value={socialMedia.twitter} placeholder="Twitter URL" onChange={handleSocialChange} />
        </div>

        {/* VERIFICATION DOC */}
        <h2 className="section-title">Team Verification</h2>
        <div className="upload-box secondary" onClick={() => docInputRef.current.click()}>
          <input type="file" name="verificationDoc" ref={docInputRef} hidden onChange={(e) => setVerificationDoc(e.target.files[0])} />
          <span className="upload-icon">📄</span>
          <p>{verificationDoc ? verificationDoc.name : "Upload team verification documents"}</p>
          <small>Documents will be verified by the admin before approval</small>
        </div>

        {/* SUBMIT BUTTON */}
        <button className={`submit-btn ${loading ? "loading" : ""}`} onClick={handleSubmit} disabled={loading}>
          {loading ? "⏳ Please wait..." : "🚀 Update Your Profile"}
        </button>

      </div>
    </div>
  );
}

export default TeamUpdate;
