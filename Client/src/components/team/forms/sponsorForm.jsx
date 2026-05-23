import { useState } from 'react';
import '../../../styles/FormStyles.css';

const SponsorForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'title',
    website: '',
    logoFile: null,
    initials: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    if (name === 'name') {
      newFormData.initials = value.charAt(0).toUpperCase();
    }

    setFormData(newFormData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      logoFile: file
    }));
  };

const handleSubmit = (e) => {
  e.preventDefault();
  console.log('Sponsor submitted:', formData);
  onSubmit(formData);
};


  return (
    <div className="form-container">
      <h2 className="form-title">Add Sponsor</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Sponsor Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Company name"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">Sponsorship Level</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-input"
          >
            <option value="title">Title Sponsor</option>
            <option value="platinum">Platinum Sponsor</option>
            <option value="gold">Gold Sponsor</option>
            <option value="silver">Silver Sponsor</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="website" className="form-label">Website</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="logoFile" className="form-label">Logo</label>
          <input
            type="file"
            id="logoFile"
            onChange={handleFileChange}
            accept="image/*"
            className="form-input"
          />
        </div>

        <button type="submit" className="form-submit-btn">
          Add Sponsor
        </button>
      </form>
    </div>
  );
};

export default SponsorForm;
