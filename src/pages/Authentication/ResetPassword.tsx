import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams(); // grabs the token from the URL

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset successful! Please log in.");
      navigate("/login");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Reset failed. The link may have expired.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        
        <h2 className="text-2xl font-bold text-center mb-2 text-green-700">
          Reset Password
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6">
          Enter your new password below.
        </p>

        {error && <p className="text-red-500 mb-4 text-center text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                placeholder="At least 6 characters"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs mt-0.5"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Re-enter your new password"
            />
          </div>

          {/* Password strength hint */}
          {password && (
            <div className="flex gap-1 mt-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    password.length >= [6, 8, 10, 12][i]
                      ? ["bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"][i]
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          <span
            className="text-green-600 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
