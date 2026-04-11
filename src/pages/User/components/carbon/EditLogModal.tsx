// pages/User/components/Carbon/EditLogModal.tsx

import { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import type { CarbonLog, CarbonFormData } from "../../../../types/carbon.types";

axios.defaults.withCredentials = true;
const API_URL = "http://localhost:5000/api";

interface EditLogModalProps {
    log:     CarbonLog;
    onClose: () => void;
    onSaved: () => void;
}

const inputClass = "w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all bg-white";
const labelClass = "block text-sm font-semibold mb-1.5";

const EditLogModal = ({ log, onClose, onSaved }: EditLogModalProps) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<CarbonFormData>({
        period:             log.period,
        privateTransportKm: log.privateTransportKm,
        vehicleFuelType:    log.vehicleFuelType,
        busKm:              log.busKm,
        trainKm:            log.trainKm,
        electricityKwh:     log.electricityKwh,
        diet:               log.diet,
        cookingFuel:        log.cookingFuel,
        cookingHoursPerDay: log.cookingHoursPerDay,
    });

    const update = (field: keyof CarbonFormData, value: string | number) =>
        setForm(prev => ({ ...prev, [field]: value }));

    const handleSave = async () => {
        setLoading(true);
        try {
            await axios.put(`${API_URL}/carbon/${log._id}`, form);
            toast.success("Carbon log updated!");
            onSaved();
            onClose();
        } catch {
            toast.error("Failed to update log.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(2,34,2,0.55)', backdropFilter: 'blur(4px)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div
                    className="px-6 py-5 flex items-center justify-between sticky top-0 rounded-t-3xl"
                    style={{ background: 'linear-gradient(135deg, #022202, #2d6a10)' }}
                >
                    <div>
                        <h3 className="font-bold text-white text-base">Edit Carbon Log</h3>
                        <p className="text-xs mt-0.5" style={{ color: '#a8d080' }}>
                            {new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white p-1.5 rounded-lg transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">

                    {/* Period */}
                    <div>
                        <label className={labelClass} style={{ color: '#022202' }}>Period</label>
                        <select value={form.period} onChange={e => update('period', e.target.value)}
                            className={inputClass} style={{ borderColor: '#c5e3a0' }}>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>

                    {/* Transport */}
                    <div className="p-4 rounded-2xl space-y-3" style={{ background: '#f0f7e6' }}>
                        <p className="font-bold text-sm" style={{ color: '#022202' }}>Transport</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass} style={{ color: '#2d6a10' }}>Vehicle Fuel</label>
                                <select value={form.vehicleFuelType} onChange={e => update('vehicleFuelType', e.target.value)}
                                    className={inputClass} style={{ borderColor: '#c5e3a0' }}>
                                    <option value="none">No vehicle</option>
                                    <option value="petrol">Petrol</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="hybrid">Hybrid</option>
                                    <option value="electric">Electric</option>
                                    <option value="motorcycle">Motorcycle</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass} style={{ color: '#2d6a10' }}>Vehicle km</label>
                                <input type="number" min="0" value={form.privateTransportKm || ''}
                                    onChange={e => update('privateTransportKm', Number(e.target.value))}
                                    className={inputClass} style={{ borderColor: '#c5e3a0' }} />
                            </div>
                            <div>
                                <label className={labelClass} style={{ color: '#2d6a10' }}>Bus km</label>
                                <input type="number" min="0" value={form.busKm || ''}
                                    onChange={e => update('busKm', Number(e.target.value))}
                                    className={inputClass} style={{ borderColor: '#c5e3a0' }} />
                            </div>
                            <div>
                                <label className={labelClass} style={{ color: '#2d6a10' }}>Train km</label>
                                <input type="number" min="0" value={form.trainKm || ''}
                                    onChange={e => update('trainKm', Number(e.target.value))}
                                    className={inputClass} style={{ borderColor: '#c5e3a0' }} />
                            </div>
                        </div>
                    </div>

                    {/* Energy */}
                    <div>
                        <label className={labelClass} style={{ color: '#022202' }}>Electricity (kWh)</label>
                        <input type="number" min="0" step="0.1" value={form.electricityKwh || ''}
                            onChange={e => update('electricityKwh', Number(e.target.value))}
                            className={inputClass} style={{ borderColor: '#c5e3a0' }} />
                    </div>

                    {/* Diet */}
                    <div>
                        <label className={labelClass} style={{ color: '#022202' }}>Diet Type</label>
                        <select value={form.diet} onChange={e => update('diet', e.target.value)}
                            className={inputClass} style={{ borderColor: '#c5e3a0' }}>
                            <option value="vegan">Vegan</option>
                            <option value="vegetarian">Vegetarian</option>
                            <option value="pescatarian">Pescatarian</option>
                            <option value="balanced">Balanced</option>
                            <option value="meat-heavy">Meat Heavy</option>
                        </select>
                    </div>

                    {/* Cooking */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass} style={{ color: '#022202' }}>Cooking Fuel</label>
                            <select value={form.cookingFuel} onChange={e => update('cookingFuel', e.target.value)}
                                className={inputClass} style={{ borderColor: '#c5e3a0' }}>
                                <option value="LPG">LPG Gas</option>
                                <option value="Wood">Wood</option>
                                <option value="Electricity">Electricity</option>
                                <option value="Biogas">Biogas</option>
                                <option value="None">None</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass} style={{ color: '#022202' }}>Cooking hrs/day</label>
                            <input type="number" min="0" max="24" step="0.5" value={form.cookingHoursPerDay || ''}
                                onChange={e => update('cookingHoursPerDay', Number(e.target.value))}
                                className={inputClass} style={{ borderColor: '#c5e3a0' }} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex gap-3">
                    <button onClick={onClose}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-colors"
                        style={{ borderColor: '#c5e3a0', color: '#4a7c2f' }}>
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={loading}
                        className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                        style={{ background: '#508C12' }}
                        onMouseEnter={e => !loading && (e.currentTarget.style.background = '#3f7708')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#508C12')}>
                        {loading
                            ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
                            : <><Save size={16} /> Save Changes</>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditLogModal;
