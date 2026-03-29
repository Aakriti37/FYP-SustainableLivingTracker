// types/ecoSuggestions.types.ts
// TypeScript interfaces matching your Mongoose models
// This file is FRONTEND ONLY — gives type safety across all components

// ── Matches your Habit mongoose model ────────────────────────────────────────
export interface Habit {
  _id: string;
  name: string;
  description?: string;
  frequency: "daily" | "weekly" | "monthly";
  streak: number;
  isActive: boolean;
  pointsPerCompletion: number;
  completedToday?: boolean;
}

// ── Matches your Goal mongoose model ─────────────────────────────────────────
export interface Goal {
  _id: string;
  title: string;
  targetDate: string;
  status: "in-progress" | "completed" | "failed";
  progress?: number;
}

// ── Matches your CarbonLog mongoose model ────────────────────────────────────
export interface CarbonLog {
  _id: string;
  date: string;
  transport: number;
  publicTransport: number;
  energy: number;
  cookingFuel: "LPG" | "Wood" | "Electricity" | "Biogas" | "None";
  diet: "vegan" | "vegetarian" | "balanced" | "meat-heavy";
  totalCO2: number;
}

// ── Matches your ActivityLog mongoose model ───────────────────────────────────
export interface ActivityLog {
  _id: string;
  habitId: string;
  date: string;
  pointsEarned: number;
}

// ── AI Suggestion shape returned by your backend ──────────────────────────────
export interface EcoSuggestion {
  id: number;
  icon: string;
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  category: "Transport" | "Energy" | "Diet" | "Lifestyle";
}
