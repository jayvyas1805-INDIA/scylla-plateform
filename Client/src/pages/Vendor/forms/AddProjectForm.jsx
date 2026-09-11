// import React, { useState } from "react";
// import { FaTimes } from "react-icons/fa";
// import "./AddProjectForm.css";
// import { addProject } from "../../../api/vendor.api";
// import { useNavigate } from "react-router-dom";

// const AddProjectForm = ({ onClose, onAdd }) => {
//   const [title, setTitle] = useState("");
//   const [desc, setDesc] = useState("");

//   /* ================= IMAGE STATE ================= */
//   const [imageFile, setImageFile] = useState(null);
//   const [imageUrl, setImageUrl] = useState("");
//   const [preview, setPreview] = useState(null);
//   const navigate = useNavigate();

//   /* ================= FILE UPLOAD ================= */
//   const handleImageFile = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setImageFile(file);
//     setImageUrl("");
//     setPreview(URL.createObjectURL(file));
//   };

//   /* ================= IMAGE URL ================= */
//   const handleImageUrl = (e) => {
//     const url = e.target.value;
//     setImageUrl(url);
//     setImageFile(null);
//     setPreview(url);
//   };


//    const handleSubmit = async () => {
//     if (!title || !desc) return alert("Title & description required");

//     try {
//       setLoading(true);
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("desc", desc);

//       if (imageFile) formData.append("image", imageFile);
//       else if (imageUrl) formData.append("imageUrl", imageUrl);

//       await addProject(formData);

//       onSuccess(); // 🔑 tell parent to refresh
//       onClose();   // close modal
//     } catch (err) {
//       console.error(err);
//       alert("Failed to add project");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       {/* STOP PROPAGATION */}
//       <div
//         className="add-member-modal"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="modal-header">
//           <h2>Add Project</h2>

//           <button
//             type="button"
//             className="close-btn"
//             onClick={()=>navigate("/vendor/profile")}
//           >
//             <FaTimes />
//           </button>
//         </div>

//         {/* PROJECT TITLE */}
//         <label>Project Title</label>
//         <input
//           placeholder="Enter project title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />

//         {/* DESCRIPTION */}
//         <label>Description</label>
//         <textarea
//           placeholder="Enter description"
//           value={desc}
//           onChange={(e) => setDesc(e.target.value)}
//         />

//         {/* ================= IMAGE INPUT ================= */}
//         <label>Project Image</label>
//         <div className="image-upload">

//           {/* FILE PICKER */}
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageFile}
//           />

//           {/* IMAGE URL INPUT */}
//           <input
//             type="text"
//             placeholder="Or paste image URL"
//             value={imageUrl}
//             onChange={handleImageUrl}
//           />

//           {/* PREVIEW */}
//           {preview && (
//             <img
//               src={preview}
//               alt="Project Preview"
//               className="image-preview"
//             />
//           )}
//         </div>

//         <div className="modal-footer">
//           <button
//             className="save-btn"
//             onClick={() => {
//               if (title.trim() && desc.trim()) {
//                 onAdd({
//                   title,
//                   desc,
//                   image: imageFile,
//                   imageUrl
//                 });
//                 setTitle("");
//                 setDesc("");
//                 setImageFile(null);
//                 setImageUrl("");
//                 setPreview(null);
//                 onClose(); // Close modal after adding
//               }
//             }}
//           >
//             Add Project
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProjectForm;

import React, { useState,useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./AddProjectForm.css";
import { addProject } from "../../../api/vendor.api";

const AddProjectForm = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImageUrl("");
    setPreview(URL.createObjectURL(file));
  };

 
  useEffect(() => {
  return () => {
    if (preview && imageFile) {
      URL.revokeObjectURL(preview);
    }
  };
}, [preview, imageFile]);


  const handleSubmit = async () => {
  if (!title || !desc) return alert("Title & description required");

  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("desc", desc);

    if (imageFile) formData.append("image", imageFile);
    // else if (imageUrl) formData.append("imageUrl", imageUrl);

    await addProject(formData);

    navigate("/vendor/profile"); // ✅ BACK AFTER SUCCESS
  } catch (err) {
    console.error(err);
    alert("Failed to add project");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-member-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Project</h2>
          <button className="close-btn" onClick={() => navigate("/vendor/profile")}>

            <FaTimes />
          </button>
        </div>

        <label>Project Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Description</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />

        <label>Project Image</label>
        <div className="image-upload">
          <input type="file" accept="image/*" onChange={handleImageFile} />
          {/* <input
            type="text"
            placeholder="Or paste image URL"
            value={imageUrl}
            onChange={handleImageUrl}
          /> */}
          {preview && <img src={preview} className="image-preview" />}
        </div>

        <div className="modal-footer">
          <button className="save-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Uploading..." : "Add Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProjectForm;
