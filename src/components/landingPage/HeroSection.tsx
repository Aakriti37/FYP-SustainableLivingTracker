// pages/Landing/HeroSection.tsx

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BgImage from "../../assets/BlackBg Tree.jpg";

const HeroSection = () => {
  const navigate        = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const handleGetStarted = () => {
    if (isLoggedIn) {
      // Redirect to their dashboard based on role
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } else {
      // Not logged in → go to login
      navigate("/login");
    }
  };

  return (
    <section
      id="home"
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${BgImage})` }}
    >
      <div className="relative z-10 flex items-center h-full px-8 lg:px-20">
        
        <div className="max-w-lg text-white">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Track Your Sustainable Lifestyle
          </h1>

          <p className="text-lg lg:text-xl mb-8 leading-relaxed">
            Monitor daily habits and reduce your personal <br />
            carbon footprint with smart insights.
          </p>

          <button
            onClick={handleGetStarted}
            className="font-semibold px-6 py-3 rounded-md transition"
            style={{ background: '#508C12' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#3f7708')}
            onMouseLeave={e => (e.currentTarget.style.background = '#508C12')}
          >
            {isLoggedIn ? "Go to Dashboard" : "Get Started"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;