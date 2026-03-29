// pages/User/components/EcoSuggestions/UserSummaryCard.tsx

import { ClipboardList, Flame, Car, Bus, Zap, UtensilsCrossed, Flame as FuelIcon } from "lucide-react";
import type { Habit, Goal, CarbonLog } from "../../../../types/ecoSuggestions.types";

interface UserSummaryCardProps {
  habits: Habit[];
  goals: Goal[];
  carbonLogs: CarbonLog[];
}

const UserSummaryCard = ({ habits, goals, carbonLogs }: UserSummaryCardProps) => {
  const activeHabits = habits.filter((h) => h.isActive);
  const inProgressGoals = goals.filter((g) => g.status === "in-progress");
  const latestLog = carbonLogs[0];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
      <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-5 border-b border-gray-100 pb-4">
        <ClipboardList size={20} className="text-emerald-500" />
        Your Profile Summary
      </h2>

      <div className="space-y-5">

        {/* Active Habits */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Active Habits
          </p>
          {activeHabits.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeHabits.map((h) => (
                <span
                  key={h._id}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100"
                >
                  {h.name}
                  {h.streak > 0 && (
                    <span className="flex items-center gap-0.5 ml-1 text-orange-500 font-bold">
                      <Flame size={11} />
                      {h.streak}
                    </span>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No active habits yet.</p>
          )}
        </div>

        {/* In-progress Goals */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Current Goals
          </p>
          {inProgressGoals.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {inProgressGoals.map((g) => (
                <span
                  key={g._id}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                >
                  {g.title}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No active goals yet.</p>
          )}
        </div>

        {/* Latest Carbon Snapshot */}
        {latestLog ? (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Latest Carbon Data
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
                <Car size={12} /> {latestLog.transport} km private
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
                <Bus size={12} /> {latestLog.publicTransport} km public
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
                <Zap size={12} /> {latestLog.energy} kWh
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
                <UtensilsCrossed size={12} /> {latestLog.diet}
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
                <FuelIcon size={12} /> {latestLog.cookingFuel}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">No carbon data logged yet.</p>
        )}

      </div>
    </div>
  );
};

export default UserSummaryCard;
