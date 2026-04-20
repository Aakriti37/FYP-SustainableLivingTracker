// pages/Admin/AdminProfile.tsx

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";

import ProfileCard      from "../common/ProfileComponents/ProfileCard";
import ProfileDetails   from "../common/ProfileComponents/ProfileDetails";
import EditProfileModal from "../common/ProfileComponents/EditProfileModal";


const AdminProfile = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName:  "",
    email:     "",
    createdAt: "",
    role:      "admin" as "user" | "admin",
  });
  const [loading,   setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      setProfile({
        firstName: res.data.firstName,
        lastName:  res.data.lastName,
        email:     res.data.email,
        createdAt: res.data.createdAt,
        role:      res.data.role,
      });
    } catch {
      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileSaved = (firstName: string, lastName: string) => {
    setProfile(prev => ({ ...prev, firstName, lastName }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f5f5f5" }}>
        <RefreshCw size={28} className="animate-spin" style={{ color: "#374151" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pb-20" style={{ background: "#f5f5f5" }}>
      <div className="max-w-4xl mx-auto">

        {/* Page header */}
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold pb-1 text-gray-800">
            Admin Profile
          </h1>
          <p className="font-medium text-gray-500">
            Manage your personal information and security settings.
          </p>
        </header>

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left — profile card */}
          <div className="md:col-span-1">
            <ProfileCard
              firstName={profile.firstName}
              lastName={profile.lastName}
              email={profile.email}
              role={profile.role}
              createdAt={profile.createdAt}
            />
          </div>

          {/* Right — profile details */}
          <div className="md:col-span-2">
            <ProfileDetails
              firstName={profile.firstName}
              lastName={profile.lastName}
              email={profile.email}
              role={profile.role}
              onEdit={() => setModalOpen(true)}
            />
          </div>
        </div>

        {/* No lifestyle section for admin */}

      </div>

      {/* Edit Profile Modal */}
      {modalOpen && (
        <EditProfileModal
          firstName={profile.firstName}
          lastName={profile.lastName}
          onClose={() => setModalOpen(false)}
          onSaved={handleProfileSaved}
        />
      )}
    </div>
  );
};

export default AdminProfile;
