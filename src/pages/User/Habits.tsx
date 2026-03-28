import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import HabitList from "./components/habits/HabitList";
import type { Habit } from "./components/habits/HabitList";
import RecentActivity from "./components/habits/RecentActivity";
import type { Activity } from "./components/habits/RecentActivity";
import CreateHabitModal from "./components/habits/CreateHabitModal";
const API_URL = "http://localhost:5000/api";

const Habits = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchHabitsAndActivities = async () => {
        try {
            const [habitsRes, activitiesRes] = await Promise.all([
                axios.get(`${API_URL}/habits`),
                axios.get(`${API_URL}/habits/activities/recent`)
            ]);
            setHabits(habitsRes.data);
            setActivities(activitiesRes.data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHabitsAndActivities();
    }, []);


    const handleDeleteHabit = async (id: string) => {
        try {
            await axios.delete(`${API_URL}/habits/${id}`);
            toast.success("Habit deleted");
            fetchHabitsAndActivities();
        } catch (error: any) {
            toast.error("Error deleting habit");
        }
    };

    const handleLogActivity = async (id: string) => {
        try {
            const res = await axios.post(`${API_URL}/habits/${id}/log`);
            toast.success(`Logged! +${res.data.activity.pointsEarned} Points`);
            
            // Optimistic UI Update immediately flips the button to 'Completed'
            setHabits(prev => 
                prev.map(h => h._id === id ? { ...h, completedToday: true, streak: h.streak + 1 } : h)
            );
            
            fetchHabitsAndActivities();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error logging activity");
        }
    };

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <header className="flex justify-between items-end mb-8 border-b pb-4 border-gray-200">
                    <div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 pb-2">
                            HabitTracker
                        </h1>
                        <p className="text-gray-500 font-medium text-lg">Build eco-friendly habits, one day at a time.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <Plus size={20} />
                        New Habit
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

            {/* Modal */}
            {isModalOpen && (
                <CreateHabitModal
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchHabitsAndActivities();
                    }}
                />
            )}
        </div>
    );
};

export default Habits;
