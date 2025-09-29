const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema({
  stationCode: { type: String, required: true, unique: true },
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

module.exports = mongoose.model("Station", stationSchema);
