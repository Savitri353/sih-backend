const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

const Station = require("./models/Station");
const Measurement = require("./models/Measurement");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const filePath = "./data/main_data_cleaned.json"; // your NDJSON file

const importData = async () => {
  try {
    // 1️⃣ Delete existing data
    await Station.deleteMany();
    await Measurement.deleteMany();
    console.log("✅ Existing stations and measurements deleted");

    const lines = fs.readFileSync(filePath, "utf-8")
      .split("\n")
      .filter(Boolean);

    const stationsMap = new Map();
    const measurementsBatch = [];
    const batchSize = 1000;

    // 2️⃣ First pass: collect unique stations
    for (const line of lines) {
      const obj = JSON.parse(line);
      if (!stationsMap.has(obj.stationCode)) {
        stationsMap.set(obj.stationCode, {
          stationCode: obj.stationCode,
          stationName: obj.stationName,
          stationType: obj.stationType,
          latitude: parseFloat(obj.latitude),
          longitude: parseFloat(obj.longitude),
          agencyName: obj.agencyName,
          state: obj.state,
          district: obj.district,
          dataAcquisitionMode: obj.dataAcquisitionMode,
          stationStatus: obj.stationStatus,
          block: obj.block,
        });
      }
    }

    // 3️⃣ Insert stations into DB
    const stationsArray = [...stationsMap.values()];
    const insertedStations = await Station.insertMany(stationsArray);
    console.log(`✅ ${insertedStations.length} stations imported successfully`);

    // 4️⃣ Create a map of stationCode → ObjectId
    const stationIdMap = new Map();
    insertedStations.forEach(station => {
      stationIdMap.set(station.stationCode, station._id);
    });

    // 5️⃣ Second pass: prepare and insert measurements
    for (let i = 0; i < lines.length; i++) {
      const obj = JSON.parse(lines[i]);

      measurementsBatch.push({
        station: stationIdMap.get(obj.stationCode), // ObjectId reference
        value: parseFloat(obj.Value),
        dateTime: new Date(Number(obj.Date_Time)),
        wellDepth: parseFloat(obj.well_depth),
        wellAquiferType: obj.well_aquifer_type,
      });

      // Insert in batches
      if (measurementsBatch.length === batchSize) {
        await Measurement.insertMany(measurementsBatch);
        console.log(`Inserted ${i + 1} measurements...`);
        measurementsBatch.length = 0; // clear batch
      }
    }

    // Insert remaining measurements
    if (measurementsBatch.length > 0) {
      await Measurement.insertMany(measurementsBatch);
      console.log(`Inserted remaining ${measurementsBatch.length} measurements`);
    }

    console.log("✅ All measurements imported successfully");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error importing data:", err);
    mongoose.disconnect();
  }
};

importData();
