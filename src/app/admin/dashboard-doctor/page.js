"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";

// Icons SVG
const Icons = {
  Home: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
    </svg>
  ),
  FileText: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
  ),
  Pill: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0 -2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Bell: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
  ),
  Filter: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
  ),
  Save: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  Printer: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
    </svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
  ),
  Trash2: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
  ),
  Activity: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
    </svg>
  ),
  TrendingUp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
    </svg>
  ),
  CheckCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
};

const FORM_FIELDS_MAP = {
  FULL_BODY: [
    { key: "antropometri", label: "Antropometri" },
    { key: "simpulan_antropometri", label: "Simpulan Antropometri" },
    { key: "klinis", label: "Simpulan Klinis" },
    { key: "rontgen_toraks", label: "Rontgen Toraks" },
    { key: "simpulan_rontgen_toraks", label: "Simpulan Rontgen Toraks" },
    { key: "ekg", label: "EKG" },
    { key: "simpulan_ekg", label: "Simpulan EKG" },
    { key: "usg_abdomen", label: "USG Abdomen" },
    { key: "simpulan_usg_abdomen", label: "Simpulan USG Abdomen" },
    { key: "panel_metabolisme", label: "Panel Metabolisme" },
    { key: "simpulan_panel_metabolisme", label: "Simpulan Panel Metabolisme" },
    { key: "fungsi_organ", label: "Fungsi Organ" },
    { key: "simpulan_fungsi_organ", label: "Simpulan Fungsi Organ" },
    { key: "diagnosis", label: "Diagnosis" },
    { key: "simpulan_diagnosis", label: "Simpulan Diagnosis" },
    { key: "rekomendasi", label: "Rekomendasi" },
    { key: "simpulan_rekomendasi", label: "Simpulan Rekomendasi" },
  ],
  HPV: [
    { key: "jenis_vaksin", label: "Jenis Vaksin" },
    { key: "dosis", label: "Dosis" },
    { key: "nama_nomor_batch", label: "Nama Nomor Batch" },
    { key: "rute_pemberian", label: "Rute Pemberian" },
    { key: "lokasi_suntikan", label: "Lokasi Suntikan" },
    { key: "nama_petugas", label: "Nama Petugas" },
    { key: "kesan_status", label: "Kesan Status" },
    { key: "reaksi", label: "Reaksi" },
    { key: "rekomendasi", label: "Rekomendasi" },
  ],
  ANAK_BAYI: [
    { key: "jenis_vaksin", label: "Jenis Vaksin" },
    { key: "dosis", label: "Dosis" },
    { key: "nama_nomor_batch", label: "Nama Nomor Batch" },
    { key: "rute_pemberian", label: "Rute Pemberian" },
    { key: "lokasi_suntikan", label: "Lokasi Suntikan" },
    { key: "nama_petugas", label: "Nama Petugas" },
    { key: "kesan_status", label: "Kesan Status" },
    { key: "reaksi", label: "Reaksi" },
    { key: "rekomendasi", label: "Rekomendasi" },
  ],
  TES_DARAH: [
    { key: "hemoglobin", label: "Hemoglobin" },
    { key: "simpulan_hemoglobin", label: "Simpulan Hemoglobin" },
    { key: "leukosit", label: "Leukosit" },
    { key: "simpulan_leukosit", label: "Simpulan Leukosit" },
    { key: "trombosit", label: "Trombosit" },
    { key: "simpulan_trombosit", label: "Simpulan Trombosit" },
    { key: "gula_darah", label: "Gula Darah" },
    { key: "simpulan_gula_darah", label: "Simpulan Gula Darah" },
    { key: "kolesterol", label: "Kolesterol" },
    { key: "simpulan_kolesterol", label: "Simpulan Kolesterol" },
    { key: "trigliserida", label: "Trigliserida" },
    { key: "simpulan_trigliserida", label: "Simpulan Trigliserida" },
    { key: "sgpt", label: "SGPT" },
    { key: "simpulan_sgpt", label: "Simpulan SGPT" },
    { key: "kreatinin", label: "Kreatinin" },
    { key: "simpulan_kreatinin", label: "Simpulan Kreatinin" },
    { key: "asam_urat", label: "Asam Urat" },
    { key: "simpulan_asam_urat", label: "Simpulan Asam Urat" },
    { key: "ringkasan", label: "Ringkasan" },
  ],
  TES_HORMON: [
    { key: "tsh", label: "TSH" },
    { key: "simpulan_tsh", label: "Simpulan TSH" },
    { key: "tiroksin", label: "Tiroksin" },
    { key: "simpulan_tiroksin", label: "Simpulan Tiroksin" },
    { key: "triiodotironin", label: "Triiodotironin" },
    { key: "simpulan_triiodotironin", label: "Simpulan Triiodotironin" },
    { key: "anti_tpo", label: "Anti-TPO" },
    { key: "simpulan_anti_tpo", label: "Simpulan Anti-TPO" },
    { key: "kesimpulan", label: "Kesimpulan" },
  ],
  TES_URINE: [
    { key: "warna", label: "Warna Urine" },
    { key: "simpulan_warna", label: "Simpulan Warna Urine" },
    { key: "kejernihan", label: "Kejernihan" },
    { key: "simpulan_kejernihan", label: "Simpulan Kejernihan" },
    { key: "berat_jenis", label: "Berat Jenis" },
    { key: "simpulan_berat_jenis", label: "Simpulan Berat Jenis" },
    { key: "keasaman", label: "Keasaman (pH)" },
    { key: "simpulan_keasaman", label: "Simpulan Keasaman" },
    { key: "protein", label: "Protein" },
    { key: "simpulan_protein", label: "Simpulan Protein" },
    { key: "glukosa", label: "Glukosa" },
    { key: "simpulan_glukosa", label: "Simpulan Glukosa" },
    { key: "keton", label: "Keton" },
    { key: "simpulan_keton", label: "Simpulan Keton" },
    { key: "bilirubin", label: "Bilirubin" },
    { key: "simpulan_bilirubin", label: "Simpulan Bilirubin" },
    { key: "eritrosit", label: "Eritrosit" },
    { key: "simpulan_eritrosit", label: "Simpulan Eritrosit" },
    { key: "leukosit", label: "Leukosit" },
    { key: "simpulan_leukosit", label: "Simpulan Leukosit" },
    { key: "epithel", label: "Epithel" },
    { key: "simpulan_epithel", label: "Simpulan Epithel" },
    { key: "bakteri", label: "Bakteri" },
    { key: "simpulan_bakteri", label: "Simpulan Bakteri" },
    { key: "ringkasan", label: "Ringkasan" },
  ],
};

