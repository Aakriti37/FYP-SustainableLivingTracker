// pages/User/components/community/LeaderboardSection.tsx

import { Trophy, Flame } from "lucide-react";

interface LeaderboardUser {
    _id:          string;
    name:         string;
    totalPoints:  number;
    totalStreak:  number;
}

interface LeaderboardSectionProps {
    leaderboard: LeaderboardUser[];
}

const rankStyle = (index: number): React.CSSProperties => {
    if (index === 0) return { background: '#d97706', color: 'white', boxShadow: '0 0 12px rgba(217,119,6,0.5)' };
    if (index === 1) return { background: '#94a3b8', color: 'white' };
    if (index === 2) return { background: '#92400e', color: 'white' };
    return { background: '#f0f7e6', color: '#2d6a10' };
};

const LeaderboardSection = ({ leaderboard }: LeaderboardSectionProps) => (
    <div>
        <div
            className="rounded-3xl p-6 text-white shadow-xl relative overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #022202 0%, #0d3d0a 100%)' }}
        >
            {/* Background icon */}
            <div className="absolute top-[-20px] right-[-20px] opacity-5">
                <Trophy size={140} />
            </div>

            {/* Title */}
            <h3
                className="text-lg font-bold flex items-center gap-2 mb-5 pb-4 border-b relative z-10"
                style={{ color: '#d97706', borderColor: 'rgba(255,255,255,0.1)' }}
            >
                <Trophy size={20} style={{ color: '#d97706' }} /> Leaderboard
            </h3>

            {/* List */}
            <div className="space-y-3 relative z-10">
                {leaderboard.length === 0 ? (
                    <p className="text-sm italic" style={{ color: 'rgba(168,208,128,0.6)' }}>
                        No rankings yet — complete habits to earn points!
                    </p>
                ) : (
                    leaderboard.map((user, index) => (
                        <div
                            key={user._id}
                            className="flex items-center gap-3 p-3 rounded-2xl transition-colors"
                            style={{ background: 'rgba(255,255,255,0.05)' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                        >
                            {/* Rank badge */}
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                                style={rankStyle(index)}
                            >
                                {index + 1}
                            </div>

                            {/* Name + streak */}
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate" style={{ color: '#d4edaa' }}>
                                    {user.name}
                                </p>

                                <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(168,208,128,0.7)' }}>
                                    <Flame size={11} style={{ color: '#ea580c' }} />
                                    
                                    {user.totalStreak} streak
                                </div>
                            </div>

                            {/* Points */}
                            <div
                                className="font-black text-sm px-2.5 py-1 rounded-lg shrink-0"
                                style={{ background: 'rgba(80,140,18,0.2)', color: '#5cbd36' }}
                            >
                                {user.totalPoints} pts
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
);

export default LeaderboardSection;
