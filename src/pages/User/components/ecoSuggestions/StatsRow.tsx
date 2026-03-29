// pages/User/components/EcoSuggestions/StatsRow.tsx

import { Wind, Flame, Target } from "lucide-react";
import type { Habit, Goal, CarbonLog } from "../../../../types/ecoSuggestions.types";

interface StatsRowProps {
  habits: Habit[];
  goals: Goal[];
  carbonLogs: CarbonLog[];
}

const StatsRow = ({ habits, goals, carbonLogs }: StatsRowProps) => {
  const todayCO2 = carbonLogs[0]?.totalCO2 ?? 0;
  const activeStreaks = habits.filter((h) => h.streak > 0).length;
  const inProgressGoals = goals.filter((g) => g.status === "in-progress").length;

  const stats = [
    {
      label: "CO₂ Today",
      value: `${todayCO2} kg`,
      icon: <Wind size={18} />,
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-700",
      border: "border-emerald-100",
    },
    {
      label: "Active Streaks",
      value: activeStreaks,
      icon: <Flame size={18} />,
      bg: "bg-orange-50",
      iconColor: "text-orange-500",
      valueColor: "text-orange-600",
      border: "border-orange-100",
    },
    {
      label: "Goals Active",
      value: inProgressGoals,
      icon: <Target size={18} />,
      bg: "bg-blue-50",
      iconColor: "text-blue-500",
      valueColor: "text-blue-600",
      border: "border-blue-100",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bg} rounded-2xl p-4 border ${stat.border} flex flex-col items-center text-center`}
        >
          <div className={`${stat.iconColor} mb-1`}>{stat.icon}</div>
          <div className={`text-2xl font-black ${stat.valueColor}`}>{stat.value}</div>
          <div className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsRow;
