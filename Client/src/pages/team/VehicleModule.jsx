// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// // import jspdf from 'jspdf';
// // import html2canvas from 'html2canvas';



// import {
//   FaPlus,
//   FaEdit,
//   FaTrash,
//   FaDownload,
//   FaUpload,
//   FaTimes,
//   FaCloudUploadAlt
// } from "react-icons/fa";

// import "./VehicleModule.css";
// import { addVehicle, getVehicle, deleteVehicle } from "../../api/vehicle.api";
// import { getTeamProfile } from "../../api/team.api";

// function VehicleModule() {
//   const navigate = useNavigate();
//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [team, setTeam] = useState(null)
//   const [activeImage, setActiveImage] = useState({});

//   const [name, setName] = useState("");
//   const [model, setModel] = useState("");
//   const [year, setYear] = useState("");
//   const [images, setImages] = useState([]);
//   const fileInputRef = useRef();

//   useEffect(() => {

//     const getData = async () => {
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

//     getData();
//   }, []);


//   // api integration 
//   const fetchVehicles = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await getVehicle();
//       const vehicleList = res.data.vehicles || [];
//       // setVehicles(res.data.vehicles);
//       setVehicles(vehicleList);
//       const imageMap = {};
//       vehicleList.forEach(v => {
//         imageMap[v._id] = v.images?.[0] || "";
//       });
//       setActiveImage(imageMap);
//     } catch (err) {
//       // alert("Failed to load vehicles");
//       console.error(err);
//     } finally {
//       setLoading(false)
//     }
//   };

//   useEffect(() => {
//     fetchVehicles();
//   }, []);


//   const saveVehicle = async () => {
//     if (loading) return;
//     setLoading(true);

//     try {
//       console.log(name, model, year, images); // 👈 ADD THIS
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("model", model);
//       formData.append("year", year);
//       if (images && images.length > 0) {
//         images.forEach((img) => {
//           formData.append("images", img);
//           console.log("images", img)
//         });
//       }


//       await addVehicle(formData);
//       await fetchVehicles();

//       closeAddVehicleModal();
//     } catch (err) {
//       // alert(err.status + " " + err.message);
//       console.log(err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async (id) => {
//     try {
//       await deleteVehicle(id);
//       await fetchVehicles(); // refresh list after delete
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete vehicle");
//     }
//   };

//   // 🔹 ADD NEW VEHICLE MODAL STATE
//   const [showAddVehicle, setShowAddVehicle] = useState(false);

//   const openAddVehicleModal = () => {
//     setShowAddVehicle(true);
//   };

//   const closeAddVehicleModal = () => {
//     setShowAddVehicle(false);
//     setName("");
//     setModel("");
//     setYear("");
//     setImages([]);
//   };
//   // download button
//   // const cardRefs = useRef({});

//   // const handleDownload = async (id) => {
//   // const card = cardRefs.current[id];
//   // if (!card) return;

//   // Wait for all images inside the card to load
//   //   const images = card.querySelectorAll("img");
//   //   await Promise.all(Array.from(images).map(img => {
//   //     if (img.complete) return Promise.resolve();
//   //     return new Promise(resolve => {
//   //       img.onload = img.onerror = () => resolve();
//   //     });
//   //   }));

//   //   html2canvas(card, { scale: 2, useCORS: true })
//   //     .then((canvas) => {
//   //       const imgData = canvas.toDataURL("image/png");
//   //       const pdf = new jspdf("p", "mm", "a4");
//   //       const pdfWidth = pdf.internal.pageSize.getWidth();
//   //       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//   //       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//   //       pdf.save(`${card.dataset.title || "vehicle"}.pdf`);
//   //     })
//   //     .catch(err => console.error("PDF generation error:", err));
//   // };



//   if (loading) return <p>Loading...</p>;



//   return (
//     <div className="vehicle-page">

