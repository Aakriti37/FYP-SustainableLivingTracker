import { useState, useEffect } from "react";
import { Leaf } from "lucide-react";
import axios from "axios";
import CalculatorForm from "./components/carbon/CalculatorForm";
import TodayResultWidget from "./components/carbon/TodayResultWidget";
import HistoryList from "./components/carbon/HistoryList";
const API_URL = "http://localhost:5000/api";

export type CarbonLog = {
    _id: string;
    date: string;
    transport: number;
    publicTransport: number;
    energy: number;
    cookingFuel: string;
    diet: string;
    totalCO2: number;
};

const CarbonCalculator = () => {

    const [todayLog, setTodayLog] = useState<CarbonLog | null>(null);
    const [history, setHistory] = useState<CarbonLog[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCarbonData = async () => {
        try {
            const [todayRes, historyRes] = await Promise.all([
                axios.get(`${API_URL}/carbon/today`),
                axios.get(`${API_URL}/carbon/history`)
            ]);
            setTodayLog(todayRes.data);
            setHistory(historyRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCarbonData();
    }, []);


    return (
        <div className="p-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <header className="mb-8 border-b pb-4 border-gray-200">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 pb-2 flex items-center gap-3">
                        <Leaf className="text-green-500" size={36} /> Carbon Calculator
                    </h1>
                    <p className="text-gray-500 font-medium text-lg">Calculate and monitor your daily CO2 footprint.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Calculator Card */}
                    <CalculatorForm todayLog={todayLog} onSuccess={fetchCarbonData} />

                    {/* Results & History Card */}
                    <div className="space-y-6">
                        <TodayResultWidget todayLog={todayLog} />
                        <HistoryList history={history} loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarbonCalculator;
