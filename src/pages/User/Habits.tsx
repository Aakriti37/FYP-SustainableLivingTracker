// pages/User/Habits.tsx

import { useState, useEffect } from "react";
import { Plus, Zap, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import HabitList        from "./components/habits/HabitList";
import RecentActivity   from "./components/habits/RecentActivity";
import CreateHabitModal from "./components/habits/CreateHabitModal";
import type { Habit }    from "./components/habits/HabitList";
import type { Activity } from "./components/habits/RecentActivity";


const Habits = () => {
    const [habits,      setHabits]      = useState<Habit[]>([]);
    const [activities,  setActivities]  = useState<Activity[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading,     setLoading]     = useState(true);

    const fetchAll = async () => {
        try {
            const [habitsRes, activitiesRes] = await Promise.all([
                api.get("/habits"),
                api.get("/habits/activities/recent"),
            ]);
            setHabits(habitsRes.data);
            setActivities(activitiesRes.data);
        } catch {
            toast.error("Failed to load habits");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
        // Generate reminders on page load
        api.post("/notifications/generate-reminders").catch(() => {});
    }, []);

    const handleDeleteHabit = async (_id: string) => {
        try {
            await api.delete(`/habits/${_id}`);
            toast.success("Habit deleted");
            fetchAll();
        } catch {
            toast.error("Error deleting habit");
        }
    };

    const handleLogActivity = async (id: string) => {
        try {
            const res = await api.post(`/habits/${id}/log`);
            toast.success(`Logged! +${res.data.activity.pointsEarned} Points`);
            // Optimistic update
            setHabits(prev =>
                prev.map(h => h._id === id ? { ...h, completedToday: true, streak: h.streak + 1 } : h)
            );
            fetchAll();
        } catch (error: unknown) {
            const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(msg || "Error logging activity");
        }
    };

    return (
        <div className="p-6 pb-20 min-h-screen" style={{ background: '#f0f7e6' }}>
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <header className="flex justify-between items-end pb-4 border-b" style={{ borderColor: '#c5e3a0' }}>
                    <div>
                        <h1 className="text-4xl font-extrabold pb-1 flex items-center gap-3" style={{ color: '#022202' }}>
                            <Zap size={34} style={{ color: '#508C12' }} />
                            Habit Tracker
                        </h1>
                        <p className="font-medium" style={{ color: '#4a7c2f' }}>
                            Build eco-friendly habits, one day at a time.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {loading && <RefreshCw size={18} className="animate-spin" style={{ color: '#508C12' }} />}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all"
                            style={{ background: '#508C12' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#3f7708')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#508C12')}
                        >
                            <Plus size={18} /> New Habit
                        </button>
                    </div>
                </header>

                {/* Content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <HabitList
                        habits={habits}
                        loading={loading}
                        onLogActivity={handleLogActivity}
                        onDeleteHabit={handleDeleteHabit}
                        onOpenModal={() => setIsModalOpen(true)}
                    />
                    <RecentActivity activities={activities} />
                </div>
            </div>

            {isModalOpen && (
                <CreateHabitModal
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => { setIsModalOpen(false); fetchAll(); }}
                />
            )}
        </div>
    );
};

export default Habits;
