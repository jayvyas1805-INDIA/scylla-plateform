import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/navbar/Navbar';
import Footer from '../../../components/navbar/Footer';
import '../../../styles/landing-theme.css';
import './AboutUs.css';

const TEAMS = [
  {
    id: 1,
    name: 'Velocity Racing',
    icon: '🏎️',
    teams: 5,
    members: 42,
    description: 'Specializing in high-speed performance racing',
  },
  {
    id: 2,
    name: 'Thunder Miles',
    icon: '⚡',
    teams: 3,
    members: 28,
    description: 'Expert in endurance racing championships',
  },
  {
    id: 3,
    name: 'Rally Masters',
    icon: '🏁',
    teams: 7,
    members: 56,
    description: 'Leading rally sports organization',
  },
];

const VENDORS = [
  { name: 'PitTech Racing', category: 'California', rating: 4.8 },
  { name: 'Specialist Tires', category: 'Texas', rating: 4.9 },
  { name: 'Safety First Gear', category: 'Florida', rating: 4.6 },
  { name: 'Honda', category: 'All Regions', rating: 5.0 },
];

const PILLARS = [
  {
    icon: '🤝',
    title: 'Marketplace & Collaboration',
    text: "Our integrated marketplace connects vendors directly with active teams, reducing marketing costs and improving lead quality — while vendors get a targeted space to showcase their expertise to the wider motorsports community.",
  },
  {
    icon: '🛡️',
    title: 'Administration & Governance',
    text: 'Every team and vendor goes through identity verification, business validation, and compliance checks before joining — so the ecosystem stays trustworthy from day one.',
  },
  {
    icon: '🌐',
    title: 'Public Access & Transparency',
    text: 'Anyone can browse published profiles and marketplace listings without an account. Removing barriers to information keeps the community open and honest.',
  },
];

export default function AboutUs() {
  const navigate = useNavigate();
  const [expandedTeam, setExpandedTeam] = useState(null);

  return (
    <>
      <Navbar />
      <main className="lp-page">
        {/* HERO */}
        <section className="lp-section about-hero">
          <div className="lp-container about-hero-content">
            <span className="lp-eyebrow">About MotorSportHub</span>
            <h1 className="about-title">
              One platform for every part of the motorsports ecosystem
            </h1>
            <p className="about-description">
              MotorSportHub unites teams, vendors, event organizers, and enthusiasts
              in a single collaborative space — built to remove the friction that has
              long fragmented the motorsports industry.
            </p>
          </div>
        </section>

        {/* PLATFORM OVERVIEW */}
        <section className="lp-section">
          <div className="lp-container">
            <h2 className="lp-section-title">Platform Overview</h2>
            <div className="lp-card about-overview-box">
              <p className="about-text">
                MotorSportHub is a unified digital ecosystem that brings together
                every aspect of motorsport management and collaboration — eliminating
                the fragmentation that has long slowed the industry down.
              </p>
              <p className="about-text">
                Teams discover verified vendors, request quotes, manage documentation,
                and coordinate with event organizers in one place. Vendors gain access
                to a targeted marketplace where they connect directly with teams and
                showcase their expertise to the broader community.
              </p>
            </div>
          </div>
        </section>

        {/* MOTORSPORT TEAMS */}
        <section className="lp-section about-section-alt">
          <div className="lp-container">
            <div className="about-section-header">
              <div>
                <h2 className="lp-section-title">Motorsport Teams</h2>
                <p className="lp-section-subtitle about-header-subtitle">
                  Racing teams use our platform to manage operations, connect with
                  verified vendors, and showcase their achievements to the community.
                </p>
              </div>
              <button className="lp-btn lp-btn-outline" onClick={() => navigate('/teams')}>
                View All Teams
              </button>
            </div>

            <div className="about-cards-grid">
              {TEAMS.map((team) => (
                <div
                  key={team.id}
                  className={`lp-card about-team-card ${expandedTeam === team.id ? 'about-card-active' : ''}`}
                  onMouseEnter={() => setExpandedTeam(team.id)}
                  onMouseLeave={() => setExpandedTeam(null)}
                >
                  <div className="about-team-card-header">
                    <span className="about-team-icon">{team.icon}</span>
                    <div>
                      <h3 className="about-team-name">{team.name}</h3>
                      <p className="about-team-desc">{team.description}</p>
                    </div>
                  </div>

                  <div className="about-team-stats">
                    <div className="about-team-stat">
                      <span className="about-stat-value">{team.teams}</span>
                      <span className="about-stat-label">Teams</span>
                    </div>
                    <div className="about-team-stat">
                      <span className="about-stat-value">{team.members}</span>
                      <span className="about-stat-label">Members</span>
                    </div>
                  </div>

                  <button className="lp-btn lp-btn-outline lp-full-width" onClick={() => navigate('/teams')}>
                    View Team Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VENDORS */}
        <section className="lp-section">
          <div className="lp-container">
            <div className="about-section-header">
              <div>
                <h2 className="lp-section-title">Vendors & Service Providers</h2>
                <p className="lp-section-subtitle about-header-subtitle">
                  Our vetted vendor marketplace connects racing teams with trusted
                  suppliers and technical specialists across every motorsport category.
                </p>
              </div>
              <button className="lp-btn lp-btn-outline" onClick={() => navigate('/vendor')}>
                View All Vendors
              </button>
            </div>

            <div className="about-vendors-grid">
              {VENDORS.map((vendor, idx) => (
                <div key={idx} className="lp-card about-vendor-card">
                  <div className="about-vendor-header">
                    <span className="about-vendor-icon">🔧</span>
                    <h4 className="about-vendor-name">{vendor.name}</h4>
                  </div>
                  <div className="about-vendor-meta">
                    <span className="about-vendor-category">{vendor.category}</span>
                    <span className="about-vendor-rating">⭐ {vendor.rating}</span>
                  </div>
                  <button className="lp-btn lp-btn-outline lp-full-width" onClick={() => navigate('/vendor')}>
                    View Vendor
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PILLARS */}
        <section className="lp-section about-section-alt">
          <div className="lp-container">
            <h2 className="lp-section-title">How the Platform Works</h2>
            <div className="about-pillars-grid">
              {PILLARS.map((pillar) => (
                <div className="lp-card about-pillar-card" key={pillar.title}>
                  <div className="about-pillar-icon">{pillar.icon}</div>
                  <h3 className="about-pillar-title">{pillar.title}</h3>
                  <p className="about-pillar-text">{pillar.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VISION */}
        <section className="lp-section about-vision">
          <div className="lp-container lp-card about-vision-box">
            <h2 className="lp-section-title">Our Vision</h2>
            <p className="about-text about-vision-text">
              We envision a future where technology seamlessly connects every part of
              the motorsports industry — creating unprecedented opportunities for
              collaboration, growth, and innovation across every team and vendor on
              the platform.
            </p>
            <p className="about-text about-vision-text">
              As the platform evolves, we'll keep listening to your feedback, identify
              emerging needs, and build new features that support your success.
              Together, we're building the foundation for the next generation of
              motorsports excellence.
            </p>
            <button className="lp-btn lp-btn-primary lp-btn-lg" onClick={() => navigate('/contact')}>
              Get in Touch
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
