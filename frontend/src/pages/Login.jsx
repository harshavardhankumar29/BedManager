// src/pages/Login.jsx
import React, { useState } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const t = toast.loading("Verifying credentials...");
    try {
      setLoading(true);
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Welcome back!", { id: t });
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Login failed", { id: t });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-['Plus_Jakarta_Sans'] overflow-hidden">
      {/* Left Side: Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center p-8 lg:p-24 relative z-10">

        {/* Animated Background Elements for Left Side */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] opacity-60 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[80px] opacity-60"></div>
        </div>

        <div className="max-w-md w-full mx-auto space-y-8 animate-in slide-in-from-left-10 duration-700 fade-in">

          {/* Logo / Header */}
          <div className="space-y-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
              Sign in to <br />
              <span className="text-blue-600">BedManager.</span>
            </h1>
            <p className="text-lg text-gray-500 font-medium max-w-sm">
              Welcome back. Enter your credentials to access your workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Work Email</label>
                <div className="relative group">
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="doctor@hospital.com"
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 text-base rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 block w-full p-4 pl-12 transition-all font-semibold placeholder:font-medium placeholder:text-gray-400"
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
                  <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">Forgot password?</a>
                </div>
                <div className="relative group">
                  <input
                    required
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 text-base rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 block w-full p-4 pl-12 transition-all font-semibold placeholder:font-medium placeholder:text-gray-400"
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gray-900 text-white font-bold text-lg shadow-xl shadow-gray-200 hover:bg-black hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 font-medium">
            Don't have an account? <span className="text-gray-900 font-bold cursor-not-allowed opacity-50" title="Contact Admin">Contact Admin</span>
          </p>
        </div>
      </div>

      {/* Right Side: Visuals */}
      <div className="hidden lg:block w-[55%] relative">
        <div className="absolute inset-0 bg-blue-600">
          {/* Stylish Abstract Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-800 opacity-90"></div>

          {/* Shapes */}
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-white opacity-5 blur-[120px] animate-pulse"></div>
        </div>

        <div className="relative h-full flex flex-col items-center justify-center p-20 z-10">
          <div className="relative w-full max-w-lg">
            {/* Main Image with Glass effect container */}
            <div className="relative z-10">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-[40px] blur opacity-30"></div>
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl border border-white/10 group">
                <img src="/hero.png" alt="Hospital Dashboard" className="w-full h-auto object-cover opacity-90 scale-105 group-hover:scale-110 transition-transform duration-1000 grayscale-[20%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                <div className="absolute bottom-8 left-8 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded bg-green-500/20 border border-green-500/50 text-green-300 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">Secure Login</span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight mb-1">Enterprise Grade Security</h3>
                  <p className="text-white/70 text-sm font-medium">HIPAA Compliant access for medical professionals.</p>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-12 -right-12 bg-white/10 backdrop-blur-xl p-5 rounded-3xl border border-white/20 shadow-2xl animate-bounce delay-1000 duration-[4000ms] z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center text-white text-xl">🛡️</div>
                <div>
                  <div className="text-white/50 text-[10px] uppercase font-bold tracking-widest">Protection</div>
                  <div className="text-white font-bold">256-bit Encrypted</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-12 bg-white/10 backdrop-blur-xl p-5 rounded-3xl border border-white/20 shadow-2xl animate-bounce delay-75 duration-[5000ms] z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <div className="text-white/50 text-[10px] uppercase font-bold tracking-widest">Uptime</div>
                  <div className="text-white font-bold">99.99% Online</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
