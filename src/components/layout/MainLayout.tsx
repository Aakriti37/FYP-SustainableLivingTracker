// components/layout/MainLayout.tsx
// No structural changes — just uses updated Navbar and Sidebar

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import Navbar  from "../common/Navbar";

interface MainLayoutProps {
    role: "admin" | "user";
}

const MainLayout = ({ role }: MainLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    const isUser = role === "user";

    return (
        <div className="flex min-h-screen font-sans text-gray-800" style={{ background: '#f0f7e6' }}>

            {/* Admin sidebar only */}
            {!isUser && (
                <Sidebar role={role} isOpen={isSidebarOpen} />
            )}

            {/* Main content area */}
            <div
                className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
                style={{ marginLeft: !isUser && isSidebarOpen ? '256px' : '0' }}
            >
                <Navbar
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                    role={role}
                />

                <main className="flex-1 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
