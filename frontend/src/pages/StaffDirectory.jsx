import React, { useEffect, useState } from "react";
import { API } from "../api/api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function StaffDirectory() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await API.get("/auth/users");
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load staff list");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm("Are you sure you want to remove this account? This action cannot be undone.")) return;
        try {
            await API.delete(`/auth/users/${userId}`);
            toast.success("Account removed");
            setUsers(users.filter(u => u._id !== userId));
        } catch (err) {
            toast.error("Failed to delete account");
        }
    };

    return (
        <div className="font-['Plus_Jakarta_Sans'] pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Staff Directory</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage hospital access and roles</p>
                </div>
                <Link to="/register" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-gray-300 hover:bg-black hover:-translate-y-0.5 transition-all flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
                    <span>Register New Staff</span>
                </Link>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 font-bold text-gray-400 text-xs uppercase tracking-wider">Name</th>
                                <th className="px-8 py-5 font-bold text-gray-400 text-xs uppercase tracking-wider">Email</th>
                                <th className="px-8 py-5 font-bold text-gray-400 text-xs uppercase tracking-wider">Role</th>
                                <th className="px-8 py-5 font-bold text-gray-400 text-xs uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((u) => (
                                <tr key={u._id} className="group hover:bg-blue-50/30 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-500 text-sm">
                                                {u.name?.[0]}
                                            </div>
                                            <span className="font-black text-gray-900">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 font-medium text-gray-600">{u.email}</td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide
                                            ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}
                                        `}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button
                                            onClick={() => handleDelete(u._id)}
                                            className="text-gray-400 hover:text-red-600 font-bold text-xs uppercase tracking-wider transition-colors hover:bg-red-50 px-3 py-1.5 rounded-lg"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && !loading && (
                        <div className="p-10 text-center text-gray-400 font-medium">No users found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
