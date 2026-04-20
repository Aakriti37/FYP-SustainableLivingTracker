// pages/User/EcoSuggestions.tsx

import { useState, useEffect } from "react";
import { RefreshCw, Sparkles, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import StatsRow       from "./components/ecoSuggestions/StatsRow";
import UserSummaryCard from "./components/ecoSuggestions/UserSummaryCard";
import GenerateButton from "./components/ecoSuggestions/GenerateButton";
import SuggestionsList from "./components/ecoSuggestions/SuggestionsList";
import LifestyleForm  from "./components/ecoSuggestions/LifestyleForm";
import EcoChatbot     from "./components/ecoSuggestions/EcoChatbot";

import { fetchHabits, fetchGoals, fetchCarbonLogs, generateEcoSuggestions } from "../../services/ecoSuggestionService";
import api from "../../services/api";
import type { Habit, Goal, CarbonLog, EcoSuggestion } from "../../types/ecoSuggestions.types";

const EcoSuggestions = () => {
  const [habits,       setHabits]       = useState<Habit[]>([]);
  const [goals,        setGoals]        = useState<Goal[]>([]);
  const [carbonLogs,   setCarbonLogs]   = useState<CarbonLog[]>([]);
  
  const [dataLoading,  setDataLoading]  = useState(true);

  const [hasLifestyle,     setHasLifestyle]     = useState(false);
  const [lifestyleLoading, setLifestyleLoading] = useState(true);

  const [suggestions,   setSuggestions]   = useState<EcoSuggestion[]>([]);
  const [emissionLevel, setEmissionLevel] = useState<string | null>(null);
  const [confidence,    setConfidence]    = useState<number | null>(null);
  const [generating,    setGenerating]    = useState(false);
  const [error,         setError]         = useState<string | null>(null);
  const [hasGenerated,  setHasGenerated]  = useState(false);

  useEffect(() => {
    api.get("/eco-suggestions/lifestyle")
      .then(res => setHasLifestyle(res.data.hasLifestyle))
      .catch(() => setHasLifestyle(false))
      .finally(() => setLifestyleLoading(false));
  }, []);

  const fetchAllData = async () => {
    try {
      const [habitsRes, goalsRes, carbonRes] = await Promise.all([
        fetchHabits(), fetchGoals(), fetchCarbonLogs(), 
      ]);
      setHabits(habitsRes);
      setGoals(goalsRes);
      setCarbonLogs(carbonRes);
    } catch {
      toast.error("Failed to load your profile data.");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

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

  if (lifestyleLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64" style={{ background: '#f0f7e6' }}>
        <RefreshCw size={24} className="animate-spin" style={{ color: '#508C12' }} />
      </div>
    );
  }

  return (
    <div className="p-6 pb-28 min-h-screen" style={{ background: '#f0f7e6' }}>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <header className="flex justify-between items-end pb-4 border-b" style={{ borderColor: '#c5e3a0' }}>
          <div>
            <h1 className="text-4xl font-extrabold pb-1 flex items-center gap-3" style={{ color: '#022202' }}>
              <Sparkles size={32} style={{ color: '#508C12' }} /> Eco Suggestions
            </h1>
            <p className="font-medium" style={{ color: '#4a7c2f' }}>
              AI-powered tips personalised to your habits, goals and carbon footprint.
            </p>
          </div>
          {dataLoading && <RefreshCw size={20} className="animate-spin" style={{ color: '#508C12' }} />}
        </header>

        {/* Lifestyle form — shown only if not completed */}
        {!hasLifestyle && <LifestyleForm onComplete={() => setHasLifestyle(true)} />}

        {hasLifestyle && (
          <>
            {/* Lifestyle completed badge */}
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl w-fit border"
              style={{ background: '#f0f7e6', borderColor: '#c5e3a0' }}
            >
              <ShieldCheck size={16} style={{ color: '#508C12' }} />
              <span className="text-sm font-medium" style={{ color: '#2d6a10' }}>
                Lifestyle profile complete — AI suggestions are personalised for you
              </span>
            </div>

            {/* Stats row */}
            {!dataLoading && <StatsRow habits={habits} goals={goals} carbonLogs={carbonLogs} />}

            {/* Summary card */}
            {!dataLoading && <UserSummaryCard habits={habits} goals={goals} carbonLogs={carbonLogs} />}

            {/* Emission level badge */}
            {emissionLevel && confidence && (
              <div
                className="flex items-center gap-3 px-5 py-3 rounded-2xl border font-semibold text-sm"
                style={{
                  background:  emissionLevel === 'High' ? '#fef2f2' : emissionLevel === 'Medium' ? '#fffbeb' : '#f0f7e6',
                  borderColor: emissionLevel === 'High' ? '#fecaca' : emissionLevel === 'Medium' ? '#fde68a' : '#c5e3a0',
                  color:       emissionLevel === 'High' ? '#dc2626' : emissionLevel === 'Medium' ? '#d97706' : '#17921f',
                }}
              >
                <span className="text-2xl">
                  {emissionLevel === 'High' ? '🔴' : emissionLevel === 'Medium' ? '🟡' : '🟢'}
                </span>
                <div>
                  <p>Your emission level is <strong>{emissionLevel}</strong></p>
                  <p className="text-xs font-normal opacity-70">Model confidence: {confidence}%</p>
                </div>
              </div>
            )}

            {/* Generate button */}
            <GenerateButton onClick={handleGenerate} loading={generating} hasGenerated={hasGenerated} />

            {/* Suggestions */}
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

      <EcoChatbot />
    </div>
  );
};

export default EcoSuggestions;
