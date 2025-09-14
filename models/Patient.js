// Patient Model
// models/Patient.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Patient = sequelize.define("Patient", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
});

export default Patient;
