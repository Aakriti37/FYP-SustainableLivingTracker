import { Leaf, Info } from "lucide-react";
import type { CarbonLog } from "../../CarbonCalculator";

interface TodayResultWidgetProps {
    todayLog: CarbonLog | null;
}

const getCO2Color = (value: number) => {
    if (value < 5) return "text-emerald-500";
    if (value < 10) return "text-yellow-500";
    if (value < 15) return "text-orange-500";
    return "text-red-500";
};

const TodayResultWidget = ({ todayLog }: TodayResultWidgetProps) => {
    return (
        <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Leaf size={120} />
            </div>
            <h3 className="text-gray-400 font-semibold mb-2">Today's CO2 Footprint</h3>

            {todayLog ? (
                <div>
                    <div className="flex items-end gap-2 mb-4">
                        <span className={`text-6xl font-black ${getCO2Color(todayLog.totalCO2)} drop-shadow-md`}>
                            {todayLog.totalCO2}
                        </span>
                        <span className="text-gray-400 font-bold mb-2">kg CO₂e</span>
                    </div>

                    {todayLog.totalCO2 < 5 ? (
                        <div className="bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2 font-semibold">
                            <Leaf size={16} /> Eco-Warrior Status!
                        </div>
                    ) : (
                        <div className="bg-white/10 text-gray-300 px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2">
                            <Info size={16} /> Above optimal footprint.
                        </div>
                    )}
                </div>
            ) : (
                <div className="py-6">
                    <p className="text-gray-300">You haven't logged your footprint today.</p>
                    <p className="text-sm text-emerald-400 mt-2 font-medium">Use the calculator to track it!</p>
                </div>
            )}
        </div>
    );
};

export default TodayResultWidget;
