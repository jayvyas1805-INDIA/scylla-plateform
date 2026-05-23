import React, { useState } from "react";
import "./AddProductForm.css";
import "../../index.css"
import { addProduct } from "../../api/product.api";

const AddProductForm = ({ onClose, onAdd }) => {
  // const [formData, setFormData] = useState({
  //   title: "",
  //   model: "",
  //   performance: "",
  //   price: "",
  //   condition: "",
  //   tags: [],
  //   status: "",
  //   image: null,
  //   preview: null
  // });

  const [formData, setFormData] = useState({
    name: '',
    model: '',
    year: '',
    condition: 'new',
    category: 'Engine Parts',
    brand: '',
    description: '',
    price: '',
    imageFile: null,   // ✅ store File
    tags: ''
  });

  const tagColors = [
    { name: 'Premium', color: '#6366f1' },
    { name: 'Limited', color: '#ec4899' },
    { name: 'Fast Shipping', color: '#f59e0b' },
    { name: 'Certified', color: '#10b981' },
    { name: 'Best Deal', color: '#06b6d4' },
    { name: 'Trending', color: '#8b5cf6' },
  ];

  const performanceOptions = ["High", "Mid", "Low"];
  const conditionOptions = ["new", "used", "refurbished"];
  const tagOptions = [
    "High Class",
    "All Season",
    "Performance Street",
    "SUV Performance",
    "Comfort Focus"
  ];
  const statusOptions = ["In Stock", "Limited", "Refurbished"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({
      ...formData,
      image: file,
      preview: URL.createObjectURL(file)
    });
  };



  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    setFormData(prev => ({
      ...prev,
      imageFile: file,        // the real file
      preview: reader.result, // the preview URL
    }));
  };
  reader.readAsDataURL(file);
};



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.imageFile || !formData.description) {
      alert("Please fill all required fields");
      return;
    }

    const tagsArray = formData.tags
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    const data = new FormData();

    // 🔑 Backend field names
    data.append("title", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("brand", formData.brand);
    data.append("model", formData.model);
    data.append("year", formData.year);
    data.append("condition", formData.condition);
    data.append("tags", JSON.stringify(tagsArray));

    // 🔥 MUST be "images"
    data.append("images", formData.imageFile);

    await onAdd(data);   // 👈 send FormData

    onClose();
  };

  return (
    <div className="add-product-overlay">
      <div className="add-product-card">

        <h2 className="form-title">Add New Tyre Product</h2>

        <form className="product-form" onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="model"
            placeholder="Model / Size (e.g. 205/55 R16)"
            value={formData.model}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="year" placeholder="year"
            value={formData.year}
            onChange={handleChange}
            className="form-input"
          />

          {/* <select
            name="performance"
            value={formData.performance}
            onChange={handleChange}
            required
          >
            <option value="">Select Performance</option>
            {performanceOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select> */}

          <label className="form-label">condition</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
          >
            <option value="">Select Condition</option>
            {conditionOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label className="form-label">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
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

          <label className="form-label">Brand</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="e.g., Apple"
            className="form-input"
          />
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your product in detail..."
            className="form-textarea"
            rows="4"
          />

          <label className="form-label">Price</label>
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={formData.price}
            onChange={handleChange}
            required
          />

          {/* TAGS */}
          <div className="tag-group">


            <label className="form-label">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., Premium, Fast Shipping, Limited"
              className="form-input"
            />
            <p className="form-hint">Suggested tags: {tagColors.map(t => t.name).join(', ')}</p>

          </div>

          {/* STATUS */}
          {/* <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">Stock Status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select> */}

          {/* IMAGE */}
          <div className="image-upload">
            <input
              type="file"
              accept="image/*"
              name="imageFile"
              onChange={handleImageChange}
              required
            />

            {formData.preview && (
              <img src={formData.preview} alt="Preview" className="image-preview" />
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Product
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
