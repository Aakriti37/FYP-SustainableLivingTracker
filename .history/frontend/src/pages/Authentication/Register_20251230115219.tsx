
import { RegisterBg, WhiteLogo } from "../../components/TS/Images";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";

const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
        }

        try {
        await api.post("/auth/register", {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
        });

        alert("Registration successful");
        navigate("/login");
        } catch (error: any) {
        alert(error.response?.data?.message || "Registration failed");
        }
    };

  return (
    
    <div className="relative h-screen w-full flex items-center justify-center px-4 overflow-hidden">
      
        <div className="absolute inset-0 z-0">
            <img
            src={RegisterBg}
            alt="Background"
            className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/50" />
        </div>

        
        <div className="absolute top-6 left-6 z-30">
            <img
            src={WhiteLogo}
            alt="Logo"
            className="w-32 sm:w-40 drop-shadow-2xl"
            />
        </div>

        <div className="relative z-10 w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row bg-green-900/90 backdrop-blur-md rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
            
            <div className="hidden md:flex flex-1 p-8 lg:p-12 text-white flex-col justify-center space-y-6">
            
                <div className="space-y-4">
                    <h2 className="text-4xl font-extrabold tracking-tight">Let’s Get Started</h2>
                    
                    <p className="text-green-50/80 text-base leading-relaxed">
                        Create your account and start tracking your sustainable lifestyle.
                    </p>
                </div>

                <ul className="space-y-4">
                    {["Track daily eco-habits", "Monitor carbon footprint", "Community feed"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                        
                        <div className="h-1.5 w-1.5 bg-green-400 rounded-full" />
                        {item}

                    </li>
                    ))}
                </ul>
            </div>

            <div className="flex-1 bg-white/10 backdrop-blur-2xl p-6 md:p-10 overflow-y-auto custom-scrollbar">
                <h2 className="text-white text-2xl font-bold mb-6 text-center md:text-left">Register</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 space-y-1">
                            <label className="text-white text-[10px] font-bold uppercase ml-1">First Name</label>
                            
                            <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="p-2.5 rounded-lg bg-white/10 border border-white/20 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                            />
                        </div>

                        <div className="flex-1 space-y-1">
                            <label className="text-white text-[10px] font-bold uppercase ml-1">Last Name</label>
                            
                            <input
                            type="text"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="p-2.5 rounded-lg bg-white/10 border border-white/20 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-white text-[10px] font-bold uppercase ml-1">Email</label>
                        
                        <input
                            type="email"
                            placeholder="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="p-2.5 rounded-lg bg-white/10 border border-white/20 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-white text-[10px] font-bold uppercase ml-1">Password</label>
                        
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="p-2.5 rounded-lg bg-white/10 border border-white/20 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-white text-[10px] font-bold uppercase ml-1">Confirm Password</label>
                        
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="p-2.5 rounded-lg bg-white/10 border border-white/20 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                        />
                    </div>

                    <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg mt-2 shadow-lg active:scale-[0.98] transition-all"
                    >
                        Create Account
                    </button>

                    <p className="text-xs text-center text-white/70">
                        Already have an account?{" "}
                        
                        <span 
                        onClick={() => navigate("/login")}
                        className="font-bold text-green-300 cursor-pointer">
                            Login
                        </span>
                    </p>
                </form>
            </div>
        </div>
    </div>
  );
};

export default Register;