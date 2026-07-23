// frontend/src/pages/AdmitPatient.jsx
import React, { useState, useEffect } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdmitPatient() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    disease: "",
    preferredWard: "",
    preferredType: ""
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!form.name.trim()) return setErrorMsg("Name is required");
    if (!form.age || Number(form.age) <= 0) return setErrorMsg("Enter a valid age");

    try {
      setLoading(true);
      const payload = {
        name: form.name.trim(),
        age: Number(form.age),
        disease: form.disease ? form.disease.trim() : undefined,
        preferredWard: form.preferredWard ? form.preferredWard.trim() : undefined,
        preferredType: form.preferredType ? form.preferredType.trim() : undefined
      };

      const res = await API.post("/patients/admit", payload);
      const bedNumber = res?.data?.bed?.bedNumber || "unknown";
      toast.success(`Admitted — Bed: ${bedNumber}`);
      setForm({ name: "", age: "", disease: "", preferredWard: "", preferredType: "" });
      navigate("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Failed to admit patient";
      console.error("Admit error:", err);
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWaitlist = async () => {
    if (!form.name.trim()) return setErrorMsg("Name is required for waitlist");
    if (!form.age || Number(form.age) <= 0) return setErrorMsg("Valid age required");

    try {
      setLoading(true);
      await API.post("/patients/waitlist", {
        patientName: form.name.trim(),
        age: Number(form.age),
        disease: form.disease ? form.disease.trim() : "Emergency Care",
        preferredWard: form.preferredWard || "ICU",
        preferredType: form.preferredType || "General",
        priority: "Critical"
      });
      toast.success(`Added ${form.name} to Emergency Waitlist!`);
      setForm({ name: "", age: "", disease: "", preferredWard: "", preferredType: "" });
      navigate("/dashboard");
    } catch (err) {
      console.error("Waitlist error:", err);
      toast.error("Failed to add patient to waitlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto font-[ 'Plus_Jakarta_Sans',_sans-serif]">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Left: Form Section */}
        <div className="flex-1">
          <div className="mb-8 pl-2">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Patient Admission</h1>
            <p className="text-gray-500 mt-2 text-lg">Process new admissions and assign beds instantly.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-2xl p-8 lg:p-10 rounded-[30px] shadow-2xl shadow-blue-900/5 border border-white/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -z-10 -mr-16 -mt-16 pointer-events-none"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Full Width Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">Patient Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  </div>
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name (e.g. John Doe)"
                    className="w-full pl-12 bg-gray-50 border-2 border-transparent focus:border-blue-100 p-4 rounded-2xl focus:ring-0 focus:bg-white outline-none transition-all font-bold text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">Age</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <input
                    required
                    name="age"
                    type="number"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="Years"
                    className="w-full pl-12 bg-gray-50 border-2 border-transparent focus:border-blue-100 p-4 rounded-2xl focus:ring-0 focus:bg-white outline-none transition-all font-bold text-gray-900 placeholder-gray-400"
                    min="0"
                  />
                </div>
              </div>

              {/* Disease */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">Condition / Disease</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  </div>
                  <input
                    name="disease"
                    value={form.disease}
                    onChange={handleChange}
                    placeholder="e.g. Influenza"
                    className="w-full pl-12 bg-gray-50 border-2 border-transparent focus:border-blue-100 p-4 rounded-2xl focus:ring-0 focus:bg-white outline-none transition-all font-bold text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="md:col-span-2 border-t border-gray-100 my-2"></div>

              {/* Ward Preference */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">Preferred Ward</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  </div>
                  <input
                    name="preferredWard"
                    value={form.preferredWard}
                    onChange={handleChange}
                    placeholder="Any (Auto-assign)"
                    className="w-full pl-12 bg-gray-50 border-2 border-transparent focus:border-blue-100 p-4 rounded-2xl focus:ring-0 focus:bg-white outline-none transition-all font-bold text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Type Preference */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">Preferred Bed Type</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                  </div>
                  <input
                    name="preferredType"
                    value={form.preferredType}
                    onChange={handleChange}
                    placeholder="Any (Auto-assign)"
                    className="w-full pl-12 bg-gray-50 border-2 border-transparent focus:border-blue-100 p-4 rounded-2xl focus:ring-0 focus:bg-white outline-none transition-all font-bold text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-8 bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-100 flex items-center gap-3 font-semibold">
                <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-white border-2 border-gray-200 text-gray-600 py-4 rounded-2xl hover:bg-gray-50 hover:border-gray-300 font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddToWaitlist}
                disabled={loading}
                className="flex-1 bg-amber-500 text-white py-4 rounded-2xl hover:bg-amber-600 font-bold transition-all shadow-lg shadow-amber-100 disabled:opacity-70 text-sm"
              >
                + Emergency Waitlist
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl hover:bg-blue-700 font-bold transition-all shadow-xl shadow-blue-200 disabled:opacity-70 transform hover:-translate-y-1 active:scale-95 text-lg"
              >
                {loading ? "Processing..." : "Complete Admission"}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Visual Context Panel */}
        <div className="hidden lg:block w-[350px] space-y-6">
          <div className="bg-blue-600 p-8 rounded-[30px] shadow-xl shadow-blue-200 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Did you know?</h3>
              <p className="text-blue-100 leading-relaxed mb-6">
                Admitting patients with complete details helps AI algorithms optimize ward distribution by 30%.
              </p>
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="font-bold text-sm uppercase tracking-wide opacity-80">Current Occupancy</span>
                </div>
                <div className="text-3xl font-black">8,420</div>
                <div className="text-xs text-blue-100">Patients treated this year</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[30px] shadow-lg border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
            <img src="/patient-cutout.png" alt="Patient" className="w-48 mb-4 relative z-10 drop-shadow-lg" />
            <h4 className="font-bold text-gray-900 text-lg">Patient Care First</h4>
            <p className="text-gray-400 text-sm mt-1 mb-8">Ensure all dietary and allergy info is recorded manually if needed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
