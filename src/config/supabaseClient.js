const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
console.log("Supabase URL:", supabaseUrl ? "Loaded" : "Not Loaded");
console.log("Supabase Key:", supabaseKey ? "Loaded" : "Not Loaded");
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
