import express from "express";
import { ChatController } from "./controller/chat.controller.js";

const router = express.Router();

//Home route
router.get("/", (req, res) => {
  res.send("Ollama wrapper!");
});

//Chat endpoint
router.post("/chat", ChatController.sendMessage);

export default router;