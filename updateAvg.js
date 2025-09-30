const mongoose = require("mongoose");
const Station = require("./models/Station");
const Measurement = require("./models/Measurement");
require("dotenv").config();

async function updateAvgForAllStations() {
  try {
    // ✅ Await connection before running queries
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    const stations = await Station.find();

    for (const st of stations) {
      const result = await Measurement.aggregate([
        { $match: { station: st._id } },
        { $group: { _id: null, avg: { $avg: "$value" } } }
      ]);

      const avg = result[0]?.avg || 0;

      await Station.findByIdAndUpdate(st._id, { avg });
      console.log(`📌 Updated ${st.stationName} (${st.stationCode}) → avg: ${avg}`);
    }

    console.log("🎉 Avg values updated for all stations!");
    await mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error updating avg:", err);
    await mongoose.connection.close();
  }
}

updateAvgForAllStations();
