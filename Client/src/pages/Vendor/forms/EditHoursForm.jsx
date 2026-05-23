import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EditHoursForm = ({ hours, onClose, onSave }) => {
  const [localHours, setLocalHours] = useState(hours);
  const navigate = useNavigate()

  return (
    <div className="modal-overlay">
      <div className="add-member-modal">
        <div className="modal-header">
          <h2>Edit Business Hours</h2>
          <button className="close-btn" onClick={()=>{onClose,navigate("/vendor/profile")}} >
            <FaTimes />
          </button>
        </div>

        {localHours?.map((h, i) => (
          <div key={i}>
            <label>{h.days}</label>
            <input
              value={h.hours}
              onChange={(e) => {
                const copy = [...localHours];
                copy[i].hours = e.target.value;
                setLocalHours(copy);
              }}
            />
          </div>
        ))}

        <div className="modal-footer">
          <button className="save-btn" onClick={() => onSave(localHours)}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditHoursForm;
