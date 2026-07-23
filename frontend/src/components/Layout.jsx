import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";

export default function Layout() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!user) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div className="flex min-h-screen bg-[#F8F9FC] font-['Plus_Jakarta_Sans'] relative overflow-hidden">
            {/* Global Theme Background Blobs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-100/40 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto h-screen relative z-10">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
            <Toaster position="top-right" />
        </div>
    );
}
