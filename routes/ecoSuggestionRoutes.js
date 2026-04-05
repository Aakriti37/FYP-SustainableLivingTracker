// routes/ecoSuggestionRoutes.js

const express                = require("express");
const router                 = express.Router();
const authMiddleware         = require("../middleware/authMiddleware");
const ecoSuggestionController = require("../controllers/ecoSuggestionController");

// Generate AI eco suggestions
// POST /api/eco-suggestions/generate
router.post("/generate",   authMiddleware, ecoSuggestionController.generateSuggestions);

// Get user lifestyle profile
// GET /api/eco-suggestions/lifestyle
router.get("/lifestyle",   authMiddleware, ecoSuggestionController.getLifestyle);

// Save user lifestyle profile
// POST /api/eco-suggestions/lifestyle
router.post("/lifestyle",  authMiddleware, ecoSuggestionController.saveLifestyle);

// Eco chatbot
// POST /api/eco-suggestions/chat
router.post("/chat",       authMiddleware, ecoSuggestionController.chat);

module.exports = router;
