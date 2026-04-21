// pages/User/Goals.tsx

import { useState, useEffect } from "react";
import { Target, Plus, Zap, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import GoalCard     from "./components/goals/GoalCard";
import GoalForm     from "./components/goals/GoalForm";
import BadgeDisplay from "./components/goals/BadgeDisplay";


type Goal = {
    _id:        string;
    title:      string;
    targetDate: string;
    status:     'in-progress' | 'completed' | 'failed';
    progress?:  number;
};

const Goals = () => {
    const [goals,    setGoals]    = useState<Goal[]>([]);
    const [loading,  setLoading]  = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [title,    setTitle]    = useState('');
    const [date,     setDate]     = useState('');

    const fetchGoals = async () => {
        setLoading(true);
        
        try {
            const res = await api.get("/goals");
            setGoals(res.data);
        } catch {
            toast.error("Failed to load goals");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
        // Generate reminders on page load
        api.post("/notifications/generate-reminders").catch(() => {});
    }, []);

    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title || !date) return;
        
        try {
            await api.post("/goals", { title, targetDate: date });
            toast.success("Goal added!");
            
            setTitle('');
            setDate('');
            setIsAdding(false);
            fetchGoals();
        } catch {
            toast.error("Failed to add goal");
        }
    };

    const handleToggleStatus = async (_id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'completed' ? 'in-progress' : 'completed';
        
        try {
            await api.patch(`/goals/${_id}/status`, { status: newStatus });
            
            if (newStatus === 'completed') toast.success("Goal completed! Check your badges!");
            else toast.success(`Goal marked as in-progress`);
            
            fetchGoals();
        } catch {
            toast.error("Failed to update goal");
        }
    };

    const handleDelete = async (_id: string) => {
        try {
            await api.delete(`/goals/${_id}`);
            toast.success("Goal deleted");
            fetchGoals();
        } catch {
            toast.error("Failed to delete goal");
        }
    };

    const inProgress = goals.filter(g => g.status === 'in-progress');
    const completed  = goals.filter(g => g.status === 'completed');
    const failed     = goals.filter(g => g.status === 'failed');

    return (
        <div className="p-6 pb-20 min-h-screen" style={{ background: '#f0f7e6' }}>
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 pb-4 border-b" style={{ borderColor: '#c5e3a0' }}>
                    <div>
                        <h1 className="text-4xl font-extrabold pb-1 flex items-center gap-3" style={{ color: '#022202' }}>
                            <Target size={34} style={{ color: '#508C12' }} />
                            Eco Goals
                        </h1>

                        <p className="font-medium" style={{ color: '#4a7c2f' }}>
                            Set milestones and track your long-term environmental impact.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {loading && <RefreshCw size={18} className="animate-spin" style={{ color: '#508C12' }} />}
                        
                        <button
                            onClick={() => setIsAdding(!isAdding)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all"
                            style={{ background: '#508C12' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#3f7708')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#508C12')}
                        >
                            <Plus size={18} /> New Goal
                        </button>
                    </div>
                </header>

                {/* Badges */}
                <BadgeDisplay />

                {/* Connection banner */}
                <div className="rounded-2xl p-5 border flex items-center gap-4" style={{ background: 'white', borderColor: '#c5e3a0' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#f0f7e6' }}>
                        <Zap size={20} style={{ color: '#508C12' }} />
                    </div>

                    <div>
                        <p className="font-bold text-sm" style={{ color: '#022202' }}>Daily Habits Fuel Your Goals</p>
                        
                        <p className="text-sm" style={{ color: '#4a7c2f' }}>
                            Progress is calculated based on how consistently you complete linked habits before the target date.
                        </p>
                    </div>
                </div>

                {/* Add goal form */}
                {isAdding && (
                    <GoalForm
                        title={title}
                        date={date}
                        onTitle={setTitle}
                        onDate={setDate}
                        onSubmit={handleAddGoal}
                        onCancel={() => setIsAdding(false)}
                    />
                )}

                {/* Loading */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="rounded-3xl h-64 border" style={{ background: '#f0f7e6', borderColor: '#c5e3a0' }} />
                        ))}
                    </div>

                ) : goals.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border" style={{ borderColor: '#c5e3a0' }}>
                        
                        <Target size={56} className="mx-auto mb-4 opacity-20" style={{ color: '#508C12' }} />
                        
                        <h3 className="text-xl font-bold mb-2" style={{ color: '#022202' }}>No goals yet</h3>
                        
                        <p className="mb-4" style={{ color: '#4a7c2f' }}>Set your first eco goal and start making an impact.</p>
                        
                        <button
                            onClick={() => setIsAdding(true)}
                            className="font-bold underline"
                            style={{ color: '#508C12' }}
                        >
                            Create your first goal
                        </button>

                    </div>
                ) : (
                    <div className="space-y-8">

                        {/* In Progress */}
                        {inProgress.length > 0 && (
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: '#4a7c2f' }}>
                                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#508C12' }} />
                                    
                                    In Progress ({inProgress.length})
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {inProgress.map(goal => (
                                        <GoalCard key={goal._id} goal={goal} onToggleStatus={handleToggleStatus} onDelete={handleDelete} />
                                    ))}
                                </div>

                            </div>
                        )}

                        {/* Completed */}
                        {completed.length > 0 && (
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: '#4a7c2f' }}>
                                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#17921f' }} />
                                    Completed ({completed.length})
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {completed.map(goal => (
                                        <GoalCard key={goal._id} goal={goal} onToggleStatus={handleToggleStatus} onDelete={handleDelete} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Failed */}
                        {failed.length > 0 && (
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: '#4a7c2f' }}>
                                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#ef4444' }} />
                                    Missed ({failed.length})
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {failed.map(goal => (
                                        <GoalCard key={goal._id} goal={goal} onToggleStatus={handleToggleStatus} onDelete={handleDelete} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Goals;
