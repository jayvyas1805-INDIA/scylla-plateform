import { useState } from 'react';
import '../../../styles/FormStyles.css';

const MediaForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaFile: null,
    type: 'image',
    url: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      mediaFile: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Media submitted:', formData);
    onSubmit(formData);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Media</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Media title"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the media..."
            className="form-textarea"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="type" className="form-label">Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="form-input"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="mediaFile" className="form-label">Upload File</label>
          <input
            type="file"
            id="mediaFile"
            onChange={handleFileChange}
            accept={formData.type === 'image' ? 'image/*' : 'video/*'}
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="form-submit-btn">
          Add Media
        </button>
      </form>
    </div>
  );
};

export default MediaForm;
