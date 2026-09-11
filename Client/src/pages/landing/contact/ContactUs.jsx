import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../../../components/navbar/Navbar';
import Footer from '../../../components/navbar/Footer';
import '../../../styles/landing-theme.css';

import './ContactUs.css';

const CATEGORIES = [
  { icon: '👨‍💼', name: 'Motorsport Teams', description: 'For race and competition teams', value: 'motorsport' },
  { icon: '🏪', name: 'Vendors & Providers', description: 'For suppliers and service providers', value: 'vendors' },
  { icon: '🎪', name: 'Event Organizers', description: 'For event and race organizers', value: 'events' },
  { icon: '👤', name: 'Administrators', description: 'For admin and management', value: 'admin' },
  { icon: '👥', name: 'General Public', description: 'For general inquiries', value: 'general' },
];

const SUPPORT_OPTIONS = [
  { icon: '📧', title: 'Email Support', description: 'support@motorsports.com' },
  { icon: '⏰', title: 'Business Hours', description: 'Mon - Fri, 9AM - 6PM' },
  { icon: '⚡', title: 'Response Time', description: 'Within 24 hours' },
  { icon: '🔴', title: 'Priority Support', description: 'For urgent issues' },
];

const PLATFORM_INFO = [
  { icon: '🏢', title: 'Platform Name', description: 'Motorsports Platform Global' },
  { icon: '📍', title: 'Registered Office', description: 'New York, United States' },
  { icon: '🕐', title: 'Working Days', description: 'Monday - Friday' },
  { icon: '⏱️', title: 'Time Zone', description: 'GMT-5 (Eastern Standard Time)' },
];

const FAQ_LINKS = [
  { icon: '✓', title: 'Account Verification', description: 'Steps to verify your account and increase limits' },
  { icon: '🤝', title: 'Team & Vendor Approval', description: 'Learn about team and vendor approval process' },
  { icon: '📋', title: 'Event Listings', description: 'How to list and manage your events on the platform' },
  { icon: '👤', title: 'Marketplace Queries', description: 'Find answers to common marketplace questions' },
  { icon: '🔒', title: 'Profile Moderation', description: 'Understand our profile moderation policies' },
  { icon: '🔧', title: 'Technical Issues', description: 'Troubleshoot common technical problems' },
];

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phoneNumber: '',
  userType: '',
  subject: '',
  message: '',
  attachments: [],
  agreeToTerms: false,
};

