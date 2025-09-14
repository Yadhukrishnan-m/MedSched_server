// Bystander Routes
import express from "express";
import { login, logout, patientsendOtp, refreshToken, sendOtp, verifyOtpAndRegister, verifyPatientOtpAndRegister } from "../controllers/bystanderController.js";
import { verifyBystanderToken } from "../middlewares/bystanderAuthMiddleware.js";
import { getPatientDetails, getPatientMedicineHistory, getPatientMedicines } from "../models/MedicineIntakeHistory.js";

const router = express.Router();
// Step 1: Send OTP
router.post("/register/send-otp", sendOtp);

// Step 2: Verify OTP & Register
router.post("/register/verify-otp", verifyOtpAndRegister);


// Public routes
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/patient-register/send-otp", patientsendOtp);

router.post(
  "/patient-register/verify-otp",
  verifyBystanderToken,
  verifyPatientOtpAndRegister
);
router.get("/patient-details",verifyBystanderToken, getPatientDetails);
router.get("/medicines",verifyBystanderToken, getPatientMedicines);
router.get("/medicines/history",verifyBystanderToken, getPatientMedicineHistory);



// Protected routes example
// router.get("/profile", verifyAccessToken, (req, res) => {
//   res.json({ user: req.user });
// });

export default router;
