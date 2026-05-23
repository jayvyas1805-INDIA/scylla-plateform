// import "./Marketplace.css";

// function Messages() {
//   return (
//     <div className="messages-layout">

//       {/* LEFT LIST */}
//       <div className="messages-list">
//         <div className="message-item active">Scylla Racing</div>
//         <div className="message-item">Astra Motorsports</div>
//         <div className="message-item">Phoenix Motorsport</div>
//       </div>

//       {/* CHAT */}
//       <div className="chat-window">

//         <div className="chat-header">
//           Scylla Racing <span className="online">Online</span>
//         </div>

//         <div className="chat-body">
//           <div className="msg left">Hi, we need a quote for tyres.</div>
//           <div className="msg right">Sure, checking specs.</div>
//         </div>

//         <div className="chat-input">
//           <input placeholder="Type your message..." />
//           <button>➤</button>
//         </div>

//       </div>

//     </div>
//   );
// }

// export default Messages;

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
// import Header from '../../components/Vendor/Header';
import '../../Vendor/VendorQuotes.css';

const Messages = () => {
  const location = useLocation();
  const [selectedInquiry, setSelectedInquiry] = useState('scylla-racing');
  const [messageInput, setMessageInput] = useState('');
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

  const [inquiryDetails] = useState({
    'scylla-racing': {
      name: 'Scylla Racing',
      avatar: '🏎️',
      status: 'Typed',
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
        { sender: 'You', time: '11:45 AM', text: 'Thank you for reaching out! I\'ve reviewed your requirements and the compound preference?' },
        { sender: 'Scylla Racing', time: '12:00 PM', text: 'Perfect! Based on this data, I can confirm the compound preference?' },
        { sender: 'You', time: '12:15 PM', text: 'Quote coming in 2 hours.' },
      ],
    },
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Inquiries');

  const current = inquiryDetails[selectedInquiry];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log('Message sent:', messageInput);
      setMessageInput('');
    }
  };

  return (
    <div className="vendor-quotes">
      {/* <Header currentPath={location.pathname} /> */}
      
      <main className="quotes-main">
        <div className="quotes-container">
          {/* Left Sidebar - Inquiries List */}
          <aside className="inquiries-sidebar">
            <div className="sidebar-header">
              <h2 className="sidebar-title">Team Inquiries & Messaging</h2>
              <p className="sidebar-subtitle">View requests, discuss requirements, and respond to teams</p>
            </div>

            {/* Search Bar */}
            <div className="search-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>

            {/* Filter Dropdown */}
            <div className="filter-dropdown">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option>All Inquiries</option>
                <option>New</option>
                <option>Open</option>
                <option>Closed</option>
              </select>
            </div>

            {/* Inquiries List */}
            <div className="inquiries-list">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className={`inquiry-item ${selectedInquiry === inquiry.id ? 'active' : ''} ${
                    inquiry.isUnread ? 'unread' : ''
                  }`}
                  onClick={() => setSelectedInquiry(inquiry.id)}
                >
                  <div className="inquiry-avatar">{inquiry.avatar}</div>
                  <div className="inquiry-content">
                    <div className="inquiry-header">
                      <h3 className="inquiry-name">{inquiry.name}</h3>
                      <span className={`inquiry-badge badge-${inquiry.status.toLowerCase()}`}>
                        {inquiry.status}
                      </span>
                    </div>
                    <p className="inquiry-category">{inquiry.category}</p>
                    <p className="inquiry-message">{inquiry.message}</p>
                    <p className="inquiry-time">{inquiry.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Center Main Area - Inquiry Details */}
          <div className="inquiry-details">
            {current && (
              <>
                {/* Header with Contact Info */}
                <div className="details-header">
                  <div className="contact-info">
                    <span className="contact-avatar">{current.avatar}</span>
                    <div className="contact-details">
                      <h2 className="contact-name">{current.name}</h2>
                      <p className="contact-status">
                        <span className="status-badge">Typed</span>
                        <span className="received-date">Received: {current.received}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Request Details Card */}
                <div className="details-card">
                  <h3 className="card-title">Request Details</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <label className="detail-label">Category Needed</label>
                      <p className="detail-value">{current.requestDetails.categoryNeeded}</p>
                    </div>
                    <div className="detail-item">
                      <label className="detail-label">Expected Lead Time</label>
                      <p className="detail-value">{current.requestDetails.expectedLeadTime}</p>
                    </div>
                  </div>
                </div>

                {/* Specifications Card */}
                <div className="details-card">
                  <h3 className="card-title">Specifications</h3>
                  <p className="detail-text">{current.specifications}</p>
                </div>

                {/* Requirement Description Card */}
                <div className="details-card">
                  <h3 className="card-title">Requirement Description</h3>
                  <p className="detail-text">{current.description}</p>
                </div>

                {/* Special Instructions Card */}
                <div className="details-card">
                  <h3 className="card-title">Special Instructions</h3>
                  <p className="detail-text">{current.specialInstructions}</p>
                </div>

                {/* Attachments Card */}
                <div className="details-card attachments-card">
                  <h3 className="card-title">Attachments</h3>
                  <div className="attachments-grid">
                    {current.attachments.map((attachment, index) => (
                      <div key={index} className="attachment-item">
                        <div className="attachment-icon">
                          {attachment.type === 'pdf' && '📄'}
                          {attachment.type === 'image' && '🖼️'}
                          {attachment.type === 'document' && '📋'}
                        </div>
                        <div className="attachment-info">
                          <p className="attachment-name">{attachment.name}</p>
                          <p className="attachment-size">{attachment.size}</p>
                        </div>
                        <button className="attachment-download">Download</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <button className="btn btn-primary">
                    <span>📤</span> Send Quote
                  </button>
                  <button className="btn btn-secondary">Mark as Open</button>
                  <button className="btn btn-danger">Mark as Closed</button>
                </div>
              </>
            )}
          </div>

          {/* Right Sidebar - Messaging */}
          <aside className="messaging-sidebar">
            {current && (
              <>
                {/* Contact Card */}
                <div className="contact-card">
                  <div className="card-avatar">{current.avatar}</div>
                  <h3 className="card-contact-name">{current.name}</h3>
                  <p className="card-contact-status">Contact</p>
                </div>

                {/* Messages Thread */}
                <div className="messages-container">
                  {current.messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === 'You' ? 'outgoing' : 'incoming'}`}>
                      {msg.sender !== 'You' && (
                        <div className="message-avatar">{current.avatar}</div>
                      )}
                      <div className="message-content">
                        <div className="message-bubble">
                          <p className="message-text">{msg.text}</p>
                        </div>
                        <p className="message-time">{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="message-input-wrapper">
                  <input
                    type="text"
                    className="message-input"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button className="message-send" onClick={handleSendMessage}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.40,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99701575 L3.03521743,10.4380088 C3.03521743,10.5951061 3.19218622,10.7522035 3.50612381,10.7522035 L16.6915026,11.5376905 C16.6915026,11.5376905 17.1624089,11.5376905 17.1624089,12.0089827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"/>
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

export default Messages;
