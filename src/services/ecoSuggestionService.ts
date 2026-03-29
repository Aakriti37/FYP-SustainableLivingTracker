// services/ecoSuggestionService.ts
// FRONTEND ONLY — makes HTTP requests to YOUR backend using axios
// Has nothing to do with Gemini directly — that's handled in the backend

import api from "./api";
import type { Habit, Goal, CarbonLog, ActivityLog, EcoSuggestion } from "../types/ecoSuggestions.types";

// ── Used by the page to show the user summary card & stats row ────────────────

export const fetchHabits = async (): Promise<Habit[]> => {
  const response = await api.get("/habits");
  return response.data;
};

export const fetchGoals = async (): Promise<Goal[]> => {
  const response = await api.get("/goals");
  return response.data;
};

export const fetchCarbonLogs = async (): Promise<CarbonLog[]> => {
  const response = await api.get("/carbon/history");
  return response.data;
};

export const fetchActivityLogs = async (): Promise<ActivityLog[]> => {
  // Reuses your existing recent activities endpoint from habitController
  const response = await api.get("/habits/activities/recent");
  return response.data;
};

// ── Calls your backend POST /api/eco-suggestions/generate ─────────────────────
// The backend handles fetching MongoDB data + calling GROQ internally
// The GROQ API key never touches the frontend

export const generateEcoSuggestions = async (): Promise<EcoSuggestion[]> => {
  const response = await api.post("/eco-suggestions/generate");

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to generate suggestions");
  }

  return response.data.suggestions;
};
