// pages/User/components/EcoSuggestions/SuggestionCard.tsx

import { TrendingUp, TrendingDown, Minus, Car, Zap, Salad, Leaf } from "lucide-react";
import type { EcoSuggestion } from "../../../../types/ecoSuggestions.types";

interface SuggestionCardProps {
  suggestion: EcoSuggestion;
  index: number;
}

// Impact badge styles
const impactConfig: Record<string, { style: string; icon: React.ReactNode }> = {
  High: {
    style: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    icon: <TrendingUp size={12} />,
  },
  Medium: {
    style: "bg-amber-100 text-amber-700 border border-amber-200",
    icon: <Minus size={12} />,
  },
  Low: {
    style: "bg-sky-100 text-sky-700 border border-sky-200",
    icon: <TrendingDown size={12} />,
  },
};

// Category icon mapping using lucide-react icons
const categoryConfig: Record<string, { icon: React.ReactNode; style: string }> = {
  Transport: {
    icon: <Car size={14} />,
    style: "bg-blue-50 text-blue-600 border border-blue-100",
  },
  Energy: {
    icon: <Zap size={14} />,
    style: "bg-yellow-50 text-yellow-600 border border-yellow-100",
  },
  Diet: {
    icon: <Salad size={14} />,
    style: "bg-green-50 text-green-600 border border-green-100",
  },
  Lifestyle: {
    icon: <Leaf size={14} />,
    style: "bg-teal-50 text-teal-600 border border-teal-100",
  },
};

// Icon circle background per category
const iconBgConfig: Record<string, string> = {
  Transport: "bg-blue-50 border-blue-100",
  Energy: "bg-yellow-50 border-yellow-100",
  Diet: "bg-green-50 border-green-100",
  Lifestyle: "bg-teal-50 border-teal-100",
};

const SuggestionCard = ({ suggestion, index }: SuggestionCardProps) => {
  const impact = impactConfig[suggestion.impact] ?? impactConfig.Medium;
  const category = categoryConfig[suggestion.category] ?? categoryConfig.Lifestyle;
  const iconBg = iconBgConfig[suggestion.category] ?? "bg-emerald-50 border-emerald-100";

  return (
    <div
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md hover:border-emerald-200 transition-all duration-300 group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Icon circle — shows the suggestion's emoji from Gemini */}
      <div
        className={`shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 ${iconBg}`}
      >
        {suggestion.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-800 text-base mb-1 leading-snug">
          {suggestion.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-3">
          {suggestion.description}
        </p>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Impact badge with lucide icon */}
          <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${impact.style}`}>
            {impact.icon}
            {suggestion.impact} Impact
          </span>

          {/* Category badge with lucide icon */}
          <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${category.style}`}>
            {category.icon}
            {suggestion.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SuggestionCard;
