
import { Facebook, Instagram, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#022202] text-white pt-14 pb-6 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Section */}
        <div className="grid md:grid-cols-3 gap-10">
          
          {/* Left - Logo + Description */}
          <div>
            <h2 className="text-2xl font-bold mb-3 text-center">
              Sustainable Living Tracker
            </h2>

            <p className="text-green-200 text-sm leading-relaxed text-center">
              Empowering individuals to track sustainable habits, understand
              their environmental impact, and build a greener future.
            </p>
          </div>

          {/* Middle - Quick Links */}
          <div className="md:text-center">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            
            <ul className="space-y-2 text-green-200 text-sm">
                <li>
                    <a href="#home" className="hover:text-white transition">
                        Home
                    </a>
                </li>

                <li>
                    <a href="#about" className="hover:text-white transition">
                        About
                    </a>
                </li>

                <li>
                    <a href="#features" className="hover:text-white transition">
                        Features
                    </a>
                </li>

                <li>
                    <a href="#community" className="hover:text-white transition">
                        Community
                    </a>
                </li>

                <li>
                    <a href="#contact" className="hover:text-white transition">
                        Contact
                    </a>
                </li>
            </ul>
          </div>

          {/* Right - Social Links */}
          <div className="md:text-right">
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex md:justify-end gap-4">
              <Facebook className="hover:text-green-300 cursor-pointer transition" />
              <Instagram className="hover:text-green-300 cursor-pointer transition" />
              <Linkedin className="hover:text-green-300 cursor-pointer transition" />
              <Github className="hover:text-green-300 cursor-pointer transition" />
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-green-700 my-8"></div>

        {/* Bottom Section */}
        <div className="text-center text-green-300 text-sm">
          &copy; {new Date().getFullYear()} Sustainable Living Tracker. All Rights Reserved
        </div>

      </div>
    </footer>
  );
}