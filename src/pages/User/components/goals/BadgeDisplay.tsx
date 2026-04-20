// pages/User/components/goals/BadgeDisplay.tsx

import { useEffect, useState } from "react";
import api from "../../../../services/api";

const API_URL = import.meta.env.VITE_API_URL;

const BADGE_INFO: Record<string, { label: string; icon: string; desc: string; color: string }> = {
    eco_starter:      { label: 'Eco Starter',      icon: '🌱', desc: 'Completed your first goal',         color: '#17921f' },
    habit_builder:    { label: 'Habit Builder',    icon: '⚡', desc: 'Logged 5 habits',                   color: '#508C12' },
    streak_master:    { label: 'Streak Master',    icon: '🔥', desc: 'Reached a 7-day streak',             color: '#f59e0b' },
    eco_champion:     { label: 'Eco Champion',     icon: '🏆', desc: 'Completed 3 eco goals',              color: '#5cbd36' },
    green_warrior:    { label: 'Green Warrior',    icon: '🌍', desc: 'Logged carbon 7 days in a row',      color: '#022202' },
    consistency_king: { label: 'Consistency King', icon: '👑', desc: 'Logged habits 30 times',             color: '#d97706' },
};

const BadgeDisplay = () => {
    const [badges, setBadges] = useState<any[]>([]);

    useEffect(() => {
        api.get("/notifications/badges")
            .then(res => setBadges(res.data))
            .catch(err => console.error('Failed to fetch badges', err));
    }, []);

    if (badges.length === 0) return null;

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border mb-6" style={{ borderColor: '#c5e3a0' }}>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: '#022202' }}>
                🏅 Your Badges
            </h3>
            <div className="flex flex-wrap gap-3">
                {badges.map(badge => {
                    const info = BADGE_INFO[badge.badgeType];
                    if (!info) return null;
                    return (
                        <div
                            key={badge._id}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border"
                            style={{ background: '#f0f7e6', borderColor: '#c5e3a0' }}
                            title={info.desc}
                        >
                            <span className="text-xl">{info.icon}</span>
                            <div>
                                <p className="text-sm font-bold" style={{ color: info.color }}>{info.label}</p>
                                <p className="text-xs" style={{ color: '#4a7c2f' }}>{info.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BadgeDisplay;
