// Medicine Model
// models/Medicine.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Medicine = sequelize.define("Medicine", {
  patientId: { type: DataTypes.INTEGER, allowNull: false },   // FK to Patient
  prescribedBy: { type: DataTypes.INTEGER, allowNull: false }, // FK to Doctor

  name: { type: DataTypes.STRING, allowNull: false }, // Paracetamol
  dosageMg: { type: DataTypes.INTEGER, allowNull: false },   // e.g. 500
  description: { type: DataTypes.STRING },

  times: { 
    type: DataTypes.JSON, 
    allowNull: false, 
    defaultValue: [] // e.g. ["08:00", "20:00"]
  },
  frequency: { 
    type: DataTypes.ENUM("daily", "weekly", "custom"), 
    defaultValue: "daily" 
  },
  startDate: { type: DataTypes.DATEONLY, allowNull: false },
  endDate: { type: DataTypes.DATEONLY },
});

export default Medicine;
