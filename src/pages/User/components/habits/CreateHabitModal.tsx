import { useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api";

interface CreateHabitModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const CreateHabitModal = ({ onClose, onSuccess }: CreateHabitModalProps) => {
    const [newHabit, setNewHabit] = useState({ name: "", description: "", frequency: "daily" });

    const handleCreateHabit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post(`${API_URL}/habits`, newHabit);
            toast.success("Habit created successfully!");
            onSuccess();
        }
        catch(error: any) {
            toast.error(error.response?.data?.message || "Error creating habit");
        }
    };


    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">

            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl scale-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Habit</h2>

                <form onSubmit={handleCreateHabit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Habit Name</label>

                        <input 
                            required
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-gray-400 bg-gray-50 focus:bg-white"
                            placeholder="e.g. Use a reusable water bottle"
                            value={newHabit.name}
                            onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        
                        <textarea
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-gray-400 bg-gray-50 focus:bg-white resize-none h-24"
                            placeholder="Optional details..."
                            value={newHabit.description}
                            onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency</label>

                        <select
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-700"
                            value={newHabit.frequency}
                            onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="flex-1 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 rounded-xl shadow-md transition-all hover:shadow-lg"
                        >
                            Save Habit
                        </button>
                    </div>

                </form>

            </div>

        </div>
    );
};

export default CreateHabitModal;