//       {/* HEADER */}
//       <div className="vehicle-header">
//         <div>
//           <h1>Team Vehicles</h1>
//           <p>
//             Add, manage, and view detailed specifications of your team's cars or bikes
//           </p>
//         </div>

//         <button
//           className="add-vehicle-btn"
//           onClick={openAddVehicleModal}
//         >
//           <FaPlus /> Add New Vehicle
//         </button>
//       </div>

//       {/* VEHICLE GRID */}
//       <div className="vehicle-grid">

//         {vehicles.map(vehicle => (
//           <div
//             className="vehicle-card"
//             key={vehicle._id}
//           // ref={(el) => (cardRefs.current[vehicle._id] = el)}
//           // data-title={vehicle.name} // used for PDF filename
//           >

//             {/* CARD HEADER */}
//             <div className="vehicle-card-header">
//               <div>
//                 <h2>{vehicle.name}</h2>
//                 <span>{vehicle.model} — {vehicle.year}</span>
//               </div>

//               <button className="icon-btn">
//                 <FaEdit />
//               </button>
//             </div>

//             {/* MAIN IMAGE */}
//             {/* MAIN IMAGE */}
//             <div className="vehicle-main-image">
//               <img
//                 src={activeImage[vehicle._id] || "/images/speedometer-image.png"}
//                 alt={vehicle.name}
//                 className="main-vehicle-img"
//               />
//             </div>

//             {/* GALLERY */}
//             <div className="vehicle-gallery">
//               {(vehicle.images || []).map((img, i) => (
//                 <img
//                   key={i}
//                   src={img}
//                   alt="Gallery"
//                   className={`gallery-thumb ${activeImage[vehicle._id] === img ? "active-thumb" : ""
//                     }`}
//                   onClick={() =>
//                     setActiveImage(prev => ({
//                       ...prev,
//                       [vehicle._id]: img
//                     }))
//                   }
//                 />
//               ))}
//             </div>



//             {/* TECHNICAL SPECS */}
//             {/* <div className="specs-section">

//               <h3>Technical Specifications</h3>

//               <div className="spec-grid">

//                 <div>
//                   <h4>Engine Specs</h4>
//                   <p>Type: Single Cylinder</p>
//                   <p>Displacement: 373cc</p>
//                   <p>Cooling: Liquid</p>
//                 </div>

//                 <div>
//                   <h4>Power & Torque</h4>
//                   <p>Power: 43.5 HP</p>
//                   <p>Torque: 37 Nm</p>
//                   <p>Redline: 10500</p>
//                 </div>

//                 <div>
//                   <h4>Transmission</h4>
//                   <p>Gearbox: 6-Speed</p>
//                   <p>Clutch: Slipper</p>
//                 </div>

//                 <div>
//                   <h4>Suspension</h4>
//                   <p>Front: USD Fork</p>
//                   <p>Rear: Monoshock</p>
//                 </div>

//               </div>
//             </div> */}

//             {/* PERFORMANCE */}
//             {/* <div className="performance-section">

//               <h3>Performance Stats</h3>

//               <div className="performance-grid">
//                 <div className="stat-box">
//                   <strong>4.2s</strong>
//                   <span>0-60 kmph</span>
//                 </div>
//                 <div className="stat-box">
//                   <strong>167</strong>
//                   <span>Top Speed</span>
//                 </div>
//                 <div className="stat-box">
//                   <strong>1:42</strong>
//                   <span>Best Lap</span>
//                 </div>
//                 <div className="stat-box">
//                   <strong>28</strong>
//                   <span>Efficiency</span>
//                 </div>
//               </div>
//             </div> */}

//             {/* PDF ACTIONS */}
//             {/* <div className="pdf-section">
//               <h3>Technical Sheet (PDF)</h3>

//               <div className="pdf-buttons">
//                 <button className="primary">
//                   <FaDownload /> Download PDF
//                 </button>
//                 <button className="secondary">
//                   <FaUpload /> Upload PDF
//                 </button>
//               </div>
//             </div> */}

