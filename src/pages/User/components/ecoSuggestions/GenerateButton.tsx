// pages/User/components/EcoSuggestions/GenerateButton.tsx

import { Sparkles, RefreshCw } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  loading: boolean;
  hasGenerated: boolean;
}

const GenerateButton = ({ onClick, loading, hasGenerated }: GenerateButtonProps) => {
  return (
    <div className="flex justify-center mb-8">
      <button
        onClick={onClick}
        disabled={loading}
        className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-white shadow-md transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] bg-linear-to-r from-emerald-500 to-teal-600"
      >
        {loading ? (
          <>
            <RefreshCw size={20} className="animate-spin" />
            Generating suggestions…
          </>
        ) : (
          <>
            <Sparkles size={20} />
            {hasGenerated ? "Regenerate Suggestions" : "Generate Eco Suggestions"}
          </>
        )}
      </button>
    </div>
  );
};

export default GenerateButton;
