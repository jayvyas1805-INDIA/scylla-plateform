import api from './api';

// Start (or reuse) a conversation about a specific product — the backend
// resolves the seller from the product's own owner automatically.
export const openConversation = (productId) => {
  return api.post('/api/chat/open', { productId });
};

// Start (or reuse) a conversation with an explicit user (not tied to a
// product) — kept for completeness / future use (e.g. a "search users"
// based chat entry point).
export const openConversationWithUser = (targetUserId, targetRole) => {
  return api.post('/api/chat/open', { targetUserId, targetRole });
};

export const getConversations = () => {
  return api.get('/api/chat/conversations');
};

export const getMessages = (conversationId) => {
  return api.get(`/api/chat/conversations/${conversationId}/messages`);
};

export const sendMessage = (conversationId, content) => {
  return api.post('/api/chat/message', { conversationId, content });
};
