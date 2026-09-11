import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getVendorProfile, businessHours } from "../../../api/vendor.api";
import "./VendorModal.css";
import "./EditHoursForm.css";

const DEFAULT_DAYS = [
  { days: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
  { days: "Saturday", hours: "10:00 AM - 4:00 PM" },
  { days: "Sunday", hours: "Closed" },
];

const EditHoursForm = ({ hours, onClose, onSave }) => {
  const [localHours, setLocalHours] = useState(hours || null);
  const [loading, setLoading] = useState(!hours);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // When rendered as a standalone route, no `hours` prop is passed in —
  // fetch the vendor's current hours so the form isn't just empty.
  useEffect(() => {
    if (hours) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await getVendorProfile();
        const fetched = res?.data?.businessHours;
        if (!cancelled) {
          setLocalHours(
            Array.isArray(fetched) && fetched.length > 0 ? fetched : DEFAULT_DAYS
          );
        }
      } catch (err) {
        console.error("Failed to load business hours", err);
        if (!cancelled) setLocalHours(DEFAULT_DAYS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hours]);

  const handleClose = () => {
    onClose?.();
    navigate("/vendor/profile");
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      if (onSave) {
        await onSave(localHours);
      } else {
        await businessHours(localHours);
      }
      navigate("/vendor/profile");
    } catch (err) {
      console.error("Failed to save business hours", err);
      alert("Failed to save business hours");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="add-member-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Business Hours</h2>
          <button className="close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        {loading ? (
          <p className="hours-loading">Loading current hours…</p>
        ) : (
          localHours?.map((h, i) => (
            <div key={i} className="hours-row">
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
          ))
        )}

        <div className="modal-footer">
          <button className="save-btn" onClick={handleSave} disabled={loading || saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditHoursForm;
