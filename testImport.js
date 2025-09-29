const mongoose = require("mongoose");
require("dotenv").config();

const Station = require("./models/Station");
const Measurement = require("./models/Measurement");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const testData = async () => {
  try {
    // Clear old data (optional)
    await Station.deleteMany();
    await Measurement.deleteMany();

    // Insert one station
    const station = await Station.create({
      stationCode: "TEST001",
      stationName: "Test Station",
      stationType: "Ground Water",
      latitude: 23.0,
      longitude: 72.0,
      agencyName: "CGWB",
      state: "Gujarat",
      district: "Ahmedabad",
      dataAcquisitionMode: "Telemetric",
      stationStatus: "Active",
      block: "TEST",
    });
    console.log("✅ Test Station inserted:", station);

    // Insert one measurement
    const measurement = await Measurement.create({
      stationCode: "TEST001",
      value: -20.5,
      dateTime: new Date(),
      wellDepth: 100,
      wellAquiferType: "Unconfined",
    });
    console.log("✅ Test Measurement inserted:", measurement);

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error inserting test data:", err);
    mongoose.disconnect();
  }
};

testData();
