// pages/common/ProfileComponents/LifestyleSection.tsx

import { useState, useEffect } from "react";
import { Leaf, Pencil, Loader2 } from "lucide-react";
import api from "../../../services/api";
import EditLifestyleModal from "./EditLifestyleModal";

interface Lifestyle {
  bodyType:            string;
  sex:                 string;
  showerFrequency:     string;
  socialActivity:      string;
  airTravelFrequency:  string;
  vehicleType:         string;
  wasteBagSize:        string;
  wasteBagWeeklyCount: number;
  monthlyGroceryBill:  number;
  tvPcHoursDaily:      number;
  internetHoursDaily:  number;
  newClothesMonthly:   number;
  energyEfficiency:    string;
  recycling:           string[];
  cookingWith:         string[];
}

const LifestyleSection = () => {
  const [lifestyle,      setLifestyle]      = useState<Lifestyle | null>(null);
  const [hasLifestyle,   setHasLifestyle]   = useState(false);
  const [loading,        setLoading]        = useState(true);
  const [modalOpen,      setModalOpen]      = useState(false);

  const fetchLifestyle = async () => {
    try {
      const res = await api.get("/eco-suggestions/lifestyle");

      setHasLifestyle(res.data.hasLifestyle);
      setLifestyle(res.data.lifestyle);
    } catch {
      setHasLifestyle(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLifestyle();
  }, []);

  const fields = lifestyle
    ? [
        { label: "Body Type",         value: lifestyle.bodyType            },
        { label: "Gender",            value: lifestyle.sex                 },
        { label: "Shower Frequency",  value: lifestyle.showerFrequency     },
        { label: "Social Activity",   value: lifestyle.socialActivity      },
        { label: "Air Travel",        value: lifestyle.airTravelFrequency  },
        { label: "Vehicle Type",      value: lifestyle.vehicleType         },
        { label: "Waste Bag Size",    value: lifestyle.wasteBagSize        },
        { label: "Waste Bags/Week",   value: `${lifestyle.wasteBagWeeklyCount} bags` },
        { label: "Grocery Bill",      value: `$${lifestyle.monthlyGroceryBill}/mo` },
        { label: "TV/PC Hours",       value: `${lifestyle.tvPcHoursDaily} hrs/day` },
        { label: "Internet Hours",    value: `${lifestyle.internetHoursDaily} hrs/day` },
        { label: "New Clothes",       value: `${lifestyle.newClothesMonthly} items/mo` },
        { label: "Energy Efficiency", value: lifestyle.energyEfficiency    },
        { label: "Recycling",         value: lifestyle.recycling?.join(", ") || "None" },
        { label: "Cooks With",        value: lifestyle.cookingWith?.join(", ") || "None" },
      ]
    : [];

  return (
    <>
      <div className="bg-white rounded-3xl p-8 shadow-sm border mt-6" style={{ borderColor: "#c5e3a0" }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: "#e8f5d0" }}>
          
          <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: "#022202" }}>
            <Leaf size={20} style={{ color: "#508C12" }} />
          
            Lifestyle Profile
          </h3>

          {hasLifestyle && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-md"
              style={{ background: "#508C12" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#3f7708")}
              onMouseLeave={e => (e.currentTarget.style.background = "#508C12")}
            >
              <Pencil size={15} />
              
              Edit Lifestyle
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={24} className="animate-spin" style={{ color: "#508C12" }} />
          </div>
        )}

        {/* Not filled yet */}
        {!loading && !hasLifestyle && (
          <div className="text-center py-10">
            
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "#f0f7e6" }}
            >
              <Leaf size={32} style={{ color: "#508C12" }} />
            </div>

            <p className="font-semibold" style={{ color: "#022202" }}>
              No lifestyle profile yet
            </p>

            <p className="text-sm mt-1 mb-5" style={{ color: "#4a7c2f" }}>
              Complete your lifestyle profile on the Eco Suggestions page to get personalised suggestions.
            </p>

            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: "#508C12" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#3f7708")}
              onMouseLeave={e => (e.currentTarget.style.background = "#508C12")}
            >
              Fill Lifestyle Profile
            </button>

          </div>
        )}

        {/* Lifestyle data grid */}
        {!loading && hasLifestyle && lifestyle && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {fields.map(field => (
              <div
                key={field.label}
                className="p-3 rounded-2xl"
                style={{ background: "#f0f7e6" }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#4a7c2f" }}>
                  {field.label}
                </p>

                <p className="text-sm font-bold mt-0.5 capitalize" style={{ color: "#022202" }}>
                  {field.value || "—"}
                </p>

              </div>
              
            ))}
          </div>
        )}
      </div>

      {/* Edit Lifestyle Modal */}
      {modalOpen && (
        <EditLifestyleModal
          lifestyle={lifestyle}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            fetchLifestyle();
          }}
        />
      )}
    </>
  );
};

export default LifestyleSection;
