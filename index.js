import express from "express";
import dotenv from "dotenv";
import { ChatController } from "./controller/chat.controller.js";

// system setup
dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

//Home route
app.get("/", (req, res) => {
  res.send("Ollama wrapper!");
});

//Chat endpoint
app.post("/chat", ChatController.sendMessage);

//Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
