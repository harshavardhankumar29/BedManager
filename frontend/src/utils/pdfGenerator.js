// frontend/src/utils/pdfGenerator.js
import { jsPDF } from "jspdf";

/**
 * Generates and downloads a PDF Discharge Summary for a patient.
 */
export const generateDischargeSummaryPDF = (patient, bed = null) => {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  // Header Banner
  doc.setFillColor(30, 58, 138); // Blue 900
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("BEDMANAGER HEALTHCARE", 14, 22);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("OFFICIAL PATIENT DISCHARGE SUMMARY & MEDICAL RECORD", 14, 31);

  // Document Metadata
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(10);
  doc.text(`Date Issued: ${dateStr}`, 140, 31);

  // Section 1: Patient Demographic Information
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 48, 182, 8, "F");
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("1. PATIENT DEMOGRAPHICS", 18, 54);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);

  doc.text(`Patient ID: ${patient._id || "N/A"}`, 18, 66);
  doc.text(`Full Name: ${patient.name || "N/A"}`, 18, 74);
  doc.text(`Age: ${patient.age ? patient.age + " yrs" : "N/A"}`, 18, 82);
  doc.text(`Contact: ${patient.contact || "N/A"}`, 110, 66);
  doc.text(`Gender: ${patient.gender || "Unspecified"}`, 110, 74);

  // Section 2: Hospitalization & Bed Details
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 94, 182, 8, "F");
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("2. ADMISSION & BED ACCOMMODATION", 18, 100);

  const assignedBed = bed || (typeof patient.bedId === "object" ? patient.bedId : null);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);

  doc.text(`Allocated Bed Number: ${assignedBed?.bedNumber || "N/A"}`, 18, 112);
  doc.text(`Ward Department: ${assignedBed?.ward || "N/A"}`, 18, 120);
  doc.text(`Bed Category: ${assignedBed?.type || "General"}`, 110, 112);
  doc.text(`Discharge Status: Clean / Discharged`, 110, 120);

  // Section 3: Clinical Diagnosis & Medical Notes
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 132, 182, 8, "F");
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("3. CLINICAL DIAGNOSIS & REMARKS", 18, 138);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);

  doc.text(`Primary Diagnosis: ${patient.disease || patient.medicalHistory || "Under Observation / Recovered"}`, 18, 150);
  doc.text(`Treatment Summary: Patient was admitted under medical supervision and successfully treated.`, 18, 158);
  doc.text(`Follow-up Protocol: Routine follow-up recommended in 14 days or as needed.`, 18, 166);

  // Footer & Physician Sign-off
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 230, 196, 230);

  doc.setFont("helvetica", "bold");
  doc.text("Attending Physician Signature:", 14, 245);
  doc.line(75, 245, 130, 245);

  doc.text("Hospital Seal", 155, 245);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("This document is a computer-generated official discharge record from St. Jude's Hospital Management System.", 14, 275);

  // Save PDF
  const filename = `Discharge_Summary_${(patient.name || "Patient").replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
};
