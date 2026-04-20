// pages/User/components/habits/RecentActivity.tsx

import { Calendar, Check, Zap } from "lucide-react";

export type Activity = {
    _id:       string;
    habitId:   { _id: string; name: string };
    date:      string;
    pointsEarned: number;
};

interface RecentActivityProps {
    activities: Activity[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#022202' }}>
                <Calendar size={20} style={{ color: '#508C12' }} />
                Recent Activity
            </h2>

            <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor: '#c5e3a0' }}>
                {activities.length === 0 ? (
                    <div className="p-8 text-center" style={{ color: '#4a7c2f' }}>
                        <Zap size={36} className="mx-auto mb-3 opacity-30" style={{ color: '#508C12' }} />
                        <p className="font-medium text-sm">No activity yet.</p>
                        <p className="text-xs mt-1 opacity-70">Complete a habit to see it here!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-[#e8f5d0]">
                        {activities.slice(0, 10).map(log => (
                            <div
                                key={log._id}
                                className="p-4 flex items-center gap-3 transition-colors"
                                onMouseEnter={e => (e.currentTarget.style.background = '#f9fef5')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                            >
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                    style={{ background: '#f0f7e6', color: '#508C12' }}
                                >
                                    <Check size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate" style={{ color: '#022202' }}>
                                        {log.habitId?.name || "Deleted Habit"}
                                    </p>
                                    <p className="text-xs" style={{ color: '#4a7c2f' }}>
                                        {new Date(log.date).toLocaleDateString()} at{' '}
                                        {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div
                                    className="text-xs font-bold px-2.5 py-1 rounded-lg shrink-0"
                                    style={{ background: '#f0f7e6', color: '#508C12' }}
                                >
                                    +{log.pointsEarned} pts
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
