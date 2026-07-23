// frontend/src/pages/RegisterStaff.jsx
import React, { useEffect, useState } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function RegisterStaff() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // admin-only guard
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "admin") {
      toast.error("Access denied — admin only");
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.email.trim()) return toast.error("Email is required");
    if (!form.password || form.password.length < 6) return toast.error("Password must be at least 6 characters");

    try {
      setLoading(true);
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role || "staff",
      };
      const res = await API.post("/auth/register-staff", payload);
      toast.success(`Created user: ${res.data.user?.email || payload.email}`);
      setForm({ name: "", email: "", password: "", role: "staff" });
    } catch (err) {
      console.error("register error", err);
      const msg = err?.message || err?.response?.data?.error || "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-[ 'Plus_Jakarta_Sans',_sans-serif]">
      <div className="w-full max-w-4xl">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[40px] shadow-2xl shadow-blue-900/5 border border-white/60 overflow-hidden flex flex-col md:flex-row relative">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -z-10 -ml-16 -mb-16 pointer-events-none"></div>

          {/* Left Side: Form */}
          <div className="p-8 md:p-12 flex-1">
            <div className="mb-10">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Register Staff</h1>
              <p className="text-gray-500 mt-2 font-medium">Create secure accounts for hospital personnel</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  </div>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Jane Smith"
                    className="w-full pl-12 bg-gray-50 border-2 border-transparent focus:border-blue-100 p-4 rounded-2xl focus:ring-0 focus:bg-white outline-none transition-all font-bold text-gray-900 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@hospital.com"
                    className="w-full pl-12 bg-gray-50 border-2 border-transparent focus:border-blue-100 p-4 rounded-2xl focus:ring-0 focus:bg-white outline-none transition-all font-bold text-gray-900 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </div>
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 bg-gray-50 border-2 border-transparent focus:border-blue-100 p-4 rounded-2xl focus:ring-0 focus:bg-white outline-none transition-all font-bold text-gray-900 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">Role</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    </div>
                    <select name="role" value={form.role} onChange={handleChange} className="w-full pl-12 bg-gray-50 border-2 border-transparent focus:border-blue-100 p-4 rounded-2xl focus:ring-0 focus:bg-white outline-none appearance-none font-bold text-gray-900">
                      <option value="staff">Medical Staff</option>
                      <option value="admin">System Admin</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-8 px-1">
                <button type="button" onClick={() => navigate("/")} className="flex-1 bg-white border-2 border-gray-200 text-gray-600 py-4 rounded-2xl hover:bg-gray-50 font-bold transition-all text-sm uppercase tracking-wide">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-[2] bg-gray-900 text-white py-4 rounded-2xl hover:bg-gray-800 font-bold transition-all shadow-xl shadow-gray-200 disabled:opacity-70 transform hover:-translate-y-1 active:scale-95 text-sm uppercase tracking-wide">
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>

          {/* Right Side: Visual */}
          <div className="hidden md:flex w-[320px] bg-gray-900 p-8 items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>
            <div className="z-10 text-center">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-gray-700">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Secure Access</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Ensure every staff member has the appropriate clearance level.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
