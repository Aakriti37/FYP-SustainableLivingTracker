import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AdminChartsProps {
    stats: {
        totalUsers: number;
        totalHabits: number;
        totalPosts: number;
        totalCO2Log: number;
    } | null;
}

const AdminCharts = ({ stats }: AdminChartsProps) => {
    // Mock Data for the Line Chart (Platform Analytics)
    const lineData = [
        { name: "Jan", users: 4000, activity: 2400 },
        { name: "Feb", users: 3000, activity: 1398 },
        { name: "Mar", users: 2000, activity: 9800 },
        { name: "Apr", users: 2780, activity: 3908 },
        { name: "May", users: 1890, activity: 4800 },
        { name: "Jun", users: 2390, activity: 3800 },
        { name: "Jul", users: 3490, activity: 4300 },
    ];

    // Data for the Donut Chart (Activity Distribution)
    const donutData = [
        { name: "Active Habits", value: stats?.totalHabits || 500, color: "#3b82f6" },
        { name: "Community Posts", value: stats?.totalPosts || 300, color: "#10b981" },
        { name: "Eco-Goals", value: Math.floor((stats?.totalHabits || 500) * 0.4), color: "#8b5cf6" },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

            {/* Donut Chart: Platform Activity */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Activity Split</h3>
                    <span className="text-xl text-slate-300">...</span>
                </div>
                <div className="h-64 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={donutData}
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {donutData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Centered Total */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-black text-slate-800">
                            {(stats?.totalHabits || 0) + (stats?.totalPosts || 0)}
                        </span>
                        <span className="text-sm font-semibold text-slate-400">Total Actions</span>
                    </div>
                </div>
                {/* Custom Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                    {donutData.map(item => (
                        <div key={item.name} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                            {item.name} <span className="text-slate-400 ml-1">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Line Chart: Platform Analytics */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Platform Analytics</h3>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-blue-600"></div> User Growth
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-emerald-600"></div> Activity
                        </div>
                    </div>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#94a3b8", fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#94a3b8", fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="users"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                                activeDot={{ r: 6, fill: "#3b82f6" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="activity"
                                stroke="#10b981"
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                                activeDot={{ r: 6, fill: "#10b981" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default AdminCharts;
