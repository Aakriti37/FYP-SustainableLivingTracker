// pages/User/components/DashboardCharts.tsx
// All charts use real backend data — no mock data

import { useState, useEffect } from "react";
import {
    AreaChart, Area,
    BarChart, Bar,
    PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

import api from "../../../../services/api";

// Color palette 
// const GREEN_COLORS = ['#17921f', '#508C12', '#5cbd36', '#a8d080', '#d4edaa'];

const chartCardStyle = {
    background: 'white',
    borderRadius: '1.5rem',
    padding: '1.5rem',
    border: '1px solid #c5e3a0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
};

const tooltipStyle = {
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 4px 12px rgba(2,34,2,0.15)',
    fontSize: '12px',
};

// Skeleton loader 
const ChartSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="rounded-3xl h-72 border" style={{ background: '#f0f7e6', borderColor: '#c5e3a0' }} />
        ))}
    </div>
);

const DashboardCharts = () => {
    const [carbonTrend,   setCarbonTrend]   = useState<any[]>([]);
    const [activityData,  setActivityData]  = useState<any[]>([]);
    const [goalsData,     setGoalsData]     = useState<any[]>([]);
    const [breakdownData, setBreakdownData] = useState<any[]>([]);
    const [loading,       setLoading]       = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [carbonRes, goalsRes, activityRes] = await Promise.all([
                    api.get("/carbon/history"),
                    // axios.get(`${API_URL}/habits`),
                    api.get("/goals"),
                    api.get("/habits/activities/recent"),
                ]);

                // 1. Carbon footprint trend (last 7 logs) 
                const trend = carbonRes.data
                    .slice(0, 7)
                    .reverse()
                    .map((item: any) => ({
                        date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                        co2:  parseFloat(item.totalCO2.toFixed(1)),
                    }));
                setCarbonTrend(trend);

                // 2. CO2 breakdown (avg across all logs) 
                const logs = carbonRes.data;
                if (logs.length > 0) {
                    const avg = (key: string) =>
                        parseFloat((logs.reduce((s: number, l: any) => s + (l[key] || 0), 0) / logs.length).toFixed(2));

                    setBreakdownData([
                        { name: 'Transport', value: avg('transportCO2'), color: '#17921f' },
                        { name: 'Diet',      value: avg('dietCO2'),      color: '#508C12' },
                        { name: 'Cooking',   value: avg('cookingCO2'),   color: '#5cbd36' },
                        { name: 'Energy',    value: avg('energyCO2'),    color: '#a8d080' },
                    ]);
                }

                // 3. Habit completion rate 
                // const habits = habitsRes.data;
                // const completedToday = habits.filter((h: any) => h.completedToday).length;
                // const notCompleted   = habits.length - completedToday;

                

                // Activity logs → group by date for weekly bar chart
                const last7Days = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
                });

                const activityByDay: Record<string, number> = {};
                activityRes.data.forEach((log: any) => {
                    const day = new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
                    activityByDay[day] = (activityByDay[day] || 0) + 1;
                });

                setActivityData(last7Days.map(day => ({
                    day:     day.split(',')[0], // just weekday
                    habits:  activityByDay[day] || 0,
                    points:  (activityByDay[day] || 0) * 10,
                })));

                // ── 4. Goals progress ─────────────────────────────────────────
                const goals = goalsRes.data;
                setGoalsData([
                    { name: 'Completed',   value: goals.filter((g: any) => g.status === 'completed').length,   color: '#17921f' },
                    { name: 'In Progress', value: goals.filter((g: any) => g.status === 'in-progress').length, color: '#508C12' },
                    { name: 'Failed',      value: goals.filter((g: any) => g.status === 'failed').length,      color: '#c5e3a0' },
                ]);

            } catch (error) {
                console.error("Failed to fetch dashboard chart data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    if (loading) return <ChartSkeleton />;

    const EmptyState = ({ message }: { message: string }) => (
        <div
            className="h-56 flex items-center justify-center rounded-2xl border border-dashed"
            style={{ background: '#f0f7e6', borderColor: '#c5e3a0', color: '#4a7c2f' }}
        >
            <p className="text-sm font-medium">{message}</p>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── 1. Carbon Footprint Trend ── */}
            <div style={chartCardStyle}>
                <div className="mb-5">
                    <h3 className="text-lg font-bold" style={{ color: '#022202' }}>Carbon Footprint Trend</h3>
                    <p className="text-sm" style={{ color: '#4a7c2f' }}>Your CO₂ emissions from recent logs (kg)</p>
                </div>
                {carbonTrend.length > 0 ? (
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={carbonTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#17921f" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#17921f" stopOpacity={0}   />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8f5d0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#4a7c2f' }} dy={8} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#4a7c2f' }} />
                                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#17921f', fontWeight: 'bold' }} />
                                <Area
                                    type="monotone"
                                    dataKey="co2"
                                    name="CO₂ (kg)"
                                    stroke="#17921f"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#co2Gradient)"
                                    dot={{ fill: '#17921f', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, fill: '#022202' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <EmptyState message="No carbon data recorded yet. Start logging!" />
                )}
            </div>

            {/* ── 2. CO2 Breakdown Pie Chart ── */}
            <div style={chartCardStyle}>
                <div className="mb-5">
                    <h3 className="text-lg font-bold" style={{ color: '#022202' }}>CO₂ Breakdown</h3>
                    <p className="text-sm" style={{ color: '#4a7c2f' }}>Average CO₂ by category (kg per log)</p>
                </div>
                {breakdownData.length > 0 && breakdownData.some(d => d.value > 0) ? (
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={breakdownData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {breakdownData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <PieTooltip
                                    contentStyle={tooltipStyle}
                                    formatter={(value) => [`${value} kg`, '']}
                                />
                                <PieLegend
                                    iconType="circle"
                                    iconSize={10}
                                    wrapperStyle={{ fontSize: '12px', color: '#4a7c2f' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <EmptyState message="No carbon breakdown data yet." />
                )}
            </div>

            {/* ── 3. Habit Activity (last 7 days — real data) ── */}
            <div style={chartCardStyle}>
                <div className="mb-5">
                    <h3 className="text-lg font-bold" style={{ color: '#022202' }}>Habit Activity</h3>
                    <p className="text-sm" style={{ color: '#4a7c2f' }}>Habits logged and points earned this week</p>
                </div>
                {activityData.some(d => d.habits > 0) ? (
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8f5d0" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#4a7c2f' }} dy={8} />
                                <YAxis yAxisId="left"  orientation="left"  axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#4a7c2f' }} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#4a7c2f' }} />
                                <Tooltip
                                    cursor={{ fill: '#f0f7e6' }}
                                    contentStyle={tooltipStyle}
                                />
                                <PieLegend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '12px', color: '#4a7c2f' }} />
                                <Bar yAxisId="left"  dataKey="habits" name="Habits Logged" fill="#17921f" radius={[4, 4, 0, 0]} maxBarSize={36} />
                                <Bar yAxisId="right" dataKey="points" name="Points Earned" fill="#5cbd36" radius={[4, 4, 0, 0]} maxBarSize={36} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <EmptyState message="No habit activity this week. Start logging habits!" />
                )}
            </div>

            {/* ── 4. Goals Progress ── */}
            <div style={chartCardStyle}>
                <div className="mb-5">
                    <h3 className="text-lg font-bold" style={{ color: '#022202' }}>Goals Progress</h3>
                    <p className="text-sm" style={{ color: '#4a7c2f' }}>Overview of your eco goals status</p>
                </div>
                {goalsData.some(d => d.value > 0) ? (
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={goalsData.filter(d => d.value > 0)}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={85}
                                    paddingAngle={3}
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                    labelLine={false}
                                >
                                    {goalsData.filter(d => d.value > 0).map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <PieTooltip contentStyle={tooltipStyle} />
                                <PieLegend
                                    iconType="circle"
                                    iconSize={10}
                                    wrapperStyle={{ fontSize: '12px', color: '#4a7c2f' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <EmptyState message="No goals set yet. Create your first eco goal!" />
                )}
            </div>
        </div>
    );
};

export default DashboardCharts;
