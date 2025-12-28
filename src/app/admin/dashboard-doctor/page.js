"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, Users, FileText, Pill, Calendar, Settings, Bell, Search, Filter, User, ArrowLeft, Save, Printer, Plus, Trash2, Clock, Activity, TrendingUp, CheckCircle } from "lucide-react";

// Icon SVG sederhana sebagai fallback
const Icons = {
  Home: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
    </svg>
  ),
  FileText: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
  ),
  Pill: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Bell: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
  ),
  Filter: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
  ),
  Save: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  Printer: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
    </svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
  ),
  Trash2: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
  ),
  Activity: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
    </svg>
  ),
  TrendingUp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
    </svg>
  ),
  CheckCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
    { key: "panel_metabolisme", label: "Panel Metabolisme" }, // fixed
    { key: "simpulan_panel_metabolisme", label: "Simpulan Panel Metabolisme" }, // fixed
    { key: "fungsi_organ", label: "Fungsi Organ" },
    { key: "simpulan_fungsi_organ", label: "Simpulan Fungsi Organ" },
    { key: "diagnosis", label: "Diagnosis" }, // fixed
    { key: "simpulan_diagnosis", label: "Simpulan Diagnosis" },
    { key: "rekomendasi", label: "Rekomendasi" },
    { key: "simpulan_rekomendasi", label: "Simpulan Rekomendasi" },
  ],
  HPV: [
    { key: "jenis_vaksin", label: "Jenis Vaksin" },
    { key: "dosis", label: "Dosis" }, // fixed
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
    { key: "dosis", label: "Dosis" }, // fixed
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
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dynamicFields, setDynamicFields] = useState({});
  const [patients, setPatients] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [prescriptionNumber, setPrescriptionNumber] = useState("");

  const router = useRouter();

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

  // Fungsi untuk mengambil data dari Backend Port 8004
  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("doctorToken");
      const res = await fetch("http://localhost:8004/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();

        const mappedData = data.map((p) => ({
          ...p,
          id: p.id,
          name: p.full_name, // Backend pakai full_name, UI pakai name
          age: p.age || 0,
          gender: p.gender,
          medicalRecordNumber: p.booking_id ? `RM-${p.booking_id}` : `ID-${p.id}`,
          status: p.records && p.records.length > 0 ? "control" : "new", // Logika status sederhana
        }));
        setPatients(mappedData);
      } else {
        console.error("Gagal mengambil data dari server");
      }
    } catch (err) {
      console.error("Network error:", err);
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

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser({
      fullname: activeDoctor || "Dokter",
      specialization: userRole === "Dokter" ? "Dokter Spesialis" : "Administrator",
    });

    fetchPatients();
    setCurrentDate(new Date().toLocaleDateString("id-ID"));
    setPrescriptionNumber(`RX-${Date.now().toString().slice(-6)}`);
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

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("doctorToken");

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
        extended_data: dynamicFields, // Data dari form dinamis dikirim ke sini
      };

      const res = await fetch("http://localhost:8004/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Rekam medis berhasil disimpan!");
        setActiveTab("dashboard");
        fetchPatients();
      } else {
        const errData = await res.json();
        alert("Gagal simpan: " + JSON.stringify(errData.detail));
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi ke server");
    }
  };

  // Handler submit resep
  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      const token = localStorage.getItem("doctorToken") || localStorage.getItem("token");

      const payload = {
        patient_id: selectedPatient.id,
        record_id: selectedPatient.records?.[0]?.id || null, // opsional
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
      console.log("Doctor name:", user.fullname);
      if (res.ok) {
        alert("Resep obat berhasil disimpan!");
        setActiveTab("dashboard");
      } else {
        const errData = await res.json();
        alert("Gagal simpan resep: " + JSON.stringify(errData.detail));
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi ke server");
    }
  };

  // Filter pasien berdasarkan search
  const filteredPatients = patients.filter((patient) => patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || patient.medicalRecordNumber.includes(searchTerm));

  // Data menu sidebar
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "patients", label: "Pasien", icon: Users },
    { id: "medical-record", label: "Rekam Medis", icon: FileText },
    { id: "prescription", label: "Resep Obat", icon: Pill },
    { id: "schedule", label: "Jadwal", icon: Calendar },
    { id: "notifications", label: "Notifikasi", icon: Bell },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ];

  // Data stats
  const stats = [
    { label: "Pasien Hari Ini", value: "12", icon: Users, color: "bg-blue-500" },
    { label: "Rekam Medis", value: "48", icon: FileText, color: "bg-green-500" },
    { label: "Resep Dibuat", value: "36", icon: Pill, color: "bg-purple-500" },
    { label: "Rata-rata Waktu", value: "15m", icon: Clock, color: "bg-orange-500" },
  ];

  // Data appointment
  const appointments = [
    { id: 1, patientName: "Ahmad Santoso", time: "09:00", type: "Kontrol", status: "confirmed" },
    { id: 2, patientName: "Siti Rahayu", time: "10:30", type: "Berkas", status: "confirmed" },
    { id: 3, patientName: "Budi Prasetyo", time: "11:15", type: "Konsultasi", status: "pending" },
    { id: 4, patientName: "Dewi Anggraini", time: "13:45", type: "Kontrol", status: "confirmed" },
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">SC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">SentraCare</h1>
                <p className="text-sm text-gray-500">Doctor Dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden md:block">
              <p className="font-medium text-gray-800">Dr. {user.fullname}</p>
              <p className="text-sm text-gray-500">{user.specialization || "Dokter Umum"}</p>
            </div>

            <div className="relative">
              <button className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="font-semibold text-blue-600">{user.fullname?.charAt(0) || "D"}</span>
              </button>
            </div>

            <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
              Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r shadow-sm pt-20">
          <nav className="px-4 py-6">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive ? "bg-blue-50 text-blue-600 border border-blue-100" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      <Icon />
                      <span className="font-medium">{item.label}</span>
                      {isActive && <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 p-4 bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-gray-800 mb-2">Bantuan Cepat</h3>
              <p className="text-sm text-gray-600 mb-3">Butuh bantuan dengan rekam medis atau resep?</p>
              <button className="w-full py-2 bg-white border border-blue-200 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50">Panduan Penggunaan</button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 ml-64">
          {/* Dashboard View */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Selamat datang, Dr. {user.fullname}</h1>
                  <p className="text-gray-600 mt-1">Semoga hari Anda menyenangkan</p>
                </div>
                <span className="px-3 py-1 bg-linear-to-r from-emerald-100 to-teal-100 text-emerald-800 rounded-full text-sm font-medium border border-emerald-200">Online</span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                        </div>
                        <div className={`${stat.color} p-3 rounded-lg shadow-sm`}>
                          <Icon className="text-white" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sm text-emerald-600 font-medium">
                        <Icons.TrendingUp className="h-4 w-4 mr-1" />
                        <span>+12% dari kemarin</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Patient List */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Daftar Pasien</h2>
                        <span className="px-3 py-1 bg-linear-to-r from-emerald-50 to-teal-50 text-emerald-800 rounded-full text-sm border border-emerald-100">Total: {patients.length} pasien</span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex-1 relative">
                          <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Cari pasien..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                          />
                        </div>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-colors">
                          <Icons.Filter />
                          <span>Filter</span>
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-linear-to-r from-emerald-50 to-teal-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Pasien</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Umur</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredPatients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-linear-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mr-3">
                                    <Icons.User className="text-emerald-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{patient.name}</div>
                                    <div className="text-sm text-gray-500">RM: {patient.medicalRecordNumber}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-700">{patient.age} tahun</td>
                              <td className="px-6 py-4">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    patient.status === "new"
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                      : patient.status === "emergency"
                                      ? "bg-red-100 text-red-800 border border-red-200"
                                      : "bg-blue-100 text-blue-800 border border-blue-200"
                                  }`}
                                >
                                  {patient.status === "new" ? "Baru" : patient.status === "emergency" ? "Darurat" : "Kontrol"}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => {
                                      setSelectedPatient(patient);
                                      setActiveTab("medical-record");
                                    }}
                                    className="px-3 py-1.5 bg-linear-to-r from-emerald-600 to-teal-600 text-white text-sm rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm"
                                  >
                                    Rekam Medis
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedPatient(patient);
                                      setActiveTab("prescription");
                                    }}
                                    className="px-3 py-1.5 bg-linear-to-r from-cyan-600 to-teal-500 text-white text-sm rounded-lg hover:from-cyan-700 hover:to-teal-600 transition-all shadow-sm"
                                  >
                                    Resep Obat
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-800">Janji Temu</h2>
                      <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700 transition-colors">Lihat Semua</button>
                    </div>

                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">{appointment.patientName}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${appointment.status === "confirmed" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-amber-100 text-amber-800 border border-amber-200"}`}>
                              {appointment.status === "confirmed" ? "Dikonfirmasi" : "Menunggu"}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Icons.Clock className="h-4 w-4 mr-2" />
                            <span>
                              {appointment.time} • {appointment.type}
                            </span>
                          </div>
                          <button className="w-full mt-3 py-2 bg-linear-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-lg text-sm font-medium hover:from-emerald-100 hover:to-teal-100 transition-all border border-emerald-100">
                            Mulai Konsultasi
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Medical Record Form */}
          {activeTab === "medical-record" && (
            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-linear-to-r from-emerald-50/50 to-teal-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button onClick={() => setActiveTab("dashboard")} className="p-2 hover:bg-white rounded-lg transition-colors border border-gray-200">
                      <Icons.ArrowLeft />
                    </button>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Rekam Medis Baru</h2>
                      <p className="text-gray-600">{selectedPatient ? `Untuk: ${selectedPatient.name}` : "Pilih pasien terlebih dahulu"}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button onClick={() => window.print()} className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-colors">
                      <Icons.Printer />
                      <span>Cetak</span>
                    </button>
                    <button
                      onClick={handleMedicalRecordSubmit}
                      className="px-4 py-2 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-lg flex items-center space-x-2 hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm"
                    >
                      <Icons.Save />
                      <span>Simpan Rekam Medis</span>
                    </button>
                  </div>
                </div>
              </div>

              <form onSubmit={handleMedicalRecordSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Data Pasien */}
                  <div className="md:col-span-2 bg-linear-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-100">
                    <h3 className="font-semibold text-gray-800 mb-2">Data Pasien</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Nama</label>
                        <input type="text" value={selectedPatient?.name || ""} disabled className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Umur</label>
                        <input type="text" value={selectedPatient?.age ? `${selectedPatient.age} tahun` : ""} disabled className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Jenis Kelamin</label>
                        <input type="text" value={selectedPatient?.gender || ""} disabled className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">No. RM</label>
                        <input type="text" value={selectedPatient?.medicalRecordNumber || ""} disabled className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg" />
                      </div>
                    </div>
                  </div>

                  {/* Tanda Vital */}
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-gray-800 mb-4">Tanda Vital</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Tekanan Darah</label>
                        <input
                          type="text"
                          name="bloodPressure"
                          value={medicalRecord.bloodPressure}
                          onChange={handleMedicalRecordChange}
                          placeholder="120/80"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Suhu (°C)</label>
                        <input
                          type="number"
                          name="temperature"
                          value={medicalRecord.temperature}
                          onChange={handleMedicalRecordChange}
                          placeholder="36.5"
                          step="0.1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Denyut Jantung</label>
                        <input
                          type="number"
                          name="heartRate"
                          value={medicalRecord.heartRate}
                          onChange={handleMedicalRecordChange}
                          placeholder="72"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Tanggal Periksa</label>
                        <input
                          type="date"
                          name="visitDate"
                          value={medicalRecord.visitDate}
                          onChange={handleMedicalRecordChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* --- FORM DINAMIS BERDASARKAN LAYANAN --- */}
                    <div className="md:col-span-2 mt-8 pt-6 border-t border-gray-200 bg-linear-to-r from-emerald-50/30 to-teal-50/30 p-4 rounded-xl">
                      <div className="flex items-center space-x-2 mb-6">
                        <div className="w-1.5 h-6 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider">Detail Hasil {selectedPatient?.tipe_layanan?.replace("_", " ")}</h3>
                      </div>

                      {!FORM_FIELDS_MAP[selectedPatient?.tipe_layanan] && <p className="text-gray-400 italic text-sm">Tidak ada form tambahan untuk layanan ini.</p>}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {(FORM_FIELDS_MAP[selectedPatient?.tipe_layanan] || []).map((field) => (
                          <div key={field.key} className="space-y-1">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase ml-1">{field.label}</label>
                            <input
                              type="text"
                              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm shadow-sm"
                              placeholder={`Input ${field.label}...`}
                              value={dynamicFields[field.key] || ""}
                              onChange={(e) => handleDynamicFieldChange(field.key, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Diagnosis & Gejala */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                    <textarea
                      name="diagnosis"
                      value={medicalRecord.diagnosis}
                      onChange={handleMedicalRecordChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Masukkan diagnosis..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gejala</label>
                    <textarea
                      name="symptoms"
                      value={medicalRecord.symptoms}
                      onChange={handleMedicalRecordChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Deskripsi gejala yang dialami pasien..."
                    />
                  </div>

                  {/* Pengobatan */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rencana Pengobatan</label>
                    <textarea
                      name="treatment"
                      value={medicalRecord.treatment}
                      onChange={handleMedicalRecordChange}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Jelaskan rencana pengobatan..."
                    />
                  </div>

                  {/* Catatan & Tindak Lanjut */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Tambahan</label>
                    <textarea
                      name="notes"
                      value={medicalRecord.notes}
                      onChange={handleMedicalRecordChange}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Catatan tambahan..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tindak Lanjut</label>
                    <input
                      type="date"
                      name="followUpDate"
                      value={medicalRecord.followUpDate}
                      onChange={handleMedicalRecordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors mb-4"
                    />
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="radio" name="followUpType" value="control" className="mr-2 text-emerald-600" />
                        <span className="text-sm text-gray-700">Kontrol Rutin</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="followUpType" value="lab" className="mr-2 text-emerald-600" />
                        <span className="text-sm text-gray-700">Pemeriksaan Lab</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="followUpType" value="specialist" className="mr-2 text-emerald-600" />
                        <span className="text-sm text-gray-700">Rujukan Spesialis</span>
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Prescription Form */}
          {activeTab === "prescription" && (
            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-linear-to-r from-cyan-50/50 to-teal-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button onClick={() => setActiveTab("dashboard")} className="p-2 hover:bg-white rounded-lg transition-colors border border-gray-200">
                      <Icons.ArrowLeft />
                    </button>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Resep Obat</h2>
                      <p className="text-gray-600">{selectedPatient ? `Untuk: ${selectedPatient.name}` : "Pilih pasien terlebih dahulu"}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button onClick={() => window.print()} className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition-colors">
                      <Icons.Printer />
                      <span>Cetak Resep</span>
                    </button>
                    <button
                      onClick={handlePrescriptionSubmit}
                      className="px-4 py-2 bg-linear-to-r from-cyan-600 to-teal-600 text-white rounded-lg flex items-center space-x-2 hover:from-cyan-700 hover:to-teal-700 transition-all shadow-sm"
                    >
                      <Icons.Save />
                      <span>Simpan Resep</span>
                    </button>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePrescriptionSubmit} className="p-6">
                {/* Header Resep */}
                <div className="mb-8 p-4 bg-linear-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">SENTRACARE - RESEP DOKTER</h3>
                      <p className="text-sm text-gray-600">No. Resep: {prescriptionNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Tanggal: {currentDate}</p>
                      <p className="text-sm text-gray-600">Dokter: Dr. {user?.fullname}</p>
                    </div>
                  </div>
                </div>

                {/* Daftar Obat */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">Daftar Obat</h3>
                    <button
                      type="button"
                      onClick={addMedicine}
                      className="px-4 py-2 bg-linear-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-lg flex items-center space-x-2 hover:from-emerald-100 hover:to-teal-100 transition-all border border-emerald-200"
                    >
                      <Icons.Plus />
                      <span>Tambah Obat</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {prescription.medicines.map((medicine, index) => (
                      <div key={medicine.id} className="p-4 border border-gray-200 rounded-lg bg-linear-to-r from-gray-50/50 to-white">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-800">Obat #{index + 1}</h4>
                          {prescription.medicines.length > 1 && (
                            <button type="button" onClick={() => removeMedicine(medicine.id)} className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors">
                              <Icons.Trash2 />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm text-gray-600 mb-1">Nama Obat</label>
                            <select
                              value={medicine.name}
                              onChange={(e) => updateMedicine(medicine.id, "name", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            >
                              <option value="">Pilih obat...</option>
                              {medicineOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Dosis</label>
                            <input
                              type="text"
                              value={medicine.dosage}
                              onChange={(e) => updateMedicine(medicine.id, "dosage", e.target.value)}
                              placeholder="1 tablet"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Frekuensi</label>
                            <select
                              value={medicine.frequency}
                              onChange={(e) => updateMedicine(medicine.id, "frequency", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            >
                              <option value="">Pilih...</option>
                              <option value="1x sehari">1x sehari</option>
                              <option value="2x sehari">2x sehari</option>
                              <option value="3x sehari">3x sehari</option>
                              <option value="4x sehari">4x sehari</option>
                              <option value="Saat diperlukan">Saat diperlukan</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Durasi</label>
                            <input
                              type="text"
                              value={medicine.duration}
                              onChange={(e) => updateMedicine(medicine.id, "duration", e.target.value)}
                              placeholder="7 hari"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="block text-sm text-gray-600 mb-1">Catatan</label>
                          <input
                            type="text"
                            value={medicine.notes}
                            onChange={(e) => updateMedicine(medicine.id, "notes", e.target.value)}
                            placeholder="Setelah makan, dll."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instruksi */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instruksi untuk Pasien</label>
                  <textarea
                    value={prescription.instructions}
                    onChange={(e) => handlePrescriptionChange("instructions", e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Masukkan instruksi khusus untuk pasien..."
                  />
                </div>

                {/* Tanda Tangan */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-600 mb-4">Pasien:</p>
                      <div className="h-20 w-48 border-b border-gray-400"></div>
                      <p className="text-sm text-gray-600 mt-1">{selectedPatient?.name || "Nama Pasien"}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-4">Dokter Penanggung Jawab:</p>
                      <div className="h-20 w-48 border-b border-gray-400"></div>
                      <p className="text-sm text-gray-600 mt-1">Dr. {user?.fullname}</p>
                      <p className="text-xs text-gray-500">{user?.specialization || "Dokter Umum"}</p>
                      <p className="text-xs text-gray-500">SIP: {user?.licenseNumber || "XXXXXXX"}</p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
