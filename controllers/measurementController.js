const Measurement = require("../models/Measurement");
const Station = require("../models/Station");

// Get measurements by stationCode
exports.getMeasurementsByStation = async (req, res) => {
  try {
    const { stationCode } = req.params;

    // 1️⃣ Find station first
    const station = await Station.findOne({ stationCode });
    if (!station) return res.status(404).json({ message: "Station not found" });

    // 2️⃣ Get measurements linked to this station's ObjectId
    const measurements = await Measurement.find({ station: station._id })
      .sort({ dateTime: 1 }) // ascending order
      .select("dateTime value -_id");

    // 3️⃣ Return response
    res.json({
      stationCode: station.stationCode,
      stationName: station.stationName,
      measurements
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get measurements by district
exports.getMeasurementsByDistrict = async (req, res) => {
  try {
    const { districtName } = req.params;

    // 1️⃣ Find all stations in the district
    const stations = await Station.find({ district: districtName });
    if (!stations || stations.length === 0)
      return res.status(404).json({ message: "No stations found in this district" });

    // 2️⃣ Get measurements for each station
    const result = await Promise.all(
      stations.map(async (station) => {
        const measurements = await Measurement.find({ station: station._id })
          .sort({ dateTime: 1 })
          .select("dateTime value -_id");

        return {
          stationCode: station.stationCode,
          stationName: station.stationName,
          measurements
        };
      })
    );

    res.json({
      district: districtName,
      stations: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
