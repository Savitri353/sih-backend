const express = require("express");
const connectDB = require("./config/db");
const stationRoutes = require("./routes/stationRoutes");
const measurementRoutes = require("./routes/measurementRoutes");
const alertRoutes = require("./routes/alertRoutes"); // new alerts routes
const cors = require("cors");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all origins
// ✅ Optional: restrict to specific frontend URLs
// app.use(cors({
//   origin: ["http://localhost:3000", "http://127.0.0.1:5173"],
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));

app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/api/stations", stationRoutes);
app.use("/api/measurements", measurementRoutes);
app.use("/api/alerts", alertRoutes); // new alerts endpoint

// Test route
app.get("/", (req, res) => {
  res.send("🚀 SIH Backend is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
