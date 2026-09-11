import '../../styles/SectionStyles.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


const TeamLocation = ({ teamData, onEditClick }) => {
  const hasCoords = teamData?.location?.lat && teamData?.location?.lng;

  return (
    <section className="content-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="section-icon-badge" style={{ '--badge-color': 'var(--tertiary)' }}>📍</span>
          <h2 className="section-title">Team Location</h2>
        </div>
        <button className="edit-icon-btn" onClick={onEditClick} aria-label="Edit team location">
          ✏️
        </button>
      </div>

      <div className="location-content">
        <div className="location-list">
          <h3 className="location-title">Headquarters</h3>
          <div className="location-items">
            <div className="location-item">
              <span className="location-icon">📍</span>
              <span className="location-name">
                {teamData?.location?.address || "No address added yet"}
              </span>
            </div>
          </div>
        </div>

        <div className="location-map">
          <div className={`map-placeholder${hasCoords ? ' has-map' : ''}`}>
            {hasCoords ? (
              <MapContainer
                center={[teamData.location.lat, teamData.location.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%', borderRadius: '10px' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[teamData.location.lat, teamData.location.lng]} />
              </MapContainer>
            ) : (
              <>
                <span className="map-text">🗺️</span>
                <p className="map-subtitle">Add coordinates to show your location on the map</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamLocation;
