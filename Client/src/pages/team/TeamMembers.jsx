// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getMember, addMember, deleteMember } from "../../api/member.api";
// import { getTeamProfile } from "../../api/team.api";
// import {
//   FaPlus,
//   FaEdit,
//   FaTrash,
//   FaTimes
// } from "react-icons/fa";

// import "./TeamMembers.css";

// function TeamMembers() {

//   const navigate = useNavigate()
//   const [team, setTeam] = useState(null)
  
//   // 🔹 BACKEND-READY STATE
//   const [members, setMembers] = useState([]);

//   const [activeTab, setActiveTab] = useState("All");

//   // 🔹 ADD MEMBER MODAL STATE
//   const [showAddModal, setShowAddModal] = useState(false);
  
//   // 🔹 FORM STATE (FRONTEND ONLY)
//   const [newMemberName, setNewMemberName] = useState("");
//   const [newMemberRole, setNewMemberRole] = useState("");
//   const [newMemberDescription, setNewMemberDescription] = useState("");
//   const [loading, setLoading] = useState(true)
//   const [newMemberEmail, setNewMemberEmail] = useState("");
  
  
//   // 🔹 API PLACEHOLDER (CONNECT BACKEND LATER)

// useEffect(() => {
    
//     const teamData = async () => {
//       try {
//         setLoading(true)
//         const res = await getTeamProfile();
//         setTeam(res.data);
//       } catch (err) {
//         // alert("cannot be fetched" + err.message);
//         console.log(err.message)
//       } finally {
//         setLoading(false)
//       }
//     };
    
//     teamData();
//   }, []);


//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const res = await getMember();
//       setMembers(res.data);
//     } catch (err) {
//       // alert(err.message);
//       console.log(err.message + err.status);
//     } finally {
//       setLoading(false)
//     }
//   }

//   // 🔹 FILTER LOGIC (BACKEND SAFE)
//   const filteredMembers = Array.isArray(members)
//   ? (activeTab === "All" ? members : members.filter(m => m.role === activeTab))
//   : [];

  
//   // 🔹 ADD MEMBER (FRONTEND DEMO)
//   const handleAddMember = async () => {
//     if (!newMemberName || !newMemberRole || !newMemberEmail) {
//       alert("Please fill name, role, and email");
//       return;
//     }

//     // Minimal fields sent to backend
//     const newMember = {
//       name: newMemberName,
//       role: newMemberRole,
//       bio: newMemberDescription || "",
//       email: newMemberEmail,
//     };

//     try {
//       const res = await addMember(newMember);
//       setMembers([...members, res.data]);
//       setShowAddModal(false);

//       // Reset form
//       setNewMemberName("");
//       setNewMemberRole("");
//       setNewMemberDescription("");
//       setNewMemberEmail("");

//       navigate("/team/members")
//       fetchData()
//     } catch (err) {
//       console.error("Add member error:", err.data);
//       console.error(err.message)
//       alert("Failed to add member");
//     }
//   };


// const handleDeleteMember = async (id) => {
//   if (!window.confirm("Are you sure you want to delete this member?")) return;
  
//   try {
//     await deleteMember(id); // call backend API
//     setMembers(members.filter(members => members._id !== id)); // update frontend state
//   } catch (err) {
//     console.error(err);
//     alert("Failed to delete member");
//   }
// };

// if(!team) return null;
  
//   return (
//     <div className="team-members-page">

//       {/* HEADER */}
//       <div className="members-header">
//         <div>
//           <h1>TEAM MEMBERS</h1>
//           <p>Manage drivers, engineers, designers, and crew</p>
//         </div>

//         <button
//           className="add-member-btn"
//           onClick={() => setShowAddModal(true)}
//         >
//           <FaPlus /> Add New Member
//         </button>
//       </div>

//       {/* FILTER TABS */}
//       <div className="member-tabs">
//         {["All", "Driver", "Engineer", "Crew", "Designer", "Manager"].map(tab => (
//           <button
//             key={tab}
//             className={activeTab === tab ? "active" : ""}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab === "All" ? "All Members" : tab}
//           </button>
//         ))}
//       </div>

//       {/* MEMBER GRID */}
//       <div className="members-grid">

//         {Array.isArray(filteredMembers) && filteredMembers.map(member => (
//           <div className="member-card" key={member._id || member.id}>
            
          
//             {/* CARD ACTIONS */ }
//           < div className = "card-actions" >
//               <button className="edit">
//                 <FaEdit />
//               </button>
//               <button className="delete" onClick={() => handleDeleteMember(member._id)}>
//                 <FaTrash />
//               </button>
//             </div>

//       {/* AVATAR */}
//       <img
//         src={member.profilePic || team.logo }
//         alt={member.name}
//         className="member-avatar"
//       />

//       {/* NAME */}
//       <h3>{member.name}</h3>

//       {/* ROLE BADGE */}
//       <span className={`role ${member.role}`}>
//         {member.role}
//       </span>

//       {/* DESCRIPTION */}
//       <p className="description">
//         {member.bio}
//       </p>

