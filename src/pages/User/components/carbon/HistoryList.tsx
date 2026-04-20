// pages/User/components/Carbon/HistoryList.tsx

import { useState, useMemo } from "react";
import { Pencil, Trash2, Car, Bus, Train, Zap, Utensils, Flame, Filter } from "lucide-react";
import api from "../../../../services/api";
import toast from "react-hot-toast";
import type { CarbonLog } from "../../../../types/carbon.types";
import EditLogModal from "./EditLogModal";


interface HistoryListProps {
    history:   CarbonLog[];
    loading:   boolean;
    onRefresh: () => void;
}

type FilterType = 'all' | 'week' | 'month';

const getPeriodBadgeStyle = (period: string) => {
    if (period === 'weekly')  return { background: 'rgba(85,152,7,0.15)',  color: '#559807' };
    if (period === 'monthly') return { background: 'rgba(23,146,31,0.15)', color: '#17921f' };
    return                           { background: 'rgba(92,189,54,0.15)', color: '#3a8a12' };
};

const getCO2Color = (co2: number) => {
    if (co2 < 5)  return '#5cbd36';
    if (co2 < 10) return '#559807';
    if (co2 < 20) return '#f59e0b';
    return '#ef4444';
};

const HistoryList = ({ history, loading, onRefresh }: HistoryListProps) => {
    const [filter,       setFilter]       = useState<FilterType>('all');
    const [editLog,      setEditLog]      = useState<CarbonLog | null>(null);
    const [deletingId,   setDeletingId]   = useState<string | null>(null);

    const filteredHistory = useMemo(() => {
        if (filter === 'all') return history;
        const now  = new Date();
        const days = filter === 'week' ? 7 : 30;
        return history.filter(log => {
            const diff = (now.getTime() - new Date(log.date).getTime()) / (1000 * 60 * 60 * 24);
            return diff <= days;
        });
    }, [history, filter]);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this carbon log?')) return;
        setDeletingId(id);
        try {
            await api.delete("/carbon/${id}");
            toast.success("Carbon log deleted.");
            onRefresh();
        } catch {
            toast.error("Failed to delete log.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            <div className="bg-white rounded-3xl shadow-sm border overflow-hidden" style={{ borderColor: '#c5e3a0' }}>

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b" style={{ borderColor: '#e8f5d0' }}>
                    <h3 className="text-lg font-bold" style={{ color: '#022202' }}>Carbon History</h3>
                    <div className="flex items-center gap-2">
                        <Filter size={14} style={{ color: '#508C12' }} />
                        <select
                            value={filter}
                            onChange={e => setFilter(e.target.value as FilterType)}
                            className="text-sm font-semibold px-3 py-1.5 rounded-xl border outline-none"
                            style={{ borderColor: '#c5e3a0', color: '#508C12', background: '#f0f7e6' }}
                        >
                            <option value="all">All Time</option>
                            <option value="week">Past Week</option>
                            <option value="month">Past Month</option>
                        </select>
                    </div>
                </div>

                {/* List */}
                <div className="divide-y divide-[#e8f5d0] overflow-y-auto" style={{ maxHeight: '500px' }}>
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
                                style={{ borderColor: '#c5e3a0', borderTopColor: '#508C12' }} />
                        </div>
                    ) : filteredHistory.length === 0 ? (
                        <div className="text-center py-16" style={{ color: '#4a7c2f' }}>
                            <p className="font-medium">No logs found for this period.</p>
                        </div>
                    ) : (
                        filteredHistory.map(log => (
                            <div
                                key={log._id}
                                className="px-5 py-4 hover:bg-opacity-50 transition-colors"
                                style={{ background: 'white' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#f9fef5')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                            >
                                <div className="flex items-start justify-between gap-3">

                                    {/* Left — date + details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <p className="font-bold text-sm" style={{ color: '#022202' }}>
                                                {new Date(log.date).toLocaleDateString(undefined, {
                                                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                                                })}
                                            </p>
                                            <span
                                                className="px-2 py-0.5 rounded-full text-xs font-bold capitalize"
                                                style={getPeriodBadgeStyle(log.period)}
                                            >
                                                {log.period}
                                            </span>
                                        </div>

                                        {/* Metrics row */}
                                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs" style={{ color: '#4a7c2f' }}>
                                            {log.privateTransportKm > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Car size={11} /> {log.privateTransportKm} km ({log.vehicleFuelType})
                                                </span>
                                            )}
                                            {log.busKm > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Bus size={11} /> {log.busKm} km bus
                                                </span>
                                            )}
                                            {log.trainKm > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Train size={11} /> {log.trainKm} km train
                                                </span>
                                            )}
                                            {log.electricityKwh > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Zap size={11} /> {log.electricityKwh} kWh
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Utensils size={11} /> {log.diet}
                                            </span>
                                            {log.cookingFuel !== 'None' && (
                                                <span className="flex items-center gap-1">
                                                    <Flame size={11} /> {log.cookingFuel}
                                                </span>
                                            )}
                                        </div>

                                        {/* Breakdown */}
                                        <div className="flex gap-3 mt-2 text-xs flex-wrap">
                                            {[
                                                { label: 'Transport', val: log.transportCO2 },
                                                { label: 'Energy',    val: log.energyCO2    },
                                                { label: 'Diet',      val: log.dietCO2      },
                                                { label: 'Cooking',   val: log.cookingCO2   },
                                            ].map(b => (
                                                <span key={b.label} style={{ color: '#4a7c2f' }}>
                                                    {b.label}: <strong>{b.val.toFixed(2)}</strong>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right — CO2 + actions */}
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <div className="text-right">
                                            <p className="text-xl font-black" style={{ color: getCO2Color(log.totalCO2) }}>
                                                {log.totalCO2.toFixed(1)}
                                            </p>
                                            <p className="text-xs font-semibold" style={{ color: '#4a7c2f' }}>kg CO₂e</p>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={() => setEditLog(log)}
                                                className="p-1.5 rounded-lg transition-colors"
                                                style={{ background: '#f0f7e6', color: '#508C12' }}
                                                onMouseEnter={e => (e.currentTarget.style.background = '#d4edaa')}
                                                onMouseLeave={e => (e.currentTarget.style.background = '#f0f7e6')}
                                                title="Edit"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(log._id)}
                                                disabled={deletingId === log._id}
                                                className="p-1.5 rounded-lg transition-colors"
                                                style={{ background: '#fef2f2', color: '#ef4444' }}
                                                onMouseEnter={e => (e.currentTarget.style.background = '#fee2e2')}
                                                onMouseLeave={e => (e.currentTarget.style.background = '#fef2f2')}
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {editLog && (
                <EditLogModal
                    log={editLog}
                    onClose={() => setEditLog(null)}
                    onSaved={onRefresh}
                />
            )}
        </>
    );
};

export default HistoryList;
