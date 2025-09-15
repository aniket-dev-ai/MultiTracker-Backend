// Filename: seed-progress-data.js

// Aapke diye gaye users ka data
const usersData = {
  users: [
    {
      id: 15,
      name: "Aditya Mehta",
      Image_Url:
        "https://ui-avatars.com/api/?name=Aditya+Mehta&background=random&color=fff&size=128",
    },
    {
      id: 9,
      name: "Aniket Srivastava",
      Image_Url:
        "https://ik.imagekit.io/datascienceBYAniket/profile_1757929684720_9hjwmYQJ0.jpg",
    },
    {
      id: 12,
      name: "Anjali Singh",
      Image_Url:
        "https://ui-avatars.com/api/?name=Anjali+Singh&background=random&color=fff&size=128",
    },
    {
      id: 17,
      name: "Arjun Desai",
      Image_Url:
        "https://ui-avatars.com/api/?name=Arjun+Desai&background=random&color=fff&size=128",
    },
    {
      id: 18,
      name: "Diya Patel",
      Image_Url:
        "https://ui-avatars.com/api/?name=Diya+Patel&background=random&color=fff&size=128",
    },
    {
      id: 16,
      name: "Isha Gupta",
      Image_Url:
        "https://ui-avatars.com/api/?name=Isha+Gupta&background=random&color=fff&size=128",
    },
    {
      id: 19,
      name: "Kabir Khan",
      Image_Url:
        "https://ui-avatars.com/api/?name=Kabir+Khan&background=random&color=fff&size=128",
    },
    {
      id: 20,
      name: "Myra Iyer",
      Image_Url:
        "https://ui-avatars.com/api/?name=Myra+Iyer&background=random&color=fff&size=128",
    },
    {
      id: 10,
      name: "Priya Sharma",
      Image_Url:
        "https://ui-avatars.com/api/?name=Priya+Sharma&background=random&color=fff&size=128",
    },
    {
      id: 11,
      name: "Rohan Verma",
      Image_Url:
        "https://ui-avatars.com/api/?name=Rohan+Verma&background=random&color=fff&size=128",
    },
    {
      id: 14,
      name: "Sneha Reddy",
      Image_Url:
        "https://ui-avatars.com/api/?name=Sneha+Reddy&background=random&color=fff&size=128",
    },
    {
      id: 13,
      name: "Vikram Rathore",
      Image_Url:
        "https://ui-avatars.com/api/?name=Vikram+Rathore&background=random&color=fff&size=128",
    },
    {
      id: 21,
      name: "Zayn Ahmed",
      Image_Url:
        "https://ui-avatars.com/api/?name=Zayn+Ahmed&background=random&color=fff&size=128",
    },
  ],
};

// --- Realistic Dummy Content ---
const studyTopics = [
  "Learned about React Hooks and state management.",
  "Practiced complex SQL joins on a sample database.",
  "Studied Python decorators and generators.",
  "Read two chapters on Neural Networks from a textbook.",
  "Completed a Coursera module on advanced data cleaning techniques.",
  "Worked on a personal project using FastAPI.",
];
const exerciseActivities = [
  "Went for a 30-minute morning run.",
  "Completed a full-body workout session at the gym.",
  "Did 45 minutes of relaxing Yoga.",
  "Played badminton with friends for an hour.",
  "Went for a long evening walk to clear my head.",
  "Followed a HIIT workout video on YouTube.",
];
const englishPracticeActivities = [
  "Read a news article on The Guardian.",
  "Watched a full TED talk without subtitles.",
  "Practiced speaking with a language partner for 20 minutes.",
  "Wrote a short blog post on a technical topic.",
  "Listened to an English podcast during my commute.",
];
const summarySentences = [
  "It was a productive day overall, managed to tick off most of my to-do list.",
  "Felt a bit tired in the evening but pushed through the important tasks.",
  "A great day for learning new concepts. Feeling confident.",
  "Struggled with focus in the afternoon but the evening was better.",
  "Balanced work and relaxation well today.",
];
const stepStatuses = ["completed", "partial", "not_completed", "not_tracked"];

// --- Helper Functions ---
// Array se random item nikalne ke liye
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
// Range ke beech random integer nikalne ke liye
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Generates dummy progress data for all users.
 * @returns {Array<Object>} An array of progress entry objects ready for insertion.
 */
function generateDummyProgressData() {
  const allProgressEntries = [];
  const today = new Date();

  usersData.users.forEach((user) => {
    // Har user ke liye 5 se 10 din ka data generate karein
    const daysToGenerate = getRandomInt(5, 10);

    for (let i = 1; i <= daysToGenerate; i++) {
      const entryDate = new Date(today);
      entryDate.setDate(today.getDate() - i);

      const progressEntry = {
        user_id: user.id,
        date: entryDate.toISOString().slice(0, 10), // Format: YYYY-MM-DD
        study: Math.random() > 0.15 ? getRandomItem(studyTopics) : null, // 85% chance
        meditation:
          Math.random() > 0.4
            ? `${getRandomInt(5, 20)} minutes of mindfulness meditation.`
            : null, // 60% chance
        water_intake: getRandomInt(2, 5), // 2 se 5 litre
        exercise:
          Math.random() > 0.2 ? getRandomItem(exerciseActivities) : null, // 80% chance
        test_link:
          Math.random() > 0.85 ? "https://example.com/test/result-123" : null, // 15% chance
        linkedin_post:
          Math.random() > 0.75
            ? "Shared a post about recent trends in data science."
            : null, // 25% chance
        other_productive_activity: null, // Ise null rakhte hain simplicity ke liye
        english_practice:
          Math.random() > 0.3 ? getRandomItem(englishPracticeActivities) : null, // 70% chance
        total_sleep_hours: getRandomInt(6, 9), // 6 se 9 ghante
        first_bath: Math.random() > 0.1, // 90% chance
        second_bath: Math.random() > 0.6, // 40% chance
        walk_10k_steps: getRandomItem(stepStatuses),
        summary: getRandomItem(summarySentences),
      };

      allProgressEntries.push(progressEntry);
    }
  });

  return allProgressEntries;
}

// --- How to Use ---

// 1. Dummy data generate karein
const dummyData = generateDummyProgressData();

// 2. Console mein print karke dekhein (Optional)
console.log(`Generated ${dummyData.length} dummy progress entries.`);
console.log(JSON.stringify(dummyData, null, 2)); // Formatted JSON output

// 3. Supabase mein data insert karein
// NOTE: Yeh code chalane se pehle aapko Supabase client setup karna hoga.
// Is function ko 'async' banana padega.


  // Supabase client instance (example)
  const { createClient } = require("@supabase/supabase-js");
  const supabase = createClient(
    "https://lcvkczgrmbqzovzordzt.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjdmtjemdybWJxem92em9yZHp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NDY1MjgsImV4cCI6MjA3MzQyMjUyOH0.yFWbeZi4RV3sIbSJwJObWc9deTC-6E08GZ3JGDdBC3E"
  );
  async function insertDataIntoSupabase() {
    console.log('Inserting data into Supabase...');
    const { data, error } = await supabase
      .from('daily_progress')
      .insert(dummyData);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Successfully inserted data!', data);
    }
  }

  // Is function ko call karke data insert karein
  insertDataIntoSupabase();
