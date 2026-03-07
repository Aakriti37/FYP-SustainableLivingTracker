import FeaturesSection from "../components/landingPage/Features"
import HeroSection from "../components/landingPage/HeroSection"
import Navbar from "../components/landingPage/Navbar"
import AboutSection from "../components/landingPage/About"
import Footer from "../components/landingPage/Footer"

const LandingPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <HeroSection />

      <FeaturesSection />

      <AboutSection />

      <Footer />

      {/* <section id="home" className="h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold">Hero Section</h1>
      </section> */}
    </div>
  )
}

export default LandingPage