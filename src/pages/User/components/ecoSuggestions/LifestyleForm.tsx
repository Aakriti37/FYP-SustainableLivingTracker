// pages/User/components/EcoSuggestions/LifestyleForm.tsx

import { useState } from "react";
import { CheckCircle, ChevronRight, Loader2 } from "lucide-react";
import api from "../../../../services/api";
import toast from "react-hot-toast";

interface LifestyleFormProps { onComplete: () => void; }

const inputBtn = (active: boolean) => ({
  padding:       '8px 16px',
  borderRadius:  '12px',
  fontSize:      '14px',
  fontWeight:    600,
  border:        `1px solid ${active ? '#508C12' : '#c5e3a0'}`,
  background:    active ? '#508C12' : 'white',
  color:         active ? 'white' : '#2d6a10',
  cursor:        'pointer',
  transition:    'all 0.2s',
});

const LifestyleForm = ({ onComplete }: LifestyleFormProps) => {
  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [form,    setForm]    = useState({
    sex: "male", bodyType: "normal", showerFrequency: "daily", socialActivity: "sometimes",
    airTravelFrequency: "rarely", vehicleType: "none", wasteBagSize: "medium",
    wasteBagWeeklyCount: 3, monthlyGroceryBill: 200, tvPcHoursDaily: 4,
    internetHoursDaily: 5, newClothesMonthly: 3, energyEfficiency: "Sometimes",
    recycling: [] as string[], cookingWith: [] as string[],
  });

  const update = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }));
  const toggleArray = (field: "recycling" | "cookingWith", value: string) => {
    setForm(prev => {
      const arr = prev[field] as string[];
      return { ...prev, [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post("/eco-suggestions/lifestyle", form);
      toast.success("Lifestyle profile saved!");
      onComplete();
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: "About You",          icon: "👤" },
    { title: "Travel & Transport", icon: "🚗" },
    { title: "Home & Energy",      icon: "⚡" },
    { title: "Habits & Lifestyle", icon: "🌿" },
  ];

  const SelectRow = ({ label, field, options }: { label: string; field: string; options: { value: string; label: string }[] }) => (
    <div>
      <label className="block text-sm font-semibold mb-2" style={{ color: '#022202' }}>{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button key={opt.value} type="button" onClick={() => update(field, opt.value)}
            style={inputBtn((form as Record<string, unknown>)[field] === opt.value)}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  const NumberRow = ({ label, field, min, max, unit }: { label: string; field: string; min: number; max: number; unit: string }) => (
    <div>
      <label className="block text-sm font-semibold mb-1" style={{ color: '#022202' }}>
        {label} <span className="font-black" style={{ color: '#508C12' }}>{(form as Record<string, unknown>)[field] as number} {unit}</span>
      </label>
      <input type="range" min={min} max={max} value={(form as Record<string, unknown>)[field] as number}
        onChange={e => update(field, Number(e.target.value))} className="w-full accent-green-700" />
      <div className="flex justify-between text-xs mt-1" style={{ color: '#4a7c2f' }}>
        <span>{min} {unit}</span><span>{max} {unit}</span>
      </div>
    </div>
  );

  const CheckboxGroup = ({ label, field, options }: { label: string; field: "recycling" | "cookingWith"; options: string[] }) => (
    <div>
      <label className="block text-sm font-semibold mb-2" style={{ color: '#022202' }}>{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const selected = (form[field] as string[]).includes(opt);
          return (
            <button key={opt} type="button" onClick={() => toggleArray(field, opt)} style={inputBtn(selected)}>
              {selected && <CheckCircle size={13} className="inline mr-1" />}{opt}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm border overflow-hidden mb-6" style={{ borderColor: '#c5e3a0' }}>
      {/* Header */}
      <div className="px-8 py-6 text-white" style={{ background: 'linear-gradient(135deg, #022202, #17921f)' }}>
        <h2 className="text-2xl font-extrabold mb-1">Complete Your Lifestyle Profile</h2>
        <p className="text-sm" style={{ color: '#a8d080' }}>Fill this once so our AI can generate accurate, personalised eco suggestions for you.</p>
      </div>

      {/* Steps */}
      <div className="flex items-center px-8 py-4 border-b gap-2 overflow-x-auto" style={{ borderColor: '#e8f5d0' }}>
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
              style={{
                background: step === i + 1 ? '#508C12' : step > i + 1 ? '#d4edaa' : '#f0f7e6',
                color:      step === i + 1 ? 'white'   : step > i + 1 ? '#2d6a10' : '#4a7c2f',
              }}
            >
              {step > i + 1 ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span className="text-sm font-medium hidden sm:block" style={{ color: step === i + 1 ? '#508C12' : '#4a7c2f', opacity: step === i + 1 ? 1 : 0.6 }}>
              {s.title}
            </span>
            {i < steps.length - 1 && <ChevronRight size={16} style={{ color: '#c5e3a0', marginLeft: 4 }} />}
          </div>
        ))}
      </div>

      {/* Form content */}
      <div className="px-8 py-6 space-y-6">
        {step === 1 && <>
          <SelectRow label="Sex"              field="sex"             options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
          <SelectRow label="Body Type"        field="bodyType"        options={[{ value: 'underweight', label: 'Underweight' }, { value: 'normal', label: 'Normal' }, { value: 'overweight', label: 'Overweight' }, { value: 'obese', label: 'Obese' }]} />
          <SelectRow label="Shower Frequency" field="showerFrequency" options={[{ value: 'daily', label: 'Daily' }, { value: 'twice a day', label: 'Twice a day' }, { value: 'more frequently', label: 'More freq.' }, { value: 'less frequently', label: 'Less freq.' }]} />
          <SelectRow label="Social Activity"  field="socialActivity"  options={[{ value: 'never', label: 'Never' }, { value: 'sometimes', label: 'Sometimes' }, { value: 'often', label: 'Often' }]} />
        </>}
        {step === 2 && <>
          <SelectRow label="Air Travel Frequency" field="airTravelFrequency" options={[{ value: 'never', label: 'Never' }, { value: 'rarely', label: 'Rarely' }, { value: 'frequently', label: 'Frequently' }, { value: 'very frequently', label: 'Very freq.' }]} />
          <SelectRow label="Vehicle Type"          field="vehicleType"        options={[{ value: 'none', label: 'No vehicle' }, { value: 'petrol', label: 'Petrol' }, { value: 'diesel', label: 'Diesel' }, { value: 'hybrid', label: 'Hybrid' }, { value: 'lpg', label: 'LPG' }, { value: 'electric', label: 'Electric' }]} />
          <NumberRow label="Monthly Grocery Bill" field="monthlyGroceryBill" min={50} max={1000} unit="$" />
        </>}
        {step === 3 && <>
          <SelectRow label="Energy Efficiency at Home" field="energyEfficiency" options={[{ value: 'No', label: 'No' }, { value: 'Sometimes', label: 'Sometimes' }, { value: 'Yes', label: 'Yes' }]} />
          <NumberRow label="Daily TV / PC usage"   field="tvPcHoursDaily"    min={0} max={24} unit="hrs" />
          <NumberRow label="Daily internet usage"  field="internetHoursDaily" min={0} max={24} unit="hrs" />
          <CheckboxGroup label="Cook with?" field="cookingWith" options={['Stove', 'Oven', 'Microwave', 'Grill', 'Airfryer']} />
        </>}
        {step === 4 && <>
          <SelectRow label="Waste Bag Size"  field="wasteBagSize" options={[{ value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }, { value: 'extra large', label: 'Extra large' }]} />
          <NumberRow label="Waste bags per week"   field="wasteBagWeeklyCount" min={1} max={10} unit="bags" />
          <NumberRow label="New clothes per month" field="newClothesMonthly"   min={0} max={30} unit="items" />
          <CheckboxGroup label="What do you recycle?" field="recycling" options={['Paper', 'Plastic', 'Glass', 'Metal']} />
        </>}
      </div>

      {/* Navigation */}
      <div className="px-8 pb-6 flex justify-between items-center">
        <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 1}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-30"
          style={{ color: '#4a7c2f' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f0f7e6')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          Back
        </button>
        {step < 4 ? (
          <button type="button" onClick={() => setStep(s => s + 1)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: '#508C12' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#3f7708')}
            onMouseLeave={e => (e.currentTarget.style.background = '#508C12')}>
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60 transition-all"
            style={{ background: '#508C12' }}
            onMouseEnter={e => !loading && (e.currentTarget.style.background = '#3f7708')}
            onMouseLeave={e => (e.currentTarget.style.background = '#508C12')}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><CheckCircle size={16} /> Save & Continue</>}
          </button>
        )}
      </div>
    </div>
  );
};

export default LifestyleForm;
