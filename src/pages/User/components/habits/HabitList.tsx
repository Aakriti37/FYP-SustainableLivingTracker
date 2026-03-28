import { Check, Trash2, TrendingUp, Zap, Target, RefreshCw, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export type Habit = {
    _id: string;
    name: string;
    description: string;
    frequency: string;
    streak: number;
    pointsPerCompletion: number;
    completedToday?: boolean;
};

interface HabitListProps {
    habits: Habit[];
    loading: boolean;
    onLogActivity: (id: string) => void;
    onDeleteHabit: (id: string) => void;
    onOpenModal: () => void;
}

const HabitList = ({ habits, loading, onLogActivity, onDeleteHabit, onOpenModal }: HabitListProps) => {
    return (
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Target className="text-emerald-500" /> Daily Habits Checklist
            </h2>

            {/* Connection Banner */}
            <div className="bg-linear-to-r from-teal-50 to-emerald-50 border border-emerald-100 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
                <div>
                    <h3 className="text-emerald-900 font-bold text-md mb-1 flex items-center gap-2">
                        <Zap size={18} className="text-yellow-500" /> Habits Fuel Goals
                    </h3>
                    <p className="text-emerald-700 text-sm">Every habit you check off contributes to your larger eco-goals!</p>
                </div>
                <Link to="/goals" className="flex items-center gap-1 text-emerald-600 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-50 text-sm font-semibold transition-colors">
                    View Goals <ArrowRight size={14} />
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <RefreshCw className="animate-spin text-emerald-500" size={32} />
                </div>
            ) : habits.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100">
                    <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="text-emerald-400" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No habits yet</h3>
                    <p className="text-gray-500 mb-6">Start building your eco-friendly lifestyle today.</p>
                    <button onClick={onOpenModal} className="text-emerald-600 font-semibold hover:underline">
                        Create your first habit
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                    {habits.map((habit) => (
                        <div key={habit._id} className="group p-5 hover:bg-gray-50 transition-all flex items-center justify-between gap-4">

                            {/* Left: Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">{habit.name}</h3>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 uppercase tracking-widest">
                                        {habit.frequency}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm line-clamp-1 group-hover:line-clamp-none transition-all">{habit.description || "No description."}</p>
                            </div>

                            {/* Middle: Stats */}
                            <div className="hidden sm:flex items-center gap-4 text-xs font-semibold">
                                <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-2 py-1.5 rounded-md" title="Current Streak">
                                    <Zap size={14} /> {habit.streak}
                                </div>
                                <div className="flex items-center gap-1 text-blue-500 bg-blue-50 px-2 py-1.5 rounded-md" title="Points per completion">
                                    <TrendingUp size={14} /> +{habit.pointsPerCompletion}
                                </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-2 border-l border-gray-100 pl-4">
                                {habit.completedToday ? (
                                    <button
                                        disabled
                                        className="flex items-center justify-center gap-1.5 bg-gray-200 text-gray-500 px-4 py-2 rounded-xl font-bold shadow-sm cursor-not-allowed"
                                        title="Already completed today"
                                    >
                                        <Check size={18} /> <span>Completed</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onLogActivity(habit._id)}
                                        className="flex items-center justify-center gap-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-xl font-bold transition-all duration-300 shadow-sm"
                                        title="Log Activity"
                                    >
                                        <Check size={18} /> <span>Done</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => onDeleteHabit(habit._id)}
                                    className="text-red-500 hover:text-white bg-red-50 hover:bg-red-500 transition-colors p-2 rounded-lg"
                                    title="Delete Habit"
                                >
                                    <Trash2 size={18} />
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
