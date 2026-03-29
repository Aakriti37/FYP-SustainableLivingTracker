// controllers/ecoSuggestionController.js

const Habit = require("../models/Habit");
const Goal = require("../models/Goal");
const CarbonLog = require("../models/CarbonLog");
const ActivityLog = require("../models/ActivityLog");
const { buildPrompt, callGroqAPI } = require("../services/ecoSuggestionService");

/**
 * POST /api/eco-suggestions/generate
 * Fetches the logged-in user's data, builds a Groq prompt,
 * and returns 4 personalised eco suggestions.
 */
exports.generateSuggestions = async (req, res) => {
  try {
    const userId = req.user.id;

    // ── Fetch all user data in parallel ───────────────────────────────────
    const [habits, goals, carbonLogs, activityLogs] = await Promise.all([
      Habit.find({ userId, isActive: true }).lean(),
      Goal.find({ userId }).sort({ targetDate: 1 }).lean(),
      CarbonLog.find({ userId }).sort({ date: -1 }).limit(30).lean(),
      ActivityLog.find({ userId }).sort({ date: -1 }).limit(20).lean(),
    ]);

    // ── Build prompt and call Groq ─────────────────────────────────────────
    const prompt = buildPrompt(habits, goals, carbonLogs, activityLogs);
    const suggestions = await callGroqAPI(prompt);

    res.status(200).json({
      success: true,
      count: suggestions.length,
      suggestions,
    });
  } catch (error) {
    console.error("Eco suggestion error:", error.message);

    if (error.message.startsWith("Groq API error")) {
      return res.status(502).json({
        success: false,
        message: "Failed to get suggestions from AI. Please try again.",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while generating suggestions.",
      error: error.message,
    });
  }
};