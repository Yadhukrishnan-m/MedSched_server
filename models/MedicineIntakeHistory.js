// models/MedicineIntakeHistory.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Medicine from "./Medicine.js";
import Bystander from "./Bystander.js";
import Patient from "./Patient.js";

const MedicineIntakeHistory = sequelize.define("MedicineIntakeHistory", {
  medicineId: { type: DataTypes.INTEGER, allowNull: false }, // FK to Medicine
  date: { type: DataTypes.DATEONLY, allowNull: false }, // e.g. 2025-09-14
  time: { type: DataTypes.STRING, allowNull: false }, // from times array
  status: {
    type: DataTypes.ENUM("pending", "eaten", "skipped", "missed"),
    defaultValue: "pending",
  },
  updatedBy: { type: DataTypes.ENUM("patient", "bystander"), allowNull: true },
  remarks: { type: DataTypes.STRING },
});

export default MedicineIntakeHistory;


const getPatientIdFromBystander = async (userId) => {
  const bystander = await Bystander.findByPk(userId);
  if (!bystander || !bystander.patientId) {
    return null;
  }
  
  return bystander.patientId;
};

export const getPatientDetails = async (req, res) => {
  try {
    const patientId = await getPatientIdFromBystander(req.userId);
    console.log(patientId,req.userId)
    if (!patientId) {
      return res.json({
        isPatientExist: false,
        message: "No patient linked to this bystander",
      });
    }

    const patient = await Patient.findByPk(patientId, {
      attributes: { exclude: ["password"] },
    });

    if (!patient) {
      return res.json({
        isPatientExist: false,
        message: "Patient not found",
      });
    }

    res.json({ success: true, isPatientExist: true, patient });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isPatientExist: false,
      message: "Error fetching patient details",
      error: error.message,
    });
  }
};


// 2. Get Patient Medicines
export const getPatientMedicines = async (req, res) => {
  try {
    const patientId = await getPatientIdFromBystander(req.userId);
    if (!patientId) {
      return res
        .status(404)
        .json({ message: "No patient linked to this bystander" });
    }

    const medicines = await Medicine.findAll({
      where: { patientId },
      include: [{ model: Doctor, attributes: ["id", "name", "email"] }],
    });

    res.json({ success: true, medicines });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching medicines", error: error.message });
  }
};

// 3. Get Patient Medicine History
export const getPatientMedicineHistory = async (req, res) => {
  try {
    const patientId = await getPatientIdFromBystander(req.userId);
    if (!patientId) {
      return res
        .status(404)
        .json({ message: "No patient linked to this bystander" });
    }

    const history = await MedicineIntakeHistory.findAll({
      include: [
        {
          model: Medicine,
          where: { patientId },
          include: [{ model: Doctor, attributes: ["id", "name"] }],
        },
      ],
      order: [
        ["date", "DESC"],
        ["time", "ASC"],
      ],
    });

    res.json({ success: true, history });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error fetching medicine history",
        error: error.message,
      });
  }
};