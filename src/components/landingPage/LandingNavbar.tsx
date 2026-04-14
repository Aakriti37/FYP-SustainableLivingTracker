// components/landing/LandingNavbar.tsx
// Shows Login/Register when logged out
// Shows user name + Go to Dashboard when logged in

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import logo from "../../assets/GreenLogo.png";
import { useAuth } from "../../context/AuthContext";

const LandingNavbar = () => {
    const [isOpen,   setIsOpen]   = useState(false);
    const { user, isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    const dashboardPath = user?.role === "admin" ? "/admin/dashboard" : "/dashboard";

    const handleLogout = () => {
        logout();
        navigate("/");
        setIsOpen(false);
    };

    const navLinks = [
        { href: "#home",     label: "Home"     },
        { href: "#features", label: "Features" },
        { href: "#about",    label: "About"    },
        // { href: "#contact",  label: "Contact"  },
    ];

    return (
        <nav className="bg-white text-black sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

                {/* Logo */}
                <NavLink to="/" className="flex items-center">
                    {/* <img src={logo} alt="SLT Logo" className="h-14 w-auto object-contain" /> */}
                    <p className="text-sm text-[#3f7708] font-bold text-center">Sustainable Living <br /> Tracker</p>
                </NavLink>

                {/* Desktop nav links */}
                <ul className="hidden md:flex space-x-8 font-medium">
                    {navLinks.map(link => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className="hover:text-green-600 transition-colors font-medium"
                                style={{ color: '#022202' }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#508C12')}
                                onMouseLeave={e => (e.currentTarget.style.color = '#022202')}
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Desktop auth buttons */}
                <div className="hidden md:flex items-center gap-3">
                    {isLoggedIn && user ? (
                        <>
                            {/* User greeting */}
                            <span className="text-sm font-semibold" style={{ color: '#2d6a10' }}>
                                Hi, {user.firstName || user.email.split("@")[0]}!
                            </span>

                            {/* Go to Dashboard */}
                            <NavLink
                                to={dashboardPath}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all"
                                style={{ background: '#508C12' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#3f7708')}
                                onMouseLeave={e => (e.currentTarget.style.background = '#508C12')}
                            >
                                <LayoutDashboard size={16} />
                                Dashboard
                            </NavLink>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all"
                                style={{ borderColor: '#c5e3a0', color: '#2d6a10' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#f0f7e6')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className="px-4 py-2 border rounded-xl text-sm font-bold transition-all"
                                style={{ borderColor: '#508C12', color: '#508C12' }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.background = '#508C12';
                                    (e.currentTarget as HTMLElement).style.color = 'white';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.background = 'white';
                                    (e.currentTarget as HTMLElement).style.color = '#508C12';
                                }}
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/register"
                                className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all"
                                style={{ background: '#508C12' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#3f7708')}
                                onMouseLeave={e => (e.currentTarget.style.background = '#508C12')}
                            >
                                Register
                            </NavLink>
                        </>
                    )}
                </div>

                {/* Mobile menu button */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white px-6 pb-6 space-y-3 border-t" style={{ borderColor: '#e8f5d0' }}>
                    {navLinks.map(link => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="block py-2 font-medium transition-colors"
                            style={{ color: '#022202' }}
                        >
                            {link.label}
                        </a>
                    ))}

                    <div className="pt-3 border-t space-y-2" style={{ borderColor: '#e8f5d0' }}>
                        {isLoggedIn && user ? (
                            <>
                                <p className="text-sm font-semibold" style={{ color: '#2d6a10' }}>
                                    Hi, {user.firstName || user.email.split("@")[0]}!
                                </p>
                                <NavLink
                                    to={dashboardPath}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-2 w-full text-center justify-center py-2.5 rounded-xl text-sm font-bold text-white"
                                    style={{ background: '#508C12' }}
                                >
                                    <LayoutDashboard size={15} /> Dashboard
                                </NavLink>
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-2.5 rounded-xl text-sm font-bold border transition-all"
                                    style={{ borderColor: '#c5e3a0', color: '#2d6a10' }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-center border py-2.5 rounded-xl text-sm font-bold"
                                    style={{ borderColor: '#508C12', color: '#508C12' }}
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-center py-2.5 rounded-xl text-sm font-bold text-white"
                                    style={{ background: '#508C12' }}
                                >
                                    Register
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default LandingNavbar;
