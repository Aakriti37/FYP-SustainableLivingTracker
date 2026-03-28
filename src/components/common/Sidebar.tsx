import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Settings,
  LogOut,
  FileText,
  MessageCircle,
  Leaf,
  ArrowLeft
} from "lucide-react";
import logo from "../../assets/WhiteLogo.png";

interface SidebarProps {
  role: "admin" | "user";
  isOpen?: boolean;
}

const Sidebar = ({ role, isOpen = true }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const adminLinks = [
    { path: "/", icon: ArrowLeft, label: "Landing Page" },
    { path: "/admin/dashboard", icon: Home, label: "Dashboard" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/posts", icon: MessageCircle, label: "Posts" },
    { path: "/admin/profile", icon: Settings, label: "Profile" },
  ];

  const userLinks = [
    { path: "/", icon: ArrowLeft, label: "Landing Page" },
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/habits", icon: FileText, label: "Habits" },
    { path: "/goals", icon: FileText, label: "Goals" },
    { path: "/carbon", icon: Leaf, label: "Carbon App" },
    { path: "/community", icon: MessageCircle, label: "Community Feed" },
    { path: "/profile", icon: Settings, label: "Profile" },
  ];

  const linksToRender = role === "admin" ? adminLinks : userLinks;

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <aside
      className={`w-64 bg-linear-to-b from-green-800 to-green-900 text-white min-h-screen fixed left-0 top-0 transition-transform duration-300 ease-in-out z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <div className="p-6 flex flex-col items-center">
        <img src={logo} alt="SLT Logo" className="w-40 mb-8 object-contain drop-shadow-lg" />

        <nav className="space-y-2 w-full">
          {linksToRender.map((link) => {
            const Icon = link.icon;
            // Exact match for landing page, otherwise startsWith
            const isActive = link.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(link.path);

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition ${isActive
                  ? "bg-green-600 text-white"
                  : "hover:bg-green-700 text-green-100"
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-600 text-green-100 transition mt-8"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;