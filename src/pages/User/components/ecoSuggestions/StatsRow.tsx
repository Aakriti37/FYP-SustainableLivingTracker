// pages/User/components/EcoSuggestions/StatsRow.tsx

import { Wind, Flame, Target } from "lucide-react";
import type { Habit, Goal, CarbonLog } from "../../../../types/ecoSuggestions.types";

interface StatsRowProps {
  habits:     Habit[];
  goals:      Goal[];
  carbonLogs: CarbonLog[];
}

const StatsRow = ({ habits, goals, carbonLogs }: StatsRowProps) => {
  const todayCO2        = carbonLogs[0]?.totalCO2 ?? 0;
  const activeStreaks   = habits.filter(h => h.streak > 0).length;
  const inProgressGoals = goals.filter(g => g.status === "in-progress").length;

  const stats = [
    { label: "Latest CO₂", value: `${todayCO2} kg`,    icon: <Wind size={18} />,   color: '#17921f' },
    { label: "Streaks",    value: activeStreaks,          icon: <Flame size={18} />,  color: '#ea580c' },
    { label: "Goals Active", value: inProgressGoals,    icon: <Target size={18} />, color: '#508C12' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      {stats.map(stat => (
        <div
          key={stat.label}
          className="rounded-2xl p-4 border flex flex-col items-center text-center"
          style={{ background: 'white', borderColor: '#c5e3a0' }}
        >
          <div className="mb-1" style={{ color: stat.color }}>{stat.icon}</div>
          <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
          <div className="text-xs font-medium mt-0.5" style={{ color: '#4a7c2f' }}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsRow;
