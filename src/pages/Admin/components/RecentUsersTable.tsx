import { useState, useEffect } from "react";
import axios from "axios";
import { Filter } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

type User = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    role?: string;
};

const RecentUsersTable = () => {
    const [recentUsers, setRecentUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${API_URL}/admin/users`);
                // Assume sort by newest first and grab top 5
                const sorted = res.data.sort((a: User, b: User) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setRecentUsers(sorted.slice(0, 6));
            } catch (error) {
                console.error("Failed to fetch recent users", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mt-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Recent Users Registration</h3>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
                    <Filter size={16} /> Filter
                </button>
            </div>

            <div className="overflow-x-auto">
                {loading ? (
                    <div className="py-12 flex justify-center">
                        <div className="animate-pulse flex space-x-4 w-full px-6">
                            <div className="flex-1 space-y-4 py-1">
                                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-slate-200 rounded"></div>
                                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                <th className="pb-3 px-4 w-12 text-center">No</th>
                                <th className="pb-3 px-4">User ID</th>
                                <th className="pb-3 px-4">Customer Name</th>
                                <th className="pb-3 px-4">Email Address</th>
                                <th className="pb-3 px-4">Join Date</th>
                                <th className="pb-3 px-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {recentUsers.map((user, index) => (
                                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-4 text-center text-slate-500 font-medium">{index + 1}</td>
                                    <td className="py-4 px-4 text-blue-600 font-semibold text-xs">#{user._id.substring(user._id.length - 6).toUpperCase()}</td>
                                    <td className="py-4 px-4 font-bold text-slate-800 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                        </div>
                                        {user.firstName} {user.lastName}
                                    </td>
                                    <td className="py-4 px-4 text-slate-500">{user.email}</td>
                                    <td className="py-4 px-4 text-slate-500">{new Date(user.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                    <td className="py-4 px-4 text-center">
                                        <span className="bg-emerald-50 text-emerald-600 font-bold px-3 py-1 rounded-full text-xs">
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default RecentUsersTable;
