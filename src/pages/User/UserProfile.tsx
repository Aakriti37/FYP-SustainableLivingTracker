// pages/User/UserProfile.tsx

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import ProfileCard      from "../common/ProfileComponents/ProfileCard";
import ProfileDetails   from "../common/ProfileComponents/ProfileDetails";
import EditProfileModal from "../common/ProfileComponents/EditProfileModal";
import LifestyleSection from "../common/ProfileComponents/LifestyleSection";

axios.defaults.withCredentials = true;
const API_URL = "http://localhost:5000/api";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName:  "",
    email:     "",
    createdAt: "",
    role:      "user" as "user" | "admin",
  });
  const [loading,    setLoading]    = useState(true);
  const [modalOpen,  setModalOpen]  = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/profile`);
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f0f7e6" }}>
        <RefreshCw size={28} className="animate-spin" style={{ color: "#508C12" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pb-20" style={{ background: "#f0f7e6" }}>
      <div className="max-w-4xl mx-auto">

        {/* Page header */}
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold pb-1" style={{ color: "#022202" }}>
            My Profile
          </h1>
          <p className="font-medium" style={{ color: "#4a7c2f" }}>
            Manage your personal information, security settings and lifestyle profile.
          </p>
        </header>

        {/* Top grid — card + details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left — profile display card */}
          <div className="md:col-span-1">
            <ProfileCard
              firstName={profile.firstName}
              lastName={profile.lastName}
              email={profile.email}
              role={profile.role}
              createdAt={profile.createdAt}
            />
          </div>

          {/* Right — profile details + edit button */}
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

        {/* Lifestyle section — user only */}
        <LifestyleSection />

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

export default UserProfile;
