// pages/Admin/components/AdminKPICards.tsx

import { Users, Activity, MessageSquare, Leaf, Target } from "lucide-react";

interface AdminKPICardsProps {
    stats: {
        totalUsers:   number;
        totalHabits:  number;
        totalPosts:   number;
        totalGoals:   number;
        totalCO2Log:  number;
    } | null;
}

const cards = [
    { key: 'totalUsers',  label: 'Total Users',      icon: Users,         color: '#3b82f6', bg: '#eff6ff' },
    { key: 'totalHabits', label: 'Active Habits',     icon: Activity,      color: '#17921f', bg: '#f0f7e6' },
    { key: 'totalPosts',  label: 'Community Posts',   icon: MessageSquare, color: '#8b5cf6', bg: '#f5f3ff' },
    { key: 'totalGoals',  label: 'Total Goals',       icon: Target,        color: '#f59e0b', bg: '#fffbeb' },
];

const AdminKPICards = ({ stats }: AdminKPICardsProps) => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => {
            const Icon  = card.icon;
            const value = stats ? (stats as Record<string, number>)[card.key] : 0;

            return (
                <div
                    key={card.key}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                >
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-gray-500">{card.label}</p>
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors group-hover:scale-110"
                            style={{ background: card.bg, color: card.color }}
                        >
                            <Icon size={18} />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-gray-800">{value ?? 0}</div>
                    {card.key === 'totalCO2Log' && (
                        <span className="text-xs text-gray-400 ml-1">kg</span>
                    )}
                </div>
            );
        })}

        {/* CO2 card separately — full width on mobile */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group col-span-2 lg:col-span-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Total CO₂ Logged (All Users)</p>
                    <div className="text-3xl font-black" style={{ color: '#17921f' }}>
                        {stats?.totalCO2Log ?? 0} <span className="text-base font-semibold text-gray-400">kg CO₂e</span>
                    </div>
                </div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#f0f7e6', color: '#17921f' }}>
                    <Leaf size={24} />
                </div>
            </div>
        </div>
    </div>
);

export default AdminKPICards;
