import { useState } from 'react';
import "../../../styles/AddVehicleForm.css";

export default function AddVehicleForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
  name: '',
  model: '',
  mainImage: null,          // ✅ FILE ONLY
  mainImagePreview: '',     // ✅ PREVIEW ONLY
  thumbnails: [null, null, null, null],   // FILES
  thumbnailPreviews: ['', '', '', ''],     // PREVIEWS
  performance: [
    { value: '', label: '0-60 km/h' },
    { value: '', label: 'Top Speed' },
    { value: '', label: 'Best Lap' },
    { value: '', label: 'Efficiency' },
  ],
  technicalSheetPdf: '',
});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  const handlePerformanceChange = (index, value) => {
    const newPerformance = [...formData.performance];
    newPerformance[index].value = value;
    setFormData({ ...formData, performance: newPerformance });
  };

  const handlePdfChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, technicalSheetPdf: value });
  };

 const handleMainImageFile = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setFormData(prev => ({
    ...prev,
    mainImage: file, // ✅ FILE
    mainImagePreview: URL.createObjectURL(file), // ✅ PREVIEW
  }));
};


const handleThumbnailFile = (index, e) => {
  const file = e.target.files[0];
  if (!file) return;

  setFormData(prev => {
    const thumbs = [...prev.thumbnails];
    const previews = [...prev.thumbnailPreviews];

    thumbs[index] = file;
    previews[index] = URL.createObjectURL(file);

    return {
      ...prev,
      thumbnails: thumbs,
      thumbnailPreviews: previews,
    };
  });
};



const handleSubmit = (e) => {
  e.preventDefault();

  if (!formData.name || !formData.model || !formData.mainImage) {
    alert("Required fields missing");
    return;
  }

  const data = new FormData();

  data.append("name", formData.name);
  data.append("model", formData.model);
  data.append("mainImage", formData.mainImage); // ✅ FILE

  formData.thumbnails.forEach((file) => {
    if (file) data.append("thumbnails", file);
  });

  data.append("performance", JSON.stringify(formData.performance));

  onSubmit(data);
};



  return (
    <form className="add-vehicle-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3 className="form-section-title">Basic Information</h3>
        
        <div className="form-group">
          <label className="form-label">Vehicle Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-input"
            placeholder="e.g., Car 01 - Scylla GT-X"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Model & Year *</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            className="form-input"
            placeholder="e.g., BMW M4 GT4 — 2024"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageFile}
            className="form-input"
          />

          {formData.mainImagePreview && (
            <img
              src={formData.mainImagePreview}
              alt="Main Preview"
              className="image-preview"
            />
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Thumbnails (up to 4)</label>
          <div className="thumbnails-inputs">
            {formData.thumbnails.map((thumb, idx) => (
              <div key={idx} className="thumbnail-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleThumbnailFile(idx, e)}
                  className="form-input"
                />

                {formData.thumbnailPreviews[idx] && (
                  <img
                    src={formData.thumbnailPreviews[idx]}
                    alt={`Thumbnail ${idx + 1}`}
                    className="thumbnail-preview"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">Performance Stats</h3>
        {formData.performance.map((stat, idx) => (
          <div key={idx} className="form-group">
            <label className="form-label">{stat.label}</label>
            <input
              type="text"
              value={stat.value}
              onChange={(e) => handlePerformanceChange(idx, e.target.value)}
              className="form-input"
              placeholder={`Enter ${stat.label.toLowerCase()}`}
            />
          </div>
        ))}
      </div>

      <div className="form-section">
        <h3 className="form-section-title">Technical Sheet (PDF)</h3>
        <div className="form-group">
          <label className="form-label">PDF URL (Optional)</label>
          <input
            type="url"
            value={formData.technicalSheetPdf}
            onChange={handlePdfChange}
            className="form-input"
            placeholder="https://example.com/technical-sheet.pdf"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-submit">
          Add Vehicle
        </button>
      </div>
    </form>
  );
}