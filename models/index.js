// models/index.js
import sequelize from "../config/db.js";

import Patient from "./Patient.js";
import Doctor from "./Doctor.js";
import Bystander from "./Bystander.js";
import Medicine from "./Medicine.js";
import MedicineIntakeHistory from "./MedicineIntakeHistory.js";
import Otp from "./Otp.js";

// 🔹 Define relationships

Doctor.hasMany(Medicine, { foreignKey: "prescribedBy" });
Medicine.belongsTo(Doctor, { foreignKey: "prescribedBy" });

Patient.hasMany(Medicine, { foreignKey: "patientId" });
Medicine.belongsTo(Patient, { foreignKey: "patientId" });

Patient.hasMany(Bystander, { foreignKey: "patientId" });
Bystander.belongsTo(Patient, { foreignKey: "patientId" });

Medicine.hasMany(MedicineIntakeHistory, { foreignKey: "medicineId" });
MedicineIntakeHistory.belongsTo(Medicine, { foreignKey: "medicineId" });

// 🔹 Sync DB
try {
  await sequelize.sync({ alter: true }); // use { force: true } if you want to reset all
  console.log("✅ Tables synced");
} catch (err) {
  console.error("❌ Sync error:", err);
}

export {
  sequelize,
  Patient,
  Doctor,
  Bystander,
  Medicine,
  MedicineIntakeHistory,
  Otp,
};