export default function ContactUs() {
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setFormData((prev) => ({ ...prev, attachments: files || [] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCategorySelect = (value) => {
    setFormData((prev) => ({ ...prev, userType: value }));
    scrollTo('contact-form');
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
    setFormData(EMPTY_FORM);

    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleResetForm = () => setFormData(EMPTY_FORM);

  return (
    <>
      <Navbar />

      <div className="lp-page">
        {/* HERO */}
        <section className="lp-section contact-hero">
          <div className="lp-container contact-hero-content">
            <div className="contact-hero-icon">🏁</div>
            <h1 className="contact-hero-title">Get in Touch With the Motorsports Platform</h1>
            <p className="lp-section-subtitle">
              Have questions or need assistance? Contact us and we'll get back to you as soon as possible.
            </p>
            <div className="contact-hero-buttons">
              <button className="lp-btn lp-btn-primary lp-btn-lg" onClick={() => scrollTo('contact-form')}>
                Submit an Inquiry
              </button>
              <button className="lp-btn lp-btn-outline lp-btn-lg" onClick={() => scrollTo('support-section')}>
                Contact Support
              </button>
            </div>
          </div>
        </section>

        {/* WHO ARE YOU */}
        <section className="lp-section">
          <div className="lp-container">
            <div className="lp-section-heading">
              <h2 className="lp-section-title">Who Are You?</h2>
              <p className="lp-section-subtitle">Select your category to help us assist you efficiently</p>
            </div>
            <div className="contact-category-grid">
              {CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  className={`lp-card contact-category-card ${formData.userType === category.value ? 'contact-category-active' : ''}`}
                  onClick={() => handleCategorySelect(category.value)}
                >
                  <div className="contact-category-icon">{category.icon}</div>
                  <h3 className="contact-category-name">{category.name}</h3>
                  <p className="contact-category-description">{category.description}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FORM */}
        <section className="lp-section contact-section-alt">
          <div className="lp-container contact-form-container" id="contact-form">
            <h2 className="lp-section-title">Send Us a Message</h2>
            <p className="lp-section-subtitle contact-form-subtitle">
              Fill out the form below and we'll get back to you as soon as possible
            </p>

            <form onSubmit={handleFormSubmit} className="lp-card contact-form">
              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label className="contact-form-label">
                    Full Name <span className="contact-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    className="contact-form-input"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="contact-form-group">
                  <label className="contact-form-label">
                    Email Address <span className="contact-required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="contact-form-input"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label className="contact-form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    className="contact-form-input"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="contact-form-group">
                  <label className="contact-form-label">
                    User Type <span className="contact-required">*</span>
                  </label>
                  <select
                    name="userType"
                    className="contact-form-select"
                    value={formData.userType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select user type</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="contact-form-row contact-form-row-full">
                <div className="contact-form-group">
                  <label className="contact-form-label">
                    Subject <span className="contact-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    className="contact-form-input"
                    placeholder="Enter the subject of your inquiry"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="contact-form-row contact-form-row-full">
                <div className="contact-form-group">
                  <label className="contact-form-label">
                    Message <span className="contact-required">*</span>
                  </label>
                  <textarea
                    name="message"
                    className="contact-form-textarea"
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="contact-form-row contact-form-row-full">
                <div className="contact-form-group">
                  <label className="contact-form-label">Attachments</label>
                  <div className="contact-form-attachments">
                    <input
                      type="file"
                      name="attachments"
                      onChange={handleInputChange}
                      multiple
                      className="contact-file-input"
                      id="attachments-input"
                    />
                    <label htmlFor="attachments-input" className="contact-file-label">
                      <div className="contact-attachments-icon">📎</div>
                      <div className="contact-attachments-text">Drag and drop files here or click to browse</div>
                      <div className="contact-attachments-subtext">Supports PDF, DOC, XLS, ZIP files</div>
                    </label>
                  </div>
                  {formData.attachments && formData.attachments.length > 0 && (
                    <div className="contact-selected-files">
                      <strong>Selected files:</strong>
                      <ul>
                        {Array.from(formData.attachments).map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="contact-form-checkbox">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  id="agree-terms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="agree-terms">
                  I agree to the platform's <a href="#privacy">terms and conditions</a> and understand that my
                  information will be handled according to our privacy policy
                </label>
              </div>

              <div className="contact-form-actions">
                <button type="submit" className="lp-btn lp-btn-primary">
                  ✓ Submit Inquiry
                </button>
                <button type="button" className="lp-btn lp-btn-outline" onClick={handleResetForm}>
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* SUPPORT */}
        <section className="lp-section" id="support-section">
          <div className="lp-container">
            <div className="lp-section-heading">
              <h2 className="lp-section-title">Support & Help Information</h2>
              <p className="lp-section-subtitle">Alternative ways to reach us</p>
            </div>

            <div className="contact-support-grid">
              {SUPPORT_OPTIONS.map((option) => (
                <div key={option.title} className="lp-card contact-support-card">
                  <div className="contact-support-icon">{option.icon}</div>
                  <h3 className="contact-support-card-title">{option.title}</h3>
                  <p className="contact-support-card-text">{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PLATFORM INFO + MAP */}
        <section className="lp-section contact-section-alt">
          <div className="lp-container contact-platform-grid">
            <div>
              <h2 className="lp-section-title">Platform Information</h2>
              <ul className="contact-platform-list">
                {PLATFORM_INFO.map((item) => (
                  <li key={item.title} className="lp-card contact-platform-item">
                    <span className="contact-platform-icon">{item.icon}</span>
                    <div>
                      <div className="contact-platform-item-title">{item.title}</div>
                      <div className="contact-platform-item-description">{item.description}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lp-card contact-platform-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2!2d-74.006!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a28c5b3b1ff%3A0x0!2sMotorsports%20Platform!5e0!3m2!1sen!2sus!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location Map"
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="lp-section">
          <div className="lp-container">
            <div className="lp-section-heading">
              <h2 className="lp-section-title">Frequently Asked Help Links</h2>
              <p className="lp-section-subtitle">Quick navigation to important resources</p>
            </div>

            <div className="contact-faq-grid">
              {FAQ_LINKS.map((link) => (
                <div key={link.title} className="lp-card contact-faq-card">
                  <div className="contact-faq-icon">{link.icon}</div>
                  <h3 className="contact-faq-card-title">{link.title}</h3>
                  <p className="contact-faq-card-description">{link.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRIVACY */}
        <section className="lp-section contact-section-alt">
          <div className="lp-container lp-card contact-privacy-card">
            <div className="contact-privacy-header">
              <div className="contact-privacy-icon">🛡️</div>
              <div>
                <h2 className="contact-privacy-title">Data Privacy & Security</h2>
                <p className="contact-privacy-description">
                  Your privacy and security are our top priorities. We are committed to handling all contact
                  information with the utmost care.
                </p>
              </div>
            </div>

            <ul className="contact-privacy-list">
              <li className="contact-privacy-item">
                <span className="contact-privacy-checkmark">✓</span>
                <span>Secure handling of all user data</span>
              </li>
              <li className="contact-privacy-item">
                <span className="contact-privacy-checkmark">✓</span>
                <span>Full compliance with GDPR and platform privacy standards</span>
              </li>
              <li className="contact-privacy-item">
                <span className="contact-privacy-checkmark">✓</span>
                <span>No storage or unauthorized sharing of contact information</span>
              </li>
            </ul>

            <button className="lp-btn lp-btn-outline" onClick={() => navigate('/motorsport-policy')}>
              Read our Motorsporting Rules & Policy →
            </button>
          </div>
        </section>

        {/* CLOSING CTA */}
        <section className="lp-section contact-closing">
          <div className="lp-container">
            <div className="contact-closing-icon">🏁</div>
            <h2 className="lp-section-title">We Look Forward to Hearing From You</h2>
            <p className="lp-section-subtitle">
              Together, we're building and supporting the motorsports ecosystem of tomorrow
            </p>

            <div className="contact-closing-buttons">
              <button className="lp-btn lp-btn-primary lp-btn-lg" onClick={() => scrollTo('contact-form')}>
                📝 Submit an Inquiry
              </button>
              <button
                className="lp-btn lp-btn-outline lp-btn-lg"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                ↑ Back to Top
              </button>
            </div>
          </div>
        </section>

        {showSuccessMessage && (
          <>
            <div className="contact-overlay" onClick={() => setShowSuccessMessage(false)} />
            <div className="lp-card contact-success-message">
              <div className="contact-success-icon">✓</div>
              <h3 className="contact-success-title">Message Sent!</h3>
              <p className="contact-success-text">
                Thank you for your inquiry. We'll get back to you soon.
              </p>
              <button
                className="lp-btn lp-btn-primary lp-full-width"
                onClick={() => setShowSuccessMessage(false)}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}
