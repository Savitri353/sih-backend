const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

const Station = require("./models/Station");
const Measurement = require("./models/Measurement");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const filePath = "./data/main_data_cleaned.json"; // your NDJSON file backend\data\main_data_cleaned.json

const importData = async () => {
  try {
    const lines = fs.readFileSync(filePath, "utf-8").split("\n").filter(Boolean);

    const stationsMap = new Map();
    const measurementsBatch = [];
    const batchSize = 1000; // insert 1000 measurements at a time

    // await Station.deleteMany();
    // await Measurement.deleteMany();

    for (let i = 0; i < lines.length; i++) {
      const obj = JSON.parse(lines[i]);

      // Store unique stations
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

      // Add measurement
      measurementsBatch.push({
        stationCode: obj.stationCode,
        value: obj.Value,
        dateTime: new Date(obj.Date_Time),
        wellDepth: obj.well_depth,
        wellAquiferType: obj.well_aquifer_type,
      });

      // Insert batch
      if (measurementsBatch.length === batchSize) {
        await Measurement.insertMany(measurementsBatch);
        measurementsBatch.length = 0; // clear batch
        console.log(`Inserted ${i + 1} measurements...`);
      }
    }

    // Insert remaining measurements
    if (measurementsBatch.length > 0) {
      await Measurement.insertMany(measurementsBatch);
    }

    // Insert stations
    await Station.insertMany([...stationsMap.values()]);
    console.log(`✅ ${stationsMap.size} stations imported successfully`);
    console.log(`✅ All measurements imported successfully`);

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error importing data:", err);
    mongoose.disconnect();
  }
};

importData();
