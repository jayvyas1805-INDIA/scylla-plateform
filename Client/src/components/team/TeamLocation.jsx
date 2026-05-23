import '../../styles/SectionStyles.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


const TeamLocation = ({ teamData,onEditClick }) => {
  const locations = [
    { icon: '🏢', name: 'MIT Motorsports Lab' },
    { icon: '📍', name: 'Kote road' },
    { icon: '🏙️', name: 'Pune' },
    { icon: '🇮🇳', name: 'India' }
  ];

  // const lat = teamData?.location?.lat || 23.0225; // default to Ahmedabad if not provided
  // const lng = teamData?.location?.lng || 72.5714;

  return (
    <section className="content-section">
      <div className="section-header">
        <h2 className="section-title">Team Location</h2>
        <button className="edit-icon-btn" onClick={onEditClick} aria-label="Edit team location">
          ✏️
        </button>
      </div>
      
      <div className="location-content">
        <div className="location-list">
          <h3 className="location-title">Headquarters</h3>
          <div className="location-items">
            
                
                <span className="location-name">{teamData?.location?.address}</span>
          </div>
        </div>

         <div className="location-map">
          <div className="map-placeholder">
          {/* 🔹 Replace placeholder with Leaflet map */}
          {/* <MapContainer
            center={[teamData?.location?.lat, teamData?.location?.lng]}
            zoom={15}
            style={{ height: '250px', width: '100%', borderRadius: '8px' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[teamData?.location?.lat, teamData?.location?.lng]} />
          </MapContainer> */}
          {teamData?.location?.lat && (
                 <MapContainer
                    center={[teamData?.location.lat, teamData?.location.lng]}
                     zoom={13}
                    style={{height: '100%', width: '100%', borderRadius: '8px' }}
                   >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                     <Marker position={[teamData?.location.lat, teamData?.location.lng]} />
                   </MapContainer>
                 )}
                 </div>
        </div>
      </div>
    </section>
  );
};

export default TeamLocation;
