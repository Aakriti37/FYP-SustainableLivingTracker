// pages/User/components/Carbon/CalculatorForm.tsx

import { useState } from "react";
import { Car, Bus, Train, Zap, Utensils, Flame, CalendarDays, Loader2, Leaf } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import type { CarbonFormData } from "../../../../types/carbon.types";

axios.defaults.withCredentials = true;
const API_URL = "http://localhost:5000/api";

// ── Styling helpers ───────────────────────────────────────────────────────────
const inputClass = `
    w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all
    bg-white
`;

const labelClass = "block text-sm font-semibold mb-1.5";

const sectionClass = `
    bg-white rounded-2xl p-5 border
`;

interface CalculatorFormProps {
    onSuccess: () => void;
}

const PERIOD_OPTIONS = [
    { value: 'daily',   label: 'Daily',   desc: 'Logging for today only' },
    { value: 'weekly',  label: 'Weekly',  desc: 'Logging for this week (7 days)' },
    { value: 'monthly', label: 'Monthly', desc: 'Logging for this month (30 days)' },
];

const FUEL_TYPE_OPTIONS = [
    { value: 'none',       label: 'No private vehicle' },
    { value: 'petrol',     label: 'Petrol'             },
    { value: 'diesel',     label: 'Diesel'             },
    { value: 'hybrid',     label: 'Hybrid'             },
    { value: 'electric',   label: 'Electric'           },
    { value: 'motorcycle', label: 'Motorcycle (Petrol)'},
];

const DIET_OPTIONS = [
    { value: 'vegan',       label: 'Vegan',        desc: '2.89 kg CO₂e/day' },
    { value: 'vegetarian',  label: 'Vegetarian',   desc: '3.81 kg CO₂e/day' },
    { value: 'pescatarian', label: 'Pescatarian',  desc: '3.91 kg CO₂e/day' },
    { value: 'balanced',    label: 'Balanced',     desc: '5.63 kg CO₂e/day' },
    { value: 'meat-heavy',  label: 'Meat Heavy',   desc: '7.19 kg CO₂e/day' },
];

const COOKING_FUEL_OPTIONS = [
    { value: 'LPG',         label: 'LPG Gas'     },
    { value: 'Wood',        label: 'Wood/Firewood'},
    { value: 'Electricity', label: 'Electricity'  },
    { value: 'Biogas',      label: 'Biogas'       },
    { value: 'None',        label: 'None'         },
];

