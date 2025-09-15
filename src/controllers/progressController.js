const supabase = require("../config/supabaseClient");
// Add or update today's progress for logged-in user
async function upsertDailyProgress(req, res) {
  try {
    const userId = req.user.id; // comes from authMiddleware
    const {
      study,
      meditation,
      water_intake,
      exercise,
      test_link,
      linkedin_post,
      other_productive_activity,
      english_practice,
      total_sleep_hours,
      first_bath,
      second_bath,
      walk_10k_steps,
      summary,
    } = req.body;

    const { data, error } = await supabase
      .from("daily_progress")
      .upsert(
        {
          user_id: userId,
          date: new Date().toISOString().slice(0, 10), // today's date
          study,
          meditation,
          water_intake,
          exercise,
          test_link,
          linkedin_post,
          other_productive_activity,
          english_practice,
          total_sleep_hours,
          first_bath,
          second_bath,
          walk_10k_steps,
          summary,
        },
        { onConflict: ["user_id", "date"] }
      ) // update if already exists
      .select();

    if (error) return res.status(400).json({ error: error.message });

    res
      .status(200)
      .json({ message: "Progress saved successfully", progress: data[0] });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Get all progress for logged-in user
async function getUserProgress(req, res) {
  try {
    // FIX: Read userId from query parameter for GET requests.
    // Fallback to the authenticated user's ID if no query is provided.
    const userId = req.query.userId || req.user.id;

    const { data, error } = await supabase
      .from("daily_progress")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ progress: data });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
// controllers/progressController.js

async function getAggregateStats(req, res) {
  try {
    const userId = req.body.userId || req.user.id;

    // 1. Current week (Monday se Sunday) ki dates calculate karein
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // Sunday: 0, Monday: 1, ..., Saturday: 6

    // Monday ki date nikaalein
    const startOfWeek = new Date(today);
    const dayOffset = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    startOfWeek.setDate(today.getDate() - dayOffset);
    const startDate = startOfWeek.toISOString().slice(0, 10);

    // Sunday ki date nikaalein
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const endDate = endOfWeek.toISOString().slice(0, 10);

    // 2. Database se sirf current week (Mon-Sun) ka data fetch karein
    const { data: progressData, error } = await supabase
      .from("daily_progress")
      .select("date, walk_10k_steps, water_intake, total_sleep_hours")
      .eq("user_id", userId)
      .gte("date", startDate) // Start date (Monday) se bada ya barabar
      .lte("date", endDate); // End date (Sunday) se chhota ya barabar

    if (error) {
      console.error("Supabase fetch error:", error);
      return res.status(400).json({ error: error.message });
    }

    if (!progressData || progressData.length === 0) {
      return res.status(200).json({
        totalSteps: 0,
        totalWater: 0,
        totalSleep: 0,
        progressPercentage: 0,
      });
    }

    // 3. Current week ke data par totals calculate karein
    const totals = progressData.reduce(
      (acc, entry) => {
        if (entry.walk_10k_steps === "completed") acc.steps += 10000;
        else if (entry.walk_10k_steps === "partial") acc.steps += 5000;
        acc.water += entry.water_intake || 0;
        acc.sleep += entry.total_sleep_hours || 0;
        return acc;
      },
      { steps: 0, water: 0, sleep: 0 }
    );

    // 4. Weekly Progress Percentage calculate karein (logic same rahega)
    let progressPercentage = 0;
    const requiredDaysCount = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

    if (requiredDaysCount <= 0) {
      progressPercentage = 100;
    } else {
      const loggedDates = new Set(progressData.map((entry) => entry.date));
      let actualEntriesCount = 0;

      for (let i = 0; i < requiredDaysCount; i++) {
        const dateToCheck = new Date();
        dateToCheck.setDate(today.getDate() - (currentDayOfWeek - 1 - i));
        const dateStringToCheck = dateToCheck.toISOString().slice(0, 10);
        if (loggedDates.has(dateStringToCheck)) {
          actualEntriesCount++;
        }
      }
      progressPercentage = Math.round(
        (actualEntriesCount / requiredDaysCount) * 100
      );
    }

    // 5. Final Response bhejein
    res.status(200).json({
      totalSteps: totals.steps,
      totalWater: totals.water,
      totalSleep: totals.sleep,
      progressPercentage: progressPercentage,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
module.exports = { upsertDailyProgress, getUserProgress, getAggregateStats };