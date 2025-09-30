const Station = require("../models/Station");
const Measurement = require("../models/Measurement");

// Helper function to calculate avg dynamically (optional)
const calculateAvg = async (stationId) => {
  const measurements = await Measurement.find({ station: stationId });
  if (measurements.length === 0) return 0;
  const sum = measurements.reduce((acc, m) => acc + m.value, 0);
  return parseFloat((sum / measurements.length).toFixed(2)); // ✅ round to 2 decimals
};

// Get all stations metadata with rounded avg
exports.getAllStations = async (req, res) => {
  try {
    const stations = await Station.find();

    const stationsWithAvg = stations.map(station => {
      return {
        ...station.toObject(),
        avg: parseFloat(station.avg.toFixed(2)) // ✅ round avg field from DB
      };
    });

    res.json(stationsWithAvg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single station metadata by stationCode with rounded avg
exports.getStationByCode = async (req, res) => {
  try {
    const station = await Station.findOne({ stationCode: req.params.stationCode });
    if (!station) return res.status(404).json({ message: "Station not found" });

    res.json({
      ...station.toObject(),
      avg: parseFloat(station.avg.toFixed(2)) // ✅ round avg field from DB
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
