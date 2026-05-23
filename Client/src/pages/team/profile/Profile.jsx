import { getTeamProfile } from "../../../api/team.api"
import { getMyProfile, updateMyProfile } from "../../../api/member.api"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCog,
  FaUser,
  FaUpload,
  FaFilePdf,
  FaShieldAlt,
  FaIdCard,
  FaPlus
} from "react-icons/fa";

import "./Profile.css";



function Profilee() {
  const [loading, setLoading] = useState(true)
  const [team, setTeam] = useState(null)
  const [member, setMember] = useState(null);
  const navigate = useNavigate()
  const [editable, setEditable] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    email: "",
    phone: "",
  });
  const [certificateName, setCertificateName] = useState("");
  const [certificateFile, setCertificateFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");



  useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true)

        // team data
        const teamRes = await getTeamProfile();
        console.log("Team response:", teamRes.data);
        setTeam(teamRes.data);

        // memberData
        const memberRes = await getMyProfile();
        console.log("Member response:", memberRes.data);
        setMember(memberRes.data.member)

      } catch (err) {
        // alert("cannot be fetched" + err.message);
        console.log(err.message)
        // navigate('team/login');

        console.log(err)
      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, []);

  // edit my profile
  useEffect(() => {
    if (member && team) {
      setFormData({
        bio: member.bio || "",
        location: member.location || "",
        phone: member.phone || "",
      });
    }
  }, [member, team]);
  const handleEditClick = async () => {
    if (editable) {
      try {
        const formDataToSend = new FormData();

        // text fields
        formDataToSend.append("bio", formData.bio);
        formDataToSend.append("location", formData.location);
        formDataToSend.append("phone", formData.phone);

        // image file
        if (selectedFile) {
          formDataToSend.append("profilePic", selectedFile);
        }

        const res = await updateMyProfile(formDataToSend);

        setMember(res.data.member);
        setEditable(false);
        setSelectedFile(null);
      } catch (err) {
        console.log("Update failed:", err);
        alert("Failed to update profile");
      }
    } else {
      setEditable(true);
    }
  };




  if (loading) return <div>Loading...</div>;
  if (!member || !team) return <div>Data Not Found</div>

  return (
    <div className="team-profile-page">

      {/* HEADER */}
      <div className="profile-header">
        <div>
          <h1>Team Documents & Profile Settings</h1>
          <p>
            Manage identity, compliance documents, renewals, and team information
          </p>
        </div>

        <div className="header-actions">
          <button className="icon-btn"><FaCog /></button>
          <button className="icon-btn"><FaUser /></button>
        </div>
      </div>

      <div className="profile-layout">

        {/* LEFT PANEL */}
        <div className="team-info-card">

          <div className="team-logo-circle" onClick={() => document.getElementById('profilePicInput').click()}>
            <img
              src={selectedFile ? URL.createObjectURL(selectedFile) : member.profilePic}
              className="team-logo-large"
              alt="Profile"
            />
            <input
              type="file"
              id="profilePicInput"
              style={{ display: "none" }}
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />

            {/* <p style={{ cursor: 'pointer', fontSize: '12px' }}>Click to change</p> */}
          </div>



          <h2>{member.name || "Team Admin"}</h2>
          <span className="team-badge">{member.role || team.category}</span>

          <div className="info-field">
            <label>Team Name</label>
            <input value={team?.name} readOnly />
          </div>

          <div className="info-field">
            <label>Description</label>
            <input
              value={formData.bio}
              readOnly={!editable}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div className="info-field">
            <label>loacation</label>
            <input
              value={formData.location}
              readOnly={!editable}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="info-field">
            <label>Member Email</label>
            <input value={member.email || team.email} readOnly />
          </div>

          <div className="info-field">
            <label>Phone Number</label>
            <input
              value={formData.phone}
              readOnly={!editable}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="info-field">
            <label>Joining </label>
            <input value={member.createdAt || ""} readOnly />
          </div>

          <button className="edit-profile-btn" onClick={handleEditClick}>
            {editable ? "Save Changes" : "Edit Team Profile"}
          </button>

        </div>

        {/* RIGHT PANEL */}
        <div className="document-panel">

          {/* DOCUMENT SECTION */}
          <div className="document-card">
            <h3>Team ID Card</h3>

            <div className="upload-box">
              <FaUpload />
              <p>Drop file or click to upload</p>
            </div>

            <div className="uploaded-file">
              <FaFilePdf />
              <div>
                <strong>team-id-2024.pdf</strong>
                <span>Uploaded 2 days ago</span>
              </div>
            </div>

            <div className="version-history">
              <p>v2.1 – Alex Thompson – Jan 15, 2024</p>
              <p>v2.0 – Sarah Chen – Dec 10, 2023</p>
            </div>
          </div>

          {/* DRIVER LICENSE */}
          <div className="document-card">
            <h3>Driver License</h3>

            <select>
              <option>Select Driver</option>
            </select>

            <div className="upload-box">
              <FaIdCard />
              <p>Upload driver license</p>
            </div>
          </div>

          {/* SAFETY CERTIFICATES */}
          <div className="document-card">
            <h3>Safety Test Certificates</h3>

            <div className="certificate-grid">
              <div className="cert-box">
                <FaShieldAlt />
                <span>safety-cert-1.jpg</span>
                <small>Valid until Mar 2024</small>
              </div>

              <div className="cert-box">
                <FaFilePdf />
                <span>fire-safety.pdf</span>
                <small>Valid until Jun 2024</small>
              </div>

              <div className="upload-cert">
                <FaUpload />
                <p>Upload Certificate</p>
              </div>
            </div>
          </div>

          {/* SCRUTINEERING */}
          <div className="document-card">
            <h3>Scrutineering Reports</h3>

            <div className="upload-box">
              <FaFilePdf />
              <p>Upload scrutineering report (PDF)</p>
            </div>
          </div>

          {/* EXPIRY REMINDERS */}
          <div className="document-card">
            <div className="expiry-header">
              <h3>Expiry Reminders</h3>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span />
              </label>
            </div>

            <div className="expiry-item danger">
              Safety Certificate <span>Expires in 12 days</span>
            </div>

            <div className="expiry-item warning">
              Driver License <span>Expires in 45 days</span>
            </div>

            <div className="expiry-item safe">
              Registration Document <span>Expires in 89 days</span>
            </div>
          </div>

          <button className="add-document-btn">
            <FaPlus /> Add New Document Type
          </button>

        </div>

      </div>
    </div>
  );
}

export default Profilee;
