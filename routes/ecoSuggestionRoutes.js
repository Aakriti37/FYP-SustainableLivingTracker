// routes/ecoSuggestionRoutes.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const ecoSuggestionController = require("../controllers/ecoSuggestionController");

// Generate AI eco suggestions for the logged-in user
// POST /api/eco-suggestions/generate
router.post("/generate", authMiddleware, ecoSuggestionController.generateSuggestions);

module.exports = router;
