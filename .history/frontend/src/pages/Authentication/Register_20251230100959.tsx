import React from "react";
import { RegisterBg, WhiteLogo } from "../../components/TS/Images";

const Register = () => {
  return (
    /* OUTER WRAPPER: 
       - min-h-screen ensures it covers the full viewport.
       - flex & items-center keeps the card centered vertically.
       - py-12/py-20 creates the "gap" at the top and bottom so the card never touches the edges.
    */
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12 md:py-20 overflow-x-hidden">
      
      {/* 1. FIXED BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <img
          src={RegisterBg}
          alt="Background"
          className="h-full w-full object-cover"
        />
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* 2. LOGO: Positioned with drop-shadow for clarity */}
      <div className="absolute top-6 left-6 z-30">
        <img
          src={WhiteLogo}
          alt="Logo"
          className="w-32 sm:w-40 drop-shadow-2xl filter brightness-110"
        />
      </div>

      {/* 3. MAIN CARD CONTAINER */}
      <div className="relative z-10 w-full max-w-5xl my-auto">
        <div className="bg-green-900/85 backdrop-blur-md rounded-[2rem] overflow-hidden flex flex-col md:flex-row items-stretch shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
          
          {/* LEFT SIDE: Information */}
          <div className="flex-1 p-8 md:p-14 text-white flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Let’s Get <br className="hidden lg:block" /> Started
              </h2>
              <p className="text-green-50/80 text-lg leading-relaxed max-w-sm">
                Create your account and start tracking your sustainable lifestyle in a few simple steps.
              </p>
            </div>

            <ul className="space-y-5">
              {[
                "Track daily eco-friendly habits",
                "Monitor your carbon footprint",
                "Learn through the community feed",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-4 group">
                  <div className="h-2 w-2 bg-green-400 rounded-full group-hover:scale-150 transition-transform" />
                  <span className="text-sm md:text-base font-medium opacity-90">{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-white/10">
              <p className="text-sm italic text-green-300/80">
                Joining is quick, free, and helps you make a positive environmental impact.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: Registration Form */}
          <div className="flex-1 bg-white/10 backdrop-blur-2xl p-8 md:p-14 flex flex-col justify-center">
            <h2 className="text-white text-3xl font-bold mb-8 text-center md:text-left">Register</h2>

            <form className="flex flex-col gap-5">
              {/* Name Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="text-white text-xs font-semibold uppercase tracking-wider ml-1">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    className="p-3.5 rounded-xl bg-white/10 border border-white/20 placeholder-white/40 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all focus:bg-white/20"
                  />
                </div>

                <div className="flex-1 space-y-1.5">
                  <label className="text-white text-xs font-semibold uppercase tracking-wider ml-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="p-3.5 rounded-xl bg-white/10 border border-white/20 placeholder-white/40 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all focus:bg-white/20"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-white text-xs font-semibold uppercase tracking-wider ml-1">Email</label>
                <input
                  type="email"
                  placeholder="hello@example.com"
                  className="p-3.5 rounded-xl bg-white/10 border border-white/20 placeholder-white/40 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all focus:bg-white/20"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-white text-xs font-semibold uppercase tracking-wider ml-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="p-3.5 rounded-xl bg-white/10 border border-white/20 placeholder-white/40 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all focus:bg-white/20"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-white text-xs font-semibold uppercase tracking-wider ml-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="p-3.5 rounded-xl bg-white/10 border border-white/20 placeholder-white/40 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all focus:bg-white/20"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-500 transition-all text-white font-bold py-4 rounded-xl mt-4 shadow-xl active:scale-[0.97] hover:shadow-green-900/20 hover:-translate-y-0.5"
              >
                Create Account
              </button>

              {/* Login Link */}
              <p className="text-sm text-center text-white/70 mt-4">
                Already have an account?{" "}
                <button 
                  type="button" 
                  className="font-bold text-green-300 hover:text-white transition-colors underline decoration-green-400/50 underline-offset-4 hover:decoration-white"
                >
                  Login
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;