// pages/User/UserProfile.tsx
// Fixed: avatar no longer blocked by banner

import { useState, useEffect } from "react";
import { RefreshCw, Mail, User, Shield, Calendar, Pencil } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import EditProfileModal    from "../common/ProfileComponents/EditProfileModal";
import LifestyleSection   from "../common/ProfileComponents/LifestyleSection";
import BadgeShieldDisplay from "../common/ProfileComponents/BadgeShieldDisplay";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_API_URL;

const UserProfile = () => {
    const [profile,   setProfile]   = useState({
        firstName: '', lastName: '', email: '', createdAt: '', role: 'user' as 'user' | 'admin',
    });
    const [loading,   setLoading]   = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

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

    useEffect(() => { fetchProfile(); }, []);

    const handleProfileSaved = (firstName: string, lastName: string) => {
        setProfile(prev => ({ ...prev, firstName, lastName }));
    };

    const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#f0f7e6' }}>
                <RefreshCw size={28} className="animate-spin" style={{ color: '#508C12' }} />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 pb-20" style={{ background: '#f0f7e6' }}>
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <header className="mb-6 pb-4 border-b" style={{ borderColor: '#c5e3a0' }}>
                    <h1 className="text-4xl font-extrabold" style={{ color: '#022202' }}>My Profile</h1>
                    <p className="font-medium mt-1" style={{ color: '#4a7c2f' }}>
                        Manage your personal information and lifestyle profile.
                    </p>
                </header>

                {/* Profile card — fixed layout */}
                <div className="bg-white rounded-3xl shadow-sm border overflow-hidden" style={{ borderColor: '#c5e3a0' }}>

                    {/* Banner */}
                    <div
                        className="h-28 w-full"
                        style={{ background: 'linear-gradient(135deg, #022202 0%, #17921f 100%)' }}
                    />

                    {/* Avatar row — positioned BELOW banner, not overlapping */}
                    <div className="px-6 py-5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                            {/* Avatar + name side by side */}
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black shadow-md shrink-0 border-4 border-white -mt-14"
                                    style={{
                                        background: 'linear-gradient(135deg, #022202, #2d6a10)',
                                        color:      '#d4edaa',
                                    }}
                                >
                                    {initials || '??'}
                                </div>
                                <div className="-mt-2">
                                    <h2 className="text-2xl font-extrabold" style={{ color: '#022202' }}>
                                        {profile.firstName} {profile.lastName}
                                    </h2>
                                    <span
                                        className="inline-block text-xs font-bold px-3 py-1 rounded-full capitalize mt-1"
                                        style={{ background: '#f0f7e6', color: '#508C12' }}
                                    >
                                        {profile.role}
                                    </span>
                                </div>
                            </div>

                            {/* Edit button */}
                            <button
                                onClick={() => setModalOpen(true)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all self-start sm:self-center"
                                style={{ background: '#508C12' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#3f7708')}
                                onMouseLeave={e => (e.currentTarget.style.background = '#508C12')}
                            >
                                <Pencil size={15} /> Edit Profile
                            </button>
                        </div>

                        {/* Info fields grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                {
                                    icon:  <Mail size={16} />,
                                    label: 'Email',
                                    value: profile.email,
                                },
                                {
                                    icon:  <Shield size={16} />,
                                    label: 'Role',
                                    value: profile.role,
                                },
                                {
                                    icon:  <Calendar size={16} />,
                                    label: 'Member Since',
                                    value: profile.createdAt
                                        ? new Date(profile.createdAt).toLocaleDateString(undefined, {
                                              year: 'numeric', month: 'long', day: 'numeric',
                                          })
                                        : '—',
                                },
                                {
                                    icon:  <User size={16} />,
                                    label: 'Full Name',
                                    value: `${profile.firstName} ${profile.lastName}`,
                                },
                            ].map(field => (
                                <div
                                    key={field.label}
                                    className="flex items-center gap-3 p-4 rounded-2xl"
                                    style={{ background: '#f0f7e6' }}
                                >
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: '#d4edaa', color: '#2d6a10' }}
                                    >
                                        {field.icon}
                                    </div>
                                    <div className="min-w-0">
                                        <p
                                            className="text-xs font-semibold uppercase tracking-wider"
                                            style={{ color: '#4a7c2f' }}
                                        >
                                            {field.label}
                                        </p>
                                        <p
                                            className="font-semibold mt-0.5 capitalize truncate"
                                            style={{ color: '#022202' }}
                                        >
                                            {field.value || '—'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Badge shields */}
                <BadgeShieldDisplay />

                {/* Lifestyle section */}
                <LifestyleSection />

            </div>

            {/* Edit modal */}
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
