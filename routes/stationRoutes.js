const express = require("express");
const { getAllStations, getStationByCode } = require("../controllers/stationController");
const router = express.Router();

router.get("/", getAllStations);
router.get("/:stationCode", getStationByCode);

module.exports = router;
