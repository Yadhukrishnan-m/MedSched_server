import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Otp = sequelize.define(
  "Otp",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "otps",
  }
);

export default Otp;
