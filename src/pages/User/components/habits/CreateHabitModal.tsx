// pages/User/components/habits/CreateHabitModal.tsx

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import api from "../../../../services/api";
import toast from "react-hot-toast";


interface CreateHabitModalProps {
    onClose:   () => void;
    onSuccess: () => void;
}

const inputClass = "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-white";

const CreateHabitModal = ({ onClose, onSuccess }: CreateHabitModalProps) => {
    const [form,    setForm]    = useState({ name: '', description: '', frequency: 'daily', goalId: '' });
    const [goals,   setGoals]   = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get("/goals")
            .then(res => setGoals(res.data.filter((g: any) => g.status !== 'completed')))
            .catch(() => {});
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/habits", form);
            toast.success("Habit created!");
            onSuccess();
        } catch (error: unknown) {
            const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(msg || "Error creating habit");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(2,34,2,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

                {/* Header */}
                <div
                    className="px-6 py-5 flex items-center justify-between"
                    style={{ background: 'linear-gradient(135deg, #022202, #2d6a10)' }}
                >
                    <h2 className="font-bold text-white text-lg">Create New Habit</h2>
                    
                    <button
                        onClick={onClose}
                        className="text-white/70 hover:text-white p-1.5 rounded-lg transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#022202' }}>
                            Habit Name
                        </label>

                        <input
                            required
                            type="text"
                            placeholder="e.g. Use a reusable water bottle"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className={inputClass}
                            style={{ borderColor: '#c5e3a0' }}
                            onFocus={e  => (e.target.style.borderColor = '#508C12')}
                            onBlur={e   => (e.target.style.borderColor = '#c5e3a0')}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#022202' }}>
                            Description <span style={{ color: '#4a7c2f', fontWeight: 400 }}>(optional)</span>
                        </label>

                        <textarea
                            rows={3}
                            placeholder="Optional details about this habit..."
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            className={`${inputClass} resize-none`}
                            style={{ borderColor: '#c5e3a0' }}
                            onFocus={e  => (e.target.style.borderColor = '#508C12')}
                            onBlur={e   => (e.target.style.borderColor = '#c5e3a0')}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#022202' }}>
                            Frequency
                        </label>

                        <select
                            value={form.frequency}
                            onChange={e => setForm({ ...form, frequency: e.target.value })}
                            className={inputClass}
                            style={{ borderColor: '#c5e3a0', color: '#022202' }}
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>

                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#022202' }}>
                            Link to Goal <span style={{ color: '#4a7c2f', fontWeight: 400 }}>(optional)</span>
                        </label>

                        <select
                            value={form.goalId}
                            onChange={e => setForm({ ...form, goalId: e.target.value })}
                            className={inputClass}
                            style={{ borderColor: '#c5e3a0', color: '#022202' }}
                        >
                            <option value="">No Goal</option>
                            
                            {goals.map(g => (
                                <option key={g._id} value={g._id}>{g.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-colors"
                            style={{ borderColor: '#c5e3a0', color: '#4a7c2f' }}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
                            style={{ background: '#508C12' }}
                            onMouseEnter={e => !loading && (e.currentTarget.style.background = '#3f7708')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#508C12')}
                        >
                            {loading ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : 'Save Habit'}
                        </button>
                        
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateHabitModal;
