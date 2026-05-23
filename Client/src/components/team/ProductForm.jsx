import React, { useState } from 'react';
import '../../styles/product-form.css';

const ProductForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    year: new Date().getFullYear(),
    condition: 'new',
    category: 'Engine Parts',
    brand: '',
    description: '',
    price: '',
    imageFile: null,   // ✅ store File
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);



  const [previewImage, setPreviewImage] = useState(null);

  const tagColors = [
    { name: 'Premium', color: '#6366f1' },
    { name: 'Limited', color: '#ec4899' },
    { name: 'Fast Shipping', color: '#f59e0b' },
    { name: 'Certified', color: '#10b981' },
    { name: 'Best Deal', color: '#06b6d4' },
    { name: 'Trending', color: '#8b5cf6' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData(prev => ({
      ...prev,
      imageFile: file   // ✅ real file
    }));

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // 🛑 extra safety

    if (!formData.name || !formData.price || !formData.imageFile) {
      alert("Please fill all required fields");
      return;
    }

    
      setIsSubmitting(true); // 🔒 disable buttons

      const tagsArray = formData.tags
        .split(",")
        .map(t => t.trim())
        .filter(Boolean);

      const data = new FormData();

      data.append("title", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("brand", formData.brand);
      data.append("model", formData.model);
      data.append("year", formData.year);
      data.append("condition", formData.condition);
      data.append("tags", JSON.stringify(tagsArray));
      data.append("images", formData.imageFile);

      await onSubmit(data);   // 🔥 API call

      onClose();
   
  };


  return (
    <div className="product-form-overlay">
      <div className="product-form-container">
        <div className="product-form-header">
          <h2 className="product-form-title">Add New Product</h2>
          <button
            className="product-form-close"
            onClick={onClose}
            aria-label="Close form"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="product-form-scroll">
            {/* Product Image */}
            <div className="form-group">
              <label className="form-label">Product Image *</label>
              <div className="image-upload-area">
                {previewImage ? (
                  <div className="image-preview">
                    <img src={previewImage} alt="Product preview" />
                    <button
                      type="button"
                      className="image-change-btn"
                      onClick={() => document.getElementById('imageInput').click()}
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <div
                    className="image-upload-placeholder"
                    onClick={() => document.getElementById('imageInput').click()}
                  >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <p>Click to upload image</p>
                  </div>
                )}
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden-input"
                />
              </div>
            </div>

            {/* Product Name */}
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., iPhone 15 Pro Max"
                className="form-input"
                required
              />
            </div>

            {/* Two Column Layout */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g., Apple"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="e.g., A2846"
                  className="form-input"
                />
              </div>
            </div>

            {/* Condition and Year */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Condition *</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="new">New</option>
                  <option value="refurbished">Refurbished</option>
                  <option value="used">Used</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="Engine Parts">Engine Parts</option>
                <option value="Tyres & Wheels">Tyres & Wheels</option>
                <option value="Brake System">Brake System</option>
                <option value="Suspension">Suspension</option>
                <option value="Exhaust System">Exhaust System</option>
                <option value="Interior Upgrades">Interior Upgrades</option>
                <option value="Body Kits">Body Kits</option>
                <option value="Fluids & Lubricants">Fluids & Lubricants</option>
                <option value="Electronics & Gauges">Electronics & Gauges</option>
                <option value="Cooling System">Cooling System</option>
                <option value="Transmission">Transmission</option>
                <option value="Fuel System">Fuel System</option>
              </select>
            </div>

            {/* Price */}
            <div className="form-group">
              <label className="form-label">Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                className="form-input"
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product in detail..."
                className="form-textarea"
                rows="4"
              />
            </div>

            {/* Tags */}
            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., Premium, Fast Shipping, Limited"
                className="form-input"
              />
              <p className="form-hint">Suggested tags: {tagColors.map(t => t.name).join(', ')}</p>
            </div>
          </div>

          <div className="product-form-footer">
            <button
              type="button"
              className="form-btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="form-btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Product"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
