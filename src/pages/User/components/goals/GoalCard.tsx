// pages/User/components/goals/GoalCard.tsx

import { Target, Clock, Award, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";

interface GoalCardProps {
    goal: {
        _id:        string;
        title:      string;
        targetDate: string;
        status:     string;
        progress?:  number;
    };
    onToggleStatus: (id: string, status: string) => void;
    onDelete:       (id: string) => void;
}

const GoalCard = ({ goal, onToggleStatus, onDelete }: GoalCardProps) => {
    const isCompleted = goal.status === 'completed';
    const isFailed    = goal.status === 'failed';
    const progress    = goal.progress || 0;

    const daysLeft = Math.ceil(
        (new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    const getStatusStyle = () => {
        if (isCompleted) return { bg: '#f0f7e6', border: '#c5e3a0', text: '#17921f' };
        if (isFailed)    return { bg: '#fef2f2', border: '#fecaca', text: '#ef4444' };
        if (daysLeft <= 3) return { bg: '#fffbeb', border: '#fde68a', text: '#d97706' };
        return { bg: 'white', border: '#e8f5d0', text: '#022202' };
    };

    const style = getStatusStyle();

    return (
        <div
            className="relative flex flex-col p-6 rounded-3xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            style={{ background: style.bg, borderColor: style.border }}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div
                    className="p-2.5 rounded-xl"
                    style={{ background: isCompleted ? '#d4edaa' : isFailed ? '#fee2e2' : '#f0f7e6' }}
                >
                    {isCompleted
                        ? <Award size={22} style={{ color: '#17921f' }} />
                        : isFailed
                        ? <AlertTriangle size={22} style={{ color: '#ef4444' }} />
                        : <Target size={22} style={{ color: '#508C12' }} />
                    }
                </div>
                <button
                    onClick={() => onDelete(goal._id)}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: '#c5e3a0' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#c5e3a0')}
                >
                    <Trash2 size={15} />
                </button>
            </div>

            {/* Title */}
            <h3
                className="font-bold text-lg mb-2 line-clamp-2 flex-1"
                style={{ color: style.text }}
            >
                {goal.title}
            </h3>

            {/* Date + days left */}
            <div className="flex items-center gap-2 mb-4 text-sm">
                <Clock size={14} style={{ color: '#4a7c2f' }} />
                <span style={{ color: '#4a7c2f' }}>
                    {isCompleted
                        ? 'Completed'
                        : isFailed
                        ? 'Deadline passed'
                        : daysLeft <= 0
                        ? 'Due today!'
                        : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`
                    }
                </span>
                <span
                    className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: '#f0f7e6', color: '#4a7c2f' }}
                >
                    {new Date(goal.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
            </div>

            {/* Progress bar */}
            <div className="mt-auto">
                <div className="flex justify-between text-sm font-bold mb-1.5">
                    <span style={{ color: '#4a7c2f' }}>Progress</span>
                    <span style={{ color: '#508C12' }}>{progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full overflow-hidden mb-4" style={{ background: '#e8f5d0' }}>
                    <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                            width:      `${progress}%`,
                            background: isCompleted ? '#17921f' : isFailed ? '#ef4444' : 'linear-gradient(to right, #508C12, #5cbd36)',
                        }}
                    />
                </div>

                {/* Action button */}
                {!isFailed && (
                    <button
                        onClick={() => onToggleStatus(goal._id, goal.status)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all"
                        style={{
                            background:  isCompleted ? '#f0f7e6' : 'white',
                            color:       isCompleted ? '#17921f' : '#508C12',
                            border:      `1px solid ${isCompleted ? '#c5e3a0' : '#c5e3a0'}`,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f0f7e6')}
                        onMouseLeave={e => (e.currentTarget.style.background = isCompleted ? '#f0f7e6' : 'white')}
                    >
                        <CheckCircle2 size={16} />
                        {isCompleted ? 'Mark as In-Progress' : 'Mark as Completed'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default GoalCard;
