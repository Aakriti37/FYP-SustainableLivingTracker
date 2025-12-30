import React from "react";
import { RegisterBg, WhiteLogo } from "../../components/TS/Images";

const Register = () => {
  return (
    /* OUTER WRAPPER: 
       Locked to h-screen and overflow-hidden to prevent any page scrolling.
    */
    <div className="relative h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden">
      
      {/* 1. FIXED BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src={RegisterBg}
          alt="Background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* 2. DEDICATED LOGO DIV: Positioned higher up */}
      <div className="absolute top-4 left-6 z-30 sm:top-6 sm:left-10">
        <img
          src={WhiteLogo}
          alt="Logo"
          className="w-28 sm:w-36 md:w-40 drop-shadow-2xl brightness-110"
        />
      </div>

      {/* 3. MAIN CARD CONTAINER: 
          Uses max-h-[85vh] to ensure a gap remains above and below the card.
      */}
      <div className="relative z-10 w-full max-w-5xl max-h-[85vh] flex flex-col md:flex-row bg-green-900/90 backdrop-blur-md rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 mt-8">
        
        {/* LEFT SIDE: Info (Hidden on smaller mobile devices for space) */}
        <div className="hidden md:flex flex-1 p-8 lg:p-14 text-white flex-col justify-center space-y-8">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Let’s Get <br /> Started
            </h2>
            <p className="text-green-50/80 text-lg leading-relaxed max-w-xs">
              Create your account and start tracking your sustainable lifestyle.
            </p>
          </div>

          <ul className="space-y-4">
            {["Track daily eco-habits", "Monitor carbon footprint", "Join the community"].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-sm font-medium">
                <div className="h-2 w-2 bg-green-400 rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT SIDE: Form (Internal scroll enabled for small heights) */}
        <div className="flex-1 bg-white/10 backdrop-blur-3xl p-6 md:p-12 overflow-y-auto custom-scrollbar">
          <h2 className="text-white text-3xl font-bold mb-8 text-center md:text-left">Register</h2>

          <form className="flex flex-col gap-5">
            {/* Name Row */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 space-y-1.5">
                <label className="text-white text-[11px] font-bold uppercase tracking-wider ml-1">First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  className="p-3 rounded-xl bg-white/10 border border-white/20 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-sm"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="text-white text-[11px] font-bold uppercase tracking-wider ml-1">Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="p-3 rounded-xl bg-white/10 border border-white/20 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-white text-[11px] font-bold uppercase tracking-wider ml-1">Email</label>
              <input
                type="email"
                placeholder="hello@example.com"
                className="p-3 rounded-xl bg-white/10 border border-white/20 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-sm"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-white text-[11px] font-bold uppercase tracking-wider ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="p-3 rounded-xl bg-white/10 border border-white/20 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-sm"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-white text-[11px] font-bold uppercase tracking-wider ml-1">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="p-3 rounded-xl bg-white/10 border border-white/20 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl mt-4 shadow-xl active:scale-[0.98] transition-all"
            >
              Sign Up
            </button>

            <p className="text-sm text-center text-white/70 mt-2">
              Already have an account?{" "}
              <button type="button" className="font-bold text-green-300 hover:text-white transition-colors underline underline-offset-4">
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;