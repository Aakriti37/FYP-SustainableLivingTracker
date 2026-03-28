import { Trophy, Flame } from "lucide-react";
import type { LeaderboardUser } from "../../Community";

interface LeaderboardSectionProps {
    leaderboard: LeaderboardUser[];
}

const LeaderboardSection = ({ leaderboard }: LeaderboardSectionProps) => {
    return (
        <div className="space-y-6">
            <div className="bg-linear-to-b from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-[-30px] right-[-30px] opacity-10">
                    <Trophy size={150} />
                </div>

                <h3 className="text-xl font-bold flex items-center gap-2 mb-6 relative z-10 border-b border-gray-700 pb-4 text-amber-400">
                    <Trophy size={22} className="text-amber-400" /> Leaderboard
                </h3>

                <div className="space-y-4 relative z-10">
                    {leaderboard.length === 0 ? (
                        <p className="text-gray-400 text-sm italic">No ranking available yet.</p>
                    ) : (
                        leaderboard.map((user, index) => (
                            <div key={user._id} className="flex items-center gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-2xl transition-colors">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-amber-400 text-amber-900 shadow-[0_0_15px_rgba(251,191,36,0.5)]' :
                                    index === 1 ? 'bg-slate-300 text-slate-800' :
                                        index === 2 ? 'bg-amber-700 text-amber-100' : 'bg-gray-700 text-gray-300'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h5 className="font-semibold text-gray-200 truncate">{user.name}</h5>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <span className="flex items-center gap-0.5"><Flame size={12} className="text-orange-500" /> {user.totalStreak} streak</span>
                                    </div>
                                </div>
                                <div className="font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">
                                    {user.totalPoints}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaderboardSection;