//       {/* CERTIFICATIONS */}
//       <div className="certifications">
//         <h4>CERTIFICATIONS</h4>
// {/* 
//         {member.certifications.map((c, i) => (
//           <span key={i}>{c}</span> */}
//         {/* ))} */}
//       </div>

//     </div>
//   ))
// }

//       </div >

//   {/* ADD MEMBER MODAL */ }
// {
//   showAddModal && (
//     <div className="modal-overlay">

//       <div className="add-member-modal">

//         <div className="modal-header">
//           <h2>Add New Member</h2>
//           <button
//             className="close-btn"
//             onClick={() => setShowAddModal(false) }
//           >
//             <FaTimes />
//           </button>
//         </div>

//         <div className="modal-body">

//           <label>FULL NAME</label>
//           <input
//             type="text"
//             placeholder="Enter member name"
//             value={newMemberName}
//             onChange={(e) => setNewMemberName(e.target.value)}
//           />

//           <label>EMAIL</label>
//           <input
//             type="email"
//             name="email"
//             placeholder="Enter member email"
//             value={newMemberEmail}
//             onChange={(e) => setNewMemberEmail(e.target.value)}
//           />

//           <label>ROLE</label>
//           <select
//             value={newMemberRole}
//             onChange={(e) => setNewMemberRole(e.target.value)}
//           >
//             <option value="">Select role</option>
//             <option value="Driver">Driver</option>
//             <option value="Engineer">Engineer</option>
//             <option value="Crew">Crew</option>
//             <option value="Designer">Designer</option>
//             <option value="Manager">Manager</option>
//           </select>

//           <label>DESCRIPTION</label>
//           <textarea
//             placeholder="Short description"
//             value={newMemberDescription}
//             onChange={(e) => setNewMemberDescription(e.target.value)}
//           />


//           {/* <label>CERTIFICATES</label>
//           <input
//             type="text"
//             placeholder="Comma separated certificates"
//             value={newMemberCertificates}
//             onChange={(e) => setNewMemberCertificates(e.target.value)}
//           /> */}

//         </div>

//         <div className="modal-footer">
//           <button
//             className="save-btn"
//             onClick={handleAddMember}
//           >
//             Add Member
//           </button>
//         </div>

//       </div>
//     </div>
//   )
// }

//     </div >
//   );
// }

// export default TeamMembers;


import { useState, useEffect } from "react";
import "../../styles/TeamMember.css";
import TeamNavbar from "../../components/team/TeamNavbar";
import { getMember, addMember, deleteMember } from "../../api/member.api";
import { getTeamProfile } from "../../api/team.api";


export default function TeamMember() {
  const [members, setMembers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All Members");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [addRole, setAddRole] = useState("Driver");
  const [addDescription, setAddDescription] = useState("");
  const [addCertifications, setAddCertifications] = useState("");
  const [editingMember, setEditingMember] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCertifications, setEditCertifications] = useState("");
  const [loading, setLoading] = useState(false);
  const [team,setTeam] = useState("")

  const filters = ["All Members", "Drivers", "Engineers", "Crew", "Designers", "Managers"];
  const roles = ["Driver", "Engineer", "Crew", "Designer", "Manager"];

  const filteredMembers = activeFilter === "All Members"
    ? members
    : members.filter(member => {
      const roleMap = {
        "Drivers": "Driver",
        "Engineers": "Engineer",
        "Crew": "Crew",
        "Designers": "Designer",
        "Managers": "Manager"
      };
      return member.role === roleMap[activeFilter];
    });


  // Fetch members from backend on page load
  useEffect(() => {

    const teamData = async () => {
      try {
        setLoading(true)
        const res = await getTeamProfile();
        setTeam(res.data);
      } catch (err) {
        // alert("cannot be fetched" + err.message);
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    };

    teamData();
  }, []);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getMember();

      const transformedMembers = res.data.map(member => ({
        id: member._id,                     // ✅ for delete/edit
        name: member.name,
        role: member.role,
        profilePic: member.profilePic || "/images/profile-avatar.png", // ✅ UI reads THIS
        description: member.bio || "",      // ✅ UI reads THIS
        certifications: member.certificates
          ? member.certificates.map(c => c.name) // ✅ badges
          : [],
      }));

      setMembers(transformedMembers);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };


  // Add member
  const handleAddMember = async () => {
    if (!fullName || !email) {
      alert("Name and email are required");
      return;
    }

    try {
      const certsArray = addCertifications
        .split(",")
        .map(cert => ({
          name: cert.trim(),
          url: "",
          expiryDate: null
        }))
        .filter(cert => cert.name.length > 0);

      const memberData = {
        name: fullName,
        email,
        role: addRole,
        bio: addDescription,
        certificates: certsArray,
      };

      const res = await addMember(memberData);

      if (res.data.success) {
        const backendMember = res.data.member;

        // 🔁 TRANSFORM backend → UI shape
        const uiMember = {
          id: backendMember._id,
          name: backendMember.name,
          role: backendMember.role,
          profilePic: backendMember.profilePic,
          description: backendMember.bio || "",
          certifications: backendMember.certificates
            ? backendMember.certificates.map(c => c.name)
            : [],
        };

        // ✅ Update UI instantly
        setMembers(prev => [...prev, uiMember]);

        // Reset form
        setFullName("");
        setEmail("");
        setAddRole("Driver");
        setAddDescription("");
        setAddCertifications("");
        setIsAddModalOpen(false);

        alert("Member added successfully!");
      } else {
        alert(res.data.error || "Failed to add member");
      }
    } catch (err) {
      console.error("Add member error:", err);
      alert("Failed to add member: " + err.message);
    }
  };



  const handleEditClick = (member) => {
    setEditingMember(member);
    setEditRole(member.role);
    setEditDescription(member.description);
    setEditCertifications(member.certifications.join(", "));
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingMember) {
      const updatedMembers = members?.map(m =>
        m.id === editingMember.id
          ? {
            ...m,
            role: editRole,
            description: editDescription,
            certifications: editCertifications
              .split(",")
              .map(cert => cert.trim())
              .filter(cert => cert.length > 0)
          }
          : m
      );
      setMembers(updatedMembers);
      setIsEditModalOpen(false);
      setEditingMember(null);
      setEditRole("");
      setEditDescription("");
      setEditCertifications("");
    }
  };

