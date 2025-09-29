const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema({
  stationCode: { type: String, required: true }, // link to Station
  value: { type: Number },
  dateTime: { type: Date, required: true },
  wellDepth: { type: Number },
  wellAquiferType: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Measurement", measurementSchema);
