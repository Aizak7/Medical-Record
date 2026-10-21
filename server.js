
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const medicineRoutes = require("./routes/medicineRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Medicine Records API is running",
  });
});

// Medicine API routes
app.use("/api/medicines", medicineRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
