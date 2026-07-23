import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    const NavItem = ({ to, icon, label }) => {
        const active = isActive(to);
        return (
            <Link
                to={to}
                className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group overflow-hidden
                    ${active
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200 translate-x-1"
                        : "text-gray-500 hover:bg-white hover:shadow-sm hover:text-blue-600 hover:translate-x-1"
                    }`}
            >
                {/* Active Indicator Glow */}
                {active && <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>}

                <div className={`transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}>
                    {icon}
                </div>
                <span className="relative z-10">{label}</span>

                {/* Chevron for active state */}
                {active && (
                    <div className="absolute right-3 opacity-60">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </div>
                )}
            </Link>
        );
    };

    return (
        <div className="w-72 bg-white/70 backdrop-blur-xl border-r border-white/50 flex flex-col h-screen sticky top-0 font-['Plus_Jakarta_Sans'] p-4 shadow-xl shadow-blue-900/5 z-20">
            {/* Logo */}
            <Link to="/" className="p-6 flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
                </div>
                <span className="font-extrabold text-2xl text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">BedManager</span>
            </Link>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto no-scrollbar px-2 space-y-6">
                {/* Main Menu */}
                <div>
                    <div className="px-4 mb-2 text-xs font-black text-gray-400 uppercase tracking-widest opacity-70">Main Menu</div>
                    <div className="space-y-1.5">
                        <NavItem
                            to="/dashboard"
                            label="Dashboard"
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>}
                        />
                        <NavItem
                            to="/patients"
                            label="Patients"
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
                        />
                        <NavItem
                            to="/admit"
                            label="Admit Patient"
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>}
                        />
                        <NavItem
                            to="/manage-beds"
                            label="Inventory"
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>}
                        />
                    </div>
                </div>

                {/* Admin Menu */}
                {user?.role === 'admin' && (
                    <div>
                        <div className="px-4 mb-2 text-xs font-black text-gray-400 uppercase tracking-widest opacity-70">Administration</div>
                        <div className="space-y-1.5">
                            <NavItem
                                to="/register"
                                label="Register Staff"
                                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>}
                            />
                            <NavItem
                                to="/staff"
                                label="Staff Directory"
                                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>}
                            />
                        </div>
                    </div>
                )}
            </nav>

            {/* Footer User Profile */}
            <div className="mt-auto px-2">
                <div className="p-4 bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-white/60 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5">
                            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                <span className="font-black text-transparent bg-clip-text bg-gradient-to-tr from-indigo-500 to-purple-500 uppercase">
                                    {user?.name?.[0] || 'U'}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="font-bold text-gray-900 truncate text-sm">{user?.name || 'User'}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{user?.role || 'Staff'}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full py-2.5 px-4 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all flex items-center justify-center gap-2 group"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
