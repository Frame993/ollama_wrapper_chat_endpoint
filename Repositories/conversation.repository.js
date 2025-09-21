// Implementation detauils
const conversations = new Map(); // In-memory store for conversations

// Export public interface
export const ConversationRepository = {
  getConversationHistory(conversationId) {
    return conversations.get(conversationId) || [];
  },
  setConversationHistory(conversationId, history) {
    return conversations.set(conversationId, history);
  },
  addMessagesToHistory(conversationId, message) {
    const history = conversations.get(conversationId) || [];
    const updatedHistory = [...history, ...message];
    conversations.set(conversationId, updatedHistory);
    return updatedHistory;
  },
};