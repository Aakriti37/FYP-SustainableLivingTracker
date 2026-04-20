// pages/User/components/EcoSuggestions/SuggestionsList.tsx

import { Leaf, RefreshCw, WifiOff } from "lucide-react";
import SuggestionCard  from "./SuggestionCard";
import LoadingSkeleton from "./LoadingSkeleton";
import type { EcoSuggestion } from "../../../../types/ecoSuggestions.types";

interface SuggestionsListProps {
  suggestions:  EcoSuggestion[];
  loading:      boolean;
  error:        string | null;
  hasGenerated: boolean;
  onRetry:      () => void;
}

const SuggestionsList = ({ suggestions, loading, error, hasGenerated, onRetry }: SuggestionsListProps) => {

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="rounded-2xl p-8 text-center border" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#fee2e2' }}>
          <WifiOff size={28} style={{ color: '#ef4444' }} />
        </div>
        <h3 className="font-bold text-base mb-1" style={{ color: '#dc2626' }}>Something went wrong</h3>
        <p className="text-sm mb-4" style={{ color: '#ef4444' }}>
          We couldn't generate your suggestions right now. Please try again.
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors"
          style={{ background: '#ef4444' }}
        >
          <RefreshCw size={15} /> Try Again
        </button>
      </div>
    );
  }

  if (hasGenerated && suggestions.length > 0) {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-center mb-4 flex items-center justify-center gap-1" style={{ color: '#4a7c2f' }}>
          <Leaf size={13} style={{ color: '#508C12' }} />
          {suggestions.length} Personalised Suggestions
        </p>
        <div className="grid grid-cols-1 gap-4">
          {suggestions.map((s, idx) => (
            <SuggestionCard key={s.id} suggestion={s} index={idx} />
          ))}
        </div>
        <p className="text-center text-xs mt-5 flex items-center justify-center gap-1" style={{ color: '#4a7c2f', opacity: 0.6 }}>
          <RefreshCw size={11} /> Click the button above to regenerate suggestions
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-14">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border" style={{ background: '#f0f7e6', borderColor: '#c5e3a0' }}>
        <Leaf size={32} style={{ color: '#508C12' }} />
      </div>
      <p className="font-medium" style={{ color: '#4a7c2f' }}>Your personalised eco suggestions will appear here.</p>
      <p className="text-sm mt-1" style={{ color: '#4a7c2f', opacity: 0.6 }}>Click the button above to get started!</p>
    </div>
  );
};

export default SuggestionsList;
