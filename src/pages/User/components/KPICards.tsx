// pages/User/components/KPICards.tsx

import { Target, Leaf, Zap, Award } from "lucide-react";

interface KPICardsProps {
    totalCO2:            number | null;
    habitsCount:         number;
    completedGoalsCount: number;
    totalGoalsCount:     number;
    ecoPoints:           number;
}

const KPICards = ({ totalCO2, habitsCount, completedGoalsCount, totalGoalsCount, ecoPoints }: KPICardsProps) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Total Carbon Footprint */}
            <div
                className="rounded-2xl p-5 text-white shadow-md relative overflow-hidden group"
                style={{ background: 'linear-gradient(135deg, #022202, #17921f)' }}
            >
                <div className="absolute right-[-10px] top-[-10px] opacity-10 transform group-hover:scale-110 transition-transform duration-500">
                    <Leaf size={80} />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <p className="font-medium text-sm mb-3" style={{ color: '#a8d080' }}>
                        Total CO₂ Emitted
                    </p>
                    <div>
                        <div className="flex items-baseline gap-1 font-black text-3xl text-white">
                            {totalCO2 !== null ? totalCO2.toFixed(1) : '--'}
                            <span className="text-lg font-bold" style={{ color: '#a8d080' }}>kg</span>
                        </div>
                        <p
                            className="text-xs mt-1.5 inline-block px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(255,255,255,0.15)', color: '#d4edaa' }}
                        >
                            {totalCO2 !== null && totalCO2 < 50 ? 'Eco Warrior!' : 'Keep reducing!'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Active Habits */}
            <div
                className="rounded-2xl p-5 shadow-sm border relative overflow-hidden group hover:shadow-md transition-shadow flex flex-col justify-between"
                style={{ background: 'white', borderColor: '#c5e3a0' }}
            >
                <div className="absolute right-[5px] bottom-[5px] opacity-5 transform group-hover:-translate-y-2 transition-transform duration-500">
                    <Zap size={60} style={{ color: '#508C12' }} />
                </div>
                <div className="relative z-10 flex items-center justify-between mb-2">
                    <p className="font-medium text-sm" style={{ color: '#4a7c2f' }}>Active Habits</p>
                    <div
                        className="w-8 h-8 rounded-xl flex justify-center items-center"
                        style={{ background: '#f0f7e6', color: '#508C12' }}
                    >
                        <Zap size={16} />
                    </div>
                </div>
                <div className="relative z-10">
                    <div className="text-3xl font-black" style={{ color: '#022202' }}>{habitsCount}</div>
                    <p className="text-xs mt-1" style={{ color: '#4a7c2f' }}>habits tracked</p>
                </div>
            </div>

            {/* Goals Met */}
            <div
                className="rounded-2xl p-5 shadow-sm border relative overflow-hidden group hover:shadow-md transition-shadow flex flex-col justify-between"
                style={{ background: 'white', borderColor: '#c5e3a0' }}
            >
                <div className="absolute right-[5px] bottom-[5px] opacity-5 transform group-hover:rotate-12 transition-transform duration-500">
                    <Target size={60} style={{ color: '#508C12' }} />
                </div>
                <div className="relative z-10 flex items-center justify-between mb-2">
                    <p className="font-medium text-sm" style={{ color: '#4a7c2f' }}>Goals Met</p>
                    <div
                        className="w-8 h-8 rounded-xl flex justify-center items-center"
                        style={{ background: '#f0f7e6', color: '#508C12' }}
                    >
                        <Target size={16} />
                    </div>
                </div>
                <div className="relative z-10">
                    <div className="text-3xl font-black" style={{ color: '#022202' }}>
                        {completedGoalsCount}
                        <span className="text-sm font-bold ml-1" style={{ color: '#4a7c2f' }}>
                            / {totalGoalsCount}
                        </span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: '#4a7c2f' }}>goals completed</p>
                </div>
            </div>

            {/* Eco Points */}
            <div
                className="rounded-2xl p-5 shadow-sm border relative overflow-hidden group hover:shadow-md transition-shadow flex flex-col justify-between"
                style={{ background: 'white', borderColor: '#c5e3a0' }}
            >
                <div className="absolute right-[5px] bottom-[5px] opacity-5 transform group-hover:-rotate-12 transition-transform duration-500">
                    <Award size={60} style={{ color: '#508C12' }} />
                </div>
                <div className="relative z-10 flex items-center justify-between mb-2">
                    <p className="font-medium text-sm" style={{ color: '#4a7c2f' }}>Eco Points</p>
                    <div
                        className="w-8 h-8 rounded-xl flex justify-center items-center"
                        style={{ background: '#f0f7e6', color: '#508C12' }}
                    >
                        <Award size={16} />
                    </div>
                </div>
                <div className="relative z-10">
                    <div className="text-3xl font-black" style={{ color: '#022202' }}>{ecoPoints}</div>
                    <p className="text-xs mt-1" style={{ color: '#4a7c2f' }}>points earned</p>
                </div>
            </div>
        </div>
    );
};

export default KPICards;
