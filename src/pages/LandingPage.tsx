import FeaturesSection from "../components/landingPage/Features"
import HeroSection from "../components/landingPage/HeroSection"
import Navbar from "../components/landingPage/LandingNavbar"
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

    </div>
  )
}

export default LandingPage