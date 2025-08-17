import express from "express";
import cors from "cors";
import bystanderRoutes from "./routes/bystanderRoutes.js";

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests

// Routes
app.use("/api/bystander", bystanderRoutes);

export default app;
