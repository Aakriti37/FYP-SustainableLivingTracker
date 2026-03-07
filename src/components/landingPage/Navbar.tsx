import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../assets/GreenLogo.png";

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);

    // const navLinkStyle = ({ isActive }: { isActive: boolean }) =>
    //     isActive ? "text-green-400 font-semibold" : "hover:text-green-400 transition";

  return (
    <nav className="bg-white text-black sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            
            {/* Logo */}
            <NavLink to="/" className="flex items-center">
                <div className="flex items-center relative -my-2 mx-4">
                    <img
                    src={logo}
                    alt="SLT Logo"
                    className="h-14 w-auto object-contain scale-200"
                    />
                </div>
            </NavLink>

            {/* Navigation Links */}
            <ul className="hidden md:flex space-x-8 font-medium">
                <li>
                    <a href="#home" className="hover:text-green-400 transition">
                        Home
                    </a>
                </li>

                <li>
                    <a href="#features" className="hover:text-green-400 transition">
                        Features
                    </a>
                </li>

                <li>
                    <a href="#about" className="hover:text-green-400 transition">
                        About
                    </a>
                </li>

                <li>
                    <a href="#contact" className="hover:text-green-400 transition">
                        Contact
                    </a>
                </li>
            </ul>

            {/* Authentication Buttons */}
            <div className="hidden md:flex space-x-4">
                <NavLink
                to="/login"
                className="px-4 py-2 border border-green-400 rounded-lg hover:bg-green-400 hover:text-slate-900 transition">
                    Login
                </NavLink>

                <NavLink
                to="/register"
                className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition">
                    Register
                </NavLink>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>

        </div>


        {/* Mobile Menu */}
        {isOpen && (
            <div className="md:hidden bg-white px-6 pb-6 space-y-4">
                <a href="#home" className="block hover:text-green-400 transition">Home</a>
                <a href="#features" className="block hover:text-green-400 transition">Features</a>
                <a href="#about" className="block hover:text-green-400 transition">About</a>
                <a href="#contact" className="block hover:text-green-400 transition">Contact</a>

                <div className="pt-4 border-t border-slate-600 space-y-3">
                    <NavLink
                    to="/login"
                    className="block text-center border border-green-400 py-2 rounded-lg hover:bg-green-400 hover:text-slate-900 transition">
                        Login
                    </NavLink>

                    <NavLink
                    to="/register"
                    className="block text-center bg-green-500 py-2 rounded-lg hover:bg-green-600 transition">
                        Register
                    </NavLink>
                </div>
            </div>
        )}

    </nav>
  );
};

export default Navbar;