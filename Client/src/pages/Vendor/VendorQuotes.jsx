import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/vendor/Header';
import { getVendorProfile } from '../../api/vendor.api';
import './VendorQuotes.css';

const VendorQuotes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState(null);

  const [selectedInquiry, setSelectedInquiry] = useState('scylla-racing');
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Inquiries');

  useEffect(() => {
    const loadVendor = async () => {
      try {
        setLoading(true);
        const res = await getVendorProfile();
        setVendor(res.data);
      } catch (err) {
        console.error('Failed to load vendor profile', err);
      } finally {
        setLoading(false);
      }
    };
    loadVendor();
  }, []);

  useEffect(() => {
    if (!loading && !vendor) {
      navigate('/vendor/login');
    }
  }, [loading, vendor, navigate]);

  // Demo inquiries — replace with a real API call once a quotes/inquiries
  // endpoint exists on the backend.
  const [inquiries] = useState([
    {
      id: 'scylla-racing',
      name: 'Scylla Racing',
      category: 'Tyres',
      status: 'New',
      message: 'Need quotation for front tyres...',
      timestamp: '2 hours ago',
      avatar: '🏎️',
      isUnread: true,
    },
    {
      id: 'astra-motorsports',
      name: 'Astra Motorsports',
      category: 'Suspension',
      status: 'Open',
      message: 'Custom exhaust system required...',
      timestamp: '5 hours ago',
      avatar: '⚙️',
      isUnread: false,
    },
    {
      id: 'team-agnite',
      name: 'Team Agnite',
      category: 'Kit',
      status: 'New',
      message: '3D modeling for aerodynamic...',
      timestamp: '1 day ago',
      avatar: '🎯',
      isUnread: true,
    },
    {
      id: 'velocity-racing',
      name: 'Velocity Racing',
      category: 'Safety Equipment',
      status: 'Closed',
      message: 'Racing harness specifications...',
      timestamp: '3 days ago',
      avatar: '⚡',
      isUnread: false,
    },
    {
      id: 'phoenix-motorsport',
      name: 'Phoenix Motorsport',
      category: 'Data acquisition system',
      status: 'Open',
      message: 'Data acquisition system...',
      timestamp: '5 days ago',
      avatar: '🔧',
      isUnread: false,
    },
  ]);

  // Full hand-authored detail record — only Scylla Racing has one.
  const [inquiryDetails] = useState({
    'scylla-racing': {
      name: 'Scylla Racing',
      avatar: '🏎️',
      received: 'Dec 8, 2024 at 11:30 AM',
      requestDetails: {
        categoryNeeded: '4 sets (16 tyres total)',
        expectedLeadTime: '2 weeks',
      },
      specifications: 'Front: 235/40R18; Rear: 285/35R18, Compound: Medium, DOT approved',
      description: 'High-performance racing tyres for upcoming championship series. Looking for consistent grip and durability over 200km races. Previous supplier had quality issues.',
      specialInstructions: 'Must be delivered to Mumbai circuit facility. Temperature range: 15-45°C',
      attachments: [
        { name: 'tyre-specs.pdf', type: 'pdf', size: '2.4 MB' },
        { name: 'car-setup.jpg', type: 'image', size: '1.8 MB' },
        { name: 'requirements.docx', type: 'document', size: '450 KB' },
      ],
      messages: [
        { sender: 'Scylla Racing', time: '11:30 AM', text: 'Hi, we need a quote for racing tyres as per the specifications uploaded.' },
        { sender: 'You', time: '11:45 AM', text: "Thank you for reaching out! I've reviewed your requirements — could you confirm the compound preference?" },
        { sender: 'Scylla Racing', time: '12:00 PM', text: 'Medium compound works for us.' },
        { sender: 'You', time: '12:15 PM', text: 'Quote coming in 2 hours.' },
      ],
    },
  });

  // Editable per-inquiry message threads, seeded once so replying actually
  // appends to the conversation instead of only logging to the console.
  const [threads, setThreads] = useState(() => {
    const seeded = {};
    inquiries.forEach((inq) => {
      seeded[inq.id] = inquiryDetails[inq.id]?.messages || [
        { sender: inq.name, time: inq.timestamp, text: inq.message },
      ];
    });
    return seeded;
  });

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      !searchTerm.trim() ||
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === 'All Inquiries' || inquiry.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const selectedMeta = inquiries.find((i) => i.id === selectedInquiry);

  // Falls back to the inquiry's list-card data when no full detail record
  // exists, so every inquiry is clickable instead of only Scylla Racing.
  const current = inquiryDetails[selectedInquiry] || (selectedMeta && {
    name: selectedMeta.name,
    avatar: selectedMeta.avatar,
    received: selectedMeta.timestamp,
    requestDetails: {
      categoryNeeded: selectedMeta.category,
      expectedLeadTime: 'Not specified yet',
    },
    specifications: 'No specifications provided yet.',
    description: selectedMeta.message,
    specialInstructions: 'None provided.',
    attachments: [],
  });

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedInquiry) return;

    const newMessage = {
      sender: 'You',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: messageInput.trim(),
    };

    setThreads((prev) => ({
      ...prev,
      [selectedInquiry]: [...(prev[selectedInquiry] || []), newMessage],
    }));
    setMessageInput('');
  };

  if (loading) {
    return (
      <div className="vendor-quotes">
        <Header currentPath={location.pathname} />
        <p className="vendor-quotes-loading">Loading inquiries…</p>
      </div>
    );
  }

  if (!vendor) return null;

  return (
    <div className="vendor-quotes">
      <Header currentPath={location.pathname} />

      <main className="vendor-quotes-main">
        <div className="vendor-quotes-container">
          {/* Left Sidebar - Inquiries List */}
          <aside className="vendor-quotes-sidebar">
            <div className="vendor-quotes-sidebar-header">
              <h2 className="vendor-quotes-sidebar-title">Team Inquiries & Messaging</h2>
              <p className="vendor-quotes-sidebar-subtitle">
                View requests, discuss requirements, and respond to teams
              </p>
            </div>

            <div className="vendor-quotes-search-wrapper">
              <input
                type="text"
                className="vendor-quotes-search-input"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="vendor-quotes-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>

            <div className="vendor-quotes-filter-dropdown">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="vendor-quotes-filter-select"
              >
                <option>All Inquiries</option>
                <option>New</option>
                <option>Open</option>
                <option>Closed</option>
              </select>
            </div>

            <div className="vendor-quotes-inquiries-list">
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className={`vendor-quotes-inquiry-item ${
                      selectedInquiry === inquiry.id ? 'vendor-quotes-inquiry-active' : ''
                    } ${inquiry.isUnread ? 'vendor-quotes-inquiry-unread' : ''}`}
                    onClick={() => setSelectedInquiry(inquiry.id)}
                  >
                    <div className="vendor-quotes-inquiry-avatar">{inquiry.avatar}</div>
                    <div className="vendor-quotes-inquiry-content">
                      <div className="vendor-quotes-inquiry-header">
                        <h3 className="vendor-quotes-inquiry-name">{inquiry.name}</h3>
                        <span className={`vendor-quotes-badge vendor-quotes-badge-${inquiry.status.toLowerCase()}`}>
                          {inquiry.status}
                        </span>
                      </div>
                      <p className="vendor-quotes-inquiry-category">{inquiry.category}</p>
                      <p className="vendor-quotes-inquiry-message">{inquiry.message}</p>
                      <p className="vendor-quotes-inquiry-time">{inquiry.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="vendor-quotes-empty">No inquiries match your search.</p>
              )}
            </div>
          </aside>

          {/* Center - Inquiry Details */}
          <div className="vendor-quotes-details">
            {current && (
              <>
                <div className="vendor-quotes-details-header">
                  <div className="vendor-quotes-contact-info">
                    <span className="vendor-quotes-contact-avatar">{current.avatar}</span>
                    <div className="vendor-quotes-contact-details">
                      <h2 className="vendor-quotes-contact-name">{current.name}</h2>
                      <p className="vendor-quotes-contact-status">
                        <span className={`vendor-quotes-badge vendor-quotes-badge-${selectedMeta?.status.toLowerCase() || 'new'}`}>
                          {selectedMeta?.status || 'New'}
                        </span>
                        <span className="vendor-quotes-received-date">Received: {current.received}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="vendor-quotes-detail-card">
                  <h3 className="vendor-quotes-card-title">Request Details</h3>
                  <div className="vendor-quotes-detail-grid">
                    <div className="vendor-quotes-detail-item">
                      <label className="vendor-quotes-detail-label">Category Needed</label>
                      <p className="vendor-quotes-detail-value">{current.requestDetails.categoryNeeded}</p>
                    </div>
                    <div className="vendor-quotes-detail-item">
                      <label className="vendor-quotes-detail-label">Expected Lead Time</label>
                      <p className="vendor-quotes-detail-value">{current.requestDetails.expectedLeadTime}</p>
                    </div>
                  </div>
                </div>

                <div className="vendor-quotes-detail-card">
                  <h3 className="vendor-quotes-card-title">Specifications</h3>
                  <p className="vendor-quotes-detail-text">{current.specifications}</p>
                </div>

                <div className="vendor-quotes-detail-card">
                  <h3 className="vendor-quotes-card-title">Requirement Description</h3>
                  <p className="vendor-quotes-detail-text">{current.description}</p>
                </div>

                <div className="vendor-quotes-detail-card">
                  <h3 className="vendor-quotes-card-title">Special Instructions</h3>
                  <p className="vendor-quotes-detail-text">{current.specialInstructions}</p>
                </div>

                {current.attachments && current.attachments.length > 0 && (
                  <div className="vendor-quotes-detail-card">
                    <h3 className="vendor-quotes-card-title">Attachments</h3>
                    <div className="vendor-quotes-attachments-grid">
                      {current.attachments.map((attachment, index) => (
                        <div key={index} className="vendor-quotes-attachment-item">
                          <div className="vendor-quotes-attachment-icon">
                            {attachment.type === 'pdf' && '📄'}
                            {attachment.type === 'image' && '🖼️'}
                            {attachment.type === 'document' && '📋'}
                          </div>
                          <div className="vendor-quotes-attachment-info">
                            <p className="vendor-quotes-attachment-name">{attachment.name}</p>
                            <p className="vendor-quotes-attachment-size">{attachment.size}</p>
                          </div>
                          <button className="vendor-quotes-attachment-download">Download</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="vendor-quotes-action-buttons">
                  <button className="vendor-quotes-btn vendor-quotes-btn-primary">
                    <span>📤</span> Send Quote
                  </button>
                  <button className="vendor-quotes-btn vendor-quotes-btn-secondary">Mark as Open</button>
                  <button className="vendor-quotes-btn vendor-quotes-btn-danger">Mark as Closed</button>
                </div>
              </>
            )}
          </div>

          {/* Right Sidebar - Messaging */}
          <aside className="vendor-quotes-messaging-sidebar">
            {current && (
              <>
                <div className="vendor-quotes-contact-card">
                  <div className="vendor-quotes-card-avatar">{current.avatar}</div>
                  <h3 className="vendor-quotes-card-contact-name">{current.name}</h3>
                  <p className="vendor-quotes-card-contact-status">Contact</p>
                </div>

                <div className="vendor-quotes-messages-container">
                  {(threads[selectedInquiry] || []).map((msg, index) => (
                    <div
                      key={index}
                      className={`vendor-quotes-message ${
                        msg.sender === 'You' ? 'vendor-quotes-message-outgoing' : 'vendor-quotes-message-incoming'
                      }`}
                    >
                      {msg.sender !== 'You' && (
                        <div className="vendor-quotes-message-avatar">{current.avatar}</div>
                      )}
                      <div className="vendor-quotes-message-content">
                        <div className="vendor-quotes-message-bubble">
                          <p className="vendor-quotes-message-text">{msg.text}</p>
                        </div>
                        <p className="vendor-quotes-message-time">{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="vendor-quotes-message-input-wrapper">
                  <input
                    type="text"
                    className="vendor-quotes-message-input"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button className="vendor-quotes-message-send" onClick={handleSendMessage}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
};

export default VendorQuotes;
