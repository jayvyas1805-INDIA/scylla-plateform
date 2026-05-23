import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from "../../../components/navbar/Navbar";
import Footer from '../../../components/navbar//Footer';

import "./contact.css";


export default function Home() {
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    userType: '',
    subject: '',
    message: '',
    attachments: [],
    agreeToTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        attachments: files || [],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      alert('Please enter your full name');
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (!formData.userType) {
      alert('Please select a user type');
      return;
    }

    if (!formData.subject.trim()) {
      alert('Please enter a subject');
      return;
    }

    if (!formData.message.trim()) {
      alert('Please enter a message');
      return;
    }

    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setShowSuccessMessage(true);

    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      userType: '',
      subject: '',
      message: '',
      attachments: [],
      agreeToTerms: false,
    });

    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleResetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      userType: '',
      subject: '',
      message: '',
      attachments: [],
      agreeToTerms: false,
    });
  };

  const categories = [
    { icon: '👨‍💼', name: 'Motorsport Teams', description: 'For race and competition teams' },
    { icon: '🏪', name: 'Vendors & Providers', description: 'For suppliers and service providers' },
    { icon: '🎪', name: 'Event Organizers', description: 'For event and race organizers' },
    { icon: '👤', name: 'Administrators', description: 'For admin and management' },
    { icon: '👥', name: 'General Public', description: 'For general inquiries' },
  ];

  return (
    <>
      <Navbar />

      <div className="contact-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-icon">🏁</div>
          <h1 className="hero-title">Get in Touch With the Motorsports Platform</h1>
          <p className="hero-subtitle">
            Have questions or need assistance? Contact us and we'll get back to you as soon as possible
          </p>
          <div className="hero-buttons">
            <button
              className="btn btn-primary"
              onClick={() =>
                document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Submit an Inquiry
            </button>
            <button
              className="btn btn-secondary"
              onClick={() =>
                document.getElementById('support-section')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Contact Support
            </button>
          </div>
        </section>

        {/* Who Are You Section */}
        <section className="who-section">
          <h2 className="who-title">Who Are You?</h2>
          <p className="who-subtitle">Select your category to help us assist you efficiently</p>
          <div className="category-cards">
            {categories.map((category, index) => (
              <div key={index} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description}</p>
              </div>
            ))}
          </div>
        </section>

      {/* Form Section */}
      <section className="form-section">
        <div className="form-container" id="contact-form">
          <h2 className="form-title">Send Us a Message</h2>
          <p className="form-subtitle">Fill out the form below and we'll get back to you as soon as possible</p>

          <form onSubmit={handleFormSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="fullName"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="form-input"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">User Type <span className="required">*</span></label>
                <select
                  name="userType"
                  className="form-select"
                  value={formData.userType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select user type</option>
                  <option value="motorsport">Motorsport Teams</option>
                  <option value="vendors">Vendors & Providers</option>
                  <option value="events">Event Organizers</option>
                  <option value="admin">Administrators</option>
                  <option value="general">General Public</option>
                </select>
              </div>
            </div>

            <div className="form-row full">
              <div className="form-group">
                <label className="form-label">Subject <span className="required">*</span></label>
                <input
                  type="text"
                  name="subject"
                  className="form-input"
                  placeholder="Enter the subject of your inquiry"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row full">
              <div className="form-group">
                <label className="form-label">Message <span className="required">*</span></label>
                <textarea
                  name="message"
                  className="form-textarea"
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
            </div>

            <div className="form-row full">
              <div className="form-group">
                <label className="form-label">Attachments</label>
                <div className="form-attachments">
                  <input
                    type="file"
                    name="attachments"
                    onChange={handleInputChange}
                    multiple
                    style={{ display: 'none' }}
                    id="attachments-input"
                  />
                  <label htmlFor="attachments-input" style={{ cursor: 'pointer', width: '100%' }}>
                    <div className="attachments-icon">📎</div>
                    <div className="attachments-text">Drag and drop files here or click to browse</div>
                    <div className="attachments-subtext">Supports PDF, DOC, XLS, ZIP files</div>
                  </label>
                </div>
                {formData.attachments && formData.attachments.length > 0 && (
                  <div style={{ marginTop: '12px', fontSize: '13px', color: '#7a8a9a' }}>
                    <strong>Selected files:</strong>
                    <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                      {Array.from(formData.attachments).map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="form-checkbox">
              <input
                type="checkbox"
                name="agreeToTerms"
                id="agree-terms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="agree-terms">
                I agree to the platform's <a href="#privacy">terms and conditions</a> and understand that my information will be handled according to our privacy policy
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                ✓ Submit Inquiry
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleResetForm}>
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Support Section */}
      <section className="support-section" id="support-section">
        <h2 className="support-title">Support & Help Information</h2>
        <p className="support-subtitle">Alternative ways to reach us</p>

        <div className="support-cards">
          {[
            { icon: '📧', title: 'Email Support', description: 'support@motorsports.com', color: 'support-card-1' },
            { icon: '⏰', title: 'Business Hours', description: 'Mon - Fri, 9AM - 6PM', color: 'support-card-2' },
            { icon: '⚡', title: 'Response Time', description: 'Within 24 hours', color: 'support-card-3' },
            { icon: '🔴', title: 'Priority Support', description: 'For urgent issues', color: 'support-card-4' },
          ].map((option, index) => (
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
              {[
                { icon: '🏢', title: 'Platform Name', description: 'Motorsports Platform Global' },
                { icon: '📍', title: 'Registered Office', description: 'New York, United States' },
                { icon: '🕐', title: 'Working Days', description: 'Monday - Friday' },
                { icon: '⏱️', title: 'Time Zone', description: 'GMT-5 (Eastern Standard Time)' },
              ].map((item, index) => (
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2!2d-74.006!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a28c5b3b1ff%3A0x0!2sMotorsports%20Platform!5e0!3m2!1sen!2sus!4v1700000000000"
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
          {[
            { icon: '✓', title: 'Account Verification', description: 'Steps to verify your account and increase limits' },
            { icon: '🤝', title: 'Team & Vendor Approval', description: 'Learn about team and vendor approval process' },
            { icon: '📋', title: 'Event Listings', description: 'How to list and manage your events on the platform' },
            { icon: '👤', title: 'Marketplace Queries', description: 'Find answers to common marketplace questions' },
            { icon: '🔒', title: 'Profile Moderation', description: 'Understand our profile moderation policies' },
            { icon: '🔧', title: 'Technical Issues', description: 'Troubleshoot common technical problems' },
          ].map((link, index) => (
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

          <button
            className="privacy-link"
            onClick={() => navigate('/motorsport-policy')}
            style={{ border: '20px', background: 'none', padding: 0, cursor: 'pointer', fontSize: 'inherit' }}
          >
            Read our Motorsporting Rules & Policy →
          </button>
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
            onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            📝 Submit an Inquiry
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            ↑ Back to Top
          </button>
        </div>

        <div className="footer-branding">
          <span className="footer-logo">🏁</span>
          <span>Motorsports Platform Global</span>
        </div>
      </section>

      {showSuccessMessage && (
          <>
            <div className="overlay"></div>
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3 className="success-title">Message Sent!</h3>
              <p className="success-message-text">
                Thank you for your inquiry. We'll get back to you soon.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setShowSuccessMessage(false)}
                style={{ marginTop: '16px', width: '100%' }}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>

      <Footer/>
    </>
  );
}