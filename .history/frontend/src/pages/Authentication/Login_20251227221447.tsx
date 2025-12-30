import { LoginBg, Logo, RegisterBg } from "../../components/TS/Images"

const Login = () => {
  return (
    // <div className="relative h-screen w-full">

    //     {/* Background Image */}
    //     <img
    //         src={LoginBg}
    //         alt="Background"
    //         className="absolute inset-0 w-full h-full object-cover"
    //     />

    //     {/* Overlay */}
    //     <div className="absolute inset-0 bg-black bg-opacity-40"></div>

    //     {/* Main Content */}
    //     <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
            
    //         {/* Logo */}
    //         <img
    //         src={Logo}
    //         alt="Sustainable Living Tracker Logo"
    //         className="w-32 sm:w-40 mb-8"
    //         />

    //         {/* Login Form */}
    //         <div className="bg-white/20 backdrop-blur-md rounded-xl p-8 w-full max-w-md">
    //             <h2 className="text-white text-2xl font-semibold mb-6 text-center">
    //                 Login
    //             </h2>

    //             <form className="flex flex-col gap-4">
    //                 <input
    //                     type="email"
    //                     placeholder="Email"
    //                     className="p-3 rounded-md bg-white/30 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-green-500"
    //                 />
    //                 <input
    //                     type="password"
    //                     placeholder="Password"
    //                     className="p-3 rounded-md bg-white/30 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-green-500"
    //                 />
    //                 <button
    //                     type="submit"
    //                     className="bg-green-500 hover:bg-green-600 transition-colors text-white p-3 rounded-md mt-2"
    //                 >
    //                     Login
    //                 </button>
    //             </form>
    //         </div>
    //     </div>
    // </div>

    <div className='relative h-screen w-full'>
      
      
        <img 
        src={LoginBg}
        alt='Background Image'
        className='h-screen w-full object-cover' />

        {/* Logo */}
        <div className="absolute inset-0 flex justify-left">
            <img
            src={Logo}
            alt="Logo"
            className="w-32 sm:w-40 mb-8"
            />
        </div>

        {/* <div className='absolute inset-0 bg-white opacity-30'></div> */}

        {/* Centered Login Form */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">


            {/* Form Container */}
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