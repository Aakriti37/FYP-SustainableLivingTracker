// pages/User/components/EcoSuggestions/LifestyleForm.tsx

import { useState } from "react";
import { CheckCircle, ChevronRight, Loader2 } from "lucide-react";
import api from "../../../../services/api";
import toast from "react-hot-toast";

interface LifestyleFormProps {
  onComplete: () => void;
}

const LifestyleForm = ({ onComplete }: LifestyleFormProps) => {
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    sex:                "male",
    bodyType:           "normal",
    showerFrequency:    "daily",
    socialActivity:     "sometimes",
    airTravelFrequency: "rarely",
    vehicleType:        "none",
    wasteBagSize:       "medium",
    wasteBagWeeklyCount: 3,
    monthlyGroceryBill:  200,
    tvPcHoursDaily:      4,
    internetHoursDaily:  5,
    newClothesMonthly:   3,
    energyEfficiency:   "Sometimes",
    recycling:          [] as string[],
    cookingWith:        [] as string[],
  });

  const update = (field: string, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const toggleArray = (field: "recycling" | "cookingWith", value: string) => {
    setForm(prev => {
      const arr = prev[field] as string[];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter(v => v !== value)
          : [...arr, value],
      };
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

  // ── Step definitions ──────────────────────────────────────────────────────
  const steps = [
    { title: "About You",        icon: "👤" },
    { title: "Travel & Transport", icon: "🚗" },
    { title: "Home & Energy",    icon: "⚡" },
    { title: "Habits & Lifestyle", icon: "🌿" },
  ];

  const SelectRow = ({
    label, field, options,
  }: {
    label: string;
    field: string;
    options: { value: string; label: string }[];
  }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => update(field, opt.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              (form as Record<string, unknown>)[field] === opt.value
                ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  const NumberRow = ({
    label, field, min, max, unit,
  }: {
    label: string; field: string; min: number; max: number; unit: string;
  }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
        <span className="ml-2 text-emerald-600 font-bold">
          {(form as Record<string, unknown>)[field] as number} {unit}
        </span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={(form as Record<string, unknown>)[field] as number}
        onChange={e => update(field, Number(e.target.value))}
        className="w-full accent-emerald-500"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );

  const CheckboxGroup = ({
    label, field, options,
  }: {
    label: string;
    field: "recycling" | "cookingWith";
    options: string[];
  }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const selected = (form[field] as string[]).includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggleArray(field, opt)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                selected
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
              }`}
            >
              {selected && <CheckCircle size={13} />}
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">

      {/* Header */}
      <div className="bg-linear-to-r from-emerald-500 to-teal-600 px-8 py-6 text-white">
        <h2 className="text-2xl font-extrabold mb-1">Complete Your Lifestyle Profile</h2>
        <p className="text-emerald-100 text-sm">
          Fill this once so our AI can generate accurate, personalised eco suggestions for you.
        </p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center px-8 py-4 border-b border-gray-100 gap-2 overflow-x-auto">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === i + 1
                ? "bg-emerald-500 text-white"
                : step > i + 1
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-400"
            }`}>
              {step > i + 1 ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${
              step === i + 1 ? "text-emerald-600" : "text-gray-400"
            }`}>
              {s.title}
            </span>
            {i < steps.length - 1 && (
              <ChevronRight size={16} className="text-gray-300 ml-1" />
            )}
          </div>
        ))}
      </div>

      {/* Form steps */}
      <div className="px-8 py-6 space-y-6">

        {/* Step 1: About You */}
        {step === 1 && (
          <>
            <SelectRow
              label="Sex"
              field="sex"
              options={[
                { value: "male",   label: "Male"   },
                { value: "female", label: "Female" },
              ]}
            />
            <SelectRow
              label="Body Type"
              field="bodyType"
              options={[
                { value: "underweight", label: "Underweight" },
                { value: "normal",      label: "Normal"      },
                { value: "overweight",  label: "Overweight"  },
                { value: "obese",       label: "Obese"       },
              ]}
            />
            <SelectRow
              label="Shower Frequency"
              field="showerFrequency"
              options={[
                { value: "daily",            label: "Daily"           },
                { value: "twice a day",      label: "Twice a day"     },
                { value: "more frequently",  label: "More frequently" },
                { value: "less frequently",  label: "Less frequently" },
              ]}
            />
            <SelectRow
              label="Social Activity Level"
              field="socialActivity"
              options={[
                { value: "never",     label: "Never"     },
                { value: "sometimes", label: "Sometimes" },
                { value: "often",     label: "Often"     },
              ]}
            />
          </>
        )}

        {/* Step 2: Travel & Transport */}
        {step === 2 && (
          <>
            <SelectRow
              label="How often do you travel by air?"
              field="airTravelFrequency"
              options={[
                { value: "never",           label: "Never"           },
                { value: "rarely",          label: "Rarely"          },
                { value: "frequently",      label: "Frequently"      },
                { value: "very frequently", label: "Very frequently" },
              ]}
            />
            <SelectRow
              label="Vehicle Type (if you own one)"
              field="vehicleType"
              options={[
                { value: "none",     label: "No vehicle" },
                { value: "petrol",   label: "Petrol"     },
                { value: "diesel",   label: "Diesel"     },
                { value: "hybrid",   label: "Hybrid"     },
                { value: "lpg",      label: "LPG"        },
                { value: "electric", label: "Electric"   },
              ]}
            />
            <NumberRow
              label="Monthly Grocery Bill"
              field="monthlyGroceryBill"
              min={50} max={1000} unit="$"
            />
            <SelectRow
              label="How often do you go out socially?"
              field="socialActivity"
              options={[
                { value: "never",     label: "Never"     },
                { value: "sometimes", label: "Sometimes" },
                { value: "often",     label: "Often"     },
              ]}
            />
          </>
        )}

        {/* Step 3: Home & Energy */}
        {step === 3 && (
          <>
            <SelectRow
              label="Do you practice energy efficiency at home?"
              field="energyEfficiency"
              options={[
                { value: "No",        label: "No"        },
                { value: "Sometimes", label: "Sometimes" },
                { value: "Yes",       label: "Yes"       },
              ]}
            />
            <NumberRow
              label="Daily TV / PC usage"
              field="tvPcHoursDaily"
              min={0} max={24} unit="hrs"
            />
            <NumberRow
              label="Daily internet usage"
              field="internetHoursDaily"
              min={0} max={24} unit="hrs"
            />
            <CheckboxGroup
              label="What do you cook with?"
              field="cookingWith"
              options={["Stove", "Oven", "Microwave", "Grill", "Airfryer"]}
            />
          </>
        )}

        {/* Step 4: Habits & Lifestyle */}
        {step === 4 && (
          <>
            <SelectRow
              label="Typical waste bag size"
              field="wasteBagSize"
              options={[
                { value: "small",       label: "Small"       },
                { value: "medium",      label: "Medium"      },
                { value: "large",       label: "Large"       },
                { value: "extra large", label: "Extra large" },
              ]}
            />
            <NumberRow
              label="Waste bags per week"
              field="wasteBagWeeklyCount"
              min={1} max={10} unit="bags"
            />
            <NumberRow
              label="New clothes per month"
              field="newClothesMonthly"
              min={0} max={30} unit="items"
            />
            <CheckboxGroup
              label="What do you recycle?"
              field="recycling"
              options={["Paper", "Plastic", "Glass", "Metal"]}
            />
          </>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="px-8 pb-6 flex justify-between items-center">
        <button
          type="button"
          onClick={() => setStep(s => s - 1)}
          disabled={step === 1}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
        >
          Back
        </button>

        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep(s => s + 1)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-linear-to-r from-emerald-500 to-teal-600 shadow-sm hover:shadow-md transition-all"
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-linear-to-r from-emerald-500 to-teal-600 shadow-sm hover:shadow-md disabled:opacity-60 transition-all"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Saving…</>
            ) : (
              <><CheckCircle size={16} /> Save & Continue</>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default LifestyleForm;
