// pages/User/components/habits/HabitList.tsx

import { Check, Trash2, TrendingUp, Zap, Target, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export type Habit = {
    _id:                 string;
    name:                string;
    description:         string;
    frequency:           string;
    streak:              number;
    pointsPerCompletion: number;
    completedToday?:     boolean;
};

interface HabitListProps {
    habits:          Habit[];
    loading:         boolean;
    onLogActivity:   (id: string) => void;
    onDeleteHabit:   (id: string) => void;
    onOpenModal:     () => void;
}

const HabitList = ({ habits, loading, onLogActivity, onDeleteHabit, onOpenModal }: HabitListProps) => {
    return (
        <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#022202' }}>
                <Target size={20} style={{ color: '#508C12' }} />
                Daily Habits Checklist
            </h2>

            {/* Banner */}
            <div className="rounded-2xl p-4 border flex flex-col sm:flex-row justify-between items-center gap-3" style={{ background: 'white', borderColor: '#c5e3a0' }}>
                <div>
                    <p className="font-bold text-sm flex items-center gap-1.5" style={{ color: '#022202' }}>
                        <Zap size={15} style={{ color: '#508C12' }} /> Habits Fuel Goals
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#4a7c2f' }}>
                        Every habit you complete contributes to your eco goals progress!
                    </p>
                </div>
                <Link
                    to="/goals"
                    className="flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-xl border transition-all shrink-0"
                    style={{ color: '#508C12', borderColor: '#c5e3a0', background: '#f0f7e6' }}
                >
                    View Goals <ArrowRight size={13} />
                </Link>
            </div>

            {/* Loading */}
            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#c5e3a0', borderTopColor: '#508C12' }} />
                </div>
            ) : habits.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border" style={{ borderColor: '#c5e3a0' }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#f0f7e6' }}>
                        <Zap size={28} style={{ color: '#508C12' }} />
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#022202' }}>No habits yet</h3>
                    <p className="text-sm mb-4" style={{ color: '#4a7c2f' }}>Start building your eco-friendly lifestyle today.</p>
                    <button
                        onClick={onOpenModal}
                        className="font-bold underline"
                        style={{ color: '#508C12' }}
                    >
                        Create your first habit
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border overflow-hidden divide-y" style={{ borderColor: '#c5e3a0', divideColor: '#e8f5d0' }}>
                    {habits.map(habit => (
                        <div
                            key={habit._id}
                            className="group p-4 flex items-center justify-between gap-4 transition-colors"
                            onMouseEnter={e => (e.currentTarget.style.background = '#f9fef5')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                        >
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                    <h3 className="font-bold text-base" style={{ color: '#022202' }}>
                                        {habit.name}
                                    </h3>
                                    <span
                                        className="text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wide"
                                        style={{ background: '#f0f7e6', color: '#4a7c2f' }}
                                    >
                                        {habit.frequency}
                                    </span>
                                </div>
                                <p className="text-sm truncate" style={{ color: '#4a7c2f' }}>
                                    {habit.description || "No description."}
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
                                <div
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg"
                                    style={{ background: '#fff7ed', color: '#ea580c' }}
                                >
                                    <Zap size={12} /> {habit.streak}
                                </div>
                                <div
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg"
                                    style={{ background: '#f0f7e6', color: '#508C12' }}
                                >
                                    <TrendingUp size={12} /> +{habit.pointsPerCompletion}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pl-3 border-l shrink-0" style={{ borderColor: '#e8f5d0' }}>
                                {habit.completedToday ? (
                                    <button
                                        disabled
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold cursor-not-allowed"
                                        style={{ background: '#f0f7e6', color: '#4a7c2f' }}
                                    >
                                        <Check size={15} /> Done
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onLogActivity(habit._id)}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all"
                                        style={{ background: '#f0f7e6', color: '#508C12' }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLElement).style.background = '#508C12';
                                            (e.currentTarget as HTMLElement).style.color = 'white';
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLElement).style.background = '#f0f7e6';
                                            (e.currentTarget as HTMLElement).style.color = '#508C12';
                                        }}
                                    >
                                        <Check size={15} /> Mark Done
                                    </button>
                                )}
                                <button
                                    onClick={() => onDeleteHabit(habit._id)}
                                    className="p-2 rounded-lg transition-colors"
                                    style={{ background: '#fef2f2', color: '#ef4444' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = '#fee2e2')}
                                    onMouseLeave={e => (e.currentTarget.style.background = '#fef2f2')}
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HabitList;
