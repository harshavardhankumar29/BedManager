// src/routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const {
    admitPatient,
    dischargePatient,
    transferPatient,
    getPatients,
    getPatient,
    addToWaitlist,
    getWaitlist,
    deleteWaitlist
} = require("../controllers/patientController");

// Waitlist routes
router.post("/waitlist", addToWaitlist);
router.get("/waitlist", getWaitlist);
router.delete("/waitlist/:id", deleteWaitlist);

// Admit -> finds an available bed and links it
router.post("/admit", admitPatient);

// Discharge -> releases bed and removes patient
router.delete("/discharge/:id", dischargePatient);

// Transfer -> move patient to another available bed
router.put("/transfer/:id", transferPatient);

// List patients
router.get("/", getPatients);

// Single patient
router.get("/:id", getPatient);

module.exports = router;