//             {/* FOOTER ACTIONS */}
//             <div className="vehicle-actions">
//               <button className="edit-btn">
//                 <FaEdit /> Edit Vehicle
//               </button>

//               <button className="delete-btn" onClick={() => handleDelete(vehicle._id)}>
//                 <FaTrash />
//               </button>
//             </div>

//           </div>
//         ))}

//       </div>

//       {/* 🔥 ADD NEW VEHICLE MODAL */}
//       {showAddVehicle && (
//         <div className="vehicle-modal-overlay">

//           <div className="vehicle-modal">

//             <div className="vehicle-modal-header">
//               <h2>Add New Vehicle</h2>
//               <button
//                 className="close-btn"
//                 onClick={closeAddVehicleModal}
//               >
//                 <FaTimes />
//               </button>
//             </div>

//             <div className="vehicle-modal-body">

//               <div className="modal-left">
//                 <label>Vehicle Name</label>
//                 <input type="text" placeholder="e.g., Scylla RZ-450" value={name} onChange={(e) => setName(e.target.value)} />

//                 <label>Make & Model</label>
//                 <input type="text" placeholder="e.g., KTM RC 390" value={model} onChange={(e) => setModel(e.target.value)} />

//                 <label>Year</label>
//                 <input type="number" placeholder="2024" value={year} onChange={(e) => setYear(e.target.value)} />
//               </div>

//               <div className="modal-right">

//                 {/* <div className="upload-box">
//                   <FaCloudUploadAlt />
//                   <p>Drag & drop images or click to browse</p>

                  
//                 </div> */}
//                 <label className="upload-box">
//                   <FaCloudUploadAlt />
//                   <p>Drag & drop images or click to browse</p>

//                   <input
//                     type="file"
//                     multiple
//                     accept="image/*"
//                     hidden
//                     ref={fileInputRef}
//                     onChange={(e) => {
//                       const files = Array.from(e.target.files || []);
//                       setImages(prev => [...prev, ...files]); // append new files
//                       e.target.value = null; // reset input so same files can be picked again
//                     }}

//                   />
//                 </label>

//                 {/* 🔹 Image Preview Before Upload */}
//                 {images.length > 0 && (
//                   <div className="image-preview-container">
//                     {images.map((img, i) => (
//                       <img
//                         key={i}
//                         src={URL.createObjectURL(img)}
//                         alt="preview"
//                         className="preview-thumb"
//                         onClick={() =>
//                           setImages(images.filter((_, index) => index !== i))
//                         }
//                       />
//                     ))}
//                   </div>
//                 )}


//                 <div className="upload-box">
//                   <span className="pdf-tag">PDF</span>
//                   <p>Upload technical specification sheet</p>
//                 </div>

//               </div>

//             </div>

//             <div className="vehicle-modal-footer">
//               <button
//                 className="secondary-btn"
//                 onClick={closeAddVehicleModal}
//               >
//                 Cancel
//               </button>

//               <button className="primary-btn" onClick={saveVehicle}>
//                 Save Vehicle
//               </button>
//             </div>

//           </div>

//         </div>
//       )}

//     </div>
//   );
// }

// export default VehicleModule;


import { useState, useEffect } from "react";
import { addVehicle, getVehicle, deleteVehicle } from "../../api/vehicle.api";
import '../../styles/TeamVehicle.css';
import { Download, Upload, Edit2, Trash2, ExternalLink, X } from 'lucide-react';
import AddVehicleForm from '../../components/team/forms/AddVehicleForm';
import TeamNavbar from '../../components/team/TeamNavbar';

