import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Landing() {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const [contactPlan, setContactPlan] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", hospital: "", phone: "", message: "" });

    const handleContactSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setContactPlan(null);
            setFormData({ name: "", email: "", hospital: "", phone: "", message: "" });
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans',_sans-serif]">
            {/* HEADER */}
            <header className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white w-10 h-10 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
                        </div>
                        <div className="font-extrabold text-gray-900 text-xl tracking-tight">BedManager</div>
                    </div>

                    <nav className="flex items-center gap-8">
                        <a href="#features" className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors hidden md:block">Features</a>
                        <a href="#pricing" className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors hidden md:block">Pricing</a>
                        <a href="#about" className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors hidden md:block">About</a>

                        {user ? (
                            <Link to="/dashboard" className="px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link to="/login" className="px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl shadow-xl shadow-gray-200 hover:bg-gray-800 hover:-translate-y-0.5 transition-all">
                                Login Portal
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="pt-32 pb-16 px-6 relative overflow-hidden">
                {/* Floating Background Blobs */}
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] -z-10"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-100/50 rounded-full blur-[80px] -z-10"></div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            System V2.0 Live
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                            Modern Care, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Simplified.</span>
                        </h1>

                        <p className="text-xl text-gray-500 leading-relaxed max-w-lg font-medium">
                            The complete operating system for modern hospitals. Manage admissions, track occupancy, and coordinate staff — all in one place.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <Link to={user ? "/dashboard" : "/login"} className="px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-blue-300 hover:shadow-2xl hover:bg-blue-700 hover:-translate-y-1 transition-all text-center">
                                Get Started
                            </Link>
                            <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 font-bold text-lg rounded-2xl hover:bg-gray-50 hover:-translate-y-1 transition-all text-center">
                                Book Demo
                            </button>
                        </div>

                        <div className="pt-8 flex items-center gap-4 text-sm text-gray-500 font-semibold">
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white overflow-hidden shadow-sm">
                                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User" />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white overflow-hidden shadow-sm">
                                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gray-400 border-2 border-white overflow-hidden shadow-sm flex items-center justify-center bg-gray-100 text-gray-600 text-xs">
                                    +2k
                                </div>
                            </div>
                            <span>Trusted by 2,000+ medical staff</span>
                        </div>
                    </div>

                    <div className="relative isolate">
                        {/* Character Cutouts Layout */}
                        <div className="relative w-full h-[600px]">
                            {/* Main Hero Group */}
                            <img
                                src="/hero.png"
                                alt="Medical Team"
                                className="absolute bottom-0 right-0 w-[90%] z-10 drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
                            />

                            {/* Floating Elements */}
                            <div className="absolute top-10 left-0 z-20 bg-white p-4 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-bounce delay-700 duration-[3000ms]">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-lg text-green-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 font-bold uppercase">Occupancy</div>
                                        <div className="text-lg font-black text-gray-900">92%</div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-20 -left-10 z-20 bg-white p-4 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 hidden md:block">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white absolute -right-1 -bottom-1"></div>
                                        <img src="/doctor-cutout.png" className="w-12 h-12 object-cover rounded-full bg-blue-50" alt="Doctor" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">Dr. Sarah</div>
                                        <div className="text-xs text-green-600 font-bold">Available Now</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* QUICK FEATURES GRID */}
            <section className="py-20 bg-white relative z-20 -mt-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: "Real-time Tracking", desc: "Live updates on bed availability across all wards.", icon: "⚡" },
                            { title: "Secure Data", desc: "Enterprise-grade security compliant with healthcare standards.", icon: "🔒" },
                            { title: "Smart Analytics", desc: "Predictive insights to optimize staff allocation.", icon: "📊" },
                            { title: "24/7 Support", desc: "Dedicated support team ensuring zero downtime.", icon: "🛟" }
                        ].map((f, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100/50 hover:-translate-y-1 transition-transform">
                                <div className="w-12 h-12 bg-blue-50 text-2xl flex items-center justify-center rounded-xl mb-6">{f.icon}</div>
                                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                                <p className="text-gray-500 text-sm font-medium leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURE SECTION with Cutouts */}
            <section id="features" className="py-32 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Built for efficiency, <br />designed for care.</h2>
                        <p className="text-gray-500 text-xl font-medium">Empower your team with tools that are as advanced as the medicine they practice.</p>
                    </div>

                    {/* Feature 1: Efficiency */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-100 rounded-[40px] transform rotate-3 group-hover:rotate-6 transition-transform"></div>
                            <div className="bg-white p-12 rounded-[40px] shadow-xl relative z-10 border border-gray-100">
                                <img src="/nurse-cutout.png" alt="Nurse" className="w-64 mx-auto drop-shadow-lg mb-8" />
                                <img src="/dashboard-preview.png" alt="Interface" className="absolute -bottom-10 -right-10 w-48 rounded-xl shadow-2xl border-4 border-white" />
                            </div>
                        </div>
                        <div className="md:pl-12">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-4">Save 2+ hours daily on admin tasks.</h3>
                            <p className="text-gray-500 text-lg leading-relaxed mb-8">
                                Our automated admission workflows and instant bed assignment mean nurses spend less time on paperwork and more time with patients.
                            </p>
                            <ul className="space-y-3">
                                {['One-click admissions', 'Automated discharge protocols', 'Instant ward transfers'].map(item => (
                                    <li key={item} className="flex items-center gap-3 font-semibold text-gray-700">
                                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Feature 2: Patient Care */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 md:pr-12">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-4">Patient-centric from Day One.</h3>
                            <p className="text-gray-500 text-lg leading-relaxed mb-8">
                                Keep track of patient needs, preferences, and status updates in real-time. Ensure every patient gets the right bed, every time.
                            </p>
                            <button className="text-blue-600 font-bold hover:gap-4 gap-2 transition-all flex items-center">
                                Explore Patient Management <span className="text-xl">→</span>
                            </button>
                        </div>
                        <div className="relative group order-1 md:order-2">
                            <div className="absolute inset-0 bg-green-100 rounded-[40px] transform -rotate-3 group-hover:-rotate-6 transition-transform"></div>
                            <div className="bg-white p-12 rounded-[40px] shadow-xl relative z-10 border border-gray-100 flex items-center justify-center">
                                <img src="/patient-cutout.png" alt="Patient" className="w-full max-w-xs drop-shadow-lg" />
                                {/* Decorative Badge */}
                                <div className="absolute top-10 right-10 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-100">
                                    <div className="text-xs font-bold text-gray-400">Total Comfort</div>
                                    <div className="text-green-600 font-black text-xl">★★★★★</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Streamline your workflow</h2>
                    <p className="text-gray-500 text-lg font-medium">From admission to discharge, we've optimized every step.</p>
                </div>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-100 border-t-2 border-dashed border-gray-200 z-0"></div>

                    {[
                        { step: "01", title: "Admit Patient", desc: "Input patient details and let our smart algorithm suggest the best available bed." },
                        { step: "02", title: "Manage Care", desc: "Track vitals, update status, and coordinate shifts with real-time dashboard sync." },
                        { step: "03", title: "Discharge & Analyze", desc: "Automate discharge paperwork and view hospital performance analytics." }
                    ].map((s, i) => (
                        <div key={i} className="relative z-10 text-center bg-white p-4">
                            <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-blue-200 mb-6 border-4 border-white">
                                {s.step}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="py-24 bg-blue-900 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-blue-300 font-bold uppercase tracking-widest text-xs">Testimonials</span>
                        <h2 className="text-4xl font-black text-white mt-2">Trusted by unparalleled teams</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { text: "BedManager transformed our ER chaos into a structured flow. The auto-assign feature is a life saver.", author: "Dr. Emily Chen", role: "Chief of Emergency" },
                            { text: "Finally, a system that doesn't feel like it was built in 1995. It's fast, modern, and easy to teach new nurses.", author: "Mark Johnson", role: "Head Nurse" },
                            { text: "The analytics dashboard gave us insights that helped us reduce wait times by 40% in just two months.", author: "Sarah Williams", role: "Hospital Administrator" }
                        ].map((t, i) => (
                            <div key={i} className="bg-blue-800/50 backdrop-blur-lg border border-blue-700/50 p-8 rounded-3xl">
                                <div className="text-blue-400 text-6xl font-serif leading-none opacity-50 mb-4">"</div>
                                <p className="text-blue-100 text-lg font-medium mb-8 italic">{t.text}</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                        {t.author[0]}
                                    </div>
                                    <div>
                                        <div className="text-white font-bold">{t.author}</div>
                                        <div className="text-blue-300 text-xs font-bold uppercase">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PLANS & PRICING */}
            <section id="pricing" className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-blue-600 font-bold uppercase tracking-widest text-xs bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">Plans & Pricing</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 mb-4 tracking-tight">Flexible Plans for Every Hospital</h2>
                        <p className="text-gray-500 text-lg font-medium">Transparent, predictable pricing built to scale seamlessly from community clinics to enterprise healthcare networks.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                        {/* Plan 1: Starter */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg shadow-gray-100/50 flex flex-col justify-between hover:-translate-y-1 transition-transform">
                            <div>
                                <div className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Community & Clinics</div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">Starter</h3>
                                <p className="text-gray-500 text-sm font-medium mb-6">Essential bed management tools for smaller wards and medical facilities.</p>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-4xl font-black text-gray-900">$299</span>
                                    <span className="text-gray-500 font-bold text-sm">/ month</span>
                                </div>
                                <ul className="space-y-4 text-sm font-semibold text-gray-600 mb-8">
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">✓</div>
                                        Up to 50 hospital beds
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">✓</div>
                                        2 Ward Departments (General, Emergency)
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">✓</div>
                                        Real-time bed availability status
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">✓</div>
                                        Patient admission & transfer tracking
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-400">
                                        <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs">✕</div>
                                        Advanced analytics & export
                                    </li>
                                </ul>
                            </div>
                            <button onClick={() => setContactPlan("Starter")} className="w-full py-4 text-center bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors shadow-md">
                                Contact Sales
                            </button>
                        </div>

                        {/* Plan 2: Pro (Highlighted) */}
                        <div className="bg-gradient-to-b from-blue-900 to-blue-800 rounded-3xl p-8 text-white border-2 border-blue-500 shadow-2xl shadow-blue-500/20 flex flex-col justify-between relative transform lg:-translate-y-3">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-900 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                                Most Popular
                            </div>
                            <div>
                                <div className="text-xs font-bold uppercase text-blue-300 tracking-wider mb-2 mt-2">Regional & Specialty</div>
                                <h3 className="text-2xl font-black text-white mb-2">Professional</h3>
                                <p className="text-blue-100 text-sm font-medium mb-6">Complete bed management & staff coordination system for active hospitals.</p>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-4xl font-black text-white">$799</span>
                                    <span className="text-blue-200 font-bold text-sm">/ month</span>
                                </div>
                                <ul className="space-y-4 text-sm font-semibold text-blue-100 mb-8">
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-cyan-400 text-gray-900 flex items-center justify-center text-xs font-bold">✓</div>
                                        Up to 300 hospital beds
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-cyan-400 text-gray-900 flex items-center justify-center text-xs font-bold">✓</div>
                                        Unlimited Wards (ICU, Emergency, Pediatrics, etc.)
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-cyan-400 text-gray-900 flex items-center justify-center text-xs font-bold">✓</div>
                                        Socket.IO real-time instant synchronization
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-cyan-400 text-gray-900 flex items-center justify-center text-xs font-bold">✓</div>
                                        Role-Based Access Control (Admin & Staff)
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-cyan-400 text-gray-900 flex items-center justify-center text-xs font-bold">✓</div>
                                        Interactive analytics & occupancy reports
                                    </li>
                                </ul>
                            </div>
                            <button onClick={() => setContactPlan("Professional")} className="w-full py-4 text-center bg-blue-500 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-400 transition-colors">
                                Contact Sales
                            </button>
                        </div>

                        {/* Plan 3: Enterprise */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg shadow-gray-100/50 flex flex-col justify-between hover:-translate-y-1 transition-transform">
                            <div>
                                <div className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Hospital Chains & Networks</div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">Enterprise</h3>
                                <p className="text-gray-500 text-sm font-medium mb-6">Tailored architecture with dedicated SLA, EMR integration & multi-location support.</p>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-4xl font-black text-gray-900">Custom</span>
                                </div>
                                <ul className="space-y-4 text-sm font-semibold text-gray-600 mb-8">
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">✓</div>
                                        Unlimited Beds & Multi-Hospital Networks
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">✓</div>
                                        Custom EHR / EMR & HL7/FHIR Integration
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">✓</div>
                                        On-Premise or Private Cloud Deployment
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">✓</div>
                                        Dedicated Technical Account Manager & 24/7 SLA
                                    </li>
                                </ul>
                            </div>
                            <button onClick={() => setContactPlan("Enterprise")} className="w-full py-4 text-center bg-blue-50 text-blue-700 font-bold rounded-2xl hover:bg-blue-100 border border-blue-200 transition-colors">
                                Contact Sales Team
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-4xl font-black text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: "Is the system HIPAA compliant?", a: "Yes, we adhere to strict data security standards including end-to-end encryption and audit logs." },
                            { q: "Can I manage multiple wards?", a: "Absolutely. You can create and manage unlimited wards and filter views instantly." },
                            { q: "How does the 'Auto-Assign' work?", a: "Unless you specify a bed, our smart algorithm picks the best available bed based on patient age and ward load." }
                        ].map((faq, i) => (
                            <details key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 group">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <span className="font-bold text-gray-900 text-lg">{faq.q}</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="text-gray-500 font-medium px-6 pb-6 pt-0 leading-relaxed">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-gray-900 text-white pt-24 pb-12 rounded-t-[50px] mt-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16 border-b border-gray-800 pb-16">
                        <div className="max-w-md">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="rounded-xl bg-blue-600 text-white w-10 h-10 flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
                                </div>
                                <div className="font-bold text-2xl tracking-tight">BedManager</div>
                            </div>
                            <h3 className="text-3xl font-bold mb-6 text-gray-100">Ready to transform your hospital?</h3>
                            <Link to={user ? "/dashboard" : "/login"} className="inline-block px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                                Get Started Today
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-20">
                            <div>
                                <h4 className="font-bold text-lg mb-6 text-gray-200">Platform</h4>
                                <ul className="space-y-4 text-gray-400 font-medium">
                                    <li><a href="#" className="hover:text-blue-400 transition-colors">Dashboard</a></li>
                                    <li><a href="#" className="hover:text-blue-400 transition-colors">Admissions</a></li>
                                    <li><a href="#" className="hover:text-blue-400 transition-colors">Staff Portal</a></li>
                                    <li><a href="#" className="hover:text-blue-400 transition-colors">Analytics</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-lg mb-6 text-gray-200">Legal</h4>
                                <ul className="space-y-4 text-gray-400 font-medium">
                                    <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy</a></li>
                                    <li><a href="#" className="hover:text-blue-400 transition-colors">Terms</a></li>
                                    <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm font-medium">
                        <div>© 2025 BedManager. All rights reserved.</div>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white transition-colors">Twitter</a>
                            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                            <a href="#" className="hover:text-white transition-colors">Facebook</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* CONTACT SALES MODAL */}
            {contactPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border border-gray-100">
                        <button
                            onClick={() => setContactPlan(null)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
                        >
                            ×
                        </button>

                        {submitted ? (
                            <div className="text-center py-8 space-y-4">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto">
                                    ✓
                                </div>
                                <h3 className="text-2xl font-black text-gray-900">Inquiry Received!</h3>
                                <p className="text-gray-500 font-medium">
                                    Thank you for your interest in the <span className="font-bold text-blue-600">{contactPlan} Plan</span>. Our hospital integration team will contact you within 2 hours.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div className="mb-6">
                                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                        {contactPlan} Plan Inquiry
                                    </span>
                                    <h3 className="text-2xl font-black text-gray-900 mt-3">Contact Sales Team</h3>
                                    <p className="text-gray-500 text-sm font-medium">
                                        Fill in your institution details below and our team will get back to you immediately.
                                    </p>
                                </div>

                                <form onSubmit={handleContactSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Dr. Alexander Wright"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Work Email</label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="alex@stjudes.org"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="+1 (555) 019-2834"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Hospital / Clinic Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="St. Jude Medical Center"
                                            value={formData.hospital}
                                            onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Message / Bed Capacity Needs</label>
                                        <textarea
                                            rows="3"
                                            placeholder="We are looking to manage 150 beds across 3 departments..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors text-sm uppercase tracking-wider"
                                    >
                                        Submit Sales Inquiry
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
