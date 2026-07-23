// backend/src/utils/socketHelper.js
const Bed = require("../models/Bed");

/**
 * Broadcasts populated beds list to all connected socket clients.
 */
const emitBedsRefresh = async (req) => {
  try {
    const io = req.app.get("io");
    if (!io) return;
    const beds = await Bed.find().populate({
      path: "patientId",
      select: "name _id"
    });
    io.emit("beds:refresh", beds);
  } catch (err) {
    console.error("emitBedsRefresh error:", err);
  }
};

module.exports = {
  emitBedsRefresh
};
