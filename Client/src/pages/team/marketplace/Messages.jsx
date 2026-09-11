import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import './Messages.css';
import NavBar from '../../../components/team/MarketPlaceNavbar';
import { getConversations, getMessages, sendMessage } from '../../../api/chat.api';

const Messages = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [selectedId, setSelectedId] = useState(searchParams.get('conversation') || null);

  const [thread, setThread] = useState([]);
  const [loadingThread, setLoadingThread] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const loadConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);
      const res = await getConversations();
      const list = Array.isArray(res.data) ? res.data : [];
      setConversations(list);

      // If we arrived here via ?conversation=<id> (e.g. from "View
      // Product" on the marketplace) and that conversation isn't
      // selected yet, select it now that the list has loaded.
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
    // Keep the URL in sync so the conversation is bookmarkable/shareable
    // and survives a refresh.
    setSearchParams({ conversation: selectedId }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const handleSelect = (id) => setSelectedId(id);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedId || sending) return;

    const text = messageInput.trim();
    setMessageInput('');
    setSending(true);

    try {
      const res = await sendMessage(selectedId, text);
      setThread((prev) => [...prev, res.data]);
      // Refresh the list in the background so the preview/last-message
      // shown in the sidebar stays current.
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

  return (
    <div className="messages-page">
      <NavBar currentPath={location.pathname} />

      <main className="quotes-main">
        <div className="quotes-container">
          {/* Left Sidebar - Conversations List */}
          <aside className="inquiries-sidebar">
            <div className="sidebar-header">
              <h2 className="sidebar-title">Messages</h2>
              <p className="sidebar-subtitle">Conversations with vendors and other teams about marketplace listings</p>
            </div>

            <div className="search-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="inquiries-list">
              {loadingConversations ? (
                <p className="inquiries-empty">Loading conversations…</p>
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <div
                    key={conv._id}
                    className={`inquiry-item ${selectedId === conv._id ? 'active' : ''}`}
                    onClick={() => handleSelect(conv._id)}
                  >
                    <div className="inquiry-avatar">
                      {conv.otherParty?.avatar ? (
                        <img src={conv.otherParty.avatar} alt={conv.otherParty.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        '🏢'
                      )}
                    </div>
                    <div className="inquiry-content">
                      <div className="inquiry-header">
                        <h3 className="inquiry-name">{conv.otherParty?.name || 'Unknown'}</h3>
                      </div>
                      <p className="inquiry-category">
                        {conv.product?.title ? `Re: ${conv.product.title}` : 'General inquiry'}
                      </p>
                      <p className="inquiry-time">{formatTime(conv.lastMessage?.createdAt || conv.updatedAt)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="inquiries-empty">
                  {conversations.length === 0
                    ? "No conversations yet — message a seller from the marketplace to start one."
                    : 'No conversations match your search.'}
                </p>
              )}
            </div>
          </aside>

          {/* Center - Conversation thread (chat is the primary focus) */}
          <div className="inquiry-details">
            {current ? (
              <>
                <div className="details-header">
                  <div className="contact-info">
                    <span className="contact-avatar">
                      {current.otherParty?.avatar ? (
                        <img src={current.otherParty.avatar} alt={current.otherParty.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        '🏢'
                      )}
                    </span>
                    <div className="contact-details">
                      <h2 className="contact-name">{current.otherParty?.name || 'Unknown'}</h2>
                      <p className="contact-status">
                        <span className="status-badge">{current.otherParty?.role || 'Contact'}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="messages-container">
                  {loadingThread ? (
                    <p className="inquiries-empty">Loading messages…</p>
                  ) : thread.length > 0 ? (
                    thread.map((msg) => (
                      <div
                        key={msg._id}
                        className={`message ${msg.sender?.role === 'TEAM' ? 'outgoing' : 'incoming'}`}
                      >
                        {msg.sender?.role !== 'TEAM' && (
                          <div className="message-avatar">🏢</div>
                        )}
                        <div className="message-content">
                          <div className="message-bubble">
                            <p className="message-text">{msg.content}</p>
                          </div>
                          <p className="message-time">{formatTime(msg.createdAt)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="inquiries-empty">
                      No messages yet — say hello to get the conversation started.
                    </p>
                  )}
                </div>

                <div className="message-input-wrapper">
                  <input
                    type="text"
                    className="message-input"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={sending}
                  />
                  <button className="message-send" onClick={handleSendMessage} disabled={sending}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <p className="inquiries-empty">
                {loadingConversations ? 'Loading…' : 'Select a conversation to view messages.'}
              </p>
            )}
          </div>

          {/* Right Sidebar - Referenced product details */}
          <aside className="messaging-sidebar">
            {current && (
              current.product ? (
                <div className="product-panel">
                  <h3 className="product-panel-title">Referenced Product</h3>

                  {current.product.images?.[0] && (
                    <img
                      src={current.product.images[0]}
                      alt={current.product.title}
                      className="product-panel-image"
                    />
                  )}

                  <h4 className="product-panel-name">{current.product.title}</h4>

                  <div className="product-panel-meta">
                    <span className="product-panel-price">${current.product.price}</span>
                    {current.product.category && (
                      <span className="product-panel-category">{current.product.category}</span>
                    )}
                  </div>

                  {current.product.description && (
                    <p className="product-panel-desc">{current.product.description}</p>
                  )}
                </div>
              ) : (
                <div className="product-panel product-panel-empty">
                  <span className="product-panel-empty-icon">💬</span>
                  <p className="inquiries-empty">
                    This is a general inquiry — no specific product was referenced.
                  </p>
                </div>
              )
            )}
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Messages;
