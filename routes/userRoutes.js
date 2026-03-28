const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

// For backward compatibility
router.get("/dashboard", authMiddleware, userController.getDashboard);

// Get user profile
router.get("/profile", authMiddleware, userController.getProfile);

// Update user profile
router.put("/profile", authMiddleware, userController.updateProfile);

module.exports = router;