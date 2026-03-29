// pages/User/components/EcoSuggestions/SuggestionsList.tsx

import { Leaf, AlertCircle, RefreshCw, WifiOff } from "lucide-react";
import SuggestionCard from "./SuggestionCard";
import LoadingSkeleton from "./LoadingSkeleton";
import type { EcoSuggestion } from "../../../../types/ecoSuggestions.types";

interface SuggestionsListProps {
  suggestions: EcoSuggestion[];
  loading: boolean;
  error: string | null;
  hasGenerated: boolean;
  onRetry: () => void;
}

const SuggestionsList = ({ suggestions, loading, error, hasGenerated, onRetry }: SuggestionsListProps) => {

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) return <LoadingSkeleton />;

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <WifiOff size={28} className="text-red-400" />
        </div>
        <h3 className="text-red-600 font-bold text-base mb-1">
          Oops! Something went wrong
        </h3>
        <p className="text-red-400 text-sm mb-4">
          We couldn't generate your suggestions right now. Please try again in a moment.
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <RefreshCw size={15} />
          Try Again
        </button>
      </div>
    );
  }

  // ── Suggestions cards ────────────────────────────────────────────────────
  if (hasGenerated && suggestions.length > 0) {
    return (
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center mb-4 flex items-center justify-center gap-1">
          <Leaf size={13} className="text-emerald-500" />
          {suggestions.length} Personalised Suggestions for You
        </p>

        <div className="grid grid-cols-1 gap-4">
          {suggestions.map((s, idx) => (
            <SuggestionCard key={s.id} suggestion={s} index={idx} />
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-5 flex items-center justify-center gap-1">
          <RefreshCw size={11} />
          Click the button again to generate fresh suggestions
        </p>
      </div>
    );
  }

  // ── Empty / pre-generate state ───────────────────────────────────────────
  return (
    <div className="text-center py-14">
      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
        <Leaf size={32} className="text-emerald-400" />
      </div>
      <p className="text-gray-500 font-medium">Your personalised eco suggestions will appear here.</p>
      <p className="text-gray-400 text-sm mt-1">Click the button above to get started!</p>
    </div>
  );
};

export default SuggestionsList;