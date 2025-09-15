const express = require("express");
require("dotenv").config();
const cors = require("cors");

const authRoutes = require("./routes/authRoutes.js");
const progressRoutes = require("./routes/progressRoute.js");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://multitracker-backend.onrender.com", // Aapka frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Base test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Auth routes
app.use("/api/auth", authRoutes);
// Progress routes
app.use("/api/progress", progressRoutes);

module.exports = app;
