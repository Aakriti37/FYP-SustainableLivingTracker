// pages/User/UserDashboard.tsx

import { useState, useEffect } from "react";
import { RefreshCw, ArrowRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

import KPICards       from "./components/dashboard/KPICards";
import DashboardCharts from "./components/dashboard/DashboardCharts";
import GoalsSection   from "./components/dashboard/GoalsSection";

axios.defaults.withCredentials = true;
const API_URL = "http://localhost:5000/api";

const UserDashboard = () => {
    const { user }   = useAuth();
    const [loading,  setLoading]  = useState(true);
    const [data,     setData]     = useState({
        totalCO2:            0,
        habitsCount:         0,
        ecoPoints:           0,
        completedGoals:      0,
        totalGoals:          0,
        goals:               [] as any[],
    });

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [goalsRes, habitsRes, carbonStatsRes, activityRes] = await Promise.all([
                axios.get(`${API_URL}/goals`),
                axios.get(`${API_URL}/habits`),
                axios.get(`${API_URL}/carbon/stats`),
                axios.get(`${API_URL}/habits/activities/recent`),
            ]);

            const habits     = habitsRes.data;
            const goals      = goalsRes.data;
            const totalPoints = activityRes.data.reduce((s: number, a: any) => s + a.pointsEarned, 0);

            setData({
                totalCO2:       carbonStatsRes.data.totalCO2 || 0,
                habitsCount:    habits.length,
                ecoPoints:      totalPoints,
                completedGoals: goals.filter((g: any) => g.status === 'completed').length,
                totalGoals:     goals.length,
                goals,
            });
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <div className="p-6 pb-20 min-h-screen" style={{ background: '#f0f7e6' }}>
            <div className="max-w-6xl mx-auto space-y-6">

                {/* ── Header ── */}
                <header className="flex justify-between items-end pb-4 border-b" style={{ borderColor: '#c5e3a0' }}>
                    <div>
                        <h1 className="text-4xl font-extrabold pb-1 flex items-center gap-3" style={{ color: '#022202' }}>
                            <Leaf size={34} style={{ color: '#508C12' }} />
                            Overview
                        </h1>
                        <p className="font-medium" style={{ color: '#4a7c2f' }}>
                            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}! Here's your eco-progress at a glance.
                        </p>
                    </div>
                    {loading && <RefreshCw size={22} className="animate-spin" style={{ color: '#508C12' }} />}
                </header>

                {/* ── KPI Cards ── */}
                <KPICards
                    totalCO2={data.totalCO2}
                    habitsCount={data.habitsCount}
                    completedGoalsCount={data.completedGoals}
                    totalGoalsCount={data.totalGoals}
                    ecoPoints={data.ecoPoints}
                />

                {/* ── Action Banner ── */}
                <Link to="/eco-suggestions" className="block group">
                    <div
                        className="rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #022202, #17921f)' }}
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/4 opacity-10"
                            style={{ background: 'white' }} />
                        <div className="z-10 text-center md:text-left mb-4 md:mb-0">
                            <h3 className="text-2xl font-bold mb-1">Get AI Eco Suggestions</h3>
                            <p className="text-sm opacity-80" style={{ color: '#a8d080' }}>
                                Our AI analyses your habits, goals and carbon data to give you personalised eco tips.
                            </p>
                        </div>
                        <div
                            className="z-10 flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all group-hover:scale-105"
                            style={{ background: 'rgba(255,255,255,0.15)' }}
                        >
                            View Suggestions
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

                {/* ── Charts ── */}
                <div>
                    <h2 className="text-xl font-bold mb-4" style={{ color: '#022202' }}>Analytics</h2>
                    <DashboardCharts />
                </div>

                {/* ── Goals Section ── */}
                <GoalsSection
                    goals={data.goals}
                    loading={loading}
                    onGoalChange={fetchDashboardData}
                />

            </div>
        </div>
    );
};

export default UserDashboard;
