import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import RegisterStaff from "./pages/RegisterStaff";
import StaffDirectory from "./pages/StaffDirectory";
import ManageBeds from "./pages/ManageBeds";
import Dashboard from "./pages/Dashboard";
import PatientDetails from "./pages/PatientDetails";
import Patients from "./pages/Patients";
import AdmitPatient from "./pages/AdmitPatient";
import AddBed from "./pages/AddBed";
import Layout from "./components/Layout";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Layout */}
            <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/manage-beds" element={<ManageBeds />} />
                <Route path="/admit" element={<AdmitPatient />} />
                <Route path="/patients/:id" element={<PatientDetails />} />
                <Route path="/add-bed" element={<AddBed />} />
                <Route path="/register" element={<RegisterStaff />} />
                <Route path="/staff" element={<StaffDirectory />} />
            </Route>
        </Routes>
    );
}
