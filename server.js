// Server start point
import app from "./app.js";
import sequelize from "./config/db.js"; // Import DB connection

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Check DB connection
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // Sync models if needed
    await sequelize.sync({ alter: true });
    console.log("✅ Models synced");

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to database:", err);
  }
};

startServer();
