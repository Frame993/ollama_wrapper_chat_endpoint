import express from "express";
import dotenv from "dotenv";
import z from "zod";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

//Home route
app.get("/", (req, res) => {
  res.send("Ollama wrapper!");
});

const conversations = new Map(); // In-memory store for conversations

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
    const conversationHistory = conversations.get(conversationId) || [];

    const response = await fetch(`${process.env.OLLAMA_ENDPOINT}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "codellama:7b",
        messages: [
          ...conversationHistory, // You can implement conversation history management
          {
            role: "user",
            content: userInput,
          },
        ],
        stream: false,
      }),
    });

    const data = await response.json();

    // Update conversation history
    const updatedConversationHistory = [
      ...conversationHistory,
      { role: "user", content: userInput },
      { role: "assistant", content: data.message.content },
    ];
    conversations.set(conversationId, updatedConversationHistory);

    // Send response back to client
    res.json({
      reply: data.message.content,
      conversationHistory: updatedConversationHistory,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
