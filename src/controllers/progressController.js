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
    const userId = req.user.id;

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
};


module.exports = { upsertDailyProgress, getUserProgress };