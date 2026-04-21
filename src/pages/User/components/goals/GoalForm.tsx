// pages/User/components/goals/GoalForm.tsx

interface GoalFormProps {
    title:     string;
    date:      string;
    onTitle:   (v: string) => void;
    onDate:    (v: string) => void;
    onSubmit:  (e: React.FormEvent) => void;
    onCancel:  () => void;
}

const inputClass = "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all bg-white";

const GoalForm = ({ title, date, onTitle, onDate, onSubmit, onCancel }: GoalFormProps) => (
    <div className="rounded-2xl p-6 border mb-6" style={{ background: '#f0f7e6', borderColor: '#c5e3a0' }}>
        <h3 className="font-bold text-base mb-4" style={{ color: '#022202' }}>Create a New Goal</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#022202' }}>
                    Goal Title
                </label>

                <input
                    required
                    type="text"
                    value={title}
                    onChange={e => onTitle(e.target.value)}
                    placeholder="e.g. Reduce household waste by 50%"
                    className={inputClass}
                    style={{ borderColor: '#c5e3a0' }}
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
                    value={date}
                    onChange={e => onDate(e.target.value)}
                    className={inputClass}
                    style={{ borderColor: '#c5e3a0', color: '#022202' }}
                    onFocus={e  => (e.target.style.borderColor = '#508C12')}
                    onBlur={e   => (e.target.style.borderColor = '#c5e3a0')}
                />
            </div>

        </div>

        <div className="flex justify-end gap-3">
            <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-semibold rounded-xl border transition-colors"
                style={{ borderColor: '#c5e3a0', color: '#4a7c2f' }}
            >
                Cancel
            </button>

            <button
                onClick={onSubmit}
                className="px-6 py-2 text-sm font-bold text-white rounded-xl transition-all"
                style={{ background: '#508C12' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#3f7708')}
                onMouseLeave={e => (e.currentTarget.style.background = '#508C12')}
            >
                Save Goal
            </button>
            
        </div>
    </div>
);

export default GoalForm;
