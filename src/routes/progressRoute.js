const express = require("express");
const {
  upsertDailyProgress,
  getUserProgress,
  getAggregateStats,
} = require("../controllers/progressController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

const router = express.Router();

// Protect all routes with authMiddleware
router.use(authMiddleware);

// Add or update daily progress
router.post("/daily", upsertDailyProgress);
// Get all progress for logged-in user
router.get("/daily", authMiddleware, getUserProgress);

router.post("/weekly",  getAggregateStats);

module.exports = router;
