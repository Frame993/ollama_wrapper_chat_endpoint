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
    // 1. Get the current history for the given conversationId, or an empty array if none exists
    const history = conversations.get(conversationId) || [];
    // 2. Create a new array with the existing history plus the new message(s)
    const updatedHistory = [...history, ...message];
    // 3. Save the updated history back into the conversations Map
    conversations.set(conversationId, updatedHistory);
    // 4. Return the updated history array
    return updatedHistory;
  },
};
