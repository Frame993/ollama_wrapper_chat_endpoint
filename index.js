import express from "express";
import dotenv from "dotenv";
import z from "zod";
import { ConversationRepository } from "./Repositories/conversation.repository.js";

// system setup
dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

//Home route
app.get("/", (req, res) => {
  res.send("Ollama wrapper!");
});

const chatRequestSchema = z.object({
  userInput: z
    .string()
    .trim()
    .min(1, "message cannot be empty")
    .max(100, "message is too long"),
  conversationId: z.uuid(),
});

//Chat endpoint
app.post("/chat", async (req, res) => {
  const parseResult = chatRequestSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({ error: parseResult.error.issues });
    return;
  }

  try {
    const { userInput, conversationId } = parseResult.data;
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

    // Update conversation history using repository method
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
      return res.status(502).json({ error: "Ollama API error" });
    }

    // Send response back to client
    res.json({
      reply: data.message.content,
      conversationHistory: updatedHistory,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
