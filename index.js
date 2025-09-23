import express from "express";
import dotenv from "dotenv";
import z from "zod";
import { ChatService } from "./services/chat.service.js";

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
    const chatResponse = await ChatService.sendMessage(
      userInput,
      conversationId
    );
    res.json(chatResponse);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
