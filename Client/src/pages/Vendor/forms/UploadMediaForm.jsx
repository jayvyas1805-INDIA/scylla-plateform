import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { uploadVendorMedia } from "../../../api/vendor.api";
import "./VendorModal.css";
import "./UploadMediaForm.css";

const UploadMediaForm = ({ onClose, onUpload }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleClose = () => {
    onClose?.();
    navigate("/vendor/profile");
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSave = async () => {
    if (!file || uploading) return;
    setUploading(true);
    try {
      if (onUpload) {
        await onUpload(file);
      } else {
        const formData = new FormData();
        formData.append("media", file);
        await uploadVendorMedia(formData);
      }
      navigate("/vendor/profile");
    } catch (err) {
      console.error("Failed to upload media", err);
      alert("Failed to upload media");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="add-member-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Upload Media</h2>
          <button className="close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <label>Choose Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {preview && (
          <img src={preview} alt="Preview" className="media-upload-preview" />
        )}

        <div className="modal-footer">
          <button className="save-btn" onClick={handleSave} disabled={!file || uploading}>
            {uploading ? "Uploading..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadMediaForm;
