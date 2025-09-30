const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema({
  station: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Station", 
    required: true 
  }, // 🔹 reference to Station collection
  value: { type: Number },
  dateTime: { type: Date, required: true },
  wellDepth: { type: Number },
  wellAquiferType: { type: String },
}, { timestamps: true });

// 🔹 Index for faster queries (by station + date)
measurementSchema.index({ station: 1, dateTime: -1 });

module.exports = mongoose.model("Measurement", measurementSchema);
