// pages/User/components/EcoSuggestions/UserSummaryCard.tsx

import { ClipboardList, Flame, Car, Bus, Zap, UtensilsCrossed, Flame as FuelIcon } from "lucide-react";
import type { Habit, Goal, CarbonLog } from "../../../../types/ecoSuggestions.types";

interface UserSummaryCardProps {
  habits:     Habit[];
  goals:      Goal[];
  carbonLogs: CarbonLog[];
}

const UserSummaryCard = ({ habits, goals, carbonLogs }: UserSummaryCardProps) => {
  const activeHabits    = habits.filter(h => h.isActive);
  const inProgressGoals = goals.filter(g => g.status === "in-progress");
  const latestLog       = carbonLogs[0];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border mb-4" style={{ borderColor: '#c5e3a0' }}>
      <h2 className="text-base font-bold flex items-center gap-2 mb-4 pb-3 border-b" style={{ color: '#022202', borderColor: '#e8f5d0' }}>
        <ClipboardList size={18} style={{ color: '#508C12' }} /> Your Profile Summary
      </h2>

      <div className="space-y-4">
        {/* Active Habits */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#4a7c2f' }}>Active Habits</p>
          
          {activeHabits.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              
              {activeHabits.map(h => (
                <span
                  key={h._id}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border"
                  style={{ background: '#f0f7e6', color: '#2d6a10', borderColor: '#c5e3a0' }}
                >
                  {h.name}
                  
                  {h.streak > 0 && (
                    <span className="flex items-center gap-0.5 ml-1 font-bold" style={{ color: '#ea580c' }}>
                      <Flame size={11} /> {h.streak}
                    </span>
                  )}

                </span>
              ))}

            </div>
          ) : <p className="text-sm" style={{ color: '#4a7c2f', opacity: 0.6 }}>No active habits yet.</p>}
        </div>

        {/* Goals */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#4a7c2f' }}>Current Goals</p>
          {inProgressGoals.length > 0 ? (
            
            <div className="flex flex-wrap gap-2">
              {inProgressGoals.map(g => (
                <span
                  key={g._id}
                  className="px-3 py-1 rounded-full text-xs font-medium border"
                  style={{ background: '#f0f7e6', color: '#2d6a10', borderColor: '#c5e3a0' }}
                >
                  {g.title}
                </span>
              ))}

            </div>

          ) : <p className="text-sm" style={{ color: '#4a7c2f', opacity: 0.6 }}>No active goals yet.</p>}
        </div>

        {/* Carbon snapshot */}
        {latestLog ? (
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#4a7c2f' }}>Latest Carbon Data</p>
            
            <div className="flex flex-wrap gap-2">
              {[
                { icon: <Car size={12} />,           label: `${latestLog.transport ?? 0} km private`   },
                { icon: <Bus size={12} />,           label: `${latestLog.publicTransport ?? 0} km public` },
                { icon: <Zap size={12} />,           label: `${latestLog.energy ?? 0} kWh`             },
                { icon: <UtensilsCrossed size={12} />, label: latestLog.diet ?? '—'                   },
                { icon: <FuelIcon size={12} />,      label: latestLog.cookingFuel ?? '—'               },
              ].map((item, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border"
                  style={{ background: '#f0f7e6', color: '#2d6a10', borderColor: '#c5e3a0' }}
                >
                  {item.icon} {item.label}
                </span>
              ))}

            </div>

          </div>
          
        ) : <p className="text-sm" style={{ color: '#4a7c2f', opacity: 0.6 }}>No carbon data logged yet.</p>}
      </div>
    </div>
  );
};

export default UserSummaryCard;
