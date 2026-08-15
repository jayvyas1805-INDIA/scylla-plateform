import React, { useState } from 'react';
import Navbar from '../../../components/navbar/Navbar';
import Footer from '../../../components/navbar/Footer';
import '../../../styles/aboutUs.css';


export default function AboutUs() {
  const [expandedTeam, setExpandedTeam] = useState(null);

  const teams = [
    {
      id: 1,
      name: 'Velocity Racing',
      icon: '🏎️',
      teams: 5,
      members: 42,
      description: 'Specializing in high-speed performance racing'
    },
    {
      id: 2,
      name: 'Thunder Miles',
      icon: '⚡',
      teams: 3,
      members: 28,
      description: 'Expert in endurance racing championships'
    },
    {
      id: 3,
      name: 'Rally Masters',
      icon: '🏁',
      teams: 7,
      members: 56,
      description: 'Leading rally sports organization'
    }
  ];

  const vendors = [
    { name: 'PitTech Racing', category: 'California', rating: 4.8 },
    { name: 'Specialist Tires', category: 'Texas', rating: 4.9 },
    { name: 'Safety First Gear', category: 'Florida', rating: 4.6 },
    { name: 'Honda', category: 'All', rating: 5.0 }
  ];

  return (
    <>
      <Navbar />
      <main className="land-about-us-container">
        {/* Hero Section */}
        <section className="land-about-hero">
          <div className="land-about-hero-content">
            <h1 className="land-about-title">About Us</h1>
            <p className="land-about-description">
              MotorSportHub is a comprehensive digital ecosystem designed to unite the motorsports community under one platform. We connect teams, vendors, event organizers, and motorsport enthusiasts to create a seamless collaborative environment.
            </p>
          </div>
        </section>

        {/* Platform Overview */}
        <section className="land-section-white">
          <div className="land-section-container">
            <h2 className="land-section-title">Platform Overview</h2>
            <p className="land-section-text">
              MotorSportHub represents a unified digital ecosystem that brings together every aspect of motorsport management and collaboration. Our platform eliminates the fragmentation that has long plagued the motorsports industry by providing a centralized space where teams, vendors, event organizers, and enthusiasts can seamlessly connect.
            </p>
            <p className="land-section-text">
              The platform facilitates seamless communication between stakeholders, enabling teams to discover verified vendors, request quotes, manage documentation, and coordinate with event organizers. Meanwhile, vendors gain access to a targeted marketplace where they can connect directly with teams, showcasing their expertise to the broader motorsports community.
            </p>
            <p className="land-section-text">
              By digitizing and streamlining these processes, we're not just improving efficiency – we're fostering a more connected and collaborative motorsports ecosystem that benefits everyone involved.
            </p>
          </div>
        </section>

        {/* Motorsport Teams */}
        <section className="land-section-gray">
          <div className="land-section-container">
            <h2 className="land-section-title">Motorsport Teams</h2>
            <p className="land-section-subtitle">
              Racing teams use our platform to manage their operations, connect with verified vendors, coordinate with event organizers, and showcase their achievements to the motorsports community.
            </p>

            <div className="land-teams-grid">
              {teams.map(team => (
                <div
                  key={team.id}
                  className={`land-team-card ${expandedTeam === team.id ? 'expanded' : ''}`}
                  onMouseEnter={() => setExpandedTeam(team.id)}
                  onMouseLeave={() => setExpandedTeam(null)}
                >
                  <div className="land-team-card-header">
                    <span className="land-team-icon">{team.icon}</span>
                    <h3 className="land-team-name">{team.name}</h3>
                  </div>
                  <div className="land-team-card-body">
                    <div className="land-team-stat">
                      <span className="land-stat-value">{team.teams}</span>
                      <span className="land-stat-label">Teams</span>
                    </div>
                    <div className="land-team-stat">
                      <span className="land-stat-value">{team.members}</span>
                      <span className="land-stat-label">Members</span>
                    </div>
                  </div>
                  <button className="land-team-button">View Team Profile</button>
                </div>
              ))}
            </div>

            <button className="land-view-all-button">View All Teams</button>
          </div>
        </section>

        {/* Vendors & Service Providers */}
        <section className="land-section-white">
          <div className="land-section-container">
            <h2 className="land-section-title">Vendors & Service Providers</h2>
            <p className="land-section-subtitle">
              Our vetted vendor marketplace connects racing teams with trusted suppliers, parts suppliers, and technical specialists across all motorsports categories.
            </p>

            <div className="land-vendors-grid">
              {vendors.map((vendor, idx) => (
                <div key={idx} className="land-vendor-card">
                  <div className="land-vendor-header">
                    <span className="land-vendor-icon">🔧</span>
                    <h4 className="land-vendor-name">{vendor.name}</h4>
                  </div>
                  <div className="land-vendor-info">
                    <span className="land-vendor-category">{vendor.category}</span>
                    <span className="land-vendor-rating">⭐ {vendor.rating}</span>
                  </div>
                  <button className="land-vendor-button">View Vendor</button>
                </div>
              ))}
            </div>

            <button className="land-view-all-button">View All Services</button>
          </div>
        </section>

        {/* Marketplace & Collaboration */}
        <section className="land-section-gray">
          <div className="land-section-container">
            <h2 className="land-section-title">Marketplace & Collaboration</h2>
            <p className="land-section-text">
              Our integrated marketplace democratizes how motorsport teams and vendors connect and collaborate. Vendors benefit from direct access to active teams, reducing marketing costs and improving lead quality. Simultaneously, vendors gain access to a targeted marketplace where they can connect directly with teams, showcasing their expertise to the broader motorsports community.
            </p>
            <p className="land-section-text">
              The platform's collaboration features embed organizational transparency while maintaining professional standards. Vendors are vetted through a multi-stage verification process, ensuring that only legitimate businesses with proven expertise can participate in the marketplace.
            </p>
            <p className="land-section-text">
              By digitizing and streamlining these processes, we're not just improving efficiency – we're fostering a more connected and collaborative motorsports ecosystem that benefits everyone involved.
            </p>
          </div>
        </section>

        {/* Administration & Governance */}
        <section className="land-section-white">
          <div className="land-section-container">
            <h2 className="land-section-title">Administration & Governance</h2>
            <p className="land-section-text">
              Strong governance frameworks are essential to maintaining a trustworthy ecosystem. Our administration tools empower platform stewards with the visibility and control needed to ensure teams and vendors meet professional standards before joining the community. This includes identity verification, business validation, and compliance checks to maintain ecosystem integrity.
            </p>
            <p className="land-section-text">
              Our administrative team oversees content moderation, manages motorsport category structures, and ensures platform resources remain current, relevant, and properly categorized for easy discovery and organization of the platform ecosystems current, relevant, and properly categorized for easy discovery.
            </p>
          </div>
        </section>

        {/* Public Access & Transparency */}
        <section className="land-section-gray">
          <div className="land-section-container">
            <h2 className="land-section-title">Public Access & Transparency</h2>
            <p className="land-section-text">
              MotorsportHub believes in the power of transparency to give the motorsports community. Our public portal allows anyone to browse published profiles, explore marketplace listings, and request information about teams and vendors in the motorsports ecosystem. By removing barriers to information access, we're fostering a more inclusive and transparent motorsports community.
            </p>
            <p className="land-section-text">
              Public profiles for teams and vendors showcase achievements, services, and specializations, making it easy for prospects and collaborators to discover the right partners. Meanwhile, published marketplace listings and vendor information ensure that the wider motorsports ecosystem is transparent and accessible to enthusiasts worldwide.
            </p>
          </div>
        </section>

        {/* Our Vision */}
        <section className="land-section-white">
          <div className="land-section-container">
            <h2 className="land-section-title">Our Vision</h2>
            <p className="land-section-text">
              We envision a future where technology seamlessly connects every aspect of the motorsports industry, creating unprecedented opportunities for collaboration, growth, and innovation. We're committed to maintaining collaboration, growth, and innovation. We're committed to maintaining cultural barriers and fostering a unified, professional motorsports ecosystem.
            </p>
            <p className="land-section-text">
              As the platform evolves, we'll continue to listen to your feedback, identify emerging needs, and build new features that support your success. Together, we're building the foundation for the next generation of motorsports excellence.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
