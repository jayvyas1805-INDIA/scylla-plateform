import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/vendor/Header';
import { getVendorProfile } from '../../api/vendor.api';
import { getConversations, getMessages, sendMessage } from '../../api/chat.api';
import './VendorQuotes.css';

const VendorQuotes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState(null);

  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [selectedId, setSelectedId] = useState(searchParams.get('conversation') || null);

  const [thread, setThread] = useState([]);
  const [loadingThread, setLoadingThread] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

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

  const loadConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);
      const res = await getConversations();
      const list = Array.isArray(res.data) ? res.data : [];
      setConversations(list);

      const fromUrl = searchParams.get('conversation');
      if (fromUrl && !selectedId) {
        setSelectedId(fromUrl);
      } else if (!fromUrl && !selectedId && list.length > 0) {
        setSelectedId(list[0]._id);
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoadingConversations(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!selectedId) {
      setThread([]);
      return;
    }

    const loadThread = async () => {
      try {
        setLoadingThread(true);
        const res = await getMessages(selectedId);
        setThread(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to load messages', err);
        setThread([]);
      } finally {
        setLoadingThread(false);
      }
    };

    loadThread();
    setSearchParams({ conversation: selectedId }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedId || sending) return;

    const text = messageInput.trim();
    setMessageInput('');
    setSending(true);

    try {
      const res = await sendMessage(selectedId, text);
      setThread((prev) => [...prev, res.data]);
      loadConversations();
    } catch (err) {
      console.error('Failed to send message', err);
      alert('Failed to send message');
      setMessageInput(text);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.otherParty?.name?.toLowerCase().includes(q) ||
      c.product?.title?.toLowerCase().includes(q)
    );
  });

  const current = conversations.find((c) => c._id === selectedId);

  const formatTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="vendor-quotes">
        <Header currentPath={location.pathname} />
        <p className="vendor-quotes-loading">Loading…</p>
      </div>
    );
  }

  if (!vendor) return null;

  return (
    <div className="vendor-quotes">
      <Header currentPath={location.pathname} />

      <main className="vendor-quotes-main">
        <div className="vendor-quotes-container">
          {/* Left Sidebar - Conversations List */}
          <aside className="vendor-quotes-sidebar">
            <div className="vendor-quotes-sidebar-header">
              <h2 className="vendor-quotes-sidebar-title">Messages & Inquiries</h2>
              <p className="vendor-quotes-sidebar-subtitle">
                Conversations with teams about your products and services
              </p>
            </div>

            <div className="vendor-quotes-search-wrapper">
              <input
                type="text"
                className="vendor-quotes-search-input"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="vendor-quotes-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>

            <div className="vendor-quotes-inquiries-list">
              {loadingConversations ? (
                <p className="vendor-quotes-empty">Loading conversations…</p>
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <div
                    key={conv._id}
                    className={`vendor-quotes-inquiry-item ${selectedId === conv._id ? 'vendor-quotes-inquiry-active' : ''}`}
                    onClick={() => setSelectedId(conv._id)}
                  >
                    <div className="vendor-quotes-inquiry-avatar">
                      {conv.otherParty?.avatar ? (
                        <img src={conv.otherParty.avatar} alt={conv.otherParty.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        '🏁'
                      )}
                    </div>
                    <div className="vendor-quotes-inquiry-content">
                      <div className="vendor-quotes-inquiry-header">
                        <h3 className="vendor-quotes-inquiry-name">{conv.otherParty?.name || 'Unknown'}</h3>
                      </div>
                      <p className="vendor-quotes-inquiry-category">
                        {conv.product?.title ? `Re: ${conv.product.title}` : 'General inquiry'}
                      </p>
                      <p className="vendor-quotes-inquiry-time">
                        {formatTime(conv.lastMessage?.createdAt || conv.updatedAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="vendor-quotes-empty">
                  {conversations.length === 0
                    ? 'No inquiries yet — they will show up here once a team messages you about a listing.'
                    : 'No inquiries match your search.'}
                </p>
              )}
            </div>
          </aside>

          {/* Center - Conversation details */}
          <div className="vendor-quotes-details">
            {current ? (
              <>
                <div className="vendor-quotes-details-header">
                  <div className="vendor-quotes-contact-info">
                    <span className="vendor-quotes-contact-avatar">
                      {current.otherParty?.avatar ? (
                        <img src={current.otherParty.avatar} alt={current.otherParty.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        '🏁'
                      )}
                    </span>
                    <div className="vendor-quotes-contact-details">
                      <h2 className="vendor-quotes-contact-name">{current.otherParty?.name || 'Unknown'}</h2>
                      <p className="vendor-quotes-contact-status">
                        <span className="vendor-quotes-badge vendor-quotes-badge-new">
                          {current.otherParty?.role || 'Team'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {current.product && (
                  <div className="vendor-quotes-detail-card">
                    <h3 className="vendor-quotes-card-title">About this product</h3>
                    <div className="vendor-quotes-detail-grid">
                      <div className="vendor-quotes-detail-item">
                        <label className="vendor-quotes-detail-label">Product</label>
                        <p className="vendor-quotes-detail-value">{current.product.title}</p>
                      </div>
                      <div className="vendor-quotes-detail-item">
                        <label className="vendor-quotes-detail-label">Price</label>
                        <p className="vendor-quotes-detail-value">${current.product.price}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="vendor-quotes-empty">
                {loadingConversations ? 'Loading…' : 'Select a conversation to view details.'}
              </p>
            )}
          </div>

          {/* Right Sidebar - Messaging */}
          <aside className="vendor-quotes-messaging-sidebar">
            {current && (
              <>
                <div className="vendor-quotes-contact-card">
                  <div className="vendor-quotes-card-avatar">
                    {current.otherParty?.avatar ? (
                      <img src={current.otherParty.avatar} alt={current.otherParty.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      '🏁'
                    )}
                  </div>
                  <h3 className="vendor-quotes-card-contact-name">{current.otherParty?.name || 'Unknown'}</h3>
                  <p className="vendor-quotes-card-contact-status">Contact</p>
                </div>

                <div className="vendor-quotes-messages-container">
                  {loadingThread ? (
                    <p className="vendor-quotes-empty">Loading messages…</p>
                  ) : thread.length > 0 ? (
                    thread.map((msg) => (
                      <div
                        key={msg._id}
                        className={`vendor-quotes-message ${
                          msg.sender?.role === 'VENDOR' ? 'vendor-quotes-message-outgoing' : 'vendor-quotes-message-incoming'
                        }`}
                      >
                        {msg.sender?.role !== 'VENDOR' && (
                          <div className="vendor-quotes-message-avatar">🏢</div>
                        )}
                        <div className="vendor-quotes-message-content">
                          <div className="vendor-quotes-message-bubble">
                            <p className="vendor-quotes-message-text">{msg.content}</p>
                          </div>
                          <p className="vendor-quotes-message-time">{formatTime(msg.createdAt)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="vendor-quotes-empty">No messages yet — say hello to get started.</p>
                  )}
                </div>

                <div className="vendor-quotes-message-input-wrapper">
                  <input
                    type="text"
                    className="vendor-quotes-message-input"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={sending}
                  />
                  <button className="vendor-quotes-message-send" onClick={handleSendMessage} disabled={sending}>
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
