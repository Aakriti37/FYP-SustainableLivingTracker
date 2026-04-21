// pages/User/CarbonCalculator.tsx

import { useState, useEffect } from "react";
import { Leaf, RefreshCw } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";

import CalculatorForm from "./components/carbon/CalculatorForm";
import ResultWidget from "./components/carbon/ResultWidget";
import HistoryList from "./components/carbon/HistoryList";

import type { CarbonLog, CarbonStats } from "../../types/carbon.types";


const CarbonCalculator = () => {
    const [latestLog, setLatestLog] = useState<CarbonLog | null>(null);
    const [history,   setHistory]   = useState<CarbonLog[]>([]);
    const [stats,     setStats]     = useState<CarbonStats | null>(null);
    const [loading,   setLoading]   = useState(true);

    const fetchAllData = async () => {
        setLoading(true);
        
        try {
            const [todayRes, historyRes, statsRes] = await Promise.all([
                api.get("/carbon/today"),
                api.get("/carbon/history"),
                api.get("/carbon/stats"),
            ]);

            setLatestLog(todayRes.data);
            setHistory(historyRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load carbon data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    return (
        <div className="p-8 pb-20 min-h-screen" style={{ background: '#f0f7e6' }}>
            <div className="max-w-6xl mx-auto">

                {/* ── Header ── */}
                <header className="flex justify-between items-end mb-8 pb-4 border-b" style={{ borderColor: '#c5e3a0' }}>
                    <div>
                        <h1
                            className="text-4xl font-extrabold pb-1 flex items-center gap-3"
                            style={{ color: '#022202' }}
                        >
                            <Leaf size={36} style={{ color: '#508C12' }} />
                            Carbon Calculator
                        </h1>

                        <p className="font-medium" style={{ color: '#4a7c2f' }}>
                            Track and calculate your carbon footprint using real emission factors.
                        </p>
                    </div>

                    {loading && <RefreshCw size={22} className="animate-spin" style={{ color: '#508C12' }} />}
                </header>

                {/* ── Main grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Left — Form */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border" style={{ borderColor: '#c5e3a0' }}>
                        <h2 className="text-xl font-bold mb-5" style={{ color: '#022202' }}>
                            Log Your Carbon Footprint
                        </h2>

                        <CalculatorForm onSuccess={fetchAllData} />
                    </div>

                    {/* Right — Results + History */}
                    <div className="space-y-6">
                        <ResultWidget todayLog={latestLog} stats={stats} />
                        
                        <HistoryList history={history} loading={loading} onRefresh={fetchAllData} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CarbonCalculator;
