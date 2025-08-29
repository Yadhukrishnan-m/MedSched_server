// Auth Middleware
import jwt from "jsonwebtoken";

// Middleware to verify bystander access token
export const verifyBystanderToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access token not provided",
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Check if role is bystander
    if (decoded.role !== "bystander") {
      return res.status(403).json({
        message: "Access denied. Bystander role required.",
      });
    }

    // Add userId to request object for controller to use
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("Token verification error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        message: "Invalid or expired token.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    res.status(500).json({
      message: "Error verifying token",
      error: error.message,
    });
  }
};