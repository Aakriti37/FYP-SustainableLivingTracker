// pages/common/ProfileComponents/EditProfileModal.tsx

import { useState } from "react";
import { X, Save, Loader2, Lock, User } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;
const API_URL = "http://localhost:5000/api";

interface EditProfileModalProps {
  firstName: string;
  lastName:  string;
  onClose:   () => void;
  onSaved:   (firstName: string, lastName: string) => void;
}

const EditProfileModal = ({ firstName, lastName, onClose, onSaved }: EditProfileModalProps) => {
  const [form, setForm] = useState({ firstName, lastName });
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading]         = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: Record<string, string> = {
        firstName: form.firstName,
        lastName:  form.lastName,
      };
      if (newPassword.trim()) {
        payload.password = newPassword;
      }
      await axios.put(`${API_URL}/user/profile`, payload);
      toast.success("Profile updated successfully!");
      onSaved(form.firstName, form.lastName);
      onClose();
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(2,34,2,0.5)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal card */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Modal header */}
        <div
          className="px-6 py-5 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #022202, #2d6a10)" }}
        >
          <div className="flex items-center gap-3 text-white">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)" }}>
              <User size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base leading-none">Edit Profile</h3>
              <p className="text-xs mt-0.5" style={{ color: "#a8d080" }}>
                Update your personal information
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

        {/* Modal body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* First + Last name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#022202" }}>
                First Name
              </label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={{ borderColor: "#c5e3a0", background: "#f0f7e6" }}
                onFocus={e => (e.target.style.borderColor = "#508C12")}
                onBlur={e  => (e.target.style.borderColor = "#c5e3a0")}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#022202" }}>
                Last Name
              </label>
              <input
                type="text"
                required
                value={form.lastName}
                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={{ borderColor: "#c5e3a0", background: "#f0f7e6" }}
                onFocus={e => (e.target.style.borderColor = "#508C12")}
                onBlur={e  => (e.target.style.borderColor = "#c5e3a0")}
              />
            </div>
          </div>

          {/* Change password */}
          <div className="pt-4 border-t" style={{ borderColor: "#e8f5d0" }}>
            <h4 className="text-sm font-bold flex items-center gap-2 mb-3" style={{ color: "#022202" }}>
              <Lock size={15} style={{ color: "#508C12" }} />
              Change Password
            </h4>
            <input
              type="password"
              placeholder="Leave blank to keep current password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
              style={{ borderColor: "#c5e3a0", background: "#f0f7e6" }}
              onFocus={e => (e.target.style.borderColor = "#508C12")}
              onBlur={e  => (e.target.style.borderColor = "#c5e3a0")}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-colors"
              style={{ borderColor: "#c5e3a0", color: "#4a7c2f" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              style={{ background: "#508C12" }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = "#3f7708")}
              onMouseLeave={e => (e.currentTarget.style.background = "#508C12")}
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Saving…</>
              ) : (
                <><Save size={16} /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
