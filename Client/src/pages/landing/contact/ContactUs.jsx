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

      <div className="land-contact-page">
        {/* Hero Section */}
        <section className="land-hero-section">
          <div className="land-hero-icon">🏁</div>
          <h1 className="land-hero-title">Get in Touch With the Motorsports Platform</h1>
          <p className="land-hero-subtitle">
            Have questions or need assistance? Contact us and we'll get back to you as soon as possible
          </p>
          <div className="land-hero-buttons">
            <button
              className="land-btn land-btn-primary"
              onClick={() =>
                document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Submit an Inquiry
            </button>
            <button
              className="land-btn land-btn-secondary"
              onClick={() =>
                document.getElementById('support-section')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Contact Support
            </button>
          </div>
        </section>

        {/* Who Are You Section */}
        <section className="land-who-section">
          <h2 className="land-who-title">Who Are You?</h2>
          <p className="land-who-subtitle">Select your category to help us assist you efficiently</p>
          <div className="land-category-cards">
            {categories.map((category, index) => (
              <div key={index} className="land-category-card">
                <div className="land-category-icon">{category.icon}</div>
                <h3 className="land-category-name">{category.name}</h3>
                <p className="land-category-description">{category.description}</p>
              </div>
            ))}
          </div>
        </section>

      {/* Form Section */}
      <section className="land-form-section">
        <div className="land-form-container" id="contact-form">
          <h2 className="land-form-title">Send Us a Message</h2>
          <p className="land-form-subtitle">Fill out the form below and we'll get back to you as soon as possible</p>

          <form onSubmit={handleFormSubmit}>
            <div className="land-form-row">
              <div className="land-form-group">
                <label className="land-form-label">Full Name <span className="land-required">*</span></label>
                <input
                  type="text"
                  name="fullName"
                  className="land-form-input"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="land-form-group">
                <label className="land-form-label">Email Address <span className="land-required">*</span></label>
                <input
                  type="email"
                  name="email"
                  className="land-form-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="land-form-row">
              <div className="land-form-group">
                <label className="land-form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="land-form-input"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="land-form-group">
                <label className="land-form-label">User Type <span className="land-required">*</span></label>
                <select
                  name="userType"
                  className="land-form-select"
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

            <div className="land-form-row full">
              <div className="land-form-group">
                <label className="land-form-label">Subject <span className="land-required">*</span></label>
                <input
                  type="text"
                  name="subject"
                  className="land-form-input"
                  placeholder="Enter the subject of your inquiry"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="land-form-row full">
              <div className="land-form-group">
                <label className="land-form-label">Message <span className="land-required">*</span></label>
                <textarea
                  name="message"
                  className="land-form-textarea"
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
            </div>

            <div className="land-form-row full">
              <div className="land-form-group">
                <label className="land-form-label">Attachments</label>
                <div className="land-form-attachments">
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

            <div className="land-form-checkbox">
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

            <div className="land-form-actions">
              <button type="submit" className="land-btn land-btn-primary">
                ✓ Submit Inquiry
              </button>
              <button type="button" className="land-btn land-btn-secondary" onClick={handleResetForm}>
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Support Section */}
      <section className="land-support-section" id="support-section">
        <h2 className="land-support-title">Support & Help Information</h2>
        <p className="land-support-subtitle">Alternative ways to reach us</p>

        <div className="land-support-cards">
          {[
            { icon: '📧', title: 'Email Support', description: 'support@motorsports.com', color: 'support-card-1' },
            { icon: '⏰', title: 'Business Hours', description: 'Mon - Fri, 9AM - 6PM', color: 'support-card-2' },
            { icon: '⚡', title: 'Response Time', description: 'Within 24 hours', color: 'support-card-3' },
            { icon: '🔴', title: 'Priority Support', description: 'For urgent issues', color: 'support-card-4' },
          ].map((option, index) => (
            <div key={index} className={`land-support-card ${option.color}`}>
              <div className="land-support-icon">{option.icon}</div>
              <h3 className="land-support-card-title">{option.title}</h3>
              <p className="land-support-card-text">{option.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Information Section */}
      <section className="land-platform-section">
        <div className="land-platform-content">
          <div>
            <h2 className="land-support-title" style={{ textAlign: 'left' }}>Platform Information</h2>
            <ul className="land-platform-list">
              {[
                { icon: '🏢', title: 'Platform Name', description: 'Motorsports Platform Global' },
                { icon: '📍', title: 'Registered Office', description: 'New York, United States' },
                { icon: '🕐', title: 'Working Days', description: 'Monday - Friday' },
                { icon: '⏱️', title: 'Time Zone', description: 'GMT-5 (Eastern Standard Time)' },
              ].map((item, index) => (
                <li key={index} className="land-platform-item">
                  <span className="land-platform-icon">{item.icon}</span>
                  <div className="land-platform-info">
                    <div className="land-platform-item-title">{item.title}</div>
                    <div className="land-platform-item-description">{item.description}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="land-platform-map">
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
      <section className="land-faq-section">
        <h2 className="land-faq-title">Frequently Asked Help Links</h2>
        <p className="land-faq-subtitle">Quick navigation to important resources</p>

        <div className="land-faq-cards">
          {[
            { icon: '✓', title: 'Account Verification', description: 'Steps to verify your account and increase limits' },
            { icon: '🤝', title: 'Team & Vendor Approval', description: 'Learn about team and vendor approval process' },
            { icon: '📋', title: 'Event Listings', description: 'How to list and manage your events on the platform' },
            { icon: '👤', title: 'Marketplace Queries', description: 'Find answers to common marketplace questions' },
            { icon: '🔒', title: 'Profile Moderation', description: 'Understand our profile moderation policies' },
            { icon: '🔧', title: 'Technical Issues', description: 'Troubleshoot common technical problems' },
          ].map((link, index) => (
            <div key={index} className="land-faq-card">
              <div className="land-faq-icon">{link.icon}</div>
              <h3 className="land-faq-card-title">{link.title}</h3>
              <p className="land-faq-card-description">{link.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Data Privacy & Security Section */}
      <section className="land-privacy-section">
        <div className="land-privacy-card">
          <div className="land-privacy-header">
            <div className="land-privacy-icon">🛡️</div>
            <div>
              <h2 className="land-privacy-title">Data Privacy & Security</h2>
              <p className="land-privacy-description">
                Your privacy and security are our top priorities. We are committed to handling all contact information with utmost care.
              </p>
            </div>
          </div>

          <ul className="land-privacy-list">
            <li className="land-privacy-item">
              <span className="land-privacy-checkmark">✓</span>
              <span>Secure handling of all user data</span>
            </li>
            <li className="land-privacy-item">
              <span className="land-privacy-checkmark">✓</span>
              <span>Full compliance with GDPR and platform privacy standards</span>
            </li>
            <li className="land-privacy-item">
              <span className="land-privacy-checkmark">✓</span>
              <span>No storage or unauthorized sharing of contact information</span>
            </li>
          </ul>

          <button
            className="land-privacy-link"
            onClick={() => navigate('/motorsport-policy')}
            style={{ border: '20px', background: 'none', padding: 0, cursor: 'pointer', fontSize: 'inherit' }}
          >
            Read our Motorsporting Rules & Policy →
          </button>
        </div>
      </section>

      {/* Footer Section */}
      <section className="land-footer-section">
        <div className="land-footer-icon">🏁</div>
        <h2 className="land-footer-title">We Look Forward to Hearing From You</h2>
        <p className="land-footer-subtitle">Together, we're building and supporting the motorsports ecosystem of tomorrow</p>

        <div className="land-footer-buttons">
          <button
            className="land-btn land-btn-primary"
            onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            📝 Submit an Inquiry
          </button>
          <button
            className="land-btn land-btn-secondary"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            ↑ Back to Top
          </button>
        </div>

        <div className="land-footer-branding">
          <span className="land-footer-logo">🏁</span>
          <span>Motorsports Platform Global</span>
        </div>
      </section>

      {showSuccessMessage && (
          <>
            <div className="land-overlay"></div>
            <div className="land-success-message">
              <div className="land-success-icon">✓</div>
              <h3 className="land-success-title">Message Sent!</h3>
              <p className="land-success-message-text">
                Thank you for your inquiry. We'll get back to you soon.
              </p>
              <button
                className="land-btn land-btn-primary"
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