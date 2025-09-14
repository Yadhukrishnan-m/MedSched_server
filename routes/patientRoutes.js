// Patient Routes
// Patient Routes
// Patient Routes
import express from "express";
import { login, logout, refreshToken,  } from "../controllers/patientController.js";

const router = express.Router();
// Step 1: Send OTP


// Public routes
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

// Protected routes example
// router.get("/profile", verifyAccessToken, (req, res) => {
//   res.json({ user: req.user });
// });

export default router;
