import { useState } from 'react';
import '../../../styles/FormStyles.css';

const SocialForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    platform: 'Instagram',
    handle: '',
    url: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Social link submitted:', formData);
    onSubmit(formData);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Social Link</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="platform" className="form-label">Platform</label>
          <select
            id="platform"
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            className="form-input"
          >
            <option value="Instagram">Instagram</option>
            <option value="YouTube">YouTube</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Facebook">Facebook</option>
            <option value="Twitter">Twitter</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="handle" className="form-label">Handle/Username</label>
          <input
            type="text"
            id="handle"
            name="handle"
            value={formData.handle}
            onChange={handleChange}
            placeholder="e.g., @thunderracing or Thunder Racing Team"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="url" className="form-label">URL</label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://instagram.com/thunderracing"
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="form-submit-btn">
          Add Social Link
        </button>
      </form>
    </div>
  );
};

export default SocialForm;
