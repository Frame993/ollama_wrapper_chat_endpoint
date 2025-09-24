import express from "express";
import dotenv from "dotenv";
import router from "./routes.js";

// system setup
dotenv.config();
const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(router);
const PORT = process.env.PORT || 3000;

//Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
