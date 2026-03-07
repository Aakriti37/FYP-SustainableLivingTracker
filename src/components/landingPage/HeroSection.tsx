import BgImage from "../../assets/BlackBg Tree.jpg";


const HeroSection = () => {
  return (
    <section id="home" className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: `url(${BgImage})` }}>
      {/* <div className="absolute inset-0 bg-black/40"></div> */}
      
        <div className="relative z-10 flex items-center h-full px-8 lg:px-20">
            <div className="max-w-lg text-white">
                <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                    Track Your Sustainable Lifestyle
                </h1>

                <p className="text-lg lg:text-xl mb-8 leading-relaxed">
                    Monitor daily habits and 
                    reduce your personal <br />
                    carbon footprint with 
                    smart insights.
                </p>
                
                <button className="bg-[#508C12] hover:bg-[#3f7708] text-white font-semibold px-6 py-3 rounded-md transition">
                    Get Started
                </button>
            </div>
        </div>
    </section>
  )
}

export default HeroSection