export default function VehicleModule() {
  

 const [vehicles, setVehicles] = useState([]);
const [showAddForm, setShowAddForm] = useState(false);
const [mainImages, setMainImages] = useState({});


useEffect(() => {
  fetchVehicles();
}, []);

const fetchVehicles = async () => {
  try {
    const res = await getVehicle();
    const fetchedVehicles = res.data.vehicles || [];

    setVehicles(fetchedVehicles);

    // setup main images
    const imageMap = {};
    fetchedVehicles.forEach(v => {
      imageMap[v._id] = v.mainImage;
    });
    setMainImages(imageMap);

  } catch (err) {
    console.error("Failed to fetch vehicles", err);
  }
};


const handleAddVehicle = async (formData) => {
  try {
    const res = await addVehicle(formData);
    const newVehicle = res.data.vehicle;

    setVehicles(prev => [...prev, newVehicle]);
    setMainImages(prev => ({
      ...prev,
      [newVehicle._id]: newVehicle.mainImage
    }));

    setShowAddForm(false);

  } catch (err) {
    console.error("Add vehicle failed", err);
    alert("Failed to add vehicle");
  }
};


const handleDeleteVehicle = async (vehicleId) => {
  try {
    await deleteVehicle(vehicleId);

    setVehicles(prev => prev.filter(v => v._id !== vehicleId));

    setMainImages(prev => {
      const copy = { ...prev };
      delete copy[vehicleId];
      return copy;
    });

  } catch (err) {
    console.error("Delete failed", err);
    alert("Failed to delete vehicle");
  }
};


  const handleThumbnailClick = (vehicleId, thumbnailUrl) => {
    setMainImages({
      ...mainImages,
      [vehicleId]: thumbnailUrl,
    });
  };

  return (
    <div className="team-vehicle-container">

      <div className="team-vehicle-header">
        <div className="team-vehicle-title-section">
          <h1 className="team-vehicle-title">Team Vehicles</h1>
          <p className="team-vehicle-subtitle">
            Manage and view performance stats of your team's vehicles
          </p>
        </div>
        <button className="team-vehicle-add-btn" onClick={() => setShowAddForm(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Vehicle
        </button>
      </div>

      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Vehicle</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowAddForm(false)}
              >
                <X size={24} />
              </button>
            </div>
            <AddVehicleForm
              onSubmit={handleAddVehicle}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      <div className="team-vehicle-grid">
        {vehicles.map((vehicle) => (
          <div key={vehicle._id} className="vehicle-card">
            <div className="vehicle-card-header">
              <h2 className="vehicle-card-title">
                {vehicle.name}
                <ExternalLink size={18} className="vehicle-edit-icon" />
              </h2>
              <p className="vehicle-model-year">{vehicle.model}</p>
            </div>

            <div className="vehicle-main-image-wrapper">
              <img
                src={mainImages[vehicle._id]}
                alt={vehicle.name}
                className="vehicle-main-image"
              />
            </div>

            <div className="vehicle-thumbnails">
              {vehicle.thumbnails?.map((thumb, idx) => (
                <img
                  key={idx}
                  src={thumb}
                  alt={`${vehicle.name} detail ${idx + 1}`}
                  className={`vehicle-thumbnail ${mainImages[vehicle._id] === thumb ? 'active' : ''}`}
                  onClick={() => handleThumbnailClick(vehicle._id, thumb)}
                />
              ))}
            </div>

            <div className="performance-stats">
              <h3 className="performance-title">Performance Stats</h3>
              <div className="performance-grid">
                {vehicle.performance.map((stat, idx) => (
                  <div key={idx} className="performance-item">
                    <div className="performance-value">{stat.value}</div>
                    <div className="performance-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="vehicle-pdf-section">
              <h3 className="pdf-title">Technical Sheet (PDF)</h3>
              <div className="pdf-buttons">
                <button className="btn-download-pdf">
                  <Download size={18} />
                  Download PDF
                </button>
                <button className="btn-upload-pdf">
                  <Upload size={18} />
                  Upload PDF
                </button>
              </div>
            </div>

            <div className="vehicle-actions">
              <button className="btn-edit-vehicle">
                <Edit2 size={18} />
                Edit Vehicle
              </button>
              <button
                className="btn-delete-vehicle"
                onClick={() => handleDeleteVehicle(vehicle._id)}
                title="Delete vehicle"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
