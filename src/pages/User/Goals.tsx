import { useState, useEffect } from "react";
import { Target, Plus, CheckCircle2, Clock, Trash2, Award, Zap } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import type { Goal as ImportedGoal } from "./components/GoalsSection";

const API_URL = "http://localhost:5000/api";

type Goal = ImportedGoal & {
    progress?: number;
};

const Goals = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddingGoal, setIsAddingGoal] = useState(false);
    const [newGoalTitle, setNewGoalTitle] = useState("");
    const [newGoalDate, setNewGoalDate] = useState("");

    const fetchGoals = async () => {
        try {
            const res = await axios.get(`${API_URL}/goals`);
            setGoals(res.data);
        } catch (error) {
            toast.error("Failed to load goals");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGoalTitle || !newGoalDate) return;
        try {
            await axios.post(`${API_URL}/goals`, { title: newGoalTitle, targetDate: newGoalDate });
            toast.success("Goal added!");
            setNewGoalTitle("");
            setNewGoalDate("");
            setIsAddingGoal(false);
            fetchGoals();
        } catch (error) {
            toast.error("Failed to add goal");
        }
    };

    const handleToggleGoalStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "completed" ? "in-progress" : "completed";
        try {
            await axios.patch(`${API_URL}/goals/${id}/status`, { status: newStatus });
            toast.success(`Goal marked as ${newStatus}`);
            fetchGoals();
        } catch (error) {
            toast.error("Failed to update goal");
        }
    };

    const handleDeleteGoal = async (id: string) => {
        try {
            await axios.delete(`${API_URL}/goals/${id}`);
            toast.success("Goal deleted");
            fetchGoals();
        } catch (error) {
            toast.error("Failed to delete goal");
        }
    };

    const calculateDaysLeft = (targetDate: string) => {
        const diff = new Date(targetDate).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 3600 * 24));
        return days > 0 ? days : 0;
    };

    return (
        <div className="p-8 pb-20">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8 border-b pb-6 border-gray-200">
                    <div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 pb-2">
                            Eco-Goals
                        </h1>
                        <p className="text-gray-500 font-medium text-lg">Set milestones and track your long-term environmental impact.</p>
                    </div>
                    <button
                        onClick={() => setIsAddingGoal(!isAddingGoal)}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <Plus size={20} />
                        New Goal
                    </button>
                </header>

                {/* Connection Banner */}
                <div className="bg-linear-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
                    <div className="bg-white p-4 rounded-full shadow-sm">
                        <Zap className="text-yellow-500" size={32} />
                    </div>
                    <div>
                        <h3 className="text-indigo-900 font-bold text-lg mb-1">Daily Habits Fuel Your Goals!</h3>
                        <p className="text-indigo-700">Completing your daily habits contributes directly to achieving these active goals. Keep the streak alive!</p>
                    </div>
                </div>

                {/* Add Goal Form */}
                {isAddingGoal && (
                    <form onSubmit={handleAddGoal} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Create a New Milestone</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Target Description</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="e.g. Reduce household waste by 50%"
                                    value={newGoalTitle}
                                    onChange={e => setNewGoalTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Target Date</label>
                                <input
                                    required
                                    type="date"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 transition-all"
                                    value={newGoalDate}
                                    onChange={e => setNewGoalDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button type="button" onClick={() => setIsAddingGoal(false)} className="px-6 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-md transition-colors">Save Goal</button>
                        </div>
                    </form>
                )}

                {/* Goals Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : goals.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <Target size={64} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No active goals</h3>
                        <p className="text-gray-500 mb-6">Set a target and start making an impact.</p>
                        <button onClick={() => setIsAddingGoal(true)} className="text-blue-600 font-bold hover:underline">
                            Create your first goal
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {goals.map(goal => {
                            const isCompleted = goal.status === 'completed';
                            const daysLeft = calculateDaysLeft(goal.targetDate);
                            const progress = goal.progress || 0;

                            return (
                                <div key={goal._id} className={`relative flex flex-col p-6 rounded-3xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${isCompleted ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100' : 'bg-white border-gray-100 group'}`}>

                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`p-3 rounded-2xl ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                            {isCompleted ? <Award size={24} /> : <Target size={24} />}
                                        </div>
                                        <button
                                            onClick={() => handleDeleteGoal(goal._id)}
                                            className="text-gray-400 hover:text-red-500 p-2 opacity-50 hover:opacity-100 transition-opacity bg-white/50 rounded-full"
                                            title="Delete Goal"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {/* Title & Info */}
                                    <div className="flex-1 mb-6">
                                        <h3 className={`font-bold text-xl mb-2 line-clamp-2 ${isCompleted ? 'text-emerald-900' : 'text-gray-800'}`}>
                                            {goal.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm font-medium">
                                            <span className={`flex items-center gap-1.5 ${isCompleted ? 'text-emerald-600' : 'text-gray-500'}`}>
                                                <Clock size={16} />
                                                {isCompleted ? 'Completed' : `${daysLeft} days left`}
                                            </span>
                                            <span className={`px-2.5 py-1 rounded-lg ${isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {new Date(goal.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-auto">
                                        <div className="flex justify-between text-sm font-bold mb-2">
                                            <span className={isCompleted ? 'text-emerald-700' : 'text-gray-700'}>Progress</span>
                                            <span className={isCompleted ? 'text-emerald-700' : 'text-blue-600'}>{progress}%</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden mb-6">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ease-out ${isCompleted ? 'bg-emerald-500' : 'bg-linear-to-r from-blue-500 to-indigo-500'}`}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>

                                        <button
                                            onClick={() => handleToggleGoalStatus(goal._id, goal.status)}
                                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${isCompleted
                                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 group-hover:border-blue-200 group-hover:text-blue-700 group-hover:bg-blue-50'
                                                }`}
                                        >
                                            <CheckCircle2 size={18} className={isCompleted ? 'fill-emerald-200' : ''} />
                                            {isCompleted ? 'Mark as In-Progress' : 'Mark as Completed'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Goals;
