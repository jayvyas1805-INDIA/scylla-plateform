import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { editVendorProfile } from '../../../api/vendor.api';


const EditAboutForm = ({ initialValue, onClose, onSave }) => {
  const [desc, setDesc] = useState(initialValue || "");
  const navigate = useNavigate()

  /* ✅ KEEP STATE IN SYNC IF VALUE CHANGES */
  useEffect(() => {
    setDesc(initialValue || "");
  }, [initialValue]);

  return (
    <div
      className="modal-overlay"
      onClick={() => { onClose, navigate("/vendor/profile") }}   /* ✅ CLICK OUTSIDE CLOSE */
    >
      <div
        className="add-member-modal"
        onClick={(e) => e.stopPropagation()}  /* ✅ STOP BUBBLE */
      >
        <div className="modal-header">
          <h2>Edit About Company</h2>

          <button
            type="button"
            className="close-btn"
            onClick={() => { onClose, navigate("/vendor/profile") }}
          /* ✅ CLOSE WORKS */
          >
            <FaTimes />
          </button>
        </div>

        <label>Company Description</label>
        <textarea
          rows="6"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <div className="modal-footer">
          <button
            type="button"
            className="save-btn"
            onClick={async () => {
              try {
                // ✅ Call backend to update only companyDesc
                await editVendorProfile({ companyDesc: desc });

                alert("Company description updated successfully!");

                // ✅ Optional: refresh vendor data if you want updated info immediately
                // vendorData();  // only if vendorData is passed via props or context

                // onClose();
                navigate("/vendor/profile");  // close modal
              } catch (err) {
                console.error(err);
                alert("Failed to update company description");
              }
            }}
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditAboutForm;
