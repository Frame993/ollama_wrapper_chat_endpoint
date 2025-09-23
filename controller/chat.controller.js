import z from "zod";
import { ChatService } from "../services/chat.service.js";

// Implementation details
const chatRequestSchema = z.object({
  userInput: z
    .string()
    .trim()
    .min(1, "message cannot be empty")
    .max(100, "message is too long"),
  conversationId: z.uuid(),
});

// Export public interface
export const ChatController = {
  async sendMessage(req, res) {
    // Validate request body
    const parseResult = chatRequestSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.issues });
      return;
    }
    // Process valid request
    try {
      const { userInput, conversationId } = parseResult.data;
      const chatResponse = await ChatService.sendMessage(
        userInput,
        conversationId
      );
      res.json(chatResponse);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
