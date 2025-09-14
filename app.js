import express from "express";
import cors from "cors";
import bystanderRoutes from "./routes/bystanderRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from './routes/patientRoutes.js'
import morgan from "morgan";

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
// Optional: Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  })
);

// Routes
app.use("/bystander", bystanderRoutes);
app.use("/doctor", doctorRoutes);
app.use("/patient", patientRoutes);



export default app;
