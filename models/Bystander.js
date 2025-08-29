import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Bystander = sequelize.define(
  "Bystander",
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
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // references: {
      //   model: "Patients",
      //   key: "id",
      // },
    },
  },
  {
    timestamps: true, // createdAt & updatedAt enabled
    tableName: "bystanders", // optional: to control table name
  }
);

export default Bystander;
