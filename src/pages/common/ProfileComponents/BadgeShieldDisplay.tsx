// pages/common/ProfileComponents/BadgeShield.tsx
// Pure CSS shield badges — no images needed

import { useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_API_URL;

const BADGE_CONFIG: Record<string, {
    label:    string;
    icon:     string;
    desc:     string;
    color:    string;
    bgFrom:   string;
    bgTo:     string;
    glow:     string;
}> = {
    eco_starter:      { label: 'Eco Starter',      icon: '🌱', desc: 'Completed first goal',       color: '#fff', bgFrom: '#17921f', bgTo: '#2d6a10', glow: 'rgba(23,146,31,0.4)'   },
    habit_builder:    { label: 'Habit Builder',    icon: '⚡', desc: 'Logged 5 habits',             color: '#fff', bgFrom: '#508C12', bgTo: '#3f7708', glow: 'rgba(80,140,18,0.4)'   },
    streak_master:    { label: 'Streak Master',    icon: '🔥', desc: '7-day habit streak',          color: '#fff', bgFrom: '#ea580c', bgTo: '#c2410c', glow: 'rgba(234,88,12,0.4)'   },
    eco_champion:     { label: 'Eco Champion',     icon: '🏆', desc: 'Completed 3 goals',           color: '#fff', bgFrom: '#d97706', bgTo: '#b45309', glow: 'rgba(217,119,6,0.4)'   },
    green_warrior:    { label: 'Green Warrior',    icon: '🌍', desc: 'Carbon logged 7 days',        color: '#fff', bgFrom: '#022202', bgTo: '#0d3d0a', glow: 'rgba(2,34,2,0.4)'      },
    consistency_king: { label: 'Consistency King', icon: '👑', desc: 'Logged habits 30 times',      color: '#fff', bgFrom: '#7c3aed', bgTo: '#5b21b6', glow: 'rgba(124,58,237,0.4)'  },
};

interface ShieldProps {
    badgeType: string;
    earnedAt:  string;
    size?:     'sm' | 'md' | 'lg';
}

const Shield = ({ badgeType, earnedAt, size = 'md' }: ShieldProps) => {
    const cfg = BADGE_CONFIG[badgeType];
    if (!cfg) return null;

    const dim = size === 'sm' ? 80 : size === 'lg' ? 140 : 110;

    return (
        <div className="flex flex-col items-center gap-2 group cursor-default" title={cfg.desc}>
            {/* Shield shape using CSS clip-path */}
            <div
                style={{
                    width:      dim,
                    height:     dim * 1.15,
                    background: `linear-gradient(160deg, ${cfg.bgFrom}, ${cfg.bgTo})`,
                    clipPath:   'polygon(50% 0%, 100% 15%, 100% 60%, 50% 100%, 0% 60%, 0% 15%)',
                    display:    'flex',
                    flexDirection: 'column',
                    alignItems:    'center',
                    justifyContent: 'center',
                    boxShadow:  `0 4px 20px ${cfg.glow}`,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    position:   'relative',
                }}
                onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)';
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${cfg.glow}`;
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${cfg.glow}`;
                }}
            >
                {/* Inner lighter shield highlight */}
                <div style={{
                    position:   'absolute',
                    top:        '8%',
                    left:       '15%',
                    right:      '15%',
                    bottom:     '20%',
                    background: 'rgba(255,255,255,0.12)',
                    clipPath:   'polygon(50% 0%, 100% 20%, 100% 65%, 50% 100%, 0% 65%, 0% 20%)',
                }} />

                {/* Icon */}
                <span style={{ fontSize: dim * 0.32, lineHeight: 1, zIndex: 1 }}>
                    {cfg.icon}
                </span>
            </div>

            {/* Badge name */}
            <div className="text-center">
                <p className="text-xs font-bold" style={{ color: cfg.bgFrom }}>{cfg.label}</p>
                <p className="text-xs opacity-60" style={{ color: '#4a7c2f', fontSize: '10px' }}>
                    {new Date(earnedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </p>
            </div>
        </div>
    );
};

interface BadgeShieldDisplayProps {
    userId?: string;
}

const BadgeShieldDisplay = ({ userId }: BadgeShieldDisplayProps) => {
    const [badges,  setBadges]  = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_URL}/notifications/badges`)
            .then(res => setBadges(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [userId]);

    if (loading) return null;

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border mt-6" style={{ borderColor: '#c5e3a0' }}>
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2" style={{ color: '#022202' }}>
                🏅 Earned Badges
            </h3>
            <p className="text-xs mb-6" style={{ color: '#4a7c2f' }}>
                Complete goals and habits to earn more badges!
            </p>

            {badges.length === 0 ? (
                <div className="text-center py-8" style={{ color: '#4a7c2f' }}>
                    <p className="text-sm font-medium opacity-60">No badges yet.</p>
                    <p className="text-xs mt-1 opacity-40">Complete your first goal to earn your first badge!</p>
                </div>
            ) : (
                <div className="flex flex-wrap gap-6 justify-start">
                    {badges.map(badge => (
                        <Shield
                            key={badge._id}
                            badgeType={badge.badgeType}
                            earnedAt={badge.earnedAt}
                            size="md"
                        />
                    ))}
                </div>
            )}

            {/* Locked badges (show what's available to earn) */}
            {badges.length < Object.keys(BADGE_CONFIG).length && (
                <div className="mt-6 pt-4 border-t" style={{ borderColor: '#e8f5d0' }}>
                    <p className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: '#4a7c2f' }}>
                        Badges to unlock
                    </p>
                    <div className="flex flex-wrap gap-4">
                        {Object.entries(BADGE_CONFIG)
                            .filter(([type]) => !badges.some(b => b.badgeType === type))
                            .map(([type, cfg]) => (
                                <div key={type} className="flex flex-col items-center gap-1 opacity-30" title={cfg.desc}>
                                    <div style={{
                                        width:      80,
                                        height:     92,
                                        background: '#e8f5d0',
                                        clipPath:   'polygon(50% 0%, 100% 15%, 100% 60%, 50% 100%, 0% 60%, 0% 15%)',
                                        display:    'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize:   28,
                                        filter:     'grayscale(1)',
                                    }}>
                                        {cfg.icon}
                                    </div>
                                    <p className="text-xs font-medium text-center" style={{ color: '#4a7c2f', maxWidth: 80 }}>
                                        {cfg.label}
                                    </p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}
        </div>
    );
};

export default BadgeShieldDisplay;
