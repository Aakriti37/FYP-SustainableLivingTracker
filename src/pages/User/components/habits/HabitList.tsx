import { Check, Trash2, TrendingUp, Zap, Target, RefreshCw } from "lucide-react";

export type Habit = {
    _id: string;
    name: string;
    description: string;
    frequency: string;
    streak: number;
    pointsPerCompletion: number;
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
                <Target className="text-emerald-500" />
                My Habits
            </h2>

            {loading ? (
                <div className="flex justify-center py-10">
                    <RefreshCw className="animate-spin text-emerald-500" size={32} />
                </div>

            ) : habits.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
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
                <div className="grid gap-4">
                    {habits.map((habit) => (
                        <div key={habit._id} className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 flex items-center justify-between">
                            
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-gray-800">{habit.name}</h3>
                                    
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-wide">
                                        {habit.frequency}
                                    </span>
                                </div>

                                <p className="text-gray-500 text-sm mb-4">{habit.description || "No description provided."}</p>

                                <div className="flex items-center gap-6 text-sm">
                                    <div className="flex items-center gap-1.5 text-orange-500 font-semibold bg-orange-50 px-3 py-1 rounded-lg">
                                        <Zap size={16} /> streak: {habit.streak}
                                    </div>

                                    <div className="flex items-center gap-1.5 text-blue-500 font-semibold bg-blue-50 px-3 py-1 rounded-lg">
                                        <TrendingUp size={16} /> +{habit.pointsPerCompletion} pts
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3 ml-6 border-l pl-6 border-gray-100">
                                <button
                                    onClick={() => onLogActivity(habit._id)}
                                    className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white px-6 py-2.5 rounded-xl font-bold transition-all duration-300 w-full"
                                >
                                    <Check size={18} /> Complete
                                </button>

                                <button
                                    onClick={() => onDeleteHabit(habit._id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-2 w-full text-right flex justify-end"
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



