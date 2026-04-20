// pages/User/components/GoalsSection.tsx

import { useState } from "react";
import { CheckCircle2, Clock, Plus, Target as TargetIcon, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../../services/api";


export type Goal = {
    _id:        string;
    title:      string;
    targetDate: string;
    status:     "in-progress" | "completed" | "failed";
    progress?:  number;
};

interface GoalsSectionProps {
    goals:        Goal[];
    loading:      boolean;
    onGoalChange: () => void;
}

const GoalsSection = ({ goals, loading, onGoalChange }: GoalsSectionProps) => {
    const [newGoalTitle, setNewGoalTitle] = useState("");
    const [newGoalDate,  setNewGoalDate]  = useState("");
    const [isAdding,     setIsAdding]     = useState(false);

    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGoalTitle || !newGoalDate) return;
        try {
            await api.post("/goals", { title: newGoalTitle, targetDate: newGoalDate });
            toast.success("Goal added!");
            setNewGoalTitle("");
            setNewGoalDate("");
            setIsAdding(false);
            onGoalChange();
        } catch {
            toast.error("Failed to add goal");
        }
    };

    const handleToggleStatus = async (_id: string, currentStatus: string) => {
        const newStatus = currentStatus === "completed" ? "in-progress" : "completed";
        try {
            await api.patch("/goals/${id}/status", { status: newStatus });
            toast.success(`Goal marked as ${newStatus}`);
            onGoalChange();
        } catch {
            toast.error("Failed to update goal");
        }
    };

    const handleDelete = async (_id: string) => {
        try {
            await api.delete("/goals/${id}");
            toast.success("Goal deleted");
            onGoalChange();
        } catch {
            toast.error("Failed to delete goal");
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border mt-6" style={{ borderColor: '#c5e3a0' }}>

            {/* Header */}
            <div className="flex justify-between items-center mb-5 pb-4 border-b" style={{ borderColor: '#e8f5d0' }}>
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#022202' }}>
                    <TargetIcon size={20} style={{ color: '#508C12' }} />
                    Eco Goals
                </h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all"
                    style={{ background: '#508C12' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#3f7708')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#508C12')}
                >
                    <Plus size={16} /> New Goal
                </button>
            </div>

            {/* Add goal form */}
            {isAdding && (
                <div className="rounded-2xl p-5 mb-5 border" style={{ background: '#f0f7e6', borderColor: '#c5e3a0' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#022202' }}>
                                Goal Title
                            </label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-white"
                                style={{ borderColor: '#c5e3a0' }}
                                placeholder="e.g. Reduce meat consumption to 1x/week"
                                value={newGoalTitle}
                                onChange={e => setNewGoalTitle(e.target.value)}
                                onFocus={e  => (e.target.style.borderColor = '#508C12')}
                                onBlur={e   => (e.target.style.borderColor = '#c5e3a0')}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#022202' }}>
                                Target Date
                            </label>
                            <input
                                required
                                type="date"
                                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-white"
                                style={{ borderColor: '#c5e3a0', color: '#022202' }}
                                value={newGoalDate}
                                onChange={e => setNewGoalDate(e.target.value)}
                                onFocus={e  => (e.target.style.borderColor = '#508C12')}
                                onBlur={e   => (e.target.style.borderColor = '#c5e3a0')}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="px-4 py-2 text-sm font-semibold rounded-xl border transition-colors"
                            style={{ borderColor: '#c5e3a0', color: '#4a7c2f' }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddGoal}
                            className="px-5 py-2 text-sm font-bold text-white rounded-xl transition-all"
                            style={{ background: '#508C12' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#3f7708')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#508C12')}
                        >
                            Save Goal
                        </button>
                    </div>
                </div>
            )}

            {/* Goals list */}
            <div className="space-y-3">
                {goals.length === 0 && !loading && (
                    <div className="text-center py-10" style={{ color: '#4a7c2f' }}>
                        <TargetIcon size={44} className="mx-auto mb-3 opacity-30" style={{ color: '#508C12' }} />
                        <p className="font-medium">No goals set yet.</p>
                        <p className="text-sm mt-1 opacity-70">Click New Goal to get started!</p>
                    </div>
                )}

                {goals.map(goal => {
                    const isCompleted = goal.status === 'completed';
                    return (
                        <div
                            key={goal._id}
                            className="flex items-center justify-between p-4 rounded-2xl border transition-all"
                            style={{
                                background:   isCompleted ? '#f0f7e6' : 'white',
                                borderColor:  isCompleted ? '#c5e3a0' : '#e8f5d0',
                            }}
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <button
                                    onClick={() => handleToggleStatus(goal._id, goal.status)}
                                    className="transition-colors shrink-0"
                                    style={{ color: isCompleted ? '#17921f' : '#c5e3a0' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#508C12')}
                                    onMouseLeave={e => (e.currentTarget.style.color = isCompleted ? '#17921f' : '#c5e3a0')}
                                >
                                    <CheckCircle2 size={26} />
                                </button>
                                <div className="min-w-0">
                                    <h3
                                        className="font-bold text-base truncate"
                                        style={{
                                            color:          isCompleted ? '#2d6a10' : '#022202',
                                            textDecoration: isCompleted ? 'line-through' : 'none',
                                            opacity:        isCompleted ? 0.7 : 1,
                                        }}
                                    >
                                        {goal.title}
                                    </h3>
                                    <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: '#4a7c2f' }}>
                                        <Clock size={12} />
                                        Target: {new Date(goal.targetDate).toLocaleDateString(undefined, {
                                            year: 'numeric', month: 'short', day: 'numeric'
                                        })}
                                    </p>
                                    {/* Progress bar */}
                                    {goal.progress !== undefined && !isCompleted && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#e8f5d0' }}>
                                                <div
                                                    className="h-full rounded-full transition-all"
                                                    style={{ width: `${goal.progress}%`, background: '#508C12' }}
                                                />
                                            </div>
                                            <span className="text-xs font-semibold" style={{ color: '#4a7c2f' }}>
                                                {goal.progress}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status badge + delete */}
                            <div className="flex items-center gap-2 shrink-0 ml-3">
                                <span
                                    className="text-xs font-bold px-2.5 py-1 rounded-full capitalize hidden sm:block"
                                    style={{
                                        background: isCompleted ? 'rgba(23,146,31,0.15)' : 'rgba(80,140,18,0.1)',
                                        color:      isCompleted ? '#17921f'               : '#508C12',
                                    }}
                                >
                                    {goal.status.replace('-', ' ')}
                                </span>
                                <button
                                    onClick={() => handleDelete(goal._id)}
                                    className="p-1.5 rounded-lg transition-colors"
                                    style={{ color: '#c5e3a0' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                                    onMouseLeave={e => (e.currentTarget.style.color = '#c5e3a0')}
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GoalsSection;
