import { ConversationRepository } from "../repositories/conversation.repository.js";

// Implementation detauils

// Export public interface
export const ChatService = {
  async sendMessage(userInput, conversationId) {
    const conversationHistory =
      ConversationRepository.getConversationHistory(conversationId);

    // Call Ollama API
    const response = await fetch(`${process.env.OLLAMA_ENDPOINT}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "codellama:7b",
        messages: [
          ...conversationHistory,
          {
            role: "user",
            content: userInput,
          },
        ],
        stream: false,
      }),
    });

    const data = await response.json();
    // Add createdAt to messages
    const updatedHistory = ConversationRepository.addMessagesToHistory(
      conversationId,
      [
        {
          role: "user",
          content: userInput,
          createdAt: new Date().toISOString(),
        },
        {
          role: "assistant",
          content: data.message?.content || "",
          createdAt: new Date().toISOString(),
        },
      ]
    );

    // Check Ollama API response
    if (!response.ok) {
      throw new Error("Ollama API error");
    }

    // Return response
    return {
      reply: data.message.content,
      conversationHistory: updatedHistory,
    };
  },
};
