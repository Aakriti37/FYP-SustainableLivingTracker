const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadImage } = require("../controllers/uploadController");
const authMiddleware = require("../middleware/authMiddleware");

// Upload single image
router.post("/image", authMiddleware, upload.single("image"), uploadImage);

module.exports = router;