// pages/Admin/components/AdminCharts.tsx

import { useEffect, useState } from "react";
import {
    AreaChart, Area,
    BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import api from "../../../services/api";

const tooltipStyle = {
    borderRadius: '12px',
    border:       'none',
    boxShadow:    '0 4px 12px rgba(0,0,0,0.1)',
    fontSize:     '12px',
};

const AdminCharts = () => {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading,   setLoading]   = useState(true);

    useEffect(() => {
        api.get("/admin/analytics")
            .then(res => setAnalytics(res.data))
            .catch(err => console.error('Analytics error:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-gray-50 rounded-2xl h-64 border border-gray-100" />
                ))}
            </div>
        );
    }

    const EmptyState = ({ msg }: { msg: string }) => (
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
            {msg}
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── 1. User Growth ── */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                
                <h3 className="font-bold text-gray-800 mb-1">User Growth</h3>
                
                <p className="text-xs text-gray-400 mb-4">New registrations per month</p>
                
                {analytics?.userGrowth?.length > 0 ? (
                    <div className="h-52">
                        
                        <ResponsiveContainer width="100%" height="100%">
                        
                            <AreaChart data={analytics.userGrowth} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                
                                <Tooltip contentStyle={tooltipStyle} />
                                
                                <Area type="monotone" dataKey="users" name="New Users" stroke="#3b82f6" strokeWidth={3}
                                    fillOpacity={1} fill="url(#userGrad)"
                                    dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
                            
                            </AreaChart>
                        </ResponsiveContainer>

                    </div>
                ) : <EmptyState msg="No user growth data yet" />}
            </div>

            {/* ── 2. CO2 Trend ── */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                
                <h3 className="font-bold text-gray-800 mb-1">Platform CO₂ Trend</h3>
                
                <p className="text-xs text-gray-400 mb-4">Average CO₂ across all users (kg)</p>
                
                {analytics?.co2Trend?.length > 0 ? (
                    <div className="h-52">
                        
                        <ResponsiveContainer width="100%" height="100%">
                        
                            <AreaChart data={analytics.co2Trend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#17921f" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#17921f" stopOpacity={0}   />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                
                                <Tooltip contentStyle={tooltipStyle} />
                                
                                <Area type="monotone" dataKey="avgCO2" name="Avg CO₂ (kg)" stroke="#17921f" strokeWidth={3}
                                    fillOpacity={1} fill="url(#co2Grad)"
                                    dot={{ fill: '#17921f', r: 4 }} activeDot={{ r: 6 }} />
                            
                            </AreaChart>

                        </ResponsiveContainer>
                    </div>
                ) : <EmptyState msg="No carbon data logged yet" />}
            </div>

            {/* ── 3. Activity Split ── */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                
                <h3 className="font-bold text-gray-800 mb-1">Platform Activity</h3>
                
                <p className="text-xs text-gray-400 mb-4">Distribution of user activities</p>
                
                {analytics?.activitySplit?.some((d: any) => d.value > 0) ? (
                
                <div className="h-52">
                
                        <ResponsiveContainer width="100%" height="100%">
                
                            <PieChart>
                
                                <Pie data={analytics.activitySplit} cx="50%" cy="50%"
                                    innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                                    {analytics.activitySplit.map((entry: any, i: number) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                
                                <Tooltip contentStyle={tooltipStyle} />
                
                                <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
                
                            </PieChart>
                
                        </ResponsiveContainer>
                    </div>

                ) : <EmptyState msg="No activity data yet" />}
            </div>

            {/* ── 4. Top Habits ── */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                
                <h3 className="font-bold text-gray-800 mb-1">Most Popular Habits</h3>
                
                <p className="text-xs text-gray-400 mb-4">Habits tracked by most users</p>
                
                {analytics?.topHabits?.length > 0 ? (
                    
                    <div className="h-52">
                        
                        <ResponsiveContainer width="100%" height="100%">
                            
                            <BarChart data={analytics.topHabits} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                                
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                
                                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false}
                                    tick={{ fontSize: 11, fill: '#64748b' }} width={100} />
                                
                                <Tooltip contentStyle={tooltipStyle} />
                                
                                <Bar dataKey="count" name="Users" fill="#508C12" radius={[0, 4, 4, 0]} maxBarSize={24} />
                            </BarChart>

                        </ResponsiveContainer>
                    </div>
                    
                ) : <EmptyState msg="No habit data yet" />}
            </div>
        </div>
    );
};

export default AdminCharts;
