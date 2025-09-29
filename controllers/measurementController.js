const Measurement = require("../models/Measurement");
const Station = require("../models/Station");

// ✅ Get measurements by stationCode
exports.getMeasurementsByStation = async (req, res) => {
  try {
    const { stationCode } = req.params;

    // 1️⃣ Get station metadata
    const station = await Station.findOne({ stationCode });
    if (!station) return res.status(404).json({ message: "Station not found" });

    // 2️⃣ Get all measurements for that station
    const measurements = await Measurement.find({ stationCode })
      .sort({ dateTime: 1 }) // ascending order by date
      .select("dateTime value -_id"); // only required fields

    // 3️⃣ Return combined object
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

// ✅ Get measurements by state

// exports.getMeasurementsByState = async (req, res) => {
//   try {
//     const { stateName } = req.params;

//     // Step 1: Find stations in that state
//     const stations = await Station.find({
//       state: { $regex: new RegExp("^" + stateName + "$", "i") }
//     });

//     const stationCodes = stations.map(st => st.stationCode);

//     // Step 2: Find measurements for those stations
//     const measurements = await Measurement.find({
//       stationCode: { $in: stationCodes }
//     });

//     res.json({
//       state: stateName,
//       measurements
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// ✅ Get measurements by district
exports.getMeasurementsByDistrict = async (req, res) => {
  try {
    const { districtName } = req.params;

    // 1️⃣ Get all stations in the district
    const stations = await Station.find({ district: districtName });
    if (!stations || stations.length === 0)
      return res.status(404).json({ message: "No stations found in this district" });

    // 2️⃣ For each station, get its measurements
    const result = await Promise.all(
      stations.map(async (station) => {
        const measurements = await Measurement.find({ stationCode: station.stationCode })
          .sort({ dateTime: 1 })
          .select("dateTime value -_id"); // only necessary fields

        return {
          stationCode: station.stationCode,
          stationName: station.stationName,
          measurements
        };
      })
    );

    // 3️⃣ Return district + stations + measurements
    res.json({
      district: districtName,
      stations: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