const CalculatorForm = ({ onSuccess }: CalculatorFormProps) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<CarbonFormData>({
        period:             'daily',
        privateTransportKm: 0,
        vehicleFuelType:    'none',
        busKm:              0,
        trainKm:            0,
        electricityKwh:     0,
        diet:               'balanced',
        cookingFuel:        'LPG',
        cookingHoursPerDay: 1,
    });

    const update = (field: keyof CarbonFormData, value: string | number) =>
        setForm(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/carbon`, form);
            toast.success(`Carbon footprint logged for ${form.period} period!`);
            setForm({
                period:             'daily',
                privateTransportKm: 0,
                vehicleFuelType:    'none',
                busKm:              0,
                trainKm:            0,
                electricityKwh:     0,
                diet:               'balanced',
                cookingFuel:        'LPG',
                cookingHoursPerDay: 1,
            });
            onSuccess();
        } catch (error: unknown) {
            const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(msg || "Failed to log carbon footprint.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            {/* ── Period selector ── */}
            <div className={sectionClass} style={{ borderColor: '#c5e3a0' }}>
                <label className={labelClass} style={{ color: '#022202' }}>
                    <CalendarDays size={16} className="inline mr-2" style={{ color: '#508C12' }} />
                    Logging Period
                </label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                    {PERIOD_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => update('period', opt.value)}
                            className="p-3 rounded-xl border text-sm font-semibold text-center transition-all"
                            style={{
                                background:  form.period === opt.value ? '#508C12' : '#f0f7e6',
                                color:       form.period === opt.value ? 'white'   : '#2d6a10',
                                borderColor: form.period === opt.value ? '#508C12' : '#c5e3a0',
                            }}
                        >
                            <p className="font-bold">{opt.label}</p>
                            <p className="text-xs opacity-80 mt-0.5 hidden sm:block">{opt.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Transport ── */}
            <div className={sectionClass} style={{ borderColor: '#c5e3a0' }}>
                <h3 className="font-bold text-base mb-4 flex items-center gap-2" style={{ color: '#022202' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#d4edaa' }}>
                        <Car size={16} style={{ color: '#2d6a10' }} />
                    </div>
                    Transport
                </h3>

                <div className="space-y-4">
                    {/* Private vehicle */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass} style={{ color: '#2d6a10' }}>
                                Vehicle Type / Fuel
                            </label>
                            <select
                                value={form.vehicleFuelType}
                                onChange={e => update('vehicleFuelType', e.target.value)}
                                className={inputClass}
                                style={{ borderColor: '#c5e3a0' }}
                            >
                                {FUEL_TYPE_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass} style={{ color: '#2d6a10' }}>
                                Private Transport Distance (km)
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="e.g. 25"
                                value={form.privateTransportKm || ''}
                                onChange={e => update('privateTransportKm', Number(e.target.value))}
                                disabled={form.vehicleFuelType === 'none'}
                                className={inputClass}
                                style={{ borderColor: '#c5e3a0', opacity: form.vehicleFuelType === 'none' ? 0.5 : 1 }}
                            />
                        </div>
                    </div>

                    {/* Public transport */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass} style={{ color: '#2d6a10' }}>
                                <Bus size={13} className="inline mr-1" /> Bus Distance (km)
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="e.g. 10"
                                value={form.busKm || ''}
                                onChange={e => update('busKm', Number(e.target.value))}
                                className={inputClass}
                                style={{ borderColor: '#c5e3a0' }}
                            />
                        </div>
                        <div>
                            <label className={labelClass} style={{ color: '#2d6a10' }}>
                                <Train size={13} className="inline mr-1" /> Train Distance (km)
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="e.g. 5"
                                value={form.trainKm || ''}
                                onChange={e => update('trainKm', Number(e.target.value))}
                                className={inputClass}
                                style={{ borderColor: '#c5e3a0' }}
                            />
                        </div>
                    </div>
                    <p className="text-xs" style={{ color: '#4a7c2f' }}>
                        Enter total km for your selected period ({form.period})
                    </p>
                </div>
            </div>

            {/* ── Energy ── */}
            <div className={sectionClass} style={{ borderColor: '#c5e3a0' }}>
                <h3 className="font-bold text-base mb-4 flex items-center gap-2" style={{ color: '#022202' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#d4edaa' }}>
                        <Zap size={16} style={{ color: '#2d6a10' }} />
                    </div>
                    Electricity Usage
                </h3>
                <div>
                    <label className={labelClass} style={{ color: '#2d6a10' }}>
                        Electricity consumed (kWh)
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="e.g. 8.5"
                        value={form.electricityKwh || ''}
                        onChange={e => update('electricityKwh', Number(e.target.value))}
                        className={inputClass}
                        style={{ borderColor: '#c5e3a0' }}
                    />
                    <p className="text-xs mt-1.5" style={{ color: '#4a7c2f' }}>
                        Nepal grid: 0.041 kg CO₂e/kWh (96% hydropower). Check your electricity meter or bill.
                    </p>
                </div>
            </div>

            {/* ── Diet ── */}
            <div className={sectionClass} style={{ borderColor: '#c5e3a0' }}>
                <h3 className="font-bold text-base mb-4 flex items-center gap-2" style={{ color: '#022202' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#d4edaa' }}>
                        <Utensils size={16} style={{ color: '#2d6a10' }} />
                    </div>
                    Diet Type
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DIET_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => update('diet', opt.value)}
                            className="flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all text-left"
                            style={{
                                background:  form.diet === opt.value ? '#508C12' : '#f0f7e6',
                                color:       form.diet === opt.value ? 'white'   : '#2d6a10',
                                borderColor: form.diet === opt.value ? '#508C12' : '#c5e3a0',
                            }}
                        >
                            <span>{opt.label}</span>
                            <span className="text-xs opacity-75">{opt.desc}</span>
                        </button>
                    ))}
                </div>
                <p className="text-xs mt-2" style={{ color: '#4a7c2f' }}>
                    Source: Oxford University / Scarborough et al. (2014)
                </p>
            </div>

            {/* ── Cooking Fuel ── */}
            <div className={sectionClass} style={{ borderColor: '#c5e3a0' }}>
                <h3 className="font-bold text-base mb-4 flex items-center gap-2" style={{ color: '#022202' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#d4edaa' }}>
                        <Flame size={16} style={{ color: '#2d6a10' }} />
                    </div>
                    Cooking Fuel
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelClass} style={{ color: '#2d6a10' }}>Fuel Type</label>
                        <select
                            value={form.cookingFuel}
                            onChange={e => update('cookingFuel', e.target.value)}
                            className={inputClass}
                            style={{ borderColor: '#c5e3a0' }}
                        >
                            {COOKING_FUEL_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass} style={{ color: '#2d6a10' }}>
                            Hours cooked per day
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="24"
                            step="0.5"
                            placeholder="e.g. 1.5"
                            value={form.cookingHoursPerDay || ''}
                            onChange={e => update('cookingHoursPerDay', Number(e.target.value))}
                            disabled={form.cookingFuel === 'None'}
                            className={inputClass}
                            style={{ borderColor: '#c5e3a0', opacity: form.cookingFuel === 'None' ? 0.5 : 1 }}
                        />
                    </div>
                </div>
                <p className="text-xs mt-1.5" style={{ color: '#4a7c2f' }}>
                    Source: Springer Nature 2025 — LPG: 1.492 kg CO₂e/kg, Wood: 1.83 kg CO₂e/kg
                </p>
            </div>

            {/* ── Submit ── */}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #508C12, #17921f)' }}
                onMouseEnter={e => !loading && (e.currentTarget.style.background = 'linear-gradient(135deg, #3f7708, #0f7015)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #508C12, #17921f)')}
            >
                {loading ? (
                    <><Loader2 size={20} className="animate-spin" /> Calculating…</>
                ) : (
                    <><Leaf size={20} /> Calculate Carbon Footprint</>
                )}
            </button>
        </form>
    );
};

export default CalculatorForm;
