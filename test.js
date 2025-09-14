const supabase = require("./src/config/supabaseClient.js");

async function testConnection() {
  const { data, error } = await supabase.from("profile").select("*").limit(1);

  if (error) {
    console.error("Supabase connection error:", error.message);
  } else {
    console.log("Connection successful, sample data:", data);
  }
}

testConnection();
