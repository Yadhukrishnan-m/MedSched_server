// Bystander Routes
import express from "express";
import { getHello } from "../controllers/bystanderController.js";

const router = express.Router();

router.get("/", getHello);

export default router;
