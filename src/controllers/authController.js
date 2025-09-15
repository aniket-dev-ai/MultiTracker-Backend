const { all } = require("axios");
const supabase = require("../config/supabaseClient");
const CryptoJS = require("crypto-js");
const ImgKit = require("imagekit");
const jwt = require("jsonwebtoken");

const imagekit = new ImgKit({
  publicKey: process.env.IMGKIT_PUBLIC_KEY,
  privateKey: process.env.IMGKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMGKIT_URL_ENDPOINT,
});

async function signup(req, res) {
  const { data } = req.body;
  const imageFile = req.file;

  if (!data) return res.status(400).json({ error: "Missing data field" });

  const parsedData = JSON.parse(data);
  const {
    emailid,
    password,
    name,
    phone_number,
    github_link,
    linkedin_link,
    skills,
  } = parsedData;
 console.log("Parsed signup data:", parsedData);
  if (!emailid || !password || !name)
    return res
      .status(400)
      .json({ error: "Email, password, and name are required" });
  if (!imageFile)
    return res.status(400).json({ error: "Image file is required" });

  try {
    const encryptedPassword = CryptoJS.SHA256(password).toString();
 
    let imageUrl = null;
    if (imageFile) {
      const uploadResult = await imagekit.upload({
        file: imageFile.buffer.toString("base64"),
        fileName: `profile_${Date.now()}.jpg`,
      });
      imageUrl = uploadResult.url;
    }
    console.log("Image uploaded to:", imageUrl);

    // Skip Supabase Auth signup completely

    const { data: insertData, error: insertError } = await supabase
      .from("profile")
      .insert([
        {
          name,
          emailid,
          password: encryptedPassword,
          phone_number,
          github_link,
          linkedin_link,
          skills,
          Image_Url: imageUrl,
        },
      ]);

    if (insertError) {
      await imagekit.deleteFile(imageUrl); // Cleanup image
      return res.status(500).json({ error: insertError.message });
    }

    // Fetch the inserted row explicitly
    const { data: profileData, error: fetchError } = await supabase
      .from("profile")
      .select("*")
      .eq("emailid", emailid)
      .single();

    if (fetchError || !profileData) {
      await imagekit.deleteFile(imageUrl); // Cleanup image
      return res.status(500).json({
        error: fetchError?.message || "Failed to fetch profile after creation",
      });
    }

    const token = jwt.sign(
      { id: profileData.id, emailid: profileData.emailid },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Signup successful (custom auth)",
      token,
      profile: profileData,
      imageUrl,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function login(req, res) {
  const { emailid } = req.body;

  try {
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("emailid", emailid)
      .single();

    if (error || !data)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: data.id, emailid: data.emailid },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ message: "Login successful", token, profile: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllUsers(req, res) {
  try {
    // Supabase se 'profile' table ka data fetch karein
    const { data, error } = await supabase
      .from("profile")
      .select("id, name, Image_Url , emailid") // Sirf zaroori columns select karein
      .order("name", { ascending: true }); // Naam ke anusaar sort karein (optional)

    // Agar Supabase se error aaye to handle karein
    if (error) {
      console.error("Supabase error fetching users:", error);
      return res.status(400).json({ error: error.message });
    }
    res.status(200).json({ users: data });
  } catch (err) {
    // Server mein koi unexpected error aaye to handle karein
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error while fetching users." });
  }
}


module.exports = { signup, login, getAllUsers};
