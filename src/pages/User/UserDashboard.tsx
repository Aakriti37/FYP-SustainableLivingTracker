import { useState, useEffect } from "react";
import { RefreshCw, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import KPICards from "./components/KPICards";
import DashboardCharts from "./components/DashboardCharts";
import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = "http://localhost:5000/api";


const UserDashboard = () => {
  const [habitsCount, setHabitsCount] = useState(0);
  const [todayCarbon, setTodayCarbon] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [goalsStats, setGoalsStats] = useState({ completed: 0, total: 0 });

  const fetchDashboardData = async () => {
    try {
      const [goalsRes, habitsRes, carbonRes] = await Promise.all([
        axios.get(`${API_URL}/goals`),
        axios.get(`${API_URL}/habits`),
        axios.get(`${API_URL}/carbon/today`),
      ]);
      setHabitsCount(habitsRes.data.length);
      setTodayCarbon(carbonRes.data?.totalCO2 || 0);
      setGoalsStats({
        completed: goalsRes.data.filter((g: any) => g.status === 'completed').length,
        total: goalsRes.data.length
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);


  return (
    <div className="p-8 pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 pb-2">
              Overview
            </h1>
            <p className="text-gray-500 font-medium">Welcome back! Here's your eco-progress at a glance.</p>
          </div>
          {loading && <RefreshCw className="animate-spin text-emerald-500" />}
        </header>

        <KPICards
          todayCarbon={todayCarbon}
          habitsCount={habitsCount}
          completedGoalsCount={goalsStats.completed}
          totalGoalsCount={goalsStats.total}
        />

        {/* Action Banner to new Goals page */}
        <Link to="/goals" className="block group">
          <div className="bg-linear-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
            <div className="z-10 text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-2xl font-bold mb-1">Check Your Active Eco-Goals</h3>
              <p className="text-emerald-50 opacity-90">Daily habits contribute to your big goals. Track your milestones and progress.</p>
            </div>
            <div className="z-10 flex items-center gap-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-bold transition-colors group-hover:scale-105">
              View Goals <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Charts Section */}
        <DashboardCharts />
      </div>
    </div>
  );
};

export default UserDashboard;