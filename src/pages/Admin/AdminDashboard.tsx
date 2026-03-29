import { useState, useEffect } from "react";
import { Users, Activity, MessageSquare, Leaf, Search, Bell, MessageCircle, ArrowUp, ArrowDown } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import AdminCharts from "./components/AdminCharts";
import RecentUsersTable from "./components/RecentUsersTable";

axios.defaults.withCredentials = true;
const API_URL = "http://localhost:5000/api";

type Stats = {
  totalUsers: number;
  totalHabits: number;
  totalPosts: number;
  totalCO2Log: number;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/stats`);
      setStats(res.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load admin stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header matching DeskBoard */}
        <header className="flex justify-between items-center mb-10 border-b border-slate-200 pb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome Back, <span className="text-blue-600">Admin</span> 👋
          </h1>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Anything"
                className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-64 text-sm font-medium"
              />
            </div>
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
              <MessageCircle size={22} />
            </button>
            <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 ml-2 cursor-pointer bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:shadow-sm transition-shadow">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex justify-center items-center font-bold text-sm">
                A
              </div>
              <span className="text-sm font-bold text-slate-700 hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        {/* 4 KPI Cards (Customers, Revenue, Profit, Invoices analog) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative group transition-shadow hover:shadow-md">
            <div className="flex justify-between items-start mb-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full absolute left-0 top-6"></div>
              <p className="text-slate-500 font-semibold text-sm pl-2">Total Users</p>
              <div className="bg-blue-50 text-blue-600 p-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Users size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-800 pl-2 mb-2">{stats?.totalUsers || 0}</div>
            <p className="text-xs font-bold text-emerald-500 pl-2 flex items-center gap-1">
              <ArrowUp /> +12.5% <span className="text-slate-400 font-medium">Since last week</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative group transition-shadow hover:shadow-md">
            <div className="flex justify-between items-start mb-2">
              <div className="w-1 h-6 bg-emerald-500 rounded-full absolute left-0 top-6"></div>
              <p className="text-slate-500 font-semibold text-sm pl-2">Active Habits</p>
              <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Activity size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-800 pl-2 mb-2">{stats?.totalHabits || 0}</div>
            <p className="text-xs font-bold text-emerald-500 pl-2 flex items-center gap-1">
              <ArrowUp /> +8.2% <span className="text-slate-400 font-medium">Since last week</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative group transition-shadow hover:shadow-md">
            <div className="flex justify-between items-start mb-2">
              <div className="w-1 h-6 bg-purple-500 rounded-full absolute left-0 top-6"></div>
              <p className="text-slate-500 font-semibold text-sm pl-2">Community Posts</p>
              <div className="bg-purple-50 text-purple-600 p-2 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <MessageSquare size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-800 pl-2 mb-2">{stats?.totalPosts || 0}</div>
            <p className="text-xs font-bold text-red-500 pl-2 flex items-center gap-1">
              <ArrowDown /> -2.4% <span className="text-slate-400 font-medium">Since last week</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative group transition-shadow hover:shadow-md">
            <div className="flex justify-between items-start mb-2">
              <div className="w-1 h-6 bg-teal-500 rounded-full absolute left-0 top-6"></div>
              <p className="text-slate-500 font-semibold text-sm pl-2">CO₂ Logged</p>
              <div className="bg-teal-50 text-teal-600 p-2 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Leaf size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-800 pl-2 mb-2">{stats?.totalCO2Log || 0} <span className="text-sm text-slate-400">kg</span></div>
            <p className="text-xs font-bold text-emerald-500 pl-2 flex items-center gap-1">
              <ArrowUp /> +15.3% <span className="text-slate-400 font-medium">Since last week</span>
            </p>
          </div>

        </div>

        {/* Main Analytics Area (Donut Chart + Line Chart) */}
        <AdminCharts stats={stats} />

        {/* Data List (Recent Enrollments) */}
        <RecentUsersTable />

      </div>
    </div>
  );
};

export default AdminDashboard;