// components/common/Navbar.tsx
import { useState } from "react";
import { Menu, LogOut, X } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Leaf, FileText, Target, Users, Settings, Sparkles, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../../pages/User/components/common/NotificationBell";

interface NavbarProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
    role:          "admin" | "user";
}

const userAppLinks = [
    { path: "/dashboard",       icon: LayoutDashboard, label: "Dashboard"   },
    { path: "/carbon",          icon: Leaf,            label: "Carbon"      },
    { path: "/habits",          icon: FileText,        label: "Habits"      },
    { path: "/goals",           icon: Target,          label: "Goals"       },
    { path: "/community",       icon: Users,           label: "Community"   },
    { path: "/eco-suggestions", icon: Sparkles,        label: "Eco AI"      },
    { path: "/profile",         icon: Settings,        label: "Profile"     },
];

const landingLinks = [
    { href: "#home",     label: "Home"     },
    { href: "#features", label: "Features" },
    { href: "#about",    label: "About"    },
];

const Navbar = ({ toggleSidebar, role }: NavbarProps) => {
    const location = useLocation();
    const navigate  = useNavigate();
    const { user, logout } = useAuth();
    const isUser = role === "user";
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // ✅ new state

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <>
            <header
                className="h-16 flex items-center justify-between px-4 sticky top-0 z-20 shadow-sm"
                style={{
                    background: isUser
                        ? 'linear-gradient(to right, #022202, #17921f)'
                        : 'white',
                    borderBottom: isUser ? 'none' : '1px solid #e5e7eb',
                }}
            >
                {/* ── Left side ── */}
                <div className="flex items-center gap-3">

                    {/* Admin — hamburger menu */}
                    {!isUser && (
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg transition-colors shrink-0"
                            style={{ color: '#508C12' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f0f7e6')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                            <Menu size={24} />
                        </button>
                    )}

                    {/* User — Logo + desktop nav */}
                    {isUser && (
                        <div className="flex items-center gap-2 shrink-0">
                            {/* ✅ Mobile hamburger for user */}
                            <button
                                onClick={() => setMobileMenuOpen(prev => !prev)}
                                className="xl:hidden p-2 rounded-lg transition-colors shrink-0"
                                style={{ color: 'rgba(212,237,170,0.85)' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>

                            {/* Logo */}
                            <Link to="/" className="flex items-center group shrink-0">
                                <p className="text-white text-center text-sm font-bold">Sustainable Living<br />Tracker</p>
                            </Link>

                            {/* Divider */}
                            <div className="h-6 w-px mx-1 hidden lg:block" style={{ background: 'rgba(255,255,255,0.2)' }} />

                            {/* Landing links — desktop only */}
                            <div className="hidden lg:flex items-center gap-1">
                                {landingLinks.map(link => (
                                    
                                        key={link.href}
                                        href={`/${link.href}`}
                                        className="px-2 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                        style={{ color: 'rgba(212,237,170,0.8)' }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLElement).style.color = 'white';
                                            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLElement).style.color = 'rgba(212,237,170,0.8)';
                                            (e.currentTarget as HTMLElement).style.background = 'transparent';
                                        }}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="h-6 w-px mx-1 hidden xl:block" style={{ background: 'rgba(255,255,255,0.2)' }} />

                            {/* App nav links — desktop only */}
                            <nav className="hidden xl:flex items-center gap-0.5">
                                {userAppLinks.map(link => {
                                    const Icon     = link.icon;
                                    const isActive = location.pathname.startsWith(link.path);
                                    return (
                                        <NavLink
                                            key={link.path}
                                            to={link.path}
                                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                            style={{
                                                background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                                                color:      isActive ? 'white' : 'rgba(212,237,170,0.85)',
                                            }}
                                            onMouseEnter={e => {
                                                if (!isActive) {
                                                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
                                                    (e.currentTarget as HTMLElement).style.color = 'white';
                                                }
                                            }}
                                            onMouseLeave={e => {
                                                if (!isActive) {
                                                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                                                    (e.currentTarget as HTMLElement).style.color = 'rgba(212,237,170,0.85)';
                                                }
                                            }}
                                        >
                                            <Icon size={14} />
                                            <span>{link.label}</span>
                                        </NavLink>
                                    );
                                })}
                            </nav>
                        </div>
                    )}

                    {/* Admin label */}
                    {!isUser && (
                        <span className="font-bold text-lg" style={{ color: '#022202' }}>
                            Admin Panel
                        </span>
                    )}
                </div>

                {/* ── Right side ── */}
                <div className="flex items-center gap-2 shrink-0">
                    {user && (
                        <span
                            className="text-xs font-semibold hidden sm:block"
                            style={{ color: isUser ? 'rgba(212,237,170,0.9)' : '#4a7c2f' }}
                        >
                            {user.firstName || user.email.split("@")[0]}
                        </span>
                    )}
                    <NotificationBell isUser={isUser} />
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                        style={{
                            background: isUser ? 'rgba(239,68,68,0.15)' : '#fef2f2',
                            color:      isUser ? '#fca5a5'              : '#ef4444',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = isUser ? 'rgba(239,68,68,0.25)' : '#fee2e2';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = isUser ? 'rgba(239,68,68,0.15)' : '#fef2f2';
                        }}
                        title="Logout"
                    >
                        <LogOut size={14} />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            {/* ✅ Mobile dropdown menu — only for user role */}
            {isUser && mobileMenuOpen && (
                <div
                    className="xl:hidden sticky top-16 z-10 shadow-lg"
                    style={{ background: 'linear-gradient(to bottom, #022202, #0d3d0a)' }}
                >
                    <nav className="flex flex-col py-2">
                        {userAppLinks.map(link => {
                            const Icon     = link.icon;
                            const isActive = location.pathname.startsWith(link.path);
                            return (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)} // ✅ close on navigate
                                    className="flex items-center gap-3 px-6 py-3 text-sm font-semibold transition-all"
                                    style={{
                                        background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        color:      isActive ? 'white' : 'rgba(212,237,170,0.85)',
                                        borderLeft: isActive ? '3px solid #17921f' : '3px solid transparent',
                                    }}
                                >
                                    <Icon size={18} />
                                    <span>{link.label}</span>
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>
            )}
        </>
    );
};

export default Navbar;