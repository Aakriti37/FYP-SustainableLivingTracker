// pages/common/ProfileComponents/ProfileDetails.tsx

import { Mail, User, Shield, Pencil } from "lucide-react";

interface ProfileDetailsProps {
  firstName: string;
  lastName:  string;
  email:     string;
  role:      "user" | "admin";
  onEdit:    () => void;
}

const ProfileDetails = ({ firstName, lastName, email, role, onEdit }: ProfileDetailsProps) => {

  const fields = [
    { icon: <User size={16} />,   label: "First Name",  value: firstName },
    { icon: <User size={16} />,   label: "Last Name",   value: lastName  },
    { icon: <Mail size={16} />,   label: "Email",       value: email     },
    { icon: <Shield size={16} />, label: "Role",        value: role      },
  ];

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border" style={{ borderColor: "#c5e3a0" }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: "#e8f5d0" }}>
        
        <h3 className="text-xl font-bold" style={{ color: "#022202" }}>
          Personal Information
        </h3>

        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:shadow-md"
          style={{
            background: "#508C12",
            color:      "white",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#3f7708")}
          onMouseLeave={e => (e.currentTarget.style.background = "#508C12")}
        >
          <Pencil size={15} />
          Edit Profile
        </button>

      </div>

      {/* Fields */}
      <div className="space-y-4">
        {fields.map(field => (
          <div
            key={field.label}
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: "#f0f7e6" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#d4edaa", color: "#2d6a10" }}
            >
              {field.icon}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#4a7c2f" }}>
                {field.label}
              </p>
              
              <p className="font-semibold mt-0.5 capitalize" style={{ color: "#022202" }}>
                {field.value || "—"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileDetails;
