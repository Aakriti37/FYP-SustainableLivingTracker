import { useState, useMemo } from "react";
import type { CarbonLog } from "../../CarbonCalculator";
import { Filter } from "lucide-react";

interface HistoryListProps {
    history: CarbonLog[];
    loading: boolean;
}

const getCO2Color = (value: number) => {
    if (value < 5) return "text-emerald-500";
    if (value < 10) return "text-yellow-500";
    if (value < 15) return "text-orange-500";
    return "text-red-500";
};

type FilterType = 'week' | 'month' | 'all';

const HistoryList = ({ history, loading }: HistoryListProps) => {
    const [filter, setFilter] = useState<FilterType>('all');

    const filteredHistory = useMemo(() => {
        if (filter === 'all') return history;

        const now = new Date();
        return history.filter(log => {
            const logDate = new Date(log.date);
            const diffTime = Math.abs(now.getTime() - logDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (filter === 'week') return diffDays <= 7;
            if (filter === 'month') return diffDays <= 30;
            return true;
        });
    }, [history, filter]);

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800">Carbon History</h3>

                <div className="relative">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as FilterType)}
                        className="appearance-none bg-emerald-50 text-emerald-700 font-semibold px-4 py-2 pr-10 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer text-sm"
                    >
                        <option value="week">Past Week</option>
                        <option value="month">Past Month</option>
                        <option value="all">All Time</option>
                    </select>
                    <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
                    </div>
                ) : filteredHistory.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <p className="italic">No history data found for this period.</p>
                    </div>
                ) : (
                    filteredHistory.map(log => (
                        <div key={log._id} className="flex justify-between items-center p-4 bg-gray-50/80 rounded-2xl hover:bg-emerald-50/50 hover:border-emerald-100 border border-transparent transition-all">
                            <div>
                                <p className="font-bold text-gray-800 text-sm mb-1">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                <div className="text-xs text-gray-500 flex gap-x-3 gap-y-1 flex-wrap">
                                    <span className="flex items-center gap-1">🚗 {log.transport}km</span>
                                    {log.publicTransport > 0 && <span className="flex items-center gap-1">🚌 {log.publicTransport}km</span>}
                                    <span className="flex items-center gap-1">⚡ {log.energy}kWh</span>
                                    <span className="flex items-center gap-1">🔥 {log.cookingFuel !== 'None' ? log.cookingFuel : 'N/A'}</span>
                                </div>
                            </div>
                            <div className={`font-black text-xl text-right ${getCO2Color(log.totalCO2)}`}>
                                {log.totalCO2.toFixed(1)} <span className="text-xs font-semibold uppercase block opacity-70">kg CO₂</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HistoryList;
