import { useState } from "react";
import { CheckCircle2, Clock, Plus, Target as TargetIcon } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export type Goal = {
    _id: string;
    title: string;
    targetDate: string;
    status: "in-progress" | "completed" | "failed";
};

interface GoalsSectionProps {
    goals: Goal[];
    loading: boolean;
    onGoalChange: () => void;
}

const GoalsSection = ({ goals, loading, onGoalChange }: GoalsSectionProps) => {
    const [newGoalTitle, setNewGoalTitle] = useState("");
    const [newGoalDate, setNewGoalDate] = useState("");
    const [isAddingGoal, setIsAddingGoal] = useState(false);

    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGoalTitle || !newGoalDate) return;
        try {
            await axios.post(`${API_URL}/goals`, { title: newGoalTitle, targetDate: newGoalDate });
            toast.success("Goal added!");
            setNewGoalTitle("");
            setNewGoalDate("");
            setIsAddingGoal(false);
            onGoalChange();
        } catch (error) {
            toast.error("Failed to add goal");
        }
    };

    const handletoggleGoalStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "completed" ? "in-progress" : "completed";
        try {
            await axios.patch(`${API_URL}/goals/${id}/status`, { status: newStatus });
            toast.success(`Goal marked as ${newStatus}`);
            onGoalChange();
        } catch (error) {
            toast.error("Failed to update goal");
        }
    };

    const handleDeleteGoal = async (id: string) => {
        try {
            await axios.delete(`${API_URL}/goals/${id}`);
            toast.success("Goal deleted");
            onGoalChange();
        } catch (error) {
            toast.error("Failed to delete goal");
        }
    };

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mt-8">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <TargetIcon className="text-blue-500" /> Eco-Goals
                </h2>
                <button
                    onClick={() => setIsAddingGoal(!isAddingGoal)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-2"
                >
                    <Plus size={18} /> New Goal
                </button>
            </div>

            {isAddingGoal && (
                <form onSubmit={handleAddGoal} className="bg-gray-50 p-6 rounded-2xl mb-6 shadow-inner border border-gray-200 animate-in fade-in slide-in-from-top-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Target</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="e.g. Reduce meat consumption to 1x/week"
                                value={newGoalTitle}
                                onChange={e => setNewGoalTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Target Date</label>
                            <input
                                required
                                type="date"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700"
                                value={newGoalDate}
                                onChange={e => setNewGoalDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setIsAddingGoal(false)} className="px-4 py-2 text-gray-500 font-semibold hover:bg-gray-200 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-md">Save Goal</button>
                    </div>
                </form>
            )}

            <div className="space-y-3">
                {goals.length === 0 && !loading && (
                    <div className="text-center py-10 text-gray-400">
                        <TargetIcon size={48} className="mx-auto text-gray-200 mb-3" />
                        <p>You haven't set any goals yet.</p>
                    </div>
                )}
                {goals.map(goal => {
                    const isCompleted = goal.status === 'completed';
                    return (
                        <div key={goal._id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isCompleted ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-sm'}`}>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handletoggleGoalStatus(goal._id, goal.status)}
                                    className={`p-1 rounded-full transition-colors ${isCompleted ? 'text-emerald-500 hover:text-emerald-600' : 'text-gray-300 hover:text-blue-500'}`}
                                >
                                    <CheckCircle2 size={28} className={isCompleted ? 'fill-emerald-100' : ''} />
                                </button>
                                <div>
                                    <h3 className={`font-bold text-lg ${isCompleted ? 'text-emerald-800 line-through opacity-70' : 'text-gray-800'}`}>{goal.title}</h3>
                                    <p className={`text-sm flex items-center gap-1 ${isCompleted ? 'text-emerald-600/70' : 'text-gray-500'}`}>
                                        <Clock size={14} /> target: {new Date(goal.targetDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDeleteGoal(goal._id)}
                                className="text-gray-400 hover:text-red-500 p-2 opacity-50 hover:opacity-100 transition-opacity"
                            >
                                Delete
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GoalsSection;
