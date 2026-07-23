import React, { useEffect, useState, useRef } from "react";
import { API } from "../api/api";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

export default function Dashboard() {
    const [beds, setBeds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedBed, setSelectedBed] = useState(null);
    const [statusFilter, setStatusFilter] = useState({
        Available: true,
        Occupied: true,
        Maintenance: true,
        "Out of Service": true,
    });
    const [wardFilter, setWardFilter] = useState("All Wards");
    const [sortBy, setSortBy] = useState("bedNumber"); // "bedNumber", "statusPriority"
    const [wards, setWards] = useState([]);
    const [waitlist, setWaitlist] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]); // Local log of events
    const socketRef = useRef(null);
    const navigate = useNavigate();

    // Color Constants
    const COLORS = {
        Available: "#10B981", // Emerald 500
        Occupied: "#3B82F6",  // Blue 500
        Maintenance: "#F59E0B", // Amber 500
        "Out of Service": "#EF4444" // Red 500
    };

    const backendBase = (import.meta.env.VITE_API_BASE || "http://localhost:5001/api").replace("/api", "");

    const addActivity = (msg) => {
        setRecentActivity(prev => [{ id: Date.now(), msg, time: new Date() }, ...prev].slice(0, 10));
    };

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io(backendBase);
        }
        const s = socketRef.current;

        s.on("connect", () => console.log("Socket connected"));
        s.on("beds:refresh", payload => {
            if (Array.isArray(payload)) setBeds(payload);
            else loadBeds();
        });
        s.on("patients:admitted", () => { loadBeds(); addActivity("New patient admitted"); });
        s.on("patients:discharged", () => { loadBeds(); addActivity("Patient discharged"); });
        s.on("patients:transferred", () => { loadBeds(); addActivity("Patient transferred"); });

        loadBeds();
        loadWaitlist();

        return () => {
            s.off("beds:refresh");
            s.off("patients:admitted");
            s.off("patients:discharged");
            s.off("patients:transferred");
            s.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadWaitlist() {
        try {
            const res = await API.get("/patients/waitlist");
            setWaitlist(res.data || []);
        } catch (err) {
            console.error("loadWaitlist error", err);
        }
    }

    const handleRemoveWaitlist = async (id) => {
        try {
            await API.delete(`/patients/waitlist/${id}`);
            toast.success("Removed from waitlist");
            loadWaitlist();
        } catch (err) {
            toast.error("Failed to remove waitlist entry");
        }
    };

    async function loadBeds() {
        try {
            setLoading(true);
            const res = await API.get("/beds");
            const list = res.data || [];
            setBeds(list);
            loadWaitlist();

            const w = Array.from(new Set(list.map(b => b.ward || "General")));
            setWards(["All Wards", ...w]);

            if (selectedBed) {
                const exists = list.find(b => b._id === selectedBed._id);
                if (!exists) setSelectedBed(null);
                else setSelectedBed(exists);
            }
        } catch (err) {
            console.error("loadBeds error", err);
            toast.error("Failed to load beds");
        } finally {
            setLoading(false);
        }
    }

    // --- Helpers ---
    const getStatusColor = (status) => {
        switch (status) {
            case "Available": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "Occupied": return "bg-blue-100 text-blue-700 border-blue-200";
            case "Maintenance": return "bg-amber-100 text-amber-700 border-amber-200";
            default: return "bg-red-100 text-red-700 border-red-200";
        }
    };

    const getStatusDot = (status) => {
        switch (status) {
            case "Available": return "bg-emerald-500";
            case "Occupied": return "bg-blue-500";
            case "Maintenance": return "bg-amber-500";
            default: return "bg-red-500";
        }
    };

    const handleSelectBed = (bed) => setSelectedBed(bed);

    const toggleStatusFilter = (name) => {
        setStatusFilter(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const handleDischarge = async () => {
        if (!selectedBed || !selectedBed.patientId) return toast.error("No patient to discharge");
        if (!confirm(`Are you sure you want to discharge the patient form Bed ${selectedBed.bedNumber}?`)) return;
        try {
            const pid = typeof selectedBed.patientId === "object" ? selectedBed.patientId._id : selectedBed.patientId;
            await API.delete(`/patients/discharge/${pid}`);
            toast.success("Patient discharged successfully");
            loadBeds();
            setSelectedBed(null);
        } catch (err) {
            console.error("discharge error", err);
            toast.error(err?.message || "Failed to discharge");
        }
    };

    const viewPatient = () => {
        if (!selectedBed || !selectedBed.patientId) return toast.error("No patient selected");
        const pid = typeof selectedBed.patientId === "object" ? selectedBed.patientId._id : selectedBed.patientId;
        navigate(`/patients/${pid}`);
    };

    // --- Calculations for Charts ---
    const statusData = [
        { name: 'Available', value: beds.filter(b => b.status === 'Available').length },
        { name: 'Occupied', value: beds.filter(b => b.status === 'Occupied').length },
        { name: 'Maintenance', value: beds.filter(b => b.status === 'Maintenance').length },
        { name: 'Other', value: beds.filter(b => !['Available', 'Occupied', 'Maintenance'].includes(b.status)).length },
    ].filter(d => d.value > 0);

    const wardData = wards.filter(w => w !== 'All Wards').map(ward => {
        const wardBeds = beds.filter(b => (b.ward || 'General') === ward);
        return {
            name: ward,
            Occupied: wardBeds.filter(b => b.status === 'Occupied').length,
            Available: wardBeds.filter(b => b.status === 'Available').length
        };
    });

    // --- Filtering ---
    const filteredBeds = beds.filter(b => {
        if (!statusFilter[b.status]) return false;
        if (wardFilter !== "All Wards" && b.ward !== wardFilter) return false;
        return true;
    });

    const grouped = {};
    filteredBeds.forEach(b => {
        const w = b.ward || "General";
        if (!grouped[w]) grouped[w] = [];
        grouped[w].push(b);
    });

    Object.keys(grouped).forEach(k => {
        grouped[k].sort((a, b) => {
            if (sortBy === "bedNumber") {
                return (a.bedNumber || "").localeCompare(b.bedNumber || "", undefined, { numeric: true });
            }
            if (sortBy === "statusPriority") {
                const priority = { "Occupied": 0, "Available": 1, "Maintenance": 2, "Out of Service": 3 };
                const pA = priority[a.status] ?? 99;
                const pB = priority[b.status] ?? 99;
                return pA - pB;
            }
            return 0;
        });
    });

    // Stats
    const totals = {
        total: beds.length,
        available: beds.filter(b => b.status === "Available").length,
        occupied: beds.filter(b => b.status === "Occupied").length,
        maintenance: beds.filter(b => b.status === "Maintenance" || b.status === "Out of Service").length,
    };

    // --- Demo Data Seeder ---
    const seedDemoData = async () => {
        const confirmSeed = window.confirm("This will add sample beds and patients to your database. Continue?");
        if (!confirmSeed) return;

        const toastId = toast.loading("Seeding demo data...");
        try {
            const wards = ["ICU", "General", "Emergency", "Pediatrics"];
            const demoBeds = [
                { bedNumber: "A-101", ward: "ICU", type: "Ventilator", status: "Available" },
                { bedNumber: "A-102", ward: "ICU", type: "Ventilator", status: "Occupied" },
                { bedNumber: "B-201", ward: "General", type: "Standard", status: "Occupied" },
                { bedNumber: "B-202", ward: "General", type: "Standard", status: "Available" },
                { bedNumber: "B-203", ward: "General", type: "Standard", status: "Maintenance" },
                { bedNumber: "C-301", ward: "Emergency", type: "ICU", status: "Available" },
                { bedNumber: "D-401", ward: "Pediatrics", type: "Standard", status: "Occupied" },
            ];

            // 1. Add Beds
            for (const bed of demoBeds) {
                try {
                    await API.post("/beds", bed);
                } catch (e) { console.log(`Skipping duplicate bed ${bed.bedNumber}`); }
            }

            // 2. Admit Fake Patients to Occupied Beds
            // We need to fetch beds first to get their IDs
            const { data: currentBeds } = await API.get("/beds");
            const patients = [
                { name: "John Doe", age: 45, gender: "Male", contact: "555-0101", medicalHistory: "Hypertension", address: "123 Main St" },
                { name: "Jane Smith", age: 28, gender: "Female", contact: "555-0102", medicalHistory: "Asthma", address: "456 Oak Ave" },
                { name: "Bob Wilson", age: 62, gender: "Male", contact: "555-0103", medicalHistory: "Diabetes", address: "789 Pine Rd" },
            ];

            const occupiedBeds = currentBeds.filter(b => b.status === "Occupied" && !b.patientId);

            for (let i = 0; i < Math.min(occupiedBeds.length, patients.length); i++) {
                const bed = occupiedBeds[i];
                const patient = patients[i];
                await API.post(`/patients/admit`, { ...patient, bedId: bed._id });
            }

            toast.success("Demo data loaded!", { id: toastId });
            loadBeds(); // Refresh
        } catch (err) {
            console.error(err);
            toast.error("Failed to seed data", { id: toastId });
        }
    };

    return (
        <div className="space-y-8 pb-20 relative">
            {/* Global blobs are now in Layout.jsx */}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-2 font-medium text-lg">Real-time hospital bed status and patient management</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={seedDemoData} className="text-xs font-bold text-gray-400 hover:text-blue-600 underline">
                        + Load Demo Data
                    </button>
                    <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100 shadow-sm">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        System Online
                    </div>
                    <button onClick={() => navigate('/admit')} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold shadow-xl shadow-blue-200 hover:shadow-2xl transition-all flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        Admit Patient
                    </button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                <MetricCard label="Total Beds" value={totals.total} icon={<BedIcon />} color="indigo" />
                <MetricCard label="Available" value={totals.available} icon={<CheckIcon />} color="emerald" />
                <MetricCard label="Occupied" value={totals.occupied} icon={<UserIcon />} color="blue" />
                <MetricCard label="Maintenance" value={totals.maintenance} icon={<ToolIcon />} color="amber" />
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                {/* Pie Chart: Status Distribution */}
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[32px] shadow-sm border border-white/50 flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-4">Status Distribution</h3>
                    <div className="h-56 w-full relative">
                        {totals.total > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%" cy="50%"
                                        innerRadius={60} outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#9CA3AF'} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontWeight: 'bold' }} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 font-medium">No data available</div>
                        )}
                        {/* Center Text */}
                        {totals.total > 0 && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                                <span className="text-3xl font-black text-gray-800">{Math.round((totals.occupied / totals.total) * 100)}%</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bar Chart: Ward Occupancy */}
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[32px] shadow-sm border border-white/50 flex flex-col lg:col-span-2">
                    <h3 className="font-bold text-gray-900 mb-4">Occupancy by Ward</h3>
                    <div className="h-56 w-full">
                        {totals.total > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={wardData} barGap={4}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="Available" stackId="a" fill={COLORS.Available} radius={[0, 0, 4, 4]} barSize={24} />
                                    <Bar dataKey="Occupied" stackId="a" fill={COLORS.Occupied} radius={[4, 4, 0, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 font-medium">No data available</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start relative z-10">
                {/* Left Column: Bed Grid */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="flex flex-col xl:flex-row items-center justify-between gap-6 bg-white/50 backdrop-blur-md p-4 rounded-[24px] border border-white/50">

                        {/* Status Filters (The 3 Buttons) */}
                        <div className="flex items-center gap-2 bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-sm">
                            {['Available', 'Occupied', 'Maintenance'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => toggleStatusFilter(status)}
                                    className={`
                                        px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all border
                                        ${statusFilter[status]
                                            ? buttonActiveStyles(status)
                                            : "bg-transparent text-gray-400 border-transparent hover:bg-gray-50"
                                        }
                                    `}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent text-sm border-none focus:ring-0 font-bold text-gray-500 cursor-pointer hover:text-blue-600 transition-colors"
                            >
                                <option value="bedNumber">Sort by Number</option>
                                <option value="statusPriority">Sort by Status</option>
                            </select>
                            <div className="h-4 w-[1px] bg-gray-300"></div>

                            {/* Ward Tabs */}
                            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[300px] xl:max-w-none">
                                {wards.map(w => (
                                    <button
                                        key={w}
                                        onClick={() => setWardFilter(w)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${wardFilter === w
                                            ? "bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-200"
                                            : "bg-white text-gray-400 border-transparent hover:bg-gray-50 hover:text-gray-600"
                                            }`}
                                    >
                                        {w}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {loading && (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
                        </div>
                    )}

                    {!loading && Object.keys(grouped).length === 0 && (
                        <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-[32px] border border-dashed border-gray-200">
                            <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <p className="text-gray-500 font-medium text-lg">No beds found for current filters.</p>
                        </div>
                    )}

                    {Object.entries(grouped).map(([wardName, bedsInWard]) => (
                        <div key={wardName} className="space-y-4">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                {wardName} Unit
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {bedsInWard.map(bed => {
                                    const isSelected = selectedBed && selectedBed._id === bed._id;
                                    const pName = bed.patientId ? (typeof bed.patientId === 'object' ? bed.patientId.name : "Occupied") : null;
                                    const pGender = bed.patientId && typeof bed.patientId === 'object' ? bed.patientId.gender : null;
                                    const pAge = bed.patientId && typeof bed.patientId === 'object' ? bed.patientId.age : null;

                                    return (
                                        <div
                                            key={bed._id}
                                            onClick={(e) => { e.stopPropagation(); handleSelectBed(bed); }}
                                            className={`
                                                relative p-5 rounded-[24px] border transition-all duration-300 cursor-pointer group flex flex-col justify-between h-full
                                                ${isSelected
                                                    ? "bg-gradient-to-br from-blue-50 to-white border-blue-500 shadow-xl shadow-blue-900/10 ring-2 ring-blue-500 ring-offset-2 z-10 scale-[1.02]"
                                                    : "bg-white border-gray-100/80 shadow-sm hover:shadow-lg hover:border-blue-200 hover:-translate-y-1"
                                                }
                                            `}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-2xl font-black text-gray-900 tracking-tight leading-none">{bed.bedNumber}</span>
                                                        {bed.type === 'Ventilator' && <span title="Ventilator" className="text-xs">🫁</span>}
                                                        {bed.type === 'ICU' && <span title="ICU" className="text-xs">❤️‍🩹</span>}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md">{bed.type}</span>
                                                </div>
                                                <div className={`
                                                    px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5
                                                    ${getStatusColor(bed.status)}
                                                `}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(bed.status)}`}></span>
                                                    {bed.status}
                                                </div>
                                            </div>

                                            {pName ? (
                                                <div className="mt-auto">
                                                    <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50/80 rounded-2xl border border-gray-100 group-hover:bg-white group-hover:border-blue-100 transition-colors">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                                                            {pName[0]}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-bold text-gray-900 text-sm truncate">{pName}</div>
                                                            <div className="text-[10px] text-gray-500 font-bold">{pAge ? `${pAge} yrs` : ''} {pGender ? `• ${pGender}` : ''}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">
                                                        <span>Patient ID: #{typeof bed.patientId === 'object' ? bed.patientId._id.slice(-4) : '...'}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-auto">
                                                    <div className="h-[58px] flex flex-col items-center justify-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 group-hover:border-emerald-300 group-hover:bg-emerald-50/30 transition-all">
                                                        <span className="text-gray-400 text-xs font-bold group-hover:text-emerald-600 transition-colors flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                                            Empty Bed
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column: Activity & Details */}
                <div className="space-y-6">
                    {/* Emergency Waitlist Card */}
                    <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent backdrop-blur-xl p-6 rounded-[32px] shadow-sm border border-amber-200/60">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping"></span>
                                Emergency Waitlist ({waitlist.length})
                            </h3>
                            <button
                                onClick={() => navigate('/admit')}
                                className="text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-100 px-3 py-1 rounded-full"
                            >
                                + Add Waitlist
                            </button>
                        </div>

                        {waitlist.length === 0 ? (
                            <div className="text-xs text-gray-400 font-medium py-3 text-center italic bg-white/60 rounded-2xl border border-gray-100">
                                No patients currently waiting
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                                {waitlist.map((item) => (
                                    <div key={item._id} className="bg-white p-3.5 rounded-2xl border border-amber-100 shadow-sm flex items-center justify-between gap-3">
                                        <div>
                                            <div className="font-bold text-gray-900 text-sm">{item.patientName} ({item.age}y)</div>
                                            <div className="text-[11px] text-gray-500 font-medium">{item.disease} • <span className="font-bold text-amber-600">{item.preferredWard}</span></div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveWaitlist(item._id)}
                                            className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Activity Feed */}
                    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[32px] shadow-sm border border-white/50">
                        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            Live Activity
                        </h3>
                        <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {recentActivity.map((act, i) => (
                                <div key={act.id} className="flex gap-4 relative">
                                    {/* Timeline line */}
                                    {i !== recentActivity.length - 1 && <div className="absolute left-[5px] top-4 bottom-0 w-0.5 bg-gray-100 -mb-6"></div>}

                                    <div className="mt-1.5 w-3 h-3 rounded-full bg-blue-100 border-2 border-blue-500 flex-shrink-0 z-10"></div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800 leading-tight mb-1">{act.msg}</p>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{act.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Selected Bed Details */}
                    <div className={`
                        sticky top-6 bg-white/90 backdrop-blur-xl p-6 rounded-[32px] shadow-2xl shadow-blue-900/10 border border-white/60 transition-all duration-500
                        ${selectedBed ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none hidden xl:block"}
                    `}>
                        {selectedBed && (
                            <>
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">{selectedBed.bedNumber}</h2>
                                        <div className="text-sm text-gray-500 font-bold mt-1">{selectedBed.ward} Wrapper</div>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusColor(selectedBed.status)}`}>
                                        {selectedBed.status}
                                    </div>
                                </div>

                                <div className="bg-gray-50/80 rounded-3xl p-6 border border-gray-100/60 mb-8 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient Details</div>
                                        {selectedBed.patientId && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>}
                                    </div>

                                    {selectedBed.patientId ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/30">
                                                    {(typeof selectedBed.patientId === 'object' ? selectedBed.patientId.name : 'Unknown')[0]}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 text-lg">
                                                        {typeof selectedBed.patientId === 'object' ? selectedBed.patientId.name : "ID: " + selectedBed.patientId}
                                                    </div>
                                                    <div className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md inline-block mt-1">Admitted</div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 mt-2">
                                                <div className="bg-white p-3 rounded-2xl border border-gray-100 text-center shadow-sm">
                                                    <div className="text-[10px] text-gray-400 font-black uppercase">AGE</div>
                                                    <div className="font-black text-gray-900 text-lg">{typeof selectedBed.patientId === 'object' ? (selectedBed.patientId.age || "-") : "-"}</div>
                                                </div>
                                                <div className="bg-white p-3 rounded-2xl border border-gray-100 text-center shadow-sm">
                                                    <div className="text-[10px] text-gray-400 font-black uppercase">GENDER</div>
                                                    <div className="font-black text-gray-900 text-lg">{typeof selectedBed.patientId === 'object' ? (selectedBed.patientId.gender || "-") : "-"}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="text-sm text-gray-400 font-medium italic">No patient assigned</div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    {selectedBed.patientId ? (
                                        <>
                                            <button onClick={viewPatient} className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold text-sm uppercase tracking-wide shadow-xl shadow-gray-200 hover:bg-black hover:scale-[1.02] transition-all">
                                                View Full Profile
                                            </button>
                                            <button onClick={handleDischarge} className="w-full py-4 rounded-2xl bg-white border border-red-100 text-red-500 font-bold text-sm uppercase tracking-wide hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors">
                                                Discharge Patient
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => navigate('/admit')} className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-sm uppercase tracking-wide shadow-lg shadow-emerald-200 hover:from-emerald-600 hover:to-emerald-700 hover:scale-[1.02] transition-all">
                                            One-Click Admit
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Subcomponents
function MetricCard({ label, value, icon, color }) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600",
        indigo: "bg-indigo-50 text-indigo-600",
        amber: "bg-amber-50 text-amber-600"
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClasses[color]} shadow-sm`}>
                {icon}
            </div>
            <div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</div>
                <div className="text-3xl font-black text-gray-900 leading-none">{value}</div>
            </div>
        </div>
    );
}

// Helper for button styles
function buttonActiveStyles(status) {
    if (status === 'Available') return "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-200";
    if (status === 'Occupied') return "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-200";
    if (status === 'Maintenance') return "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-200";
    return "bg-gray-500 text-white";
}

// Icons (unchanged)
function BedIcon() { return <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 20h14M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12v8m14-8v8"></path></svg>; }
function CheckIcon() { return <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>; }
function UserIcon() { return <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>; }
function ToolIcon() { return <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>; }
