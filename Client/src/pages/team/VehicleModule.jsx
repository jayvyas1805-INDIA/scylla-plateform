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
    <div className="team-vehicle-container"style={{backgroundColor:"#0a0e27"}}>

      <div className="team-vehicle-header"style={{borderBottom:"1px solid #1a1f3a"}}>
        <div className="team-vehicle-title-section" style={{marginBottom:"10px"}}>
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
