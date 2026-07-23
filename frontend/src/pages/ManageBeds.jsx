// frontend/src/pages/ManageBeds.jsx
import React, { useEffect, useState } from "react";
import { API } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { downloadCSV } from "../utils/csvExport";

export default function ManageBeds() {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("bedNumber"); // bedNumber, status, ward, type

  const navigate = useNavigate();

  useEffect(() => {
    fetchBeds();
  }, []);

  const fetchBeds = async () => {
    try {
      setLoading(true);
      const res = await API.get("/beds");
      setBeds(res.data);
    } catch (err) {
      console.error("fetch error", err);
      toast.error("Failed to load beds");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!beds.length) return toast.error("No bed records to export");
    const exportData = beds.map(b => ({
      "Bed Number": b.bedNumber,
      "Ward": b.ward,
      "Type": b.type,
      "Status": b.status,
      "Patient Name": typeof b.patientId === "object" ? b.patientId?.name : (b.patientId || "None")
    }));
    downloadCSV(exportData, `Beds_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    toast.success("Beds exported to CSV!");
  };

  const confirmDelete = async (bed) => {
    if (confirm(`Are you sure you want to delete bed ${bed.bedNumber}?`)) {
      try {
        await API.delete(`/beds/${bed._id}`);
        toast.success("Bed deleted successfully");
        fetchBeds();
      } catch (err) {
        console.error("delete error", err);
        toast.error("Failed to delete bed");
      }
    }
  };

  // --- Edit Modal State ---
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editBed, setEditBed] = useState(null);

  const openEdit = (bed) => {
    setEditBed(bed);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setEditBed(null);
    setIsEditOpen(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/beds/${editBed._id}`, { status: editBed.status });
      toast.success("Bed status updated");
      fetchBeds();
      closeEdit();
    } catch (err) {
      console.error("update error", err);
      toast.error("Failed to update status");
    }
  };

  // --- Sorting Logic ---
  const sortedBeds = [...beds].sort((a, b) => {
    if (sortBy === "bedNumber") {
      return a.bedNumber.localeCompare(b.bedNumber, undefined, { numeric: true });
    }
    if (sortBy === "status") {
      // Custom order: Available -> Occupied -> Maintenance
      const order = { "Available": 0, "Occupied": 1, "Maintenance": 2 };
      const valA = order[a.status] !== undefined ? order[a.status] : 99;
      const valB = order[b.status] !== undefined ? order[b.status] : 99;
      return valA - valB;
    }
    if (sortBy === "ward") {
      return a.ward.localeCompare(b.ward);
    }
    if (sortBy === "type") {
      return a.type.localeCompare(b.type);
    }
    return 0;
  });

  return (
    <div className="font-[ 'Plus_Jakarta_Sans',_sans-serif] pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Bed Inventory</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage hospital capacity and status</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <div className="relative group z-20">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-200 text-gray-700 py-3 pl-4 pr-10 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm cursor-pointer"
            >
              <option value="bedNumber">Sort by Number</option>
              <option value="status">Sort by Status</option>
              <option value="ward">Sort by Ward</option>
              <option value="type">Sort by Type</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <button onClick={handleExportCSV} className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span>Export Beds CSV</span>
          </button>

          <Link to="/add-bed" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-gray-300 hover:bg-black hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
            <span>Add New Bed</span>
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100/60 overflow-hidden">
        <div className="overflow-x-auto px-1 pb-4">
          <table className="min-w-full border-separate border-spacing-y-2 px-4 pt-2">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider pl-8">Bed Number</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Ward</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider pr-8">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="5" className="text-center py-10 font-bold text-gray-400">Loading beds...</td></tr>
              )}
              {!loading && sortedBeds.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-20">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M20 12H4"></path></svg>
                      </div>
                      <span className="text-gray-500 font-bold">No beds found</span>
                    </div>
                  </td>
                </tr>
              )}
              {sortedBeds.map((b) => (
                <tr key={b._id} className="group transition-transform hover:-translate-y-0.5 duration-200">
                  {/* Removed all backdrop-blur classes. Using solid white with border for performance. */}
                  <td className="bg-white border-y border-l border-gray-100 rounded-l-2xl py-4 pl-4 shadow-sm group-hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 pl-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-gray-50
                        ${b.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : ''}
                        ${b.status === 'Occupied' ? 'bg-blue-50 text-blue-600' : ''}
                        ${b.status === 'Maintenance' ? 'bg-amber-50 text-amber-600' : ''}
                      `}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                      </div>
                      <div>
                        <span className="block text-sm font-black text-gray-900">{b.bedNumber}</span>
                        {b.patientId && <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wide">Occupied</span>}
                      </div>
                    </div>
                  </td>
                  <td className="bg-white border-y border-gray-100 py-4 shadow-sm group-hover:shadow-md transition-all">
                    <span className="text-sm font-bold text-gray-700">{b.ward}</span>
                  </td>
                  <td className="bg-white border-y border-gray-100 py-4 shadow-sm group-hover:shadow-md transition-all">
                    <span className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg">{b.type}</span>
                  </td>
                  <td className="bg-white border-y border-gray-100 py-4 shadow-sm group-hover:shadow-md transition-all">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider
                      ${b.status === "Available" ? "bg-emerald-100/50 text-emerald-700 border border-emerald-100" : ""}
                      ${b.status === "Occupied" ? "bg-blue-100/50 text-blue-700 border border-blue-100" : ""}
                      ${b.status === "Maintenance" ? "bg-amber-100/50 text-amber-700 border border-amber-100" : ""}
                    `}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 
                        ${b.status === "Available" ? "bg-emerald-500" : ""}
                        ${b.status === "Occupied" ? "bg-blue-500" : ""}
                        ${b.status === "Maintenance" ? "bg-amber-500" : ""}
                      `}></span>
                      {b.status}
                    </span>
                  </td>
                  <td className="bg-white border-y border-r border-gray-100 rounded-r-2xl py-4 pr-4 shadow-sm group-hover:shadow-md transition-all">
                    <div className="flex justify-end gap-2 pr-4 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(b)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors hover:scale-110" title="Edit">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button onClick={() => confirmDelete(b)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors hover:scale-110" title="Delete">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditOpen && editBed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={closeEdit}></div>
          <div className="bg-white rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Update Status</h2>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Current Status</label>
                <div className="flex flex-col gap-3">
                  {['Available', 'Occupied', 'Maintenance'].map((s) => (
                    <label key={s} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${editBed.status === s
                      ? 'border-blue-500 bg-blue-50/50'
                      : 'border-gray-100 hover:border-gray-200'
                      }`}>
                      <input
                        type="radio"
                        name="status"
                        value={s}
                        checked={editBed.status === s}
                        onChange={(e) => setEditBed({ ...editBed, status: e.target.value })}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`font-bold ${editBed.status === s ? 'text-gray-900' : 'text-gray-600'}`}>{s}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeEdit} className="flex-1 py-3.5 rounded-xl border-2 border-gray-100 font-bold text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3.5 rounded-xl bg-gray-900 text-white font-bold shadow-lg hover:bg-black transition-colors">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
