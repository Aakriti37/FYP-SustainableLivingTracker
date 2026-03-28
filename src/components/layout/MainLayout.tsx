import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import Navbar from "../common/Navbar";

interface MainLayoutProps {
    role: "admin" | "user";
}

const MainLayout = ({ role }: MainLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const isUser = role === "user";

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
            {!isUser && <Sidebar role={role} isOpen={isSidebarOpen} />}

            <div
                className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${!isUser && isSidebarOpen ? 'ml-64' : 'ml-0'
                    }`}
            >
                <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} role={role} />

                <main className="flex-1 overflow-x-hidden pt-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
