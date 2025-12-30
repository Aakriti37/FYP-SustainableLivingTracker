import { RegisterBg, WhiteLogo } from "../../components/TS/Images";

const Register = () => {
  return (
    <div className="relative h-screen w-full">
        {/* Background Image */}
        <img
            src={RegisterBg}
            alt="Background Image"
            className="h-screen w-full object-cover"
        />

        {/* Dark Green Transparent Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-green-900/70 rounded-2xl p-8 w-full max-w-6xl flex flex-col md:flex-row gap-8">
            
            {/* Left Side - Info */}
            <div className="text-white flex-1 space-y-4">
                <h2 className="text-3xl font-bold">Let’s Get Started</h2>
                <p>Create your account and start tracking your sustainable lifestyle in a few simple steps.</p>

                <ul className="list-disc list-inside space-y-2">
                <li>Track daily eco-friendly habits</li>
                <li>Monitor your carbon footprint</li>
                <li>Share and learn through the community feed</li>
                </ul>

                <p>Joining is quick, free, and helps you make a positive environmental impact.</p>
            </div>

            {/* Right Side - Registration Form */}
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-8 flex-1">
                <h2 className="text-[#f9fdf5] text-2xl font-bold mb-6 text-center">Register</h2>

                <form className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <div className="flex-1">
                    <label className="text-white text-sm">First Name</label>
                    <input
                        type="text"
                        placeholder="First Name"
                        className="p-3 rounded-md bg-white/30 placeholder-white text-white w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    </div>

                    <div className="flex-1">
                    <label className="text-white text-sm">Last Name</label>
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="p-3 rounded-md bg-white/30 placeholder-white text-white w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    </div>
                </div>

                <label className="text-white text-sm">Email</label>
                <input
                    type="email"
                    placeholder="Email"
                    className="p-3 rounded-md bg-white/30 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <label className="text-white text-sm">Password</label>
                <input
                    type="password"
                    placeholder="Password"
                    className="p-3 rounded-md bg-white/30 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <label className="text-white text-sm">Confirm Password</label>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="p-3 rounded-md bg-white/30 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <button
                    type="submit"
                    className="bg-[#325D05] hover:bg-[#417905] transition-colors text-white p-3 rounded-md mt-2 cursor-pointer"
                >
                    Sign Up
                </button>

                <p className="text-sm text-center text-[#f9fdf5] mt-2">
                    Already have an account? <span className="font-bold cursor-pointer text-[#1b3302]">Login</span>
                </p>
                </form>
            </div>

            </div>
        </div>

        {/* Logo */}
        <img
            src={WhiteLogo}
            alt="Logo"
            className="absolute top-1 left-4 w-32 sm:w-40"
        />
    </div>
  );
};

export default Register;