export default function DoctorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dynamicFields, setDynamicFields] = useState({});
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Data form rekam medis
  const [medicalRecord, setMedicalRecord] = useState({
    visitDate: new Date().toISOString().split("T")[0],
    diagnosis: "",
    symptoms: "",
    bloodPressure: "",
    temperature: "",
    heartRate: "",
    weight: "",
    height: "",
    treatment: "",
    notes: "",
    followUpDate: "",
  });

  // Data form resep
  const [prescription, setPrescription] = useState({
    medicines: [{ id: 1, name: "", dosage: "", frequency: "", duration: "", notes: "" }],
    instructions: "",
  });

  const [prescriptionNumber] = useState(`RX-${Date.now().toString().slice(-6)}`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fungsi untuk mengambil data dari Backend Port 8004
  const fetchPatients = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("doctorToken");

      if (!token) {
        setErrorMsg("Token missing. Please login.");
        router.push("/auth/login");
        return;
      }

      const res = await fetch("http://localhost:8004/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          setErrorMsg("Unauthorized. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("doctorToken");
          router.push("/auth/login");
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const mappedData = data.map((p) => ({
        ...p,
        id: p.id,
        name: p.full_name,
        age: p.age || 0,
        gender: p.gender,
        medicalRecordNumber: p.booking_id ? `RM-${p.booking_id}` : `ID-${p.id}`,
        status: p.records && p.records.length > 0 ? "control" : "new",
      }));
      setPatients(mappedData);
    } catch (err) {
      console.error("Network error:", err);
      setErrorMsg(`Error fetching patients: ${err?.message || "Please check your connection"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("doctorToken");
    const activeDoctor = localStorage.getItem("activeDoctorName");
    const userRole = localStorage.getItem("userRole");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    setUser({
      fullname: activeDoctor || "Dokter",
      specialization: userRole === "Dokter" ? "Dokter Spesialis" : "Dokter Umum",
    });

    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Handler untuk select pasien
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setActiveTab("medical-record");

    const schema = FORM_FIELDS_MAP[patient.tipe_layanan] || [];
    const initialFields = {};
    schema.forEach((field) => {
      initialFields[field.key] = "";
    });
    setDynamicFields(initialFields);
    setMedicalRecord((prev) => ({
      ...prev,
      visitDate: new Date().toISOString().split("T")[0],
    }));
  };

  // Fungsi untuk handle perubahan di form dinamis
  const handleDynamicFieldChange = (key, value) => {
    setDynamicFields((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handler logout
  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  // Handler change rekam medis
  const handleMedicalRecordChange = (e) => {
    const { name, value } = e.target;
    setMedicalRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler change resep
  const handlePrescriptionChange = (field, value) => {
    setPrescription((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handler obat
  const addMedicine = () => {
    setPrescription((prev) => ({
      ...prev,
      medicines: [...prev.medicines, { id: Date.now(), name: "", dosage: "", frequency: "", duration: "", notes: "" }],
    }));
  };

  const removeMedicine = (id) => {
    if (prescription.medicines.length > 1) {
      setPrescription((prev) => ({
        ...prev,
        medicines: prev.medicines.filter((med) => med.id !== id),
      }));
    }
  };

  const updateMedicine = (id, field, value) => {
    setPrescription((prev) => ({
      ...prev,
      medicines: prev.medicines.map((med) => (med.id === id ? { ...med, [field]: value } : med)),
    }));
  };

  // Handler submit rekam medis
  const handleMedicalRecordSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!selectedPatient) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("doctorToken");

      if (!token) {
        setErrorMsg("Token missing. Please login.");
        setIsSubmitting(false);
        router.push("/auth/login");
        return;
      }

      const payload = {
        patient_id: selectedPatient.id,
        booking_id: selectedPatient.booking_id,
        visit_date: medicalRecord.visitDate,
        visit_type: selectedPatient.tipe_layanan,
        diagnosis: medicalRecord.diagnosis,
        treatment: medicalRecord.treatment,
        vital_signs: {
          blood_pressure: medicalRecord.bloodPressure,
          temperature: medicalRecord.temperature,
          heart_rate: medicalRecord.heartRate,
          weight: medicalRecord.weight,
          height: medicalRecord.height,
        },
        extended_data: dynamicFields,
      };

      const res = await fetch("http://localhost:8004/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to save medical record: ${res.status}`);
      }

      setSuccessMsg("Medical record saved successfully!");
      setActiveTab("dashboard");
      fetchPatients();
    } catch (err) {
      console.error("Error saving medical record:", err);
      setErrorMsg(err.message || "Failed to save medical record");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler submit resep
  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const token = localStorage.getItem("doctorToken") || localStorage.getItem("token");

      if (!token) {
        setErrorMsg("Token missing. Please login.");
        setIsSubmitting(false);
        router.push("/auth/login");
        return;
      }

      const payload = {
        patient_id: selectedPatient.id,
        record_id: selectedPatient.records?.[0]?.id || null,
        medicines: prescription.medicines,
        instructions: prescription.instructions,
        prescription_number: prescriptionNumber,
      };

      const res = await fetch("http://localhost:8004/prescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to save prescription: ${res.status}`);
      }

      setSuccessMsg("Prescription saved successfully!");
      setActiveTab("dashboard");
    } catch (err) {
      console.error("Error saving prescription:", err);
      setErrorMsg(err.message || "Failed to save prescription");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter pasien berdasarkan search
  const filteredPatients = patients.filter((patient) => patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || patient.medicalRecordNumber.includes(searchTerm));

  // Data menu sidebar
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Icons.Home },
    { id: "patients", label: "Patients", icon: Icons.Users },
    { id: "medical-record", label: "Medical Records", icon: Icons.FileText },
    { id: "prescription", label: "Prescriptions", icon: Icons.Pill },
    { id: "schedule", label: "Schedule", icon: Icons.Calendar },
    { id: "notifications", label: "Notifications", icon: Icons.Bell },
    { id: "settings", label: "Settings", icon: Icons.Settings },
  ];

  // Data stats
  const stats = [
    { label: "Today's Patients", value: patients.filter((p) => p.status === "new").length, icon: Icons.Users, color: "bg-blue-500" },
    { label: "Medical Records", value: patients.filter((p) => p.records && p.records.length > 0).length, icon: Icons.FileText, color: "bg-green-500" },
    { label: "Prescriptions", value: "0", icon: Icons.Pill, color: "bg-purple-500" },
    { label: "Avg. Time", value: "15m", icon: Icons.Clock, color: "bg-orange-500" },
  ];

  // Opsi obat
  const medicineOptions = ["Amoxicillin 500mg", "Paracetamol 500mg", "Ibuprofen 400mg", "Cetirizine 10mg", "Loratadine 10mg", "Omeprazole 20mg", "Metformin 500mg", "Amlodipine 5mg", "Salbutamol Inhaler", "Vitamin C 500mg"];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Doctor Dashboard - SentraCare</title>
        <meta name="description" content="Doctor dashboard for managing patients and medical records" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header/Navbar - Serasi dengan halaman lain */}
      <nav className="bg-linear-to-r from-teal-600 to-emerald-700 text-white p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-bold text-2xl">
            SentraCare<span className="font-light"> Doctor</span>
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="font-semibold text-white">D</span>
            </div>
            <div className="text-right">
              <span className="font-medium text-white block">Dr. {user.fullname}</span>
              <span className="text-xs text-white/80">{user.specialization}</span>
            </div>
          </div>
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full flex items-center space-x-2 transition duration-200" onClick={handleLogout}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-white">Logout</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, Dr. {user.fullname}</p>
            <p className="text-sm text-blue-600 mt-1">Data dinamis dari API: {patients.length} patient(s) loaded</p>
          </div>
          <div className="flex space-x-4">
            <button onClick={fetchPatients} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>

            <button onClick={() => setActiveTab("dashboard")} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200">
              ← Back
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50/90 px-5 py-4 text-green-700 shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{successMsg}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50/90 px-5 py-4 text-red-700 shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Error: {errorMsg}</span>
            </div>
            <button onClick={fetchPatients} className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50/90 px-5 py-4 text-blue-700 shadow-sm">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <span className="font-medium">Fetching patient data from API...</span>
            </div>
          </div>
        )}

        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 text-sm">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                      </div>
                      <div className={`${stat.color.replace("500", "50")} p-3 rounded-lg`}>
                        <Icon className={`${stat.color.replace("bg-", "text-")}`} />
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mt-3">Live data from database</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient List */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-800">Patient List ({patients.length})</h2>
                      <div className="text-sm text-gray-500">
                        <span className="ml-2 text-green-600">✓ Live from API</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-6">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Icons.Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search patients..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2.5 text-black w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age/Gender</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {loading ? (
                            <tr>
                              <td colSpan="5" className="px-6 py-8 text-center">
                                <div className="flex justify-center">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                                <p className="mt-2 text-gray-500">Loading patient data...</p>
                              </td>
                            </tr>
                          ) : patients.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                <div className="flex flex-col items-center">
                                  <Icons.Users className="w-12 h-12 text-gray-400 mb-4" />
                                  <p className="text-lg font-medium text-gray-700">No patients found</p>
                                  <p className="text-gray-500 mt-1">No patient data available</p>
                                </div>
                              </td>
                            </tr>
                          ) : filteredPatients.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                No patients found matching your search.
                              </td>
                            </tr>
                          ) : (
                            filteredPatients.map((patient) => (
                              <tr key={patient.id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">{patient.name?.charAt(0) || "P"}</div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                                      <div className="text-sm text-gray-500">ID: {patient.medicalRecordNumber}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{patient.age} years</div>
                                  <div className="text-sm text-gray-500">{patient.gender}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{patient.tipe_layanan || "General"}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${patient.status === "new" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                    {patient.status === "new" ? "New" : "Control"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-3">
                                    <button onClick={() => handlePatientSelect(patient)} className="text-blue-600 hover:text-blue-900">
                                      EMR
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedPatient(patient);
                                        setActiveTab("prescription");
                                      }}
                                      className="text-purple-600 hover:text-purple-900"
                                    >
                                      Prescribe
                                    </button>
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
              </div>

              {/* Quick Actions Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button onClick={() => setActiveTab("medical-record")} className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                      <span className="text-sm font-medium text-gray-700">New Medical Record</span>
                      <Icons.Plus className="w-5 h-5 text-gray-400" />
                    </button>
                    <button onClick={() => setActiveTab("prescription")} className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                      <span className="text-sm font-medium text-gray-700">New Prescription</span>
                      <Icons.Pill className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                      <span className="text-sm font-medium text-gray-700">View Schedule</span>
                      <Icons.Calendar className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* API Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">API Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Icons.Activity className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Data Source</p>
                        <p className="text-sm text-gray-500">Connected to: http://localhost:8004/patients</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Icons.CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Connection Status</p>
                        <p className="text-sm text-gray-500">{loading ? "Connecting..." : "Connected ✓"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medical Record Form */}
        {activeTab === "medical-record" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-linear-to-r from-blue-50 to-teal-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button onClick={() => setActiveTab("dashboard")} className="p-2 hover:bg-white rounded-lg transition-colors border border-gray-200">
                    <Icons.ArrowLeft />
                  </button>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">New Medical Record</h2>
                    <p className="text-gray-600">{selectedPatient ? `For: ${selectedPatient.name}` : "Please select a patient"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleMedicalRecordSubmit}
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Icons.Save />
                        <span>Save Record</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleMedicalRecordSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Info */}
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-2">Patient Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Name</label>
                      <input type="text" value={selectedPatient?.name || ""} disabled className="w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Age</label>
                      <input type="text" value={selectedPatient?.age ? `${selectedPatient.age} years` : ""} disabled className="w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Gender</label>
                      <input type="text" value={selectedPatient?.gender || ""} disabled className="w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Medical Record #</label>
                      <input type="text" value={selectedPatient?.medicalRecordNumber || ""} disabled className="w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                </div>

                {/* Vital Signs */}
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-800 mb-4">Vital Signs</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Blood Pressure</label>
                      <input
                        type="text"
                        name="bloodPressure"
                        value={medicalRecord.bloodPressure}
                        onChange={handleMedicalRecordChange}
                        placeholder="120/80"
                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Temperature (°C)</label>
                      <input
                        type="number"
                        name="temperature"
                        value={medicalRecord.temperature}
                        onChange={handleMedicalRecordChange}
                        placeholder="36.5"
                        step="0.1"
                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Heart Rate</label>
                      <input
                        type="number"
                        name="heartRate"
                        value={medicalRecord.heartRate}
                        onChange={handleMedicalRecordChange}
                        placeholder="72"
                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Visit Date</label>
                      <input
                        type="date"
                        name="visitDate"
                        value={medicalRecord.visitDate}
                        onChange={handleMedicalRecordChange}
                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Dynamic Fields */}
                {selectedPatient?.tipe_layanan && FORM_FIELDS_MAP[selectedPatient.tipe_layanan] && (
                  <div className="md:col-span-2">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <h3 className="font-semibold text-gray-800 mb-4">Service-Specific Fields ({selectedPatient.tipe_layanan})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {FORM_FIELDS_MAP[selectedPatient.tipe_layanan].map((field) => (
                          <div key={field.key}>
                            <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Enter ${field.label.toLowerCase()}...`}
                              value={dynamicFields[field.key] || ""}
                              onChange={(e) => handleDynamicFieldChange(field.key, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Diagnosis & Symptoms */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                  <textarea
                    name="diagnosis"
                    value={medicalRecord.diagnosis}
                    onChange={handleMedicalRecordChange}
                    rows="3"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter diagnosis..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                  <textarea
                    name="symptoms"
                    value={medicalRecord.symptoms}
                    onChange={handleMedicalRecordChange}
                    rows="3"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe symptoms..."
                  />
                </div>

                {/* Treatment & Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Plan</label>
                  <textarea
                    name="treatment"
                    value={medicalRecord.treatment}
                    onChange={handleMedicalRecordChange}
                    rows="4"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe treatment plan..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={medicalRecord.notes}
                    onChange={handleMedicalRecordChange}
                    rows="4"
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Additional notes..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>

                  {/* Checkbox untuk menandai tidak perlu follow-up */}
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="noFollowUp"
                      checked={medicalRecord.followUpDate === null}
                      onChange={(e) => {
                        if (e.target.checked) {
                          // set null jika tidak perlu follow-up
                          setMedicalRecord((prev) => ({ ...prev, followUpDate: null }));
                        } else {
                          // reset ke string kosong agar bisa isi tanggal
                          setMedicalRecord((prev) => ({ ...prev, followUpDate: "" }));
                        }
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="noFollowUp" className="text-sm text-gray-700">
                      Tidak perlu kunjungan ulang
                    </label>
                  </div>

                  {/* Input tanggal hanya muncul kalau followUpDate bukan null */}
                  {medicalRecord.followUpDate !== null && (
                    <input
                      type="date"
                      name="followUpDate"
                      value={medicalRecord.followUpDate}
                      onChange={handleMedicalRecordChange}
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:border-blue-500 mb-4"
                    />
                  )}
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Prescription Form */}
        {activeTab === "prescription" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-linear-to-r from-purple-50 to-pink-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button onClick={() => setActiveTab("dashboard")} className="p-2 hover:bg-white rounded-lg transition-colors border border-gray-200">
                    <Icons.ArrowLeft />
                  </button>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">New Prescription</h2>
                    <p className="text-gray-600">{selectedPatient ? `For: ${selectedPatient.name}` : "Please select a patient"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handlePrescriptionSubmit}
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200 flex items-center space-x-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Icons.Save />
                        <span>Save Prescription</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handlePrescriptionSubmit} className="p-6">
              {/* Prescription Header */}
              <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">SENTRACARE - DOCTOR`S PRESCRIPTION</h3>
                    <p className="text-sm text-gray-600">Prescription #: {prescriptionNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString("id-ID")}</p>
                    <p className="text-sm text-gray-600">Doctor: Dr. {user?.fullname}</p>
                  </div>
                </div>
              </div>

              {/* Medicines List */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Medicines</h3>
                  <button type="button" onClick={addMedicine} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg flex items-center space-x-2 hover:bg-blue-100 transition-all border border-blue-200">
                    <Icons.Plus />
                    <span>Add Medicine</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {prescription.medicines.map((medicine, index) => (
                    <div key={medicine.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-800">Medicine #{index + 1}</h4>
                        {prescription.medicines.length > 1 && (
                          <button type="button" onClick={() => removeMedicine(medicine.id)} className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors">
                            <Icons.Trash2 />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-600 mb-1">Medicine Name</label>
                          <select
                            value={medicine.name}
                            onChange={(e) => updateMedicine(medicine.id, "name", e.target.value)}
                            className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select medicine...</option>
                            {medicineOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Dosage</label>
                          <input
                            type="text"
                            value={medicine.dosage}
                            onChange={(e) => updateMedicine(medicine.id, "dosage", e.target.value)}
                            placeholder="1 tablet"
                            className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Frequency</label>
                          <select
                            value={medicine.frequency}
                            onChange={(e) => updateMedicine(medicine.id, "frequency", e.target.value)}
                            className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select...</option>
                            <option value="1x sehari">1x daily</option>
                            <option value="2x sehari">2x daily</option>
                            <option value="3x sehari">3x daily</option>
                            <option value="4x sehari">4x daily</option>
                            <option value="Saat diperlukan">As needed</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Duration</label>
                          <input
                            type="text"
                            value={medicine.duration}
                            onChange={(e) => updateMedicine(medicine.id, "duration", e.target.value)}
                            placeholder="7 days"
                            className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="block text-sm text-gray-600 mb-1">Notes</label>
                        <input
                          type="text"
                          value={medicine.notes}
                          onChange={(e) => updateMedicine(medicine.id, "notes", e.target.value)}
                          placeholder="After meals, etc."
                          className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Instructions for Patient</label>
                <textarea
                  value={prescription.instructions}
                  onChange={(e) => handlePrescriptionChange("instructions", e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter special instructions for patient..."
                />
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
