import React from "react";
import { FaTimes } from "react-icons/fa";
import Header from '../../../components/vendor/Header';
import { useNavigate } from "react-router-dom";

const UploadMediaForm = ({ onClose, onUpload }) => {
  const navigate = useNavigate()
  return (
    <div className="modal-overlay">
      <div className="add-member-modal">
        <div className="modal-header">
          <h2>Upload Media</h2>
          <button className="close-btn" onClick={()=>{onClose,navigate("/vendor/profile")}} >
            <FaTimes />
          </button>
        </div>

        <input type="file" accept="image/*" onChange={onUpload} />

        <button
            className="save-btn"
            onClick={() => onAdd(service)}
          >
            Save
          </button>

      </div>
    </div>
  );
};

export default UploadMediaForm;
