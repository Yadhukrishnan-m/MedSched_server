// Bystander Routes
import express from "express";
import { login, logout, refreshToken, sendOtp, verifyOtpAndRegister } from "../controllers/bystanderController.js";

const router = express.Router();
// Step 1: Send OTP
router.post("/register/send-otp", sendOtp);

// Step 2: Verify OTP & Register
router.post("/register/verify-otp", verifyOtpAndRegister);


// Public routes
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

// Protected routes example
// router.get("/profile", verifyAccessToken, (req, res) => {
//   res.json({ user: req.user });
// });

export default router;
