import { Menu, Bell, Home, Leaf, FileText, Target, Users, Settings, LogOut, ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/WhiteLogo.png";

interface NavbarProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
    role: "admin" | "user";
}

const Navbar = ({ toggleSidebar, role }: NavbarProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isUser = role === "user";

    const userLinks = [
        { path: "/dashboard", icon: Home, label: "Dashboard" },
        { path: "/carbon", icon: Leaf, label: "Carbon" },
        { path: "/habits", icon: FileText, label: "Habits" },
        { path: "/goals", icon: Target, label: "Goals" },
        { path: "/community", icon: Users, label: "Community" },
        { path: "/profile", icon: Settings, label: "Profile" },
    ];

    const handleLogout = () => {
        navigate("/login");
    };

    return (
        <header className={`${isUser ? 'bg-linear-to-r from-emerald-800 to-teal-800 text-white' : 'bg-white border-b border-gray-100 text-gray-600'} h-16 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm transition-colors`}>
            <div className="flex items-center gap-4">
                {!isUser ? (
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        aria-label="Toggle Sidebar"
                    >
                        <Menu size={24} />
                    </button>
                ) : (
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center group cursor-pointer" title="Go to Landing Page">
                            <img src={logo} alt="Logo" className="h-12 md:h-14 w-auto opacity-90 group-hover:opacity-100 transition-opacity object-contain" />
                        </Link>
                        <div className="h-6 w-px bg-emerald-700/50 mx-2 hidden sm:block"></div>
                        <Link to="/" className="flex items-center gap-2 text-emerald-100 hover:text-white transition-colors group px-2 py-1 rounded-lg hover:bg-white/10">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-semibold text-sm hidden sm:inline">Landing Page</span>
                        </Link>
                        <div className="h-6 w-px bg-emerald-700/50 mx-2 hidden sm:block"></div>
                        <nav className="flex space-x-1">
                            {userLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = location.pathname.startsWith(link.path);
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${isActive
                                            ? "bg-white/20 text-white shadow-inner"
                                            : "hover:bg-white/10 text-emerald-100"
                                            }`}
                                    >
                                        <Icon size={16} />
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                <button className={`p-2 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isUser ? 'hover:bg-white/10 text-emerald-100' : 'hover:bg-gray-100 text-gray-600'}`}>
                    <Bell size={22} />
                    <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>
                {isUser && (
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-full hover:bg-red-500/20 text-emerald-100 hover:text-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 ml-2"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                )}
            </div>
        </header>
    );
};

export default Navbar;
