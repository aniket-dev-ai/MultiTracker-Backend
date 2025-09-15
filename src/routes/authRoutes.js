const express = require("express");

const multer = require("multer");
const { signup, login, getAllUsers } = require("../controllers/authController");

const router = express.Router();
const upload = multer(); // For parsing multipart/form-data

router.post("/signup", upload.single("image"), signup);
router.post("/login", login);
router.get("/users", getAllUsers);

module.exports = router;
