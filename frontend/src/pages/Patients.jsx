// frontend/src/pages/Patients.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../api/api";
import toast from "react-hot-toast";
import { downloadCSV } from "../utils/csvExport";
import { generateDischargeSummaryPDF } from "../utils/pdfGenerator";

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await API.get("/patients");
            setPatients(res.data || []);
        } catch (err) {
            console.error("Failed to load patients", err);
            toast.error("Could not load patient list");
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        if (!patients.length) return toast.error("No patient records to export");
        const exportData = patients.map(p => ({
            "Patient Name": p.name,
            "Age": p.age,
            "Gender": p.gender || "Unspecified",
            "Contact": p.contact || "N/A",
            "Disease/Condition": p.disease || p.medicalHistory || "N/A",
            "Bed ID": typeof p.bedId === "object" ? p.bedId?.bedNumber : p.bedId,
            "Admitted Date": new Date(p.createdAt).toLocaleDateString()
        }));
        downloadCSV(exportData, `Patients_Report_${new Date().toISOString().slice(0, 10)}.csv`);
        toast.success("Patients exported to CSV!");
    };

    const filteredPatients = patients.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.contact?.includes(search)
    );

    return (
        <div className="font-['Plus_Jakarta_Sans',_sans-serif]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Patient Directory</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage, export, and view all admitted patients</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search patients..."
                            className="pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium text-gray-700 w-full md:w-64"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <button onClick={handleExportCSV} className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <span>Export CSV</span>
                    </button>
                    <Link to="/admit" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
                        <span>Admit Patient</span>
                    </Link>
                </div>
            </div>

            {/* List */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[32px] shadow-sm border border-white/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Patient Data</th>
                                <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Contact</th>
                                <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Details</th>
                                <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Admission Date</th>
                                <th className="px-8 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="5" className="py-20 text-center text-gray-400">Loading patients...</td></tr>
                            ) : filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                            </div>
                                            <span className="text-gray-500 font-bold">No patients found</span>
                                            {search && <p className="text-gray-400 text-sm mt-1">Try a different search term.</p>}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPatients.map(p => (
                                    <tr key={p._id} className="group hover:bg-blue-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-200">
                                                    {p.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 text-lg">{p.name}</div>
                                                    <div className="text-sm text-gray-500 font-medium">Age: {p.age} • {p.gender}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-gray-700">{p.contact || "N/A"}</div>
                                            <div className="text-xs text-gray-400 font-medium truncate max-w-[150px]">{p.address}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                                                {p.medicalHistory || "General Care"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm font-bold text-gray-500">
                                                {new Date(p.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        generateDischargeSummaryPDF(p);
                                                        toast.success(`Generated PDF summary for ${p.name}`);
                                                    }}
                                                    title="Download Discharge Summary PDF"
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-all font-bold text-xs"
                                                >
                                                    📄 PDF
                                                </button>
                                                <Link to={`/patients/${p._id}`} className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
