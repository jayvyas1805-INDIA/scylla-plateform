import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/navbar/Navbar';
import Footer from '../../../components/navbar/Footer';
import { getPublicVendorProfile } from '../../../api/vendor.api';
import '../../../styles/landing-theme.css';
import './PublicVendorProfile.css';

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'products', label: 'Products & Services' },
  { key: 'projects', label: 'Projects' },
];

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function PublicVendorProfile() {
  const { vendorId } = useParams();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const res = await getPublicVendorProfile(vendorId);
        setVendor(res.data);
      } catch (err) {
        console.error('Failed to load vendor profile', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (vendorId) fetchVendor();
  }, [vendorId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="lp-page pvp-page">
          <div className="lp-container pvp-loading">
            <div className="skeleton pvp-skeleton-header" />
            <div className="skeleton pvp-skeleton-block" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (notFound || !vendor) {
    return (
      <>
        <Navbar />
        <main className="lp-page pvp-page">
          <div className="lp-container pvp-notfound">
            <h1 className="lp-section-title">Vendor Not Found</h1>
            <p className="lp-section-subtitle">
              This vendor profile doesn't exist or isn't public yet.
            </p>
            <button className="lp-btn lp-btn-primary" onClick={() => navigate('/vendors-directory')}>
              ← Back to Vendors
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const businessHours = Array.isArray(vendor.businessHours) && vendor.businessHours.length > 0
    ? [...vendor.businessHours].sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day))
    : null;

  return (
    <>
      <Navbar />
      <main className="lp-page pvp-page">
        {/* HEADER */}
        <section className="lp-section pvp-header">
          <div className="lp-container">
            <div className="lp-card pvp-header-card">
              <div className="pvp-header-content">
                <div className="pvp-logo">
                  {vendor.logo ? <img src={vendor.logo} alt={vendor.businessName} /> : <span>🏪</span>}
                </div>
                <div className="pvp-header-info">
                  <h1 className="pvp-name">{vendor.businessName}</h1>
                  <div className="pvp-meta-row">
                    {vendor.category && <span className="pvp-tag">{vendor.category}</span>}
                    {vendor.location && <span className="pvp-meta-item">📍 {vendor.location}</span>}
                    <span className="pvp-meta-item">
                      📦 {vendor.products?.length || 0} Listing{vendor.products?.length === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TABS */}
        <section className="pvp-tabs-section">
          <div className="lp-container pvp-tabs-bar">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`pvp-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                {tab.key === 'products' && ` (${vendor.products?.length || 0})`}
                {tab.key === 'projects' && ` (${vendor.projects?.length || 0})`}
              </button>
            ))}
          </div>
        </section>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <section className="lp-section">
            <div className="lp-container pvp-profile-grid">
              <div className="pvp-profile-main">
                <div className="lp-card pvp-block">
                  <h2 className="pvp-block-title">About</h2>
                  <p className={`pvp-about-text ${!vendor.companyDesc && !vendor.description ? 'pvp-empty' : ''}`}>
                    {vendor.companyDesc || vendor.description || "This vendor hasn't added a description yet."}
                  </p>
                </div>

                <div className="lp-card pvp-block">
                  <h2 className="pvp-block-title">Services Offered</h2>
                  {vendor.services?.length > 0 ? (
                    <div className="pvp-services-grid">
                      {vendor.services.map((s, i) => (
                        <div className="pvp-service-item" key={i}>
                          <span className="pvp-service-icon">{s.icon || '🔧'}</span>
                          <span className="pvp-service-name">{s.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="pvp-empty">No services listed yet.</p>
                  )}
                </div>

                <div className="lp-card pvp-block">
                  <h2 className="pvp-block-title">Media Gallery</h2>
                  {vendor.gallery?.length > 0 ? (
                    <div className="pvp-gallery-grid">
                      {vendor.gallery.map((src, i) => (
                        <img key={i} src={src} alt={`Gallery ${i + 1}`} className="pvp-gallery-item" />
                      ))}
                    </div>
                  ) : (
                    <p className="pvp-empty">No media uploaded yet.</p>
                  )}
                </div>
              </div>

              <aside className="pvp-profile-side">
                <div className="lp-card pvp-block">
                  <h2 className="pvp-block-title">Business Hours</h2>
                  {businessHours ? (
                    <div className="pvp-hours-list">
                      {businessHours.map((h, i) => (
                        <div className="pvp-hours-row" key={i}>
                          <span className="pvp-hours-day">{h.day}</span>
                          <span className="pvp-hours-time">
                            {h.closed ? 'Closed' : `${h.start || '—'} - ${h.end || '—'}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="pvp-empty">Business hours not listed yet.</p>
                  )}
                </div>
              </aside>
            </div>
          </section>
        )}

        {/* PRODUCTS & SERVICES TAB */}
        {activeTab === 'products' && (
          <section className="lp-section">
            <div className="lp-container">
              {vendor.products?.length > 0 ? (
                <div className="pvp-products-grid">
                  {vendor.products.map((p) => (
                    <div className="lp-card pvp-product-card" key={p._id}>
                      <div className="pvp-product-image-wrapper">
                        <img src={p.images?.[0]} alt={p.title} className="pvp-product-image" />
                      </div>
                      <div className="pvp-product-body">
                        <h3 className="pvp-product-title">{p.title}</h3>
                        <p className="pvp-product-price">${p.price}</p>
                        <p className="pvp-product-desc">{p.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="pvp-empty pvp-empty-section">This vendor hasn't listed any products yet.</p>
              )}
            </div>
          </section>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <section className="lp-section">
            <div className="lp-container">
              {vendor.projects?.length > 0 ? (
                <div className="pvp-projects-grid">
                  {vendor.projects.map((proj, i) => (
                    <div className="lp-card pvp-project-card" key={i}>
                      {proj.image && (
                        <div className="pvp-project-image-wrapper">
                          <img src={proj.image} alt={proj.title} className="pvp-project-image" />
                        </div>
                      )}
                      <div className="pvp-project-body">
                        <h3 className="pvp-project-title">{proj.title}</h3>
                        {proj.desc && <p className="pvp-project-desc">{proj.desc}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="pvp-empty pvp-empty-section">This vendor hasn't added any projects yet.</p>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
