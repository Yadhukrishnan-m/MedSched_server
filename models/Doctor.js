// Doctor Model
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Doctor = sequelize.define(
  "Doctor",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // validates proper email format
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt enabled
    tableName: "doctors", // optional: to control table name
  }
);

export default Doctor;
