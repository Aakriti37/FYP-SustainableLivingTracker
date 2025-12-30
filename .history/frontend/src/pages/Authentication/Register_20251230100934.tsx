{/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl px-4 py-12 lg:py-0">
        <div className="bg-green-900/80 backdrop-blur-sm rounded-3xl overflow-hidden flex flex-col md:flex-row items-stretch shadow-2xl">
          
          {/* Left Side - Info */}
          <div className="flex-1 p-8 md:p-12 text-white flex flex-col justify-center space-y-6">
            <div>
              <h2 className="text-4xl font-bold mb-4">Let’s Get Started</h2>
              <p className="text-green-50 opacity-90 leading-relaxed">
                Create your account and start tracking your sustainable lifestyle in a few simple steps.
              </p>
            </div>

            <ul className="space-y-4">
              {[
                "Track daily eco-friendly habits",
                "Monitor your carbon footprint",
                "Learn through the community feed",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="h-2 w-2 bg-green-400 rounded-full" />
                  <span className="text-sm md:text-base">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm italic text-green-200">
              Joining is quick, free, and helps you make a positive impact.
            </p>
          </div>

          {/* Right Side - Registration Form */}
          <div className="flex-1 bg-white/10 backdrop-blur-xl p-8 md:p-12 border-l border-white/10">
            <h2 className="text-white text-3xl font-bold mb-8 text-center md:text-left">Register</h2>

            <form className="flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="text-white text-xs font-medium ml-1">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    className="p-3 rounded-xl bg-white/20 border border-white/20 placeholder-white/60 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                  />
                </div>

                <div className="flex-1 space-y-1.5">
                  <label className="text-white text-xs font-medium ml-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="p-3 rounded-xl bg-white/20 border border-white/20 placeholder-white/60 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-white text-xs font-medium ml-1">Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="p-3 rounded-xl bg-white/20 border border-white/20 placeholder-white/60 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-white text-xs font-medium ml-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="p-3 rounded-xl bg-white/20 border border-white/20 placeholder-white/60 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-white text-xs font-medium ml-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="p-3 rounded-xl bg-white/20 border border-white/20 placeholder-white/60 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                />
              </div>

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-500 transition-all text-white font-bold p-4 rounded-xl mt-4 shadow-lg active:scale-[0.98]"
              >
                Sign Up
              </button>

              <p className="text-sm text-center text-white/80 mt-2">
                Already have an account?{" "}
                <span className="font-bold cursor-pointer text-green-300 hover:text-white transition-colors underline decoration-green-300 underline-offset-4">
                  Login
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>