import sequelize from "../config/db.js";
import Bystander from "./Bystander.js";
import Otp from "./otp.js";

try {
  await sequelize.sync({ alter: true });
  console.log("✅ Tables synced");
} catch (err) {
  console.error("❌ Sync error:", err);
}

export { Bystander, Otp };
