import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/navbar/Navbar';
import Footer from '../../../components/navbar/Footer';
import { getAllVendors } from '../../../api/vendor.api';
import '../../../styles/landing-theme.css';
import './VendorsDirectory.css';

export default function VendorsDirectory() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const res = await getAllVendors();
        setVendors(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to load vendors', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter((vendor) => {
    if (!searchTerm.trim()) return true;

    const q = searchTerm.toLowerCase();

    return (
      vendor.businessName?.toLowerCase().includes(q) ||
      vendor.category?.toLowerCase().includes(q) ||
      vendor.location?.toLowerCase().includes(q)
    );
  });

  const formatVendorSince = (date) => {
    if (!date) return null;

    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      <Navbar />

      <main className="lp-page">
        <section className="lp-section vendors-dir-hero">
          <div className="lp-container">
            <span className="lp-eyebrow">Marketplace</span>

            <h1 className="vendors-dir-title">
              Browse Vendors
            </h1>

            <p className="lp-section-subtitle vendors-dir-subtitle">
              Explore verified vendors on the platform — see their services,
              products, and completed projects.
            </p>

            <input
              type="text"
              className="vendors-dir-search"
              placeholder="Search vendors by name, category, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        <section className="lp-section vendors-dir-list-section">
          <div className="lp-container">

            {loading && (
              <div className="vendors-dir-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    className="lp-card vendors-dir-skeleton-card"
                    key={i}
                  >
                    <div className="skeleton vendors-dir-skeleton-logo" />

                    <div className="skeleton vendors-dir-skeleton-line" />

                    <div
                      className="skeleton vendors-dir-skeleton-line"
                      style={{ width: '60%' }}
                    />
                  </div>
                ))}
              </div>
            )}

            {!loading && error && (
              <p className="vendors-dir-empty">
                Couldn't load vendors right now — please try again shortly.
              </p>
            )}

            {!loading && !error && filteredVendors.length === 0 && (
              <p className="vendors-dir-empty">
                {vendors.length === 0
                  ? 'No vendors have joined the platform yet.'
                  : 'No vendors match your search.'}
              </p>
            )}

            {!loading && !error && filteredVendors.length > 0 && (
              <div className="vendors-dir-grid">

                {filteredVendors.map((vendor) => (
                  <button
                    key={vendor._id}
                    className="lp-card vendors-dir-card"
                    onClick={() =>
                      navigate(`/vendors-directory/${vendor._id}`)
                    }
                  >
                    {/* Logo */}
                    <div className="vendors-dir-card-logo">
                      {vendor.logo ? (
                        <img
                          src={vendor.logo}
                          alt={vendor.businessName}
                        />
                      ) : (
                        <span>🏪</span>
                      )}
                    </div>

                    {/* Vendor Name */}
                    <h3 className="vendors-dir-card-name">
                      {vendor.businessName}
                    </h3>

                    {/* Category + Location */}
                    <div className="vendors-dir-card-meta">
                      {vendor.category && (
                        <span className="vendors-dir-card-tag">
                          {vendor.category}
                        </span>
                      )}

                      {vendor.location && (
                        <span className="vendors-dir-card-location">
                          📍 {vendor.location}
                        </span>
                      )}
                    </div>

                    {/* Vendor Since */}
                    {vendor.createdAt && (
                      <div className="vendors-dir-card-since">
                        Vendor since {formatVendorSince(vendor.createdAt)}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="vendors-dir-card-footer">
                      <span className="vendors-dir-card-view">
                        View Profile →
                      </span>
                    </div>
                  </button>
                ))}

              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}