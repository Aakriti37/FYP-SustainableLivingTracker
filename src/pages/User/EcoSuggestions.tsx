// pages/User/EcoSuggestions.tsx

import { useState, useEffect } from "react";
import { RefreshCw, Sparkles, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import StatsRow from "./components/ecoSuggestions/StatsRow";
import UserSummaryCard from "./components/ecoSuggestions/UserSummaryCard";
import GenerateButton from "./components/ecoSuggestions/GenerateButton";
import SuggestionsList from "./components/ecoSuggestions/SuggestionsList";
import LifestyleForm from "./components/ecoSuggestions/LifestyleForm";
import EcoChatbot from "./components/ecoSuggestions/EcoChatbot";

import {
  fetchHabits,
  fetchGoals,
  fetchCarbonLogs,
  fetchActivityLogs,
  generateEcoSuggestions,
} from "../../services/ecoSuggestionService";

import api from "../../services/api";

import type {
  Habit,
  Goal,
  CarbonLog,
  ActivityLog,
  EcoSuggestion,
} from "../../types/ecoSuggestions.types";

const EcoSuggestions = () => {
  // ── User data ────────────────────────────────────────────────────────────
  const [habits,       setHabits]       = useState<Habit[]>([]);
  const [goals,        setGoals]        = useState<Goal[]>([]);
  const [carbonLogs,   setCarbonLogs]   = useState<CarbonLog[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [dataLoading,  setDataLoading]  = useState(true);

  // ── Lifestyle profile ────────────────────────────────────────────────────
  const [hasLifestyle,     setHasLifestyle]     = useState(false);
  const [lifestyleLoading, setLifestyleLoading] = useState(true);

  // ── AI suggestions ───────────────────────────────────────────────────────
  const [suggestions,   setSuggestions]   = useState<EcoSuggestion[]>([]);
  const [emissionLevel, setEmissionLevel] = useState<string | null>(null);
  const [confidence,    setConfidence]    = useState<number | null>(null);
  const [generating,    setGenerating]    = useState(false);
  const [error,         setError]         = useState<string | null>(null);
  const [hasGenerated,  setHasGenerated]  = useState(false);

  // ── Check lifestyle profile on mount ────────────────────────────────────
  useEffect(() => {
    const checkLifestyle = async () => {
      try {
        const res = await api.get("/eco-suggestions/lifestyle");
        setHasLifestyle(res.data.hasLifestyle);
      } catch {
        setHasLifestyle(false);
      } finally {
        setLifestyleLoading(false);
      }
    };
    checkLifestyle();
  }, []);

  // ── Fetch all user data ──────────────────────────────────────────────────
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
    } catch {
      toast.error("Failed to load your profile data.");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ── Generate suggestions ─────────────────────────────────────────────────
  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setSuggestions([]);
    setHasGenerated(false);
    setEmissionLevel(null);
    setConfidence(null);

    try {
      const result = await generateEcoSuggestions();
      setSuggestions(result.suggestions);
      setEmissionLevel(result.emission_level);
      setConfidence(result.confidence);
      setHasGenerated(true);
      toast.success("Suggestions generated!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      toast.error("Failed to generate suggestions.");
    } finally {
      setGenerating(false);
    }
  };

  // ── Lifestyle form completed ─────────────────────────────────────────────
  const handleLifestyleComplete = () => {
    setHasLifestyle(true);
  };

  // ── Loading state ────────────────────────────────────────────────────────
  if (lifestyleLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <RefreshCw size={24} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="p-8 pb-28">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ── Page Header ── */}
        <header className="flex justify-between items-end mb-2">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 pb-2 flex items-center gap-3">
              <Sparkles size={32} className="text-emerald-500" />
              Eco Suggestions
            </h1>
            <p className="text-gray-500 font-medium">
              AI-powered tips personalised to your habits, goals and carbon footprint.
            </p>
          </div>
          {dataLoading && <RefreshCw size={22} className="animate-spin text-emerald-500" />}
        </header>

        {/* ── Lifestyle Form (shown only if not completed yet) ── */}
        {!hasLifestyle && (
          <LifestyleForm onComplete={handleLifestyleComplete} />
        )}

        {/* ── Main content (shown after lifestyle is completed) ── */}
        {hasLifestyle && (
          <>
            {/* Lifestyle completed badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl w-fit">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span className="text-sm font-medium text-emerald-700">
                Lifestyle profile complete — AI suggestions are personalised for you
              </span>
            </div>

            {/* Stats Row */}
            {!dataLoading && (
              <StatsRow habits={habits} goals={goals} carbonLogs={carbonLogs} />
            )}

            {/* User Summary Card */}
            {!dataLoading && (
              <UserSummaryCard habits={habits} goals={goals} carbonLogs={carbonLogs} />
            )}

            {/* Emission level badge (shown after generation) */}
            {emissionLevel && confidence && (
              <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border font-semibold text-sm ${
                emissionLevel === "High"
                  ? "bg-red-50 border-red-100 text-red-700"
                  : emissionLevel === "Medium"
                  ? "bg-amber-50 border-amber-100 text-amber-700"
                  : "bg-emerald-50 border-emerald-100 text-emerald-700"
              }`}>
                <span className="text-2xl">
                  {emissionLevel === "High" ? "🔴" : emissionLevel === "Medium" ? "🟡" : "🟢"}
                </span>
                <div>
                  <p>Your emission level is <strong>{emissionLevel}</strong></p>
                  <p className="text-xs font-normal opacity-70">
                    Model confidence: {confidence}%
                  </p>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <GenerateButton
              onClick={handleGenerate}
              loading={generating}
              hasGenerated={hasGenerated}
            />

            {/* Suggestions List */}
            <SuggestionsList
              suggestions={suggestions}
              loading={generating}
              error={error}
              hasGenerated={hasGenerated}
              onRetry={handleGenerate}
            />
          </>
        )}
      </div>

      {/* ── Floating Chatbot ── */}
      <EcoChatbot />
    </div>
  );
};

export default EcoSuggestions;
