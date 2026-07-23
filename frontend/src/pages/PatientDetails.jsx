import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api/api";
import { toast } from "react-hot-toast";
import { generateDischargeSummaryPDF } from "../utils/pdfGenerator";

export default function PatientDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    // Transfer State
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [transferTarget, setTransferTarget] = useState({ ward: "", type: "" });

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await API.get(`/patients/${id}`);
                setPatient(res.data);
            } catch (err) {
                console.error("Failed to load patient", err);
                toast.error("Could not load patient details");
                // Fallback attempt
                try {
                    const bedsRes = await API.get("/beds");
                    const bed = bedsRes.data.find(b =>
                        b.patientId && (typeof b.patientId === 'object' ? b.patientId._id === id : b.patientId === id)
                    );
                    if (bed && typeof bed.patientId === 'object') {
                        setPatient({ ...bed.patientId, assignedBed: bed.bedNumber, ward: bed.ward });
                    }
                } catch (e) { console.error("Fallback search failed", e); }
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPatient();
    }, [id]);

    const handleTransfer = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Processing transfer...");
        try {
            await API.put(`/patients/transfer/${id}`, {
                targetWard: transferTarget.ward || undefined,
                targetType: transferTarget.type || undefined
            });
            toast.success("Patient transferred successfully", { id: toastId });
            setIsTransferOpen(false);
            // Slight delay to allow backend to refresh
            setTimeout(() => window.location.reload(), 800);
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.error || "Transfer failed. No beds available?", { id: toastId });
        }
    };

    if (loading) return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    if (!patient) return (
        <div className="p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Patient Not Found</h2>
            <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Go Back</button>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6 font-['Plus_Jakarta_Sans']">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-bold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Dashboard
            </button>

            {/* Header Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 shadow-sm border border-white/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>

                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-500/30">
                        {patient.name?.[0] || "?"}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{patient.name}</h1>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full">Admitted</span>
                        </div>
                        <p className="text-gray-500 font-medium">Patient ID: <span className="font-mono text-gray-400 select-all">{patient._id || id}</span></p>

                        <div className="flex flex-wrap gap-3 mt-4">
                            <button
                                onClick={() => setIsTransferOpen(true)}
                                className="px-5 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl text-sm hover:bg-indigo-100 transition-colors flex items-center gap-2 border border-indigo-100"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                Transfer Patient
                            </button>
                            <button
                                onClick={() => {
                                    generateDischargeSummaryPDF(patient);
                                    toast.success("Discharge Summary PDF downloaded!");
                                }}
                                className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 flex items-center gap-2"
                            >
                                📄 Download Discharge Summary PDF
                            </button>
                        </div>
                    </div>

                    {patient.assignedBed && (
                        <div className="text-right bg-white/50 p-4 rounded-2xl border border-white/60 backdrop-blur-sm">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Assigned Bed</div>
                            <div className="text-3xl font-black text-blue-600">{patient.assignedBed}</div>
                            <div className="text-sm font-bold text-gray-500">{patient.ward || "General"}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Personal Information
                    </h3>
                    <div className="space-y-4">
                        <InfoRow label="Age" value={patient.age || "N/A"} />
                        <InfoRow label="Gender" value={patient.gender || "N/A"} />
                        <InfoRow label="Contact" value={patient.contact || "N/A"} />
                        <InfoRow label="Address" value={patient.address || "No address on file"} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Medical Details
                    </h3>
                    <div className="space-y-4">
                        <InfoRow label="Medical History" value={patient.medicalHistory || "None provided"} />
                        <InfoRow label="Admission Date" value={patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : "Unknown"} />
                        <InfoRow label="Priority" value={
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${patient.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                {patient.priority || "Normal"}
                            </span>
                        } />
                    </div>
                </div>
            </div>

            {/* Transfer Modal */}
            {isTransferOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsTransferOpen(false)}></div>
                    <div className="bg-white rounded-[32px] p-8 w-full max-w-md relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Transfer Patient</h2>
                        <p className="text-gray-500 mb-6 font-medium">Select criteria for the new bed. The system will auto-assign an available one.</p>

                        <form onSubmit={handleTransfer} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Target Ward</label>
                                <select
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    value={transferTarget.ward}
                                    onChange={(e) => setTransferTarget({ ...transferTarget, ward: e.target.value })}
                                >
                                    <option value="">Any Ward</option>
                                    <option value="General">General</option>
                                    <option value="ICU">ICU</option>
                                    <option value="Emergency">Emergency</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bed Type</label>
                                <select
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    value={transferTarget.type}
                                    onChange={(e) => setTransferTarget({ ...transferTarget, type: e.target.value })}
                                >
                                    <option value="">Any Type</option>
                                    <option value="Standard">Standard</option>
                                    <option value="ICU">ICU / Ventilator</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsTransferOpen(false)} className="flex-1 py-3.5 rounded-2xl border-2 border-gray-100 font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3.5 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 hover:scale-[1.02] transition-all">Confirm Transfer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between items-start border-b border-gray-50 pb-3 last:border-0 last:pb-0">
            <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">{label}</span>
            <span className="text-gray-900 font-bold text-right max-w-[60%]">{value}</span>
        </div>
    );
}
