// Patient Controller
import { Patient, Otp } from "../models/index.js";

import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import { generateOtpEmail, sendEmail } from "../services/emailService.js";

// Utility to generate random 6-digit OTP
function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}


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

    const user = await Patient.findOne({
      where: { email: email.trim().toLowerCase() },
    });
    
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
console.log(req.body);
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials or wrong password",
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, "patient");
    const refreshToken = generateRefreshToken(user.id, "patient");

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
      error: error.message,
    });
  }
};

// Refresh Token Controller
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not provided",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user to ensure they still exist
    const user = await Patient.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user.id, "patient");

    res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    // Clear invalid refresh token cookie
    res.clearCookie("refreshToken");

    res.status(403).json({
      message: "Invalid or expired token.",
    });
  }
};

// Logout Controller
export const logout = async (req, res) => {
  try {
    // Clear refresh token cookie
    res.clearCookie("refreshToken");

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      message: "Error during logout",
      error: error.message,
    });
  }
};
