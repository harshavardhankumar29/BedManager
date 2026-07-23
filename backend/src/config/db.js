// src/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital-bed-management";
    await mongoose.connect(connStr);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // If remote connection fails, try fallback to local MongoDB if available
    if (process.env.MONGO_URI || process.env.MONGODB_URI) {
      try {
        console.log("🔄 Retrying with local MongoDB connection...");
        await mongoose.connect("mongodb://127.0.0.1:27017/hospital-bed-management");
        console.log("✅ Connected to local MongoDB");
        return;
      } catch (localErr) {
        console.error("❌ Local MongoDB fallback also failed:", localErr.message);
      }
    }
    process.exit(1); // stop app if DB fails
  }
};

module.exports = connectDB;
