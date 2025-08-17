import sequelize from "../db.js";
import User from "./Bystander.js";

try {
  await sequelize.sync({ alter: true });
  console.log("✅ Tables synced");
} catch (err) {
  console.error("❌ Sync error:", err);
}

export { User };
