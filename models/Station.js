const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema({
  stationCode: { type: String, required: true, unique: true }, // unique for each station
  stationName: { type: String, required: true },
  stationType: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  agencyName: { type: String },
  state: { type: String },
  district: { type: String },
  dataAcquisitionMode: { type: String },
  stationStatus: { type: String },
  block: { type: String },
}, { timestamps: true });

// 🔹 Indexes for faster lookups
stationSchema.index({ stationCode: 1 });
stationSchema.index({ state: 1 });
stationSchema.index({ district: 1 });

module.exports = mongoose.model("Station", stationSchema);
