import { Bystander, Otp, Patient } from "../models/index.js";

import jwt from "jsonwebtoken";


import bcrypt from "bcrypt";
import { generateOtpEmail, generatePatientRegistrationEmail, sendEmail } from "../services/emailService.js";

// Utility to generate random 6-digit OTP
function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

//  Send OTP
export const sendOtp = async (req, res) => {
  try {
    console.log(req.body);
    
    const {  email  } = req.body;

    // check if user already exists
    const existing = await Bystander.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // generate OTP
    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // save OTP in db
    await Otp.create({ email, otp: otpCode, expiresAt });

    // TODO: send OTP via email/sms
    await sendEmail(email, "Your OTP Code for Registration", generateOtpEmail(otpCode));

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};

// Step 2: Verify OTP & Register
export const verifyOtpAndRegister = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    // find otp record
const otpRecord = await Otp.findOne({
  where: { email },
  order: [["createdAt", "DESC"]], // get the most recent one
});       


    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

       if (otpRecord.otp !== String(otp)) {
         return res.status(400).json({ message: "Invalid OTP" });
       }


    // check expiry
    if (otpRecord.expiresAt < new Date()) {
      await otpRecord.destroy(); // cleanup
      return res.status(400).json({ message: "OTP expired" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create bystander
    const newBystander = await Bystander.create({
      name,
      email:email.trim().toLowerCase(),
      password: hashedPassword,
    });

    // delete otp after success
    await otpRecord.destroy();

    res.json({ message: "Registration successful", user: newBystander });
  } catch (error) {
    console.log(error);
    
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};



// Utility functions for token generation
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" } // Short-lived access token
  );
};

const generateRefreshToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // Long-lived refresh token
  );
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await Bystander.findOne({ where: { email:email.trim().toLowerCase() } });
    console.log(user)
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials or wrong password",
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, "bystander");
    const refreshToken = generateRefreshToken(user.id, "bystander");

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return response with access token
    res.json({
      message: "Login successful",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Error during login", 
      error: error.message 
    });
  }
};

// Refresh Token Controller
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ 
        message: "Refresh token not provided" 
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find user to ensure they still exist
    const user = await Bystander.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        message: "User not found" 
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user.id, 'bystander');

    res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    
    // Clear invalid refresh token cookie
    res.clearCookie("refreshToken");
    
    res.status(403).json({ 
      message: "Invalid or expired token." 
    });
  }
};

// Logout Controller
export const logout = async (req, res) => {
  try {
    // Clear refresh token cookie
    res.clearCookie("refreshToken");
    
    res.json({ 
      success:true,
      message: "Logout successful" 
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ 
      message: "Error during logout", 
      error: error.message 
    });
  }
};


export const verifyPatientOtpAndRegister = async (req, res) => {
  try {
    console.log('hi')
    const { name, email, password, otp } = req.body;
    const userId = req.userId; // from auth middleware

    // find otp record
    const otpRecord = await Otp.findOne({
      where: { email },
      order: [["createdAt", "DESC"]],
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.otp !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // check expiry
    if (otpRecord.expiresAt < new Date()) {
      await otpRecord.destroy();
      return res.status(400).json({ message: "OTP expired" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create Patient
    const newPatient = await Patient.create({
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    // update existing bystander with patientId
    const bystander = await Bystander.findByPk(userId);
    if (!bystander) {
      return res.status(404).json({ message: "Bystander not found" });
    }
    bystander.patientId = newPatient.id;
    await bystander.save();

    // delete otp after success
    await otpRecord.destroy();

    // send success email with password
    const emailContent = generatePatientRegistrationEmail(name, password);
    await sendEmail(
      email,
      "MedSched - Patient Registration Successful",
      emailContent
    );

    res.json({
      success:true,
      message: "Patient registered successfully",
      patient: newPatient,
      bystander,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error verifying OTP",
      error: error.message,
    });
  }
};


//  Send OTP
export const patientsendOtp = async (req, res) => {
  try {
    console.log(req.body);
    
    const {  email  } = req.body;

    // check if user already exists
    const existing = await Patient.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // generate OTP
    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // save OTP in db
    await Otp.create({ email, otp: otpCode, expiresAt });

    // TODO: send OTP via email/sms
    await sendEmail(email, "Your OTP Code for patient Registration", generateOtpEmail(otpCode));

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};



