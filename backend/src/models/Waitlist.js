// backend/src/models/Waitlist.js
const mongoose = require("mongoose");

const waitlistSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    age: { type: Number, required: true },
    contact: { type: String },
    disease: { type: String },
    preferredWard: { type: String, default: "General" },
    preferredType: { type: String, default: "General" },
    priority: { type: String, enum: ["Critical", "High", "Medium"], default: "High" },
    status: { type: String, enum: ["Waiting", "Assigned", "Cancelled"], default: "Waiting" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Waitlist", waitlistSchema);
