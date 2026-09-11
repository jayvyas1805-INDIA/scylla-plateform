import { useState } from 'react';
import '../../../styles/FormStyles.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const TeamDescriptionForm = ({ teamData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
  name: teamData?.name || "",
  tagline: teamData?.tagline || "",
  location: teamData?.location || { address: "", lat: "", lng: "" },
  description: teamData?.description || "",
  logo : teamData?.logo || "",

});

 const [location, setLocation] = useState({
    address: "",
    lat: null,
    lng: null
  });

   const [showMap, setShowMap] = useState(false);

  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "location") {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, address: value }
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
};


  const handleSubmit = (e) => {
  e.preventDefault();

  // Merge selected map location into formData
  const updatedData = {
    ...formData,
    location: {
      address: location.address || formData.location.address,
      lat: location.lat || formData.location.lat,
      lng: location.lng || formData.location.lng
    }
  };

  console.log('Submitting team data:', updatedData);
  onSubmit(updatedData); // now teamData in parent gets correct location
};



  const MapClickHandler = () => {
      useMapEvents({
        async click(e) {
          const { lat, lng } = e.latlng;
  
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();
  
          setLocation({
            address: data.display_name || "",
            lat,
            lng
          });
  
  
  
        }
      });
  
      return null;
    };
  

  return (
    <div className="form-container">
      <h2 className="form-title">Edit Team Information</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="teamName" className="form-label">Team Name</label>
          <input
            type="text"
            id="teamName"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tagline" className="form-label">Tagline</label>
          <input
            type="text"
            id="tagline"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          {/* <label htmlFor="location" className="form-label">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location.address}
            onChange={handleChange}
            className="form-input"
          /> */}

           <label htmlFor="location" className='form-label'>Location</label>
          
                    <textarea
                      name="address"
                      placeholder="Select address from map"
                      value={location.address || formData.location.address}
                      readOnly
                    />
          
          
                    <button
                      type="button"
                      className="map-toggle-btn"
                      onClick={() => setShowMap(!showMap)}
                    >
                      📍 Pick from Map
                    </button>
          
                    {showMap && (
                      <MapContainer
                        center={[location.lat || 23.0225, location.lng || 72.5714]}
                        zoom={13}
                        style={{ height: "300px", marginTop: "10px" }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
                        <MapClickHandler />   {/* ✅ THIS IS IMPORTANT */}
          
                        {location.lat && (
                          <Marker position={[location.lat, location.lng]} />
                        )}
                      </MapContainer>
                    )}
          
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Team Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            rows="6"
            required
          />
        </div>

        <button type="submit" className="form-submit-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default TeamDescriptionForm;