const handleDeleteMember = async (memberId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this team member?"
  );
  if (!confirmed) return;

  try {
    // 🔥 CALL BACKEND
    const res = await deleteMember(memberId);

    if (res.data.success) {
      // ✅ Update UI after backend success
      setMembers(prev => prev.filter(m => m.id !== memberId));
    } else {
      alert(res.data.error || "Failed to delete member");
    }
  } catch (err) {
    console.error("Delete member error:", err);
    alert("Failed to delete member");
  }
};


  return (
    <div className="team-members-page">

      <header className="team-header">
        <div className="header-container">
          <div className="header-left">
            <h1 className="page-title">TEAM MEMBERS</h1>
            <p className="page-subtitle">Manage drivers, engineers, designers, and crew</p>
          </div>
          <button className="add-member-btn" onClick={() => setIsAddModalOpen(true)}>
            <span className="plus-icon">+</span>
            <span>Add New Member</span>
          </button>
        </div>
      </header>

      <div className="filter-section">
        <div className="filter-tabs">
          {filters.map(filter => (
            <button
              key={filter}
              className={`filter-tab ${activeFilter === filter ? "active" : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="members-grid">
        {filteredMembers.map(member => (
          <div key={member.id} className="member-card">
            <div className="member-card-inner">
              <div className="member-avatar">
                <img src={member.profilePic} alt={member?.name} />
              </div>
              <div className="member-info">
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
              </div>
              <div className="member-actions">
                <button
                  className="icon-btn edit-btn"
                  title="Edit"
                  onClick={() => handleEditClick(member)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  className="icon-btn delete-btn"
                  title="Delete"
                  onClick={() => handleDeleteMember(member.id)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="member-description">{member.description}</p>
            <div className="certifications-section">
              <p className="certifications-label">CERTIFICATIONS</p>
              <div className="certifications-list">
                {member.certifications.map((cert, idx) => (
                  <span key={idx} className="certification-badge">{cert}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h2 className="modal-title">Add New Member</h2>

            <div className="form-group">
              <label className="form-label">FULL NAME</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter member name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />

            </div>
            <div className="form-group">
              <label className="form-label">ROLE</label>
              <select
                className="form-input"
                value={addRole}
                onChange={e => setAddRole(e.target.value)}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">DESCRIPTION</label>
              <textarea
                className="form-input form-textarea"
                placeholder="Enter member description"
                value={addDescription}
                onChange={e => setAddDescription(e.target.value)}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label className="form-label">CERTIFICATIONS</label>
              <textarea
                className="form-input form-textarea"
                placeholder="Enter certifications separated by commas (e.g., Cert 1, Cert 2, Cert 3)"
                value={addCertifications}
                onChange={e => setAddCertifications(e.target.value)}
                rows="3"
              />
            </div>

            <button className="modal-submit-btn" onClick={handleAddMember}>
              Add Member
            </button>
          </div>
        </div>
      )}

      {isEditModalOpen && editingMember && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h2 className="modal-title">Edit Member</h2>

            <div className="form-group">
              <label className="form-label">NAME</label>
              <input
                type="text"
                className="form-input"
                value={editingMember.name}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">ROLE</label>
              <select
                className="form-input"
                value={editRole}
                onChange={e => setEditRole(e.target.value)}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">DESCRIPTION</label>
              <textarea
                className="form-input form-textarea"
                placeholder="Enter member description"
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label className="form-label">CERTIFICATIONS</label>
              <textarea
                className="form-input form-textarea"
                placeholder="Enter certifications separated by commas (e.g., Cert 1, Cert 2, Cert 3)"
                value={editCertifications}
                onChange={e => setEditCertifications(e.target.value)}
                rows="3"
              />
            </div>

            <div className="modal-actions">
              <button className="modal-cancel-btn" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </button>
              <button className="modal-submit-btn" onClick={handleSaveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
