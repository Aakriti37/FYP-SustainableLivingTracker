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

      <div className='absolute inset-0 bg-white opacity-30'></div>

      {/* <div className='absolute inset-0 flex flex-col items-center justify-center z-10 p-4'>
        
        <img 
        src={Logo}
        alt='Profile'
        className='w-24 h-24 rounded-full mb-4 border-4 border-purple-400 object-cover' />

        <h2 className='text-white text-2xl font-normal font-roboto mb-5'>Tania Andrew</h2>

        <input 
        type='password' 
        placeholder='Enter Password' 
        className='px-4 py-2 rounded-lg mb-10 w-full max-w-xs bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-purple-400' />

        <button className='bg-cyan-400 text-white px-8 py-2 rounded-lg font-medium hover:bg-cyan-500 transition'>
          Unlock
        </button>

      </div> */}

    </div>
  )
}

export default Login