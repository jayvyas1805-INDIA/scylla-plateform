import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function SupportHelp() {
  const navigate = useNavigate();
  
  // Map configuration - CHANGE THESE VALUES TO UPDATE THE MAP LOCATION
  const mapConfig = {
    latitude: 40.7128,
    longitude: -74.0060,
    zoom: 15,
    city: 'Vadodara, Gujarat',
    address: '123 Motorsports Avenue, New York, NY 10001',
  };

  // Generate map embed URL with updated coordinates
  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2!2d${mapConfig.longitude}!3d${mapConfig.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a28c5b3b1ff%3A0x0!2sMotorsports%20Platform!5e0!3m2!1sen!2sus!4v1700000000000`;

  const supportOptions = [
    { icon: '📧', title: 'Email Support', description: 'support@motorsports.com', color: 'support-card-1' },
    { icon: '⏰', title: 'Business Hours', description: 'Mon - Fri, 9AM - 6PM', color: 'support-card-2' },
    { icon: '⚡', title: 'Response Time', description: 'Within 24 hours', color: 'support-card-3' },
    { icon: '🔴', title: 'Priority Support', description: 'For urgent issues', color: 'support-card-4' },
  ];

  const platformInfo = [
    { icon: '🏢', title: 'Platform Name', description: 'Motorsports Platform Global' },
    { icon: '📍', title: 'Registered Office', description: 'New York, United States' },
    { icon: '🕐', title: 'Working Days', description: 'Monday - Friday' },
    { icon: '⏱️', title: 'Time Zone', description: 'GMT-5 (Eastern Standard Time)' },
  ];

  const faqLinks = [
    { icon: '✓', title: 'Account Verification', description: 'Steps to verify your account and increase limits' },
    { icon: '🤝', title: 'Team & Vendor Approval', description: 'Learn about team and vendor approval process' },
    { icon: '📋', title: 'Event Listings', description: 'How to list and manage your events on the platform' },
    { icon: '👤', title: 'Marketplace Queries', description: 'Find answers to common marketplace questions' },
    { icon: '🔒', title: 'Profile Moderation', description: 'Understand our profile moderation policies' },
    { icon: '🔧', title: 'Technical Issues', description: 'Troubleshoot common technical problems' },
  ];

  return (
    <div className="container">
      {/* Support Section */}
      <section className="support-section">
        <h1 className="support-title">Support & Help Information</h1>
        <p className="support-subtitle">Alternative ways to reach us</p>
        
        <div className="support-cards">
          {supportOptions.map((option, index) => (
            <div key={index} className={`support-card ${option.color}`}>
              <div className="support-icon">{option.icon}</div>
              <h3 className="support-card-title">{option.title}</h3>
              <p className="support-card-text">{option.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Information Section */}
      <section className="platform-section">
        <div className="platform-content">
          <div>
            <h2 className="support-title" style={{ textAlign: 'left' }}>Platform Information</h2>
            <ul className="platform-list">
              {platformInfo.map((item, index) => (
                <li key={index} className="platform-item">
                  <span className="platform-icon">{item.icon}</span>
                  <div className="platform-info">
                    <div className="platform-item-title">{item.title}</div>
                    <div className="platform-item-description">{item.description}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="platform-map">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location Map"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="faq-title">Frequently Asked Help Links</h2>
        <p className="faq-subtitle">Quick navigation to important resources</p>
        
        <div className="faq-cards">
          {faqLinks.map((link, index) => (
            <div key={index} className="faq-card">
              <div className="faq-icon">{link.icon}</div>
              <h3 className="faq-card-title">{link.title}</h3>
              <p className="faq-card-description">{link.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Data Privacy & Security Section */}
      <section className="privacy-section">
        <div className="privacy-card">
          <div className="privacy-header">
            <div className="privacy-icon">🛡️</div>
            <div>
              <h2 className="privacy-title">Data Privacy & Security</h2>
              <p className="privacy-description">
                Your privacy and security are our top priorities. We are committed to handling all contact information with utmost care.
              </p>
            </div>
          </div>
          
          <ul className="privacy-list">
            <li className="privacy-item">
              <span className="privacy-checkmark">✓</span>
              <span>Secure handling of all user data</span>
            </li>
            <li className="privacy-item">
              <span className="privacy-checkmark">✓</span>
              <span>Full compliance with GDPR and platform privacy standards</span>
            </li>
            <li className="privacy-item">
              <span className="privacy-checkmark">✓</span>
              <span>No storage or unauthorized sharing of contact information</span>
            </li>
          </ul>
          
          <a href="#privacy-policy" className="privacy-link">Read our full Privacy Policy →</a>
        </div>
      </section>

      {/* Footer Section */}
      <section className="footer-section">
        <div className="footer-icon">🏁</div>
        <h2 className="footer-title">We Look Forward to Hearing From You</h2>
        <p className="footer-subtitle">Together, we're building and supporting the motorsports ecosystem of tomorrow</p>
        
        <div className="footer-buttons">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            📝 Submit an Inquiry
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
        </div>

        <div className="footer-branding">
          <span className="footer-logo">🏁</span>
          <span>Motorsports Platform Global</span>
        </div>
      </section>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SupportHelp() {
  const navigate = useNavigate();
  
  // Map configuration - CHANGE THESE VALUES TO UPDATE THE MAP LOCATION
  const mapConfig = {
    latitude: 40.7128,
    longitude: -74.0060,
    zoom: 15,
    city: 'New York, NY',
    address: '123 Motorsports Avenue, New York, NY 10001',
  };

  // Generate map embed URL with updated coordinates
  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2!2d${mapConfig.longitude}!3d${mapConfig.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a28c5b3b1ff%3A0x0!2sMotorsports%20Platform!5e0!3m2!1sen!2sus!4v1700000000000`;

  const supportOptions = [
    { icon: '📧', title: 'Email Support', description: 'support@motorsports.com', color: 'support-card-1' },
    { icon: '⏰', title: 'Business Hours', description: 'Mon - Fri, 9AM - 6PM', color: 'support-card-2' },
    { icon: '⚡', title: 'Response Time', description: 'Within 24 hours', color: 'support-card-3' },
    { icon: '🔴', title: 'Priority Support', description: 'For urgent issues', color: 'support-card-4' },
  ];

  const platformInfo = [
    { icon: '🏢', title: 'Platform Name', description: 'Motorsports Platform Global' },
    { icon: '📍', title: 'Registered Office', description: 'New York, United States' },
    { icon: '🕐', title: 'Working Days', description: 'Monday - Friday' },
    { icon: '⏱️', title: 'Time Zone', description: 'GMT-5 (Eastern Standard Time)' },
  ];

  const faqLinks = [
    { icon: '✓', title: 'Account Verification', description: 'Steps to verify your account and increase limits' },
    { icon: '🤝', title: 'Team & Vendor Approval', description: 'Learn about team and vendor approval process' },
    { icon: '📋', title: 'Event Listings', description: 'How to list and manage your events on the platform' },
    { icon: '👤', title: 'Marketplace Queries', description: 'Find answers to common marketplace questions' },
    { icon: '🔒', title: 'Profile Moderation', description: 'Understand our profile moderation policies' },
    { icon: '🔧', title: 'Technical Issues', description: 'Troubleshoot common technical problems' },
  ];

  return (
    <div className="container">
      {/* Support Section */}
      <section className="support-section">
        <h1 className="support-title">Support & Help Information</h1>
        <p className="support-subtitle">Alternative ways to reach us</p>
        
        <div className="support-cards">
          {supportOptions.map((option, index) => (
            <div key={index} className={`support-card ${option.color}`}>
              <div className="support-icon">{option.icon}</div>
              <h3 className="support-card-title">{option.title}</h3>
              <p className="support-card-text">{option.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Information Section */}
      <section className="platform-section">
        <div className="platform-content">
          <div>
            <h2 className="support-title" style={{ textAlign: 'left' }}>Platform Information</h2>
            <ul className="platform-list">
              {platformInfo.map((item, index) => (
                <li key={index} className="platform-item">
                  <span className="platform-icon">{item.icon}</span>
                  <div className="platform-info">
                    <div className="platform-item-title">{item.title}</div>
                    <div className="platform-item-description">{item.description}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="platform-map">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location Map"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="faq-title">Frequently Asked Help Links</h2>
        <p className="faq-subtitle">Quick navigation to important resources</p>
        
        <div className="faq-cards">
          {faqLinks.map((link, index) => (
            <div key={index} className="faq-card">
              <div className="faq-icon">{link.icon}</div>
              <h3 className="faq-card-title">{link.title}</h3>
              <p className="faq-card-description">{link.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Data Privacy & Security Section */}
      <section className="privacy-section">
        <div className="privacy-card">
          <div className="privacy-header">
            <div className="privacy-icon">🛡️</div>
            <div>
              <h2 className="privacy-title">Data Privacy & Security</h2>
              <p className="privacy-description">
                Your privacy and security are our top priorities. We are committed to handling all contact information with utmost care.
              </p>
            </div>
          </div>
          
          <ul className="privacy-list">
            <li className="privacy-item">
              <span className="privacy-checkmark">✓</span>
              <span>Secure handling of all user data</span>
            </li>
            <li className="privacy-item">
              <span className="privacy-checkmark">✓</span>
              <span>Full compliance with GDPR and platform privacy standards</span>
            </li>
            <li className="privacy-item">
              <span className="privacy-checkmark">✓</span>
              <span>No storage or unauthorized sharing of contact information</span>
            </li>
          </ul>
          
          <a href="#privacy-policy" className="privacy-link">Read our full Privacy Policy →</a>
        </div>
      </section>

      {/* Footer Section */}
      <section className="footer-section">
        <div className="footer-icon">🏁</div>
        <h2 className="footer-title">We Look Forward to Hearing From You</h2>
        <p className="footer-subtitle">Together, we're building and supporting the motorsports ecosystem of tomorrow</p>
        
        <div className="footer-buttons">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            📝 Submit an Inquiry
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
        </div>

        <div className="footer-branding">
          <span className="footer-logo">🏁</span>
          <span>Motorsports Platform Global</span>
        </div>
      </section>
    </div>
  );
}
