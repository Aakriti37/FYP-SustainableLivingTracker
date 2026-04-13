// routes/authRoutes.js
const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/authController");

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Logout
router.post("/logout", authController.logout);

// Forgot password
router.post("/forgot-password", authController.forgotPassword);

// Reset Password Route
router.post("/reset-password/:token", authController.resetPassword);


module.exports = router;