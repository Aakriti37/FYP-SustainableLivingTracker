// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api";
// import toast from "react-hot-toast";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !password) {
//       setError("Please fill in all fields");
//       return;
//     }

//     try {
//       // Call backend login
//       const response = await api.post("/auth/login", { email, password, rememberMe });

//       const { token, user } = response.data; // user contains firstName, lastName, email, role

//       // Save token based on "remember me"
//       if (rememberMe) {
//         localStorage.setItem("token", token);
//       } else {
//         sessionStorage.setItem("token", token);
//       }

//       toast.success("Login successful!");

//       // Navigate based on role
//       if (user.role === "admin") {
//         navigate("/admin/dashboard");
//       } else {
//         navigate("/dashboard");
//       }

//     } catch (err: any) {
//       setError(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-green-50">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-6 text-green-700">
//           Login to Sustainable Living Tracker
//         </h2>

//         {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="example@gmail.com"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="********"
//             />
//           </div>

//           <div className="flex items-center justify-between">
//             <label className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={() => setRememberMe(!rememberMe)}
//                 className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
//               />
//               <span className="text-sm text-gray-700">Remember Me</span>
//             </label>

//             <button
//               type="button"
//               onClick={() => toast("Password reset feature coming soon!")}
//               className="text-sm text-green-600 hover:underline"
//             >
//               Forgot Password?
//             </button>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
//           >
//             Login
//           </button>
//         </form>

//         <p className="mt-4 text-center text-sm text-gray-600">
//           Don’t have an account?{" "}
//           <span
//             className="text-green-600 hover:underline cursor-pointer"
//             onClick={() => navigate("/register")}
//           >
//             Sign Up
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle normal login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await api.post("/auth/login", { email, password, rememberMe });
      const { token, user } = response.data;

      // Save token
      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      toast.success("Login successful!");

      // Navigate based on role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  // Handle Google login redirect
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google"; // backend route
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-700">
          Login to Sustainable Living Tracker
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="example@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="********"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Remember Me</span>
            </label>

            <button
              type="button"
              onClick={() => toast("Password reset feature coming soon!")}
              className="text-sm text-green-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>

        {/* Google Login Button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center text-black px-4 py-2 rounded-md cursor-pointer transition"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Login with Google
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            className="text-green-600 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;