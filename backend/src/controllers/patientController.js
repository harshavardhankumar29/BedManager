// src/controllers/patientController.js
const Patient = require("../models/Patient");
const Bed = require("../models/Bed");
const Waitlist = require("../models/Waitlist");
const { emitBedsRefresh } = require("../utils/socketHelper");

// Admit a patient and allocate an available bed
exports.admitPatient = async (req, res) => {
  let reservedBed = null;
  try {
    const { name, age, disease, preferredWard, preferredType } = req.body;
    if (!name || age === undefined || age === null) {
      return res.status(400).json({ error: "Patient name and age are required" });
    }

    // Atomically reserve a bed by changing status from "Available" -> "Occupied"
    const bedQuery = { status: "Available" };
    if (preferredWard) bedQuery.ward = preferredWard;
    if (preferredType) bedQuery.type = preferredType;

    const bed = await Bed.findOneAndUpdate(
      bedQuery,
      { status: "Occupied" },
      { new: true }
    );

    if (!bed) {
      return res.status(404).json({ error: "No available bed found matching criteria" });
    }
    reservedBed = bed;

    // Create patient and link bed
    const patient = await Patient.create({
      name,
      age,
      disease,
      bedId: bed._id
    });

    // Link patientId to bed
    bed.patientId = patient._id;
    await bed.save();

    // emit events
    const io = req.app.get("io");
    if (io) io.emit("patients:admitted", { patient, bed });
    await emitBedsRefresh(req);

    res.status(201).json({ patient, bed });
  } catch (error) {
    console.error("admitPatient error:", error);
    if (reservedBed) {
      // Revert bed allocation on error
      await Bed.findByIdAndUpdate(reservedBed._id, {
        status: "Available",
        patientId: null
      }).catch((e) => console.error("Rollback bed error:", e));
      await emitBedsRefresh(req);
    }
    res.status(500).json({ error: error.message });
  }
};

// Discharge patient and release bed
exports.dischargePatient = async (req, res) => {
  try {
    const { id } = req.params; // patient id
    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    let releasedBed = null;
    // If patient had a bed, release it
    if (patient.bedId) {
      releasedBed = await Bed.findByIdAndUpdate(patient.bedId, {
        status: "Available",
        patientId: null
      }, { new: true });
    }

    await Patient.findByIdAndDelete(id);

    const io = req.app.get("io");
    if (io) io.emit("patients:discharged", { patientId: id, bed: releasedBed });
    await emitBedsRefresh(req);

    res.status(200).json({ message: "Patient discharged and bed released" });
  } catch (error) {
    console.error("dischargePatient error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Transfer patient to another available bed
exports.transferPatient = async (req, res) => {
  let reservedNewBed = null;
  try {
    const { id } = req.params; // patient id
    const { targetWard, targetType } = req.body;

    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    // Atomically reserve a new bed
    const newBedQuery = { status: "Available" };
    if (targetWard) newBedQuery.ward = targetWard;
    if (targetType) newBedQuery.type = targetType;

    const newBed = await Bed.findOneAndUpdate(
      newBedQuery,
      { status: "Occupied" },
      { new: true }
    );

    if (!newBed) {
      return res.status(404).json({ error: "No available target bed" });
    }
    reservedNewBed = newBed;

    const oldBedId = patient.bedId;

    // Release old bed if exists
    if (oldBedId) {
      await Bed.findByIdAndUpdate(oldBedId, {
        status: "Available",
        patientId: null
      });
    }

    // Update patient record
    patient.bedId = newBed._id;
    await patient.save();

    // Link patient to new bed
    newBed.patientId = patient._id;
    await newBed.save();

    const io = req.app.get("io");
    if (io) io.emit("patients:transferred", { patient, newBed });
    await emitBedsRefresh(req);

    res.status(200).json({ patient, newBed });
  } catch (error) {
    console.error("transferPatient error:", error);
    if (reservedNewBed) {
      await Bed.findByIdAndUpdate(reservedNewBed._id, {
        status: "Available",
        patientId: null
      }).catch((e) => console.error("Rollback transfer bed error:", e));
      await emitBedsRefresh(req);
    }
    res.status(500).json({ error: error.message });
  }
};

// Get all patients
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate("bedId");
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single patient
exports.getPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id).populate("bedId");
    if (!patient) return res.status(404).json({ error: "Not found" });
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Waitlist Management
exports.addToWaitlist = async (req, res) => {
  try {
    const { patientName, age, contact, disease, preferredWard, preferredType, priority } = req.body;
    if (!patientName || !age) {
      return res.status(400).json({ error: "Patient name and age are required" });
    }
    const item = await Waitlist.create({
      patientName,
      age,
      contact,
      disease,
      preferredWard: preferredWard || "General",
      preferredType: preferredType || "General",
      priority: priority || "High"
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWaitlist = async (req, res) => {
  try {
    const list = await Waitlist.find({ status: "Waiting" }).sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteWaitlist = async (req, res) => {
  try {
    const { id } = req.params;
    await Waitlist.findByIdAndDelete(id);
    res.status(200).json({ message: "Removed from waitlist" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
