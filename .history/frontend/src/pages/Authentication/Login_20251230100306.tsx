import { LoginBg, WhiteLogo } from "../../components/TS/Images"

const Login = () => {
  return (

    <div className='relative h-screen w-full'>
      
        <img 
        src={LoginBg}
        alt='Background Image'
        className='h-screen w-full object-cover' />


        <div className='absolute inset-0 bg-black opacity-30'></div>

        {/* Logo */}
        <div></div>

        {/* Centered Login Form */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">


            {/* Form Container */}
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-8 w-full max-w-md">
                <h2 className="text-[#325D05] text-2xl font-bold mb-6 text-center">
                    Login
                </h2>

                <form className="flex flex-col gap-4">

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

                    <button
                        type="submit"
                        className="bg-[#325D05] hover:bg-[#417905] transition-colors text-white p-3 rounded-md mt-2 cursor-pointer"
                    >
                        Sign In
                    </button>

                    <p className="text-sm text-[#f9fdf5] text-center cursor-pointer">
                        Forgot Password ?
                    </p>

                    <p className="text-sm text-center">
                        Don't have an account ? <span className="text-[#1b3302] font-bold cursor-pointer">Sign Up</span>
                    </p>

                </form>
            </div>

        </div>

    </div>
  )
}

export default Login