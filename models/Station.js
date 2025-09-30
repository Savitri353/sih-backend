const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema({
  stationCode: { type: String, required: true, unique: true }, // unique for each station
  stationName: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  agencyName: { type: String },
  state: { type: String },
  district: { type: String },
  block: { type: String },

  // ✅ Optional metadata
  stationType: { type: String },          // e.g. Ground Water, Surface Water
  stationStatus: { type: String },        // e.g. Active, Inactive
  dataAcquisitionMode: { type: String },  // e.g. Telemetric, Manual

  // 🔹 Average measurement value
  avg: { type: Number, default: 0 },
}, 
{ timestamps: true });

// 🔹 Indexes for faster lookups
stationSchema.index({ stationCode: 1 });
stationSchema.index({ state: 1 });
stationSchema.index({ district: 1 });
stationSchema.index({ avg: 1 }); // ✅ for sorting/filtering by average

module.exports = mongoose.model("Station", stationSchema);
