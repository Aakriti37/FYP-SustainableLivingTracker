// pages/User/components/EcoSuggestions/SuggestionCard.tsx

import { TrendingUp, TrendingDown, Minus, Car, Zap, Salad, Leaf } from "lucide-react";
import type { EcoSuggestion } from "../../../../types/ecoSuggestions.types";

interface SuggestionCardProps {
  suggestion: EcoSuggestion;
  index:      number;
}

const impactConfig: Record<string, { bg: string; color: string; border: string; icon: React.ReactNode }> = {
  High:   { bg: '#f0f7e6', color: '#17921f', border: '#c5e3a0', icon: <TrendingUp  size={12} /> },
  Medium: { bg: '#fffbeb', color: '#d97706', border: '#fde68a', icon: <Minus        size={12} /> },
  Low:    { bg: '#eff6ff', color: '#3b82f6', border: '#bfdbfe', icon: <TrendingDown size={12} /> },
};

const categoryConfig: Record<string, { icon: React.ReactNode; bg: string; color: string; border: string }> = {
  Transport: { icon: <Car    size={14} />, bg: '#eff6ff', color: '#3b82f6', border: '#bfdbfe' },
  Energy:    { icon: <Zap    size={14} />, bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  Diet:      { icon: <Salad  size={14} />, bg: '#f0f7e6', color: '#17921f', border: '#c5e3a0' },
  Lifestyle: { icon: <Leaf   size={14} />, bg: '#f0fdf4', color: '#508C12', border: '#bbf7d0' },
};

const SuggestionCard = ({ suggestion, index }: SuggestionCardProps) => {
  const impact   = impactConfig[suggestion.impact]   ?? impactConfig.Medium;
  const category = categoryConfig[suggestion.category] ?? categoryConfig.Lifestyle;

  return (
    <div
      className="rounded-2xl p-5 border flex items-start gap-4 transition-all duration-300 group hover:shadow-md"
      style={{
        background:   'white',
        borderColor:  '#c5e3a0',
        animationDelay: `${index * 100}ms`,
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#508C12')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#c5e3a0')}
    >
      {/* Emoji icon */}
      <div
        className="shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300"
        style={{ background: '#f0f7e6', borderColor: '#c5e3a0' }}
      >
        {suggestion.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base mb-1 leading-snug" style={{ color: '#022202' }}>
          {suggestion.title}
        </h3>
        <p className="text-sm leading-relaxed mb-3" style={{ color: '#4a7c2f' }}>
          {suggestion.description}
        </p>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border"
            style={{ background: impact.bg, color: impact.color, borderColor: impact.border }}
          >
            {impact.icon} {suggestion.impact} Impact
          </span>
          <span
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border"
            style={{ background: category.bg, color: category.color, borderColor: category.border }}
          >
            {category.icon} {suggestion.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SuggestionCard;
