// pages/Admin/AdminDashboard.tsx

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import AdminKPICards    from "./components/AdminKPICards";
import AdminCharts      from "./components/AdminCharts";
import RecentUsersTable from "./components/RecentUsersTable";
import { useAuth } from "../../context/AuthContext";


type Stats = {
    totalUsers:  number;
    totalHabits: number;
    totalPosts:  number;
    totalGoals:  number;
    totalCO2Log: number;
};

const AdminDashboard = () => {
    const [stats,   setStats]   = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        api.get("/admin/stats")
            .then(res => setStats(res.data))
            .catch(() => toast.error("Failed to load admin stats"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-6 pb-20 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <header className="flex justify-between items-end pb-4 border-b border-gray-200">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-800">
                            Welcome back, <span style={{ color: '#17921f' }}>{user?.firstName || 'Admin'}</span>
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">
                            Here's what's happening on your platform today.
                        </p>
                    </div>
                    {loading && <RefreshCw size={20} className="animate-spin text-gray-400" />}
                </header>

                {/* KPI Cards */}
                <AdminKPICards stats={stats} />

                {/* Charts */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Analytics</h2>
                    <AdminCharts />
                </div>

                {/* Recent Users */}
                <RecentUsersTable />
            </div>
        </div>
    );
};

export default AdminDashboard;
