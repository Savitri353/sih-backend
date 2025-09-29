const Measurement = require("../models/Measurement");

// Example thresholds (tune these values later)
const thresholds = {
  green: -10,
  yellow: -20,
  red: -30
};

exports.getAlerts = async (req, res) => {
  try {
    // Find latest measurement for each station
    const pipeline = [
      { $sort: { stationCode: 1, dateTime: -1 } },
      {
        $group: {
          _id: "$stationCode",
          latestValue: { $first: "$value" },
          dateTime: { $first: "$dateTime" }
        }
      }
    ];
    const results = await Measurement.aggregate(pipeline);

    // Classify into alerts
    const alerts = results.map(r => {
      let status = "green";
      if (r.latestValue <= thresholds.red) status = "red";
      else if (r.latestValue <= thresholds.yellow) status = "yellow";

      return {
        stationCode: r._id,
        value: r.latestValue,
        dateTime: r.dateTime,
        status
      };
    });

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
