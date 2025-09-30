const Station = require("../models/Station");

// Get all stations metadata
exports.getAllStations = async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single station metadata by stationCode
exports.getStationByCode = async (req, res) => {
  try {
    const station = await Station.findOne({ stationCode: req.params.stationCode });
    if (!station) return res.status(404).json({ message: "Station not found" });
    res.json(station);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
