// pages/User/components/Carbon/ResultWidget.tsx

import { Leaf, TrendingUp, BarChart3, AlertCircle, CheckCircle } from "lucide-react";
import type { CarbonLog, CarbonStats } from "../../../../types/carbon.types";

interface ResultWidgetProps {
    todayLog: CarbonLog | null;
    stats:    CarbonStats | null;
}

const getEmissionStatus = (co2: number, period: string) => {
    // WHO / global average daily target: ~5 kg CO2e/day
    const daily = period === 'weekly' ? co2 / 7 : period === 'monthly' ? co2 / 30 : co2;
    
    if (daily < 4)  return { label: 'Eco Warrior',    color: '#5cbd36', bg: 'rgba(92,189,54,0.15)'  };
    if (daily < 7)  return { label: 'Below Average',  color: '#559807', bg: 'rgba(85,152,7,0.15)'   };
    if (daily < 12) return { label: 'Above Average',  color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' };
    return              { label: 'High Emitter',   color: '#ef4444', bg: 'rgba(239,68,68,0.15)'  };
};

const ResultWidget = ({ todayLog, stats }: ResultWidgetProps) => {
    const status = todayLog ? getEmissionStatus(todayLog.totalCO2, todayLog.period) : null;

    return (
        <div className="space-y-4">

            {/* ── Latest log result ── */}
            <div
                className="rounded-3xl p-6 relative overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #022202 0%, #1a3d0a 60%, #2d6a10 100%)' }}
            >
                <div className="absolute top-4 right-4 opacity-5">
                    <Leaf size={100} />
                </div>

                <p className="text-sm font-semibold mb-1" style={{ color: '#a8d080' }}>
                    Latest Carbon Log
                </p>

                {todayLog ? (
                    <>
                        <div className="flex items-end gap-2 mb-3">
                            <span className="text-5xl font-black" style={{ color: status?.color }}>
                                {todayLog.totalCO2.toFixed(1)}
                            </span>

                            <span className="text-sm font-bold mb-1.5" style={{ color: '#a8d080' }}>
                                kg CO₂e / {todayLog.period}
                            </span>
                        </div>

                        {/* Status badge */}
                        <div
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
                            style={{ background: status?.bg, color: status?.color }}
                        >
                            {(status?.label === 'Eco Warrior' || status?.label === 'Below Average')
                                ? <CheckCircle size={13} />
                                : <AlertCircle size={13} />
                            }

                            {status?.label}
                        </div>

                    </>
                ) : (
                    <div className="py-4">
                        <p className="font-medium" style={{ color: '#a8d080' }}>
                            No carbon log yet.
                        </p>

                        <p className="text-sm mt-1" style={{ color: 'rgba(168,208,128,0.6)' }}>
                            Fill in the form and calculate your footprint!
                        </p>
                    </div>
                )}
            </div>

            {/* ── Total stats row ── */}
            {stats && (
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: 'Total CO₂',  value: `${stats.totalCO2.toFixed(1)} kg`, icon: <TrendingUp size={16} /> },
                        { label: 'Total Logs', value: stats.totalLogs,                    icon: <BarChart3   size={16} /> },
                        
                    ].map(stat => (
                        <div
                            key={stat.label}
                            className="rounded-2xl p-4 text-center border"
                            style={{ background: '#f0f7e6', borderColor: '#c5e3a0' }}
                        >
                            <div className="flex justify-center mb-1" style={{ color: '#508C12' }}>
                                {stat.icon}
                            </div>

                            <p className="text-lg font-black" style={{ color: '#022202' }}>{stat.value}</p>
                            
                            <p className="text-xs font-medium" style={{ color: '#4a7c2f' }}>{stat.label}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResultWidget;
