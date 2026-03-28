import { Target, Leaf, Zap, Award } from "lucide-react";

interface KPICardsProps {
    todayCarbon: number | null;
    habitsCount: number;
    completedGoalsCount: number;
    totalGoalsCount: number;
}

const KPICards = ({ todayCarbon, habitsCount, completedGoalsCount, totalGoalsCount }: KPICardsProps) => {
    // Mocking an Eco-Points value for the 4th card based on habits
    const ecoPoints = habitsCount * 15 + completedGoalsCount * 50;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-linear-to-br from-emerald-500 to-teal-500 rounded-2xl p-4 text-white shadow-md relative overflow-hidden group">
                <div className="absolute right-[-10px] top-[-10px] opacity-20 transform group-hover:scale-110 transition-transform duration-500">
                    <Leaf size={80} />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <p className="text-emerald-50 font-medium text-sm mb-2">Today's Footprint</p>
                    <div>
                        <div className="flex items-baseline gap-1 font-black text-3xl">
                            {todayCarbon ?? '--'} <span className="text-lg font-bold">kg</span>
                        </div>
                        <p className="text-xs text-emerald-100 mt-1 inline-block bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                            {todayCarbon && todayCarbon < 5 ? 'Excellent!' : 'Keep pushing!'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="absolute right-[5px] bottom-[5px] opacity-5 transform group-hover:-translate-y-2 transition-transform duration-500">
                    <Zap size={60} className="text-orange-500" />
                </div>
                <div className="relative z-10 flex items-center justify-between mb-2">
                    <p className="text-gray-500 font-medium text-sm">Active Habits</p>
                    <div className="w-8 h-8 bg-orange-50 text-orange-500 rounded-xl flex justify-center items-center">
                        <Zap size={16} />
                    </div>
                </div>
                <div className="relative z-10">
                    <div className="text-3xl font-black text-gray-800">{habitsCount}</div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="absolute right-[5px] bottom-[5px] opacity-5 transform group-hover:rotate-12 transition-transform duration-500">
                    <Target size={60} className="text-blue-500" />
                </div>
                <div className="relative z-10 flex items-center justify-between mb-2">
                    <p className="text-gray-500 font-medium text-sm">Goals Met</p>
                    <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-xl flex justify-center items-center">
                        <Target size={16} />
                    </div>
                </div>
                <div className="relative z-10">
                    <div className="text-3xl font-black text-gray-800">
                        {completedGoalsCount} <span className="text-sm text-gray-400 font-bold">/ {totalGoalsCount}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="absolute right-[5px] bottom-[5px] opacity-5 transform group-hover:-rotate-12 transition-transform duration-500">
                    <Award size={60} className="text-purple-500" />
                </div>
                <div className="relative z-10 flex items-center justify-between mb-2">
                    <p className="text-gray-500 font-medium text-sm">Eco-Points</p>
                    <div className="w-8 h-8 bg-purple-50 text-purple-500 rounded-xl flex justify-center items-center">
                        <Award size={16} />
                    </div>
                </div>
                <div className="relative z-10">
                    <div className="text-3xl font-black text-gray-800">{ecoPoints}</div>
                </div>
            </div>
        </div>
    );
};

export default KPICards;
