
import { RegisterBg, Logo } from "../../components/TS/Images"


const Register = () => {
  return (

    <div className='relative h-screen w-full'>
      
      
      <img 
      src={RegisterBg}
      alt='Background Image'
      className='h-screen w-full object-cover' />

      <div className='absolute inset-0 bg-grey opacity-80'></div>

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

export default Register