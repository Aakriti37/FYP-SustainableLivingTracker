import { useState } from "react";
import { Car, Bus, Zap, Utensils, Leaf, Flame } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import type { CarbonLog } from "../../CarbonCalculator";

const API_URL = "http://localhost:5000/api";

interface CalculatorFormProps {
    todayLog: CarbonLog | null;
    onSuccess: () => void;
}

const CalculatorForm = ({ todayLog, onSuccess }: CalculatorFormProps) => {
    const [transport, setTransport] = useState(0);
    const [publicTransport, setPublicTransport] = useState(0);
    const [energy, setEnergy] = useState(0);
    const [cookingFuel, setCookingFuel] = useState("LPG");
    const [diet, setDiet] = useState("balanced");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/carbon`, { transport, publicTransport, energy, cookingFuel, diet });
            toast.success("Carbon footprint logged for today!");
            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to log CO2");
        }
    };

    return (
        <div className={`bg-white rounded-3xl p-8 shadow-sm border border-gray-100 transition-all ${todayLog ? 'opacity-70 pointer-events-none grayscale-[0.3]' : ''}`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Log Daily Footprint</h2>
                {todayLog && (
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Leaf size={14} /> Logged Today
                    </span>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Transport */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Car size={18} /></div>
                        Transport (km)
                    </label>
                    <div className="flex gap-4 items-center">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            className="w-full accent-blue-500"
                            value={transport}
                            onChange={(e) => setTransport(Number(e.target.value))}
                            disabled={!!todayLog}
                        />
                        <span className="font-bold w-12 text-right text-lg">{transport}</span>
                    </div>
                    <p className="text-xs text-gray-400">Distance traveled by personal car or motorcycle.</p>
                </div>

                {/* Public Transport */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><Bus size={18} /></div>
                        Public Transport (km)
                    </label>
                    <div className="flex gap-4 items-center">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            className="w-full accent-indigo-500"
                            value={publicTransport}
                            onChange={(e) => setPublicTransport(Number(e.target.value))}
                            disabled={!!todayLog}
                        />
                        <span className="font-bold w-12 text-right text-lg">{publicTransport}</span>
                    </div>
                    <p className="text-xs text-gray-400">Distance traveled by bus, train, or subway.</p>
                </div>

                {/* Energy */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600"><Zap size={18} /></div>
                        Energy Usage (kWh)
                    </label>
                    <div className="flex gap-4 items-center">
                        <input
                            type="range"
                            min="0"
                            max="50"
                            className="w-full accent-yellow-500"
                            value={energy}
                            onChange={(e) => setEnergy(Number(e.target.value))}
                            disabled={!!todayLog}
                        />
                        <span className="font-bold w-12 text-right text-lg">{energy}</span>
                    </div>
                    <p className="text-xs text-gray-400">Estimated electricity consumed at home.</p>
                </div>

                {/* Cooking Fuel */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <div className="bg-red-100 p-2 rounded-lg text-red-600"><Flame size={18} /></div>
                        Cooking Fuel
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {['LPG', 'Wood', 'Electricity', 'Biogas', 'None'].map(f => (
                            <button
                                type="button"
                                key={f}
                                onClick={() => setCookingFuel(f)}
                                disabled={!!todayLog}
                                className={`py-2 rounded-xl border text-sm font-semibold transition-all ${cookingFuel === f
                                    ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Diet */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><Utensils size={18} /></div>
                        Diet Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {['vegan', 'vegetarian', 'balanced', 'meat-heavy'].map(d => (
                            <button
                                type="button"
                                key={d}
                                onClick={() => setDiet(d)}
                                disabled={!!todayLog}
                                className={`capitalize py-2.5 rounded-xl border text-sm font-semibold transition-all ${diet === d
                                    ? 'bg-green-500 text-white border-green-500 shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                                    }`}
                            >
                                {d.replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={!!todayLog}
                        className="w-full bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all hover:shadow-lg disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        Save Today's Footprint
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CalculatorForm;
