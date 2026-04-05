// pages/common/ProfileComponents/EditLifestyleModal.tsx

import { useState } from "react";
import { X, Save, Loader2, Leaf, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import api from "../../../services/api";
import toast from "react-hot-toast";

interface Lifestyle {
  bodyType?:            string;
  sex?:                 string;
  showerFrequency?:     string;
  socialActivity?:      string;
  airTravelFrequency?:  string;
  vehicleType?:         string;
  wasteBagSize?:        string;
  wasteBagWeeklyCount?: number;
  monthlyGroceryBill?:  number;
  tvPcHoursDaily?:      number;
  internetHoursDaily?:  number;
  newClothesMonthly?:   number;
  energyEfficiency?:    string;
  recycling?:           string[];
  cookingWith?:         string[];
}

interface EditLifestyleModalProps {
  lifestyle: Lifestyle | null;
  onClose:   () => void;
  onSaved:   () => void;
}

const EditLifestyleModal = ({ lifestyle, onClose, onSaved }: EditLifestyleModalProps) => {
  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    sex:                 lifestyle?.sex                 || "male",
    bodyType:            lifestyle?.bodyType            || "normal",
    showerFrequency:     lifestyle?.showerFrequency     || "daily",
    socialActivity:      lifestyle?.socialActivity      || "sometimes",
    airTravelFrequency:  lifestyle?.airTravelFrequency  || "rarely",
    vehicleType:         lifestyle?.vehicleType         || "none",
    wasteBagSize:        lifestyle?.wasteBagSize        || "medium",
    wasteBagWeeklyCount: lifestyle?.wasteBagWeeklyCount ?? 3,
    monthlyGroceryBill:  lifestyle?.monthlyGroceryBill  ?? 200,
    tvPcHoursDaily:      lifestyle?.tvPcHoursDaily      ?? 4,
    internetHoursDaily:  lifestyle?.internetHoursDaily  ?? 5,
    newClothesMonthly:   lifestyle?.newClothesMonthly   ?? 3,
    energyEfficiency:    lifestyle?.energyEfficiency    || "Sometimes",
    recycling:           lifestyle?.recycling           || [] as string[],
    cookingWith:         lifestyle?.cookingWith         || [] as string[],
  });

  const update = (field: string, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const toggleArray = (field: "recycling" | "cookingWith", value: string) =>
    setForm(prev => {
      const arr = prev[field] as string[];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter(v => v !== value)
          : [...arr, value],
      };
    });

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.post("/eco-suggestions/lifestyle", form);
      toast.success("Lifestyle profile updated!");
      onSaved();
    } catch {
      toast.error("Failed to update lifestyle profile.");
    } finally {
      setLoading(false);
    }
  };

  const steps = ["About You", "Travel", "Home & Energy", "Habits"];

  // ── Reusable field components ─────────────────────────────────────────────
  const SelectRow = ({
    label, field, options,
  }: { label: string; field: string; options: { value: string; label: string }[] }) => (
    <div>
      <label className="block text-sm font-semibold mb-2" style={{ color: "#022202" }}>
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const selected = (form as Record<string, unknown>)[field] === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => update(field, opt.value)}
              className="px-3 py-1.5 rounded-xl text-sm font-medium border transition-all"
              style={{
                background:   selected ? "#508C12" : "#f0f7e6",
                color:        selected ? "white"   : "#2d6a10",
                borderColor:  selected ? "#508C12" : "#c5e3a0",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const NumberRow = ({
    label, field, min, max, unit,
  }: { label: string; field: string; min: number; max: number; unit: string }) => (
    <div>
      <label className="block text-sm font-semibold mb-1" style={{ color: "#022202" }}>
        {label}
        <span className="ml-2 font-bold" style={{ color: "#508C12" }}>
          {(form as Record<string, unknown>)[field] as number} {unit}
        </span>
      </label>
      <input
        type="range" min={min} max={max}
        value={(form as Record<string, unknown>)[field] as number}
        onChange={e => update(field, Number(e.target.value))}
        className="w-full"
        style={{ accentColor: "#508C12" }}
      />
      <div className="flex justify-between text-xs mt-1" style={{ color: "#4a7c2f" }}>
        <span>{min} {unit}</span><span>{max} {unit}</span>
      </div>
    </div>
  );

  const CheckboxGroup = ({
    label, field, options,
  }: { label: string; field: "recycling" | "cookingWith"; options: string[] }) => (
    <div>
      <label className="block text-sm font-semibold mb-2" style={{ color: "#022202" }}>
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const selected = (form[field] as string[]).includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggleArray(field, opt)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all"
              style={{
                background:  selected ? "#508C12" : "#f0f7e6",
                color:       selected ? "white"   : "#2d6a10",
                borderColor: selected ? "#508C12" : "#c5e3a0",
              }}
            >
              {selected && <CheckCircle size={12} />}
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(2,34,2,0.55)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #022202, #2d6a10)" }}
        >
          <div className="flex items-center gap-3 text-white">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)" }}>
              <Leaf size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base leading-none">Edit Lifestyle Profile</h3>
              <p className="text-xs mt-0.5" style={{ color: "#a8d080" }}>
                Step {step} of {steps.length} — {steps[step - 1]}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex px-6 py-3 gap-1.5 flex-shrink-0 border-b" style={{ borderColor: "#e8f5d0" }}>
          {steps.map((s, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full transition-all"
              style={{ background: step > i ? "#508C12" : "#e8f5d0" }}
            />
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {step === 1 && (
            <>
              <SelectRow label="Gender" field="sex"
                options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
              <SelectRow label="Body Type" field="bodyType"
                options={[
                  { value: "underweight", label: "Underweight" },
                  { value: "normal",      label: "Normal"      },
                  { value: "overweight",  label: "Overweight"  },
                  { value: "obese",       label: "Obese"       },
                ]} />
              <SelectRow label="Shower Frequency" field="showerFrequency"
                options={[
                  { value: "daily",           label: "Daily"           },
                  { value: "twice a day",     label: "Twice a day"     },
                  { value: "more frequently", label: "More frequently" },
                  { value: "less frequently", label: "Less frequently" },
                ]} />
              <SelectRow label="Social Activity" field="socialActivity"
                options={[
                  { value: "never",     label: "Never"     },
                  { value: "sometimes", label: "Sometimes" },
                  { value: "often",     label: "Often"     },
                ]} />
            </>
          )}

          {step === 2 && (
            <>
              <SelectRow label="Air Travel Frequency" field="airTravelFrequency"
                options={[
                  { value: "never",           label: "Never"           },
                  { value: "rarely",          label: "Rarely"          },
                  { value: "frequently",      label: "Frequently"      },
                  { value: "very frequently", label: "Very frequently" },
                ]} />
              <SelectRow label="Vehicle Type" field="vehicleType"
                options={[
                  { value: "none",     label: "No vehicle" },
                  { value: "petrol",   label: "Petrol"     },
                  { value: "diesel",   label: "Diesel"     },
                  { value: "hybrid",   label: "Hybrid"     },
                  { value: "lpg",      label: "LPG"        },
                  { value: "electric", label: "Electric"   },
                ]} />
              <NumberRow label="Monthly Grocery Bill" field="monthlyGroceryBill"
                min={50} max={1000} unit="$" />
            </>
          )}

          {step === 3 && (
            <>
              <SelectRow label="Energy Efficiency at Home" field="energyEfficiency"
                options={[
                  { value: "No",        label: "No"        },
                  { value: "Sometimes", label: "Sometimes" },
                  { value: "Yes",       label: "Yes"       },
                ]} />
              <NumberRow label="Daily TV / PC Usage"   field="tvPcHoursDaily"     min={0} max={24} unit="hrs" />
              <NumberRow label="Daily Internet Usage"  field="internetHoursDaily" min={0} max={24} unit="hrs" />
              <CheckboxGroup label="What do you cook with?" field="cookingWith"
                options={["Stove", "Oven", "Microwave", "Grill", "Airfryer"]} />
            </>
          )}

          {step === 4 && (
            <>
              <SelectRow label="Waste Bag Size" field="wasteBagSize"
                options={[
                  { value: "small",       label: "Small"       },
                  { value: "medium",      label: "Medium"      },
                  { value: "large",       label: "Large"       },
                  { value: "extra large", label: "Extra large" },
                ]} />
              <NumberRow label="Waste Bags Per Week"    field="wasteBagWeeklyCount" min={1} max={10} unit="bags"  />
              <NumberRow label="New Clothes Per Month"  field="newClothesMonthly"   min={0} max={30} unit="items" />
              <CheckboxGroup label="What do you recycle?" field="recycling"
                options={["Paper", "Plastic", "Glass", "Metal"]} />
            </>
          )}
        </div>

        {/* Footer navigation */}
        <div className="px-6 py-4 border-t flex gap-3 flex-shrink-0" style={{ borderColor: "#e8f5d0" }}>
          <button
            type="button"
            onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors"
            style={{ borderColor: "#c5e3a0", color: "#4a7c2f" }}
          >
            <ChevronLeft size={16} />
            {step === 1 ? "Cancel" : "Back"}
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(s => s + 1)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: "#508C12" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#3f7708")}
              onMouseLeave={e => (e.currentTarget.style.background = "#508C12")}
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60"
              style={{ background: "#508C12" }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = "#3f7708")}
              onMouseLeave={e => (e.currentTarget.style.background = "#508C12")}
            >
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
                : <><Save size={16} /> Save Changes</>
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditLifestyleModal;
