
const Login = () => {
  return (
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <img
        src={bgImage}
        alt="Background"
        className="absolute w-full h-full object-cover"
      />

      {/* Overlay for blur effect */}
      <div className="absolute w-full h-full bg-black bg-opacity-40 backdrop-blur-sm"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Logo */}
        <img src={logo} alt="Logo" className="w-32 mb-8" />

        {/* Login Form */}
        <div className="bg-white/20 backdrop-blur-md rounded-xl p-8 w-full max-w-md">
          <h2 className="text-white text-2xl font-semibold mb-6 text-center">
            Login
          </h2>
          <form className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="p-3 rounded-md bg-white/30 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 rounded-md bg-white/30 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 transition-colors text-white p-3 rounded-md mt-2"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login