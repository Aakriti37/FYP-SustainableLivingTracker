import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Settings,
  LogOut,
  FileText,
  MessageCircle
} from "lucide-react";

interface SidebarProps {
  role: "admin" | "user";
}

const Sidebar = ({ role }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const userLinks = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/habits", icon: FileText, label: "Habits" },
    { path: "/community", icon: Users, label: "Community" },
    { path: "/profile", icon: Settings, label: "Profile" },
  ];

  const adminLinks = [
    { path: "/admin/dashboard", icon: Home, label: "Dashboard" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/posts", icon: MessageCircle, label: "Posts" },
  ];

  const links = role === "admin" ? adminLinks : userLinks;

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-green-800 to-green-900 text-white min-h-screen fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-8 text-center">SLT🌱</h2>

        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition ${
                  isActive
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