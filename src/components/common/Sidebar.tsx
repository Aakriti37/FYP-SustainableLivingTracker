// components/common/Sidebar.tsx
// Admin sidebar only — clean admin links + landing page section links
// User links removed completely

import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    Home,
    Users,
    Settings,
    LogOut,
    MessageCircle,
    LayoutDashboard,
    ChevronRight,
} from "lucide-react";
import logo from "../../assets/WhiteLogo.png";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
    role:    "admin" | "user";
    isOpen?: boolean;
}

const adminLinks = [
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/users",     icon: Users,           label: "Users"     },
    { path: "/admin/posts",     icon: MessageCircle,   label: "Posts"     },
    { path: "/admin/profile",   icon: Settings,        label: "Profile"   },
];

const landingLinks = [
    { href: "#home",     label: "Home"     },
    { href: "#features", label: "Features" },
    { href: "#about",    label: "About"    },
    { href: "#contact",  label: "Contact"  },
];

const Sidebar = ({ isOpen = true }: SidebarProps) => {
    const navigate       = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside
            className="w-64 min-h-screen fixed left-0 top-0 z-30 flex flex-col transition-transform duration-300 ease-in-out"
            style={{
                background:  'linear-gradient(180deg, #022202 0%, #0d3d0a 50%, #17921f 100%)',
                transform:   isOpen ? 'translateX(0)' : 'translateX(-100%)',
            }}
        >
            {/* ── Logo ── */}
            <div className="p-6 flex justify-center border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <Link to="/">
                    <img src={logo} alt="SLT Logo" className="w-36 object-contain" />
                </Link>
            </div>

            {/* ── Admin info ── */}
            {user && (
                <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                    <div
                        className="flex items-center gap-3 px-3 py-2 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.08)' }}
                    >
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                            style={{ background: '#508C12', color: 'white' }}
                        >
                            {(user.firstName || user.email)[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">
                                {user.firstName || user.email.split("@")[0]}
                            </p>
                            <p className="text-xs capitalize" style={{ color: '#a8d080' }}>
                                {user.role}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Admin navigation ── */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                <p className="text-xs font-bold uppercase tracking-widest px-3 mb-3" style={{ color: 'rgba(168,208,128,0.5)' }}>
                    Admin Menu
                </p>

                {adminLinks.map(link => {
                    const Icon = link.icon;
                    return (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                                    isActive ? 'text-white' : ''
                                }`
                            }
                            style={({ isActive }) => ({
                                background: isActive ? '#508C12' : 'transparent',
                                color:      isActive ? 'white'   : 'rgba(212,237,170,0.85)',
                            })}
                            onMouseEnter={e => {
                                const el = e.currentTarget as HTMLElement;
                                if (!el.classList.contains('active')) {
                                    el.style.background = 'rgba(255,255,255,0.08)';
                                }
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget as HTMLElement;
                                if (!el.style.background.includes('#508C12')) {
                                    el.style.background = 'transparent';
                                }
                            }}
                        >
                            <span className="flex items-center gap-3">
                                <Icon size={18} />
                                {link.label}
                            </span>
                            <ChevronRight size={14} className="opacity-50" />
                        </NavLink>
                    );
                })}

                {/* ── Landing page links ── */}
                <div className="pt-4 mt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                    <p className="text-xs font-bold uppercase tracking-widest px-3 mb-3" style={{ color: 'rgba(168,208,128,0.5)' }}>
                        Landing Page
                    </p>

                    <Link
                        to="/"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold mb-1 transition-all"
                        style={{ color: 'rgba(212,237,170,0.85)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                        <Home size={18} />
                        Landing Page
                    </Link>

                    {landingLinks.map(link => (
                        <a
                            key={link.href}
                            href={`/${link.href}`}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all"
                            style={{ color: 'rgba(168,208,128,0.7)' }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                                (e.currentTarget as HTMLElement).style.color = 'rgba(212,237,170,0.9)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.background = 'transparent';
                                (e.currentTarget as HTMLElement).style.color = 'rgba(168,208,128,0.7)';
                            }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#508C12' }} />
                            {link.label}
                        </a>
                    ))}
                </div>
            </nav>

            {/* ── Logout ── */}
            <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{ color: '#fca5a5' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.15)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
