// frontend/src/pages/AddBed.jsx
import React, { useState, useEffect } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AddBed() {
  const [form, setForm] = useState({
    bedNumber: "",
    ward: "",
    type: "General", // default
    status: "Available", // default
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // simple auth guard: only admins should reach this
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) return navigate("/login");
    if (user.role !== "admin") {
      toast.error("Only admins can add beds");
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bedNumber.trim()) return toast.error("Bed number is required");
    if (!form.ward.trim()) return toast.error("Ward is required");

    try {
      setLoading(true);
      const payload = {
        bedNumber: form.bedNumber.trim(),
        ward: form.ward.trim(),
        type: form.type,
        status: form.status
      };

      const res = await API.post("/beds", payload);
      toast.success(`Bed ${res.data.bedNumber || res.data.bedNumber} created`);
      navigate("/");
    } catch (err) {
      console.error("AddBed error:", err);
      const msg = err?.message || err?.response?.data?.error || "Failed to add bed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto font-[ 'Plus_Jakarta_Sans',_sans-serif]">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Add Inventory</h1>
        <p className="text-gray-500 mt-2 text-lg">Expand hospital capacity by registering new beds</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-2xl p-10 md:p-12 rounded-[40px] shadow-2xl shadow-blue-900/5 border border-white/60 relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">Bed Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg>
                </div>
                <input
                  name="bedNumber"
                  value={form.bedNumber}
                  onChange={handleChange}
                  placeholder="e.g., B-104"
                  className="w-full pl-12 bg-gray-50 border-2 border-transparent focus:border-blue-100 p-4 rounded-2xl focus:ring-0 focus:bg-white outline-none transition-all font-bold text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">Ward Location</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </div>
                <input
                  name="ward"
                  value={form.ward}
                  onChange={handleChange}
                  placeholder="e.g., ICU, West Wing"
                  className="w-full pl-12 bg-gray-50 border-2 border-transparent focus:border-blue-100 p-4 rounded-2xl focus:ring-0 focus:bg-white outline-none transition-all font-bold text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">Bed Type</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                </div>
                <select name="type" value={form.type} onChange={handleChange} className="w-full pl-12 bg-gray-50 border-2 border-transparent focus:border-blue-100 p-4 rounded-2xl focus:ring-0 focus:bg-white outline-none appearance-none font-bold text-gray-900">
                  <option value="General">General</option>
                  <option value="ICU">ICU</option>
                  <option value="Emergency">Emergency</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">Initial Status</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <select name="status" value={form.status} onChange={handleChange} className="w-full pl-12 bg-gray-50 border-2 border-transparent focus:border-blue-100 p-4 rounded-2xl focus:ring-0 focus:bg-white outline-none appearance-none font-bold text-gray-900">
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-12 pt-8 border-t border-gray-100">
          <button type="button" onClick={() => navigate("/")} className="flex-1 bg-white border-2 border-gray-200 text-gray-600 py-4 rounded-2xl hover:bg-gray-50 font-bold transition-colors uppercase tracking-wide text-sm">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl hover:bg-blue-700 font-bold transition-colors shadow-xl shadow-blue-200 disabled:opacity-70 transform active:scale-95 uppercase tracking-wide text-sm">
            {loading ? "Adding..." : "Add Bed to System"}
          </button>
        </div>
      </form>
    </div>
  );
}
