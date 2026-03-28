import { Calendar, Check } from "lucide-react";

export type Activity = {
    _id: string;
    habitId: { _id: string; name: string };
    date: string;
    pointsEarned: number;
};

interface RecentActivityProps {
    activities: Activity[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="text-teal-500" /> Recent Activity
            </h2>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {activities.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No activity yet. Complete a habit to see it here!
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {activities.slice(0, 10).map((log) => (
                            <div key={log._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
                                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
                                    <Check size={16} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{log.habitId?.name || "Deleted Habit"}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(log.date).toLocaleDateString()} at {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md text-sm">
                                    +{log.pointsEarned}
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
