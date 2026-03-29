// pages/User/EcoSuggestions.tsx

import { useState, useEffect } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

import StatsRow from "./components/ecoSuggestions/StatsRow";
import UserSummaryCard from "./components/ecoSuggestions/UserSummaryCard";
import GenerateButton from "./components/ecoSuggestions/GenerateButton";
import SuggestionsList from "./components/ecoSuggestions/SuggestionsList";

import {
  fetchHabits,
  fetchGoals,
  fetchCarbonLogs,
  fetchActivityLogs,
  generateEcoSuggestions,
} from "../../services/ecoSuggestionService";

import type {
  Habit,
  Goal,
  CarbonLog,
  ActivityLog,
  EcoSuggestion,
} from "../../types/ecoSuggestions.types";

const EcoSuggestions = () => {
  // ── User data state ──────────────────────────────────────────────────────
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [carbonLogs, setCarbonLogs] = useState<CarbonLog[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // ── AI suggestion state ──────────────────────────────────────────────────
  const [suggestions, setSuggestions] = useState<EcoSuggestion[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  // ── Fetch all user data on mount (same pattern as UserDashboard) ─────────
  const fetchAllData = async () => {
    try {
      const [habitsRes, goalsRes, carbonRes, activityRes] = await Promise.all([
        fetchHabits(),
        fetchGoals(),
        fetchCarbonLogs(),
        fetchActivityLogs(),
      ]);
      setHabits(habitsRes);
      setGoals(goalsRes);
      setCarbonLogs(carbonRes);
      setActivityLogs(activityRes);
    } catch (err) {
      console.error("Failed to load user data", err);
      toast.error("Failed to load your profile data.");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ── Trigger AI suggestion generation ────────────────────────────────────
  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setSuggestions([]);
    setHasGenerated(false);
    try {
      const result = await generateEcoSuggestions();
      setSuggestions(result);
      setHasGenerated(true);
      toast.success("Suggestions generated!");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
      toast.error("Failed to generate suggestions.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-8 pb-20">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ── Page Header — matches UserDashboard header style ── */}
        <header className="flex justify-between items-end mb-2">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600 pb-2 flex items-center gap-3">
              <Sparkles size={32} className="text-emerald-500" />
              Eco Suggestions
            </h1>
            <p className="text-gray-500 font-medium">
              AI-powered tips personalised to your habits, goals & carbon footprint.
            </p>
          </div>
          {dataLoading && <RefreshCw size={22} className="animate-spin text-emerald-500" />}
        </header>

        {/* ── Stats Row ── */}
        {!dataLoading && (
          <StatsRow habits={habits} goals={goals} carbonLogs={carbonLogs} />
        )}

        {/* ── User Summary Card ── */}
        {!dataLoading && (
          <UserSummaryCard habits={habits} goals={goals} carbonLogs={carbonLogs} />
        )}

        {/* ── Generate Button ── */}
        <GenerateButton
          onClick={handleGenerate}
          loading={generating}
          hasGenerated={hasGenerated}
        />

        {/* ── Suggestions (cards / skeleton / empty / error) ── */}
        <SuggestionsList
          suggestions={suggestions}
          loading={generating}
          error={error}
          hasGenerated={hasGenerated}
          onRetry={handleGenerate}
        />

      </div>
    </div>
  );
};

export default EcoSuggestions;
