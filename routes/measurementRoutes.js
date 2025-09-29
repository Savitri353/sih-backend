const express = require("express");
const router = express.Router();
const {
  getMeasurementsByStation,

  getMeasurementsByDistrict
} = require("../controllers/measurementController");




// 🔹 Measurements of one station (for line graph)
router.get("/station/:stationCode", getMeasurementsByStation);

// 🔹 Measurements of all stations in a district
router.get("/district/:districtName", getMeasurementsByDistrict);


module.exports = router;
