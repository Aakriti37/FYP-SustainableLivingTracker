import { useState, useEffect } from "react";
import { User, Mail, Shield, CheckCircle2, Lock, Save } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = "http://localhost:5000/api";

interface ProfileProps {
    role: "admin" | "user";
}

const BaseProfile = ({ role }: ProfileProps) => {
    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        createdAt: "",
        role: role
    });
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${API_URL}/user/profile`);
                setProfile({
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    email: res.data.email,
                    createdAt: res.data.createdAt,
                    role: res.data.role
                });
            } catch (error) {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: any = {
                firstName: profile.firstName,
                lastName: profile.lastName,
            };
            if (newPassword.trim()) {
                payload.password = newPassword;
            }
            await axios.put(`${API_URL}/user/profile`, payload);
            toast.success("Profile updated successfully");
            setNewPassword("");
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    const gradientColor = role === "admin" ? "from-slate-800 to-slate-700" : "from-emerald-600 to-teal-500";
    const buttonColor = role === "admin" ? "bg-slate-800 hover:bg-slate-900" : "bg-emerald-600 hover:bg-emerald-700";
    const bgColor = role === "admin" ? "bg-slate-50" : "bg-emerald-50";

    return (
        <div className={`p-8 ${bgColor} min-h-screen`}>
            <div className="max-w-4xl mx-auto space-y-8">

                <header className="mb-8 border-b border-gray-200 pb-4">
                    <h1 className={`text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r ${gradientColor} pb-2 flex items-center gap-3`}>
                        <User className={role === "admin" ? "text-slate-800" : "text-emerald-600"} size={36} /> My Profile
                    </h1>
                    <p className="text-gray-500 font-medium text-lg">Manage your personal information and security settings.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Display Card */}
                    <div className={`bg-linear-to-br ${gradientColor} rounded-3xl p-8 text-white shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Shield size={120} />
                        </div>

                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold mb-4 backdrop-blur-sm z-10 border-4 border-white/30">
                            {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                        </div>
                        <h2 className="text-2xl font-bold z-10">{profile.firstName} {profile.lastName}</h2>
                        <p className="text-white/80 z-10 mb-4">{profile.email}</p>

                        <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider z-10">
                            {profile.role}
                        </span>

                        <div className="mt-8 text-sm text-white/70 z-10 absolute bottom-4">
                            Joined {new Date(profile.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    {/* Edit Form */}
                    <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <CheckCircle2 className={role === "admin" ? "text-slate-500" : "text-emerald-500"} /> Personal Information
                        </h3>

                        {loading ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-12 bg-gray-100 rounded-xl w-full"></div>
                                <div className="h-12 bg-gray-100 rounded-xl w-full"></div>
                                <div className="h-12 bg-gray-100 rounded-xl w-full"></div>
                            </div>
                        ) : (
                            <form onSubmit={handleUpdate} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-all"
                                            value={profile.firstName}
                                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-all"
                                            value={profile.lastName}
                                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Mail size={16} className="text-gray-400" /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        disabled
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                                        value={profile.email}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                                </div>

                                <div className="pt-4 border-t border-gray-100 mt-4 font-semibold">
                                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Lock className={role === "admin" ? "text-slate-500" : "text-emerald-500"} size={20} /> Change Password
                                    </h4>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Leave blank to keep current password"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition-all"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        className={`w-full ${buttonColor} text-white font-bold py-3.5 rounded-xl shadow-md transition-all hover:shadow-lg flex justify-center items-center gap-2`}
                                    >
                                        <Save size={20} /> Save Changes
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BaseProfile;
