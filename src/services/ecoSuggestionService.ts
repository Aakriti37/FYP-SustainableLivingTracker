// services/ecoSuggestionService.ts
// FRONTEND ONLY — HTTP requests to your backend via axios

import api from "./api";
import type { Habit, Goal, CarbonLog, ActivityLog, EcoSuggestion } from "../types/ecoSuggestions.types";

// ── Data fetchers (used for stats + summary card) ─────────────────────────────

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
  const response = await api.get("/habits/activities/recent");
  return response.data;
};

// ── Generate suggestions via your backend → ML service ───────────────────────
export const generateEcoSuggestions = async (): Promise<{
  suggestions:    EcoSuggestion[];
  emission_level: string;
  confidence:     number;
}> => {
  const response = await api.post("/eco-suggestions/generate");

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to generate suggestions");
  }

  return {
    suggestions:    response.data.suggestions,
    emission_level: response.data.emission_level,
    confidence:     response.data.confidence,
  };
};
