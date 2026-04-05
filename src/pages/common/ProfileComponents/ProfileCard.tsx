// pages/common/ProfileComponents/ProfileCard.tsx

import { ShieldCheck, User } from "lucide-react";

interface ProfileCardProps {
  firstName: string;
  lastName:  string;
  email:     string;
  role:      "user" | "admin";
  createdAt: string;
}

const ProfileCard = ({ firstName, lastName, email, role, createdAt }: ProfileCardProps) => {
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "??";

  const joinDate = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        year: "numeric", month: "long", day: "numeric",
      })
    : "—";

  return (
    <div
      className="rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden shadow-xl"
      style={{ background: "linear-gradient(160deg, #022202 0%, #1a3d0a 60%, #2d6a10 100%)" }}
    >
      {/* Background decorative icon */}
      <div className="absolute top-4 right-4 opacity-5">
        <ShieldCheck size={120} />
      </div>

      {/* Avatar */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black mb-5 border-4 relative z-10"
        style={{
          background:   "rgba(255,255,255,0.15)",
          borderColor:  "rgba(255,255,255,0.25)",
          backdropFilter: "blur(8px)",
          color:        "#d4edaa",
        }}
      >
        {initials}
      </div>

      {/* Name */}
      <h2 className="text-2xl font-bold text-white z-10 relative">
        {firstName} {lastName}
      </h2>

      {/* Email */}
      <p className="text-sm mt-1 z-10 relative" style={{ color: "#a8d080" }}>
        {email}
      </p>

      {/* Role badge */}
      <span
        className="mt-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest z-10 relative flex items-center gap-1.5"
        style={{ background: "rgba(80,140,18,0.4)", color: "#d4edaa", border: "1px solid rgba(212,237,170,0.3)" }}
      >
        <User size={11} />
        {role}
      </span>

      {/* Joined date */}
      <p
        className="text-xs mt-6 z-10 relative"
        style={{ color: "rgba(168,208,128,0.6)" }}
      >
        Member since {joinDate}
      </p>
    </div>
  );
};

export default ProfileCard;
