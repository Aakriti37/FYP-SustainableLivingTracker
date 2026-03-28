import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const DashboardCharts = () => {
    const [carbonData, setCarbonData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Fetch full history to show trends
                const res = await axios.get(`${API_URL}/carbon/history`);
                // Format data for Recharts (Show last 7 entries)
                const formatted = res.data
                    .map((item: any) => ({
                        date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                        co2: item.totalCO2,
                    }))
                    .reverse() // ensure chronological order
                    .slice(-7); // take last 7

                setCarbonData(formatted);
            } catch (error) {
                console.error("Failed to fetch history for charts", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
                <div className="bg-white p-6 rounded-3xl h-80 border border-gray-100"></div>
                <div className="bg-white p-6 rounded-3xl h-80 border border-gray-100"></div>
            </div>
        );
    }

    // Mock engagement data for the second chart 
    // Usually this would come from the backend counting daily habit logs
    const engagementData = [
        { day: 'Mon', habits: 3, points: 15 },
        { day: 'Tue', habits: 4, points: 20 },
        { day: 'Wed', habits: 2, points: 10 },
        { day: 'Thu', habits: 5, points: 25 },
        { day: 'Fri', habits: 4, points: 20 },
        { day: 'Sat', habits: 6, points: 30 },
        { day: 'Sun', habits: 7, points: 35 },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

            {/* Carbon Trend Chart */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Carbon Footprint Trend</h3>
                    <p className="text-sm text-gray-500">Your daily CO2 emissions over the past week (kg)</p>
                </div>

                {carbonData.length > 0 ? (
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={carbonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ color: '#047857', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="co2" name="CO2 (kg)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCo2)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p>No carbon data recorded yet</p>
                    </div>
                )}
            </div>

            {/* Engagement Chart */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Habit Engagement</h3>
                    <p className="text-sm text-gray-500">Your weekly habit activity and points earned</p>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                            <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <Tooltip
                                cursor={{ fill: '#f3f4f6' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar yAxisId="left" dataKey="habits" name="Habits Logged" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            <Bar yAxisId="right" dataKey="points" name="Points Earned" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default DashboardCharts;
