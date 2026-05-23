import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { addService } from "../../../api/vendor.api";


const AddServiceForm = ({ onClose, onAdd }) => {
  const [service, setService] = useState("");
  const navigate = useNavigate()
  const [icon, setIcon] = useState("");
  const SERVICE_ICONS = ["⚙️", "🔧", "🏁", "📊", "✏️", "📈", "⚡", "🛡️"];

 const handleSubmit = async () => {
  if (!service || !icon) return;

  try {
    await addService({
      name: service,
      icon
    });

    navigate("/vendor/profile"); // go back
  } catch (err) {
    console.error(err);
    console.log(err.data)
    alert("Failed to add service");
  }
};


  return (
    <div className="modal-overlay">
      <div className="add-member-modal">
        <div className="modal-header">
          <h2>Add New Service</h2>
          <button className="close-btn" onClick={() => navigate("/vendor/profile")}>
            <FaTimes />
          </button>
        </div>

        <label>Service Name</label>
        <input
          type="text"
          value={service}
          onChange={(e) => setService(e.target.value)}
        />
        <label>Select Icon</label>
        <select
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
        >
          <option value="">-- Select an icon --</option>
          {SERVICE_ICONS.map((ic) => (
            <option key={ic} value={ic}>
              {ic}
            </option>
          ))}
        </select>

        <div className="modal-footer">
          <button
            className="save-btn"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddServiceForm;
