// pages/Admin/AdminCarbonLogs.tsx

import { useState, useEffect } from "react";
import { Leaf, Search, Car, Bus, Zap, Flame } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_API_URL;

type CarbonLog = {
    _id:                string;
    userId:             { firstName: string; lastName: string; email: string };
    date:               string;
    period:             string;
    privateTransportKm: number;
    vehicleFuelType:    string;
    busKm:              number;
    trainKm:            number;
    electricityKwh:     number;
    diet:               string;
    cookingFuel:        string;
    transportCO2:       number;
    energyCO2:          number;
    dietCO2:            number;
    cookingCO2:         number;
    totalCO2:           number;
};

const getCO2Color = (co2: number) => {
    if (co2 < 5)  return '#17921f';
    if (co2 < 15) return '#f59e0b';
    return '#ef4444';
};

const AdminCarbonLogs = () => {
    const [logs,       setLogs]       = useState<CarbonLog[]>([]);
    const [loading,    setLoading]    = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get(`${API_URL}/admin/carbon-logs`)
            .then(res => setLogs(res.data))
            .catch(() => toast.error("Failed to load carbon logs"))
            .finally(() => setLoading(false));
    }, []);

    const filtered = logs.filter(log => {
        const name = `${log.userId?.firstName || ''} ${log.userId?.lastName || ''}`.toLowerCase();
        return name.includes(searchTerm.toLowerCase()) ||
               (log.userId?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="p-6 pb-20 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <header className="pb-4 border-b border-gray-200">
                    <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
                        <Leaf size={30} style={{ color: '#17921f' }} /> Carbon Logs
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">All user carbon footprint records.</p>
                </header>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div className="relative w-72">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by user..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 bg-white"
                                style={{ focusRingColor: '#17921f' } as React.CSSProperties}
                            />
                        </div>
                        <span className="text-sm font-semibold text-gray-500">
                            {filtered.length} records
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-10 text-center text-gray-400">Loading...</div>
                        ) : filtered.length === 0 ? (
                            <div className="p-10 text-center text-gray-400">No carbon logs found.</div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                        <th className="p-4 font-semibold border-b border-gray-100">User</th>
                                        <th className="p-4 font-semibold border-b border-gray-100">Date</th>
                                        <th className="p-4 font-semibold border-b border-gray-100">Period</th>
                                        <th className="p-4 font-semibold border-b border-gray-100">Transport</th>
                                        <th className="p-4 font-semibold border-b border-gray-100">Energy</th>
                                        <th className="p-4 font-semibold border-b border-gray-100">Diet</th>
                                        <th className="p-4 font-semibold border-b border-gray-100">Total CO₂</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filtered.map(log => (
                                        <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <p className="font-bold text-gray-800 text-sm">
                                                    {log.userId?.firstName} {log.userId?.lastName}
                                                </p>
                                                <p className="text-xs text-gray-400">{log.userId?.email}</p>
                                            </td>
                                            <td className="p-4 text-sm text-gray-500">
                                                {new Date(log.date).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                                                    style={{ background: '#f0f7e6', color: '#17921f' }}>
                                                    {log.period}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                                                    {log.privateTransportKm > 0 && (
                                                        <span className="flex items-center gap-1">
                                                            <Car size={10} /> {log.privateTransportKm}km ({log.vehicleFuelType})
                                                        </span>
                                                    )}
                                                    {log.busKm > 0 && (
                                                        <span className="flex items-center gap-1">
                                                            <Bus size={10} /> {log.busKm}km bus
                                                        </span>
                                                    )}
                                                    <span className="font-semibold" style={{ color: '#17921f' }}>
                                                        {log.transportCO2.toFixed(2)} kg
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Zap size={10} /> {log.electricityKwh} kWh
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Flame size={10} /> {log.cookingFuel}
                                                    </span>
                                                    <span className="font-semibold" style={{ color: '#17921f' }}>
                                                        {(log.energyCO2 + log.cookingCO2).toFixed(2)} kg
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-xs text-gray-500 capitalize">{log.diet}</td>
                                            <td className="p-4">
                                                <span
                                                    className="text-lg font-black"
                                                    style={{ color: getCO2Color(log.totalCO2) }}
                                                >
                                                    {log.totalCO2.toFixed(1)}
                                                </span>
                                                <span className="text-xs text-gray-400 ml-1">kg</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCarbonLogs;
