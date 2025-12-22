"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PatientEMRPage() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("records");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const router = useRouter();

  // Form untuk medical record baru
  const [newRecord, setNewRecord] = useState({
    patient_id: "",
    visit_date: new Date().toISOString().split("T")[0],
    visit_type: "Konsultasi",
    diagnosis: "",
    treatment: "",
    prescription: "",
    notes: "",
    doctor_name: "",
    vital_signs: {
      blood_pressure: "",
      heart_rate: "",
      temperature: "",
      weight: "",
      height: "",
    },
  });

  // Sample data jika API belum tersedia
  const samplePatients = [
    {
      id: "P001",
      patient_id: "P001",
      name: "Lanang Wisana",
      age: 32,
      gender: "Laki-laki",
      phone: "081234567890",
      email: "lanang@email.com",
      address: "Jl. Merdeka No. 123, Jakarta",
      blood_type: "O+",
      allergies: "Tidak ada",
      emergency_contact: "081298765432",
      medical_records: [
        {
          id: "MR001",
          date: "2025-12-10",
          visit_type: "Medical Check-Up",
          diagnosis: "Hipertensi Grade 1",
          treatment: "Terapi obat, diet rendah garam, olahraga teratur",
          prescription: "Amlodipine 5mg 1x sehari",
          doctor: "Dr. Budi Santoso",
          vital_signs: {
            blood_pressure: "140/90 mmHg",
            heart_rate: "78 bpm",
            temperature: "36.8°C",
            weight: "75 kg",
            height: "170 cm",
          },
        },
        {
          id: "MR002",
          date: "2025-11-15",
          visit_type: "Follow-up",
          diagnosis: "Hipertensi terkontrol",
          treatment: "Terapi lanjutan, monitoring tekanan darah",
          prescription: "Amlodipine 5mg 1x sehari, Pantoprazole 40mg 1x sehari",
          doctor: "Dr. Sari Dewi",
          vital_signs: {
            blood_pressure: "130/85 mmHg",
            heart_rate: "72 bpm",
            temperature: "36.5°C",
            weight: "74 kg",
            height: "170 cm",
          },
        },
      ],
      last_visit: "2025-12-10",
      status: "Active",
    },
    {
      id: "P002",
      patient_id: "P002",
      name: "Sari Dewi",
      age: 28,
      gender: "Perempuan",
      phone: "081234567891",
      email: "sari@email.com",
      address: "Jl. Sudirman No. 45, Bandung",
      blood_type: "A+",
      allergies: "Penisilin",
      emergency_contact: "081298765433",
      medical_records: [
        {
          id: "MR003",
          date: "2025-12-05",
          visit_type: "Konsultasi Umum",
          diagnosis: "Influenza",
          treatment: "Istirahat, banyak minum air putih, obat penurun demam",
          prescription: "Paracetamol 500mg 3x sehari",
          doctor: "Dr. Ahmad Fauzi",
          vital_signs: {
            blood_pressure: "120/80 mmHg",
            heart_rate: "85 bpm",
            temperature: "38.2°C",
            weight: "58 kg",
            height: "165 cm",
          },
        },
      ],
      last_visit: "2025-12-05",
      status: "Active",
    },
    {
      id: "P003",
      patient_id: "P003",
      name: "Bambang Susanto",
      age: 45,
      gender: "Laki-laki",
      phone: "081234567892",
      email: "bambang@email.com",
      address: "Jl. Gatot Subroto No. 78, Surabaya",
      blood_type: "B+",
      allergies: "Tidak ada",
      emergency_contact: "081298765434",
      medical_records: [
        {
          id: "MR004",
          date: "2025-11-20",
          visit_type: "Diabetes Check-up",
          diagnosis: "Diabetes Mellitus Tipe 2",
          treatment: "Terapi insulin, diet diabetes, monitoring gula darah",
          prescription: "Metformin 500mg 2x sehari, Insulin Glargine",
          doctor: "Dr. Budi Santoso",
          vital_signs: {
            blood_pressure: "135/85 mmHg",
            heart_rate: "76 bpm",
            temperature: "36.7°C",
            weight: "82 kg",
            height: "175 cm",
          },
        },
        {
          id: "MR005",
          date: "2025-10-10",
          visit_type: "Lab Test",
          diagnosis: "Kolesterol Tinggi",
          treatment: "Diet rendah lemak, olahraga aerobik",
          prescription: "Atorvastatin 20mg 1x sehari",
          doctor: "Dr. Sari Dewi",
          vital_signs: {
            blood_pressure: "140/90 mmHg",
            heart_rate: "80 bpm",
            temperature: "36.6°C",
            weight: "85 kg",
            height: "175 cm",
          },
        },
      ],
      last_visit: "2025-11-20",
      status: "Follow-up",
    },
  ];

  // Fetch data patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Untuk sementara pakai sample data
        // const response = await fetch("http://localhost:8000/patients");
        // const data = await response.json();
        setPatients(samplePatients);
        setFilteredPatients(samplePatients);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setPatients(samplePatients);
        setFilteredPatients(samplePatients);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients based on search and status
  useEffect(() => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter((patient) => patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) || patient.phone.includes(searchTerm));
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((patient) => patient.status === filterStatus);
    }

    setFilteredPatients(filtered);
  }, [searchTerm, filterStatus, patients]);

  // Handle adding new medical record
  const handleAddRecord = async (e) => {
    e.preventDefault();

    if (!newRecord.patient_id) {
      alert("Silakan pilih pasien terlebih dahulu");
      return;
    }

    // Simulate API call
    try {
      const newRecordData = {
        id: `MR${Date.now()}`,
        date: newRecord.visit_date,
        visit_type: newRecord.visit_type,
        diagnosis: newRecord.diagnosis,
        treatment: newRecord.treatment,
        prescription: newRecord.prescription,
        doctor: newRecord.doctor_name,
        vital_signs: newRecord.vital_signs,
        notes: newRecord.notes,
      };

      // Update patient's medical records
      const updatedPatients = patients.map((patient) => {
        if (patient.patient_id === newRecord.patient_id) {
          return {
            ...patient,
            medical_records: [newRecordData, ...patient.medical_records],
            last_visit: newRecord.visit_date,
          };
        }
        return patient;
      });

      setPatients(updatedPatients);
      setFilteredPatients(updatedPatients);

      // Update selected patient
      if (selectedPatient?.patient_id === newRecord.patient_id) {
        setSelectedPatient({
          ...selectedPatient,
          medical_records: [newRecordData, ...selectedPatient.medical_records],
          last_visit: newRecord.visit_date,
        });
      }

      // Reset form
      setNewRecord({
        patient_id: newRecord.patient_id, // Keep patient selected
        visit_date: new Date().toISOString().split("T")[0],
        visit_type: "Konsultasi",
        diagnosis: "",
        treatment: "",
        prescription: "",
        notes: "",
        doctor_name: "",
        vital_signs: {
          blood_pressure: "",
          heart_rate: "",
          temperature: "",
          weight: "",
          height: "",
        },
      });

      alert("Rekam medis berhasil ditambahkan!");
      setActiveTab("records");
    } catch (error) {
      alert("Terjadi kesalahan saat menambahkan rekam medis");
    }
  };

  // Handle patient selection
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setNewRecord({
      ...newRecord,
      patient_id: patient.patient_id,
    });
  };

  // Calculate patient statistics
  const stats = {
    total: patients.length,
    active: patients.filter((p) => p.status === "Active").length,
    followUp: patients.filter((p) => p.status === "Follow-up").length,
    newThisMonth: patients.filter((p) => {
      const lastVisit = new Date(p.last_visit);
      const now = new Date();
      return now.getMonth() === lastVisit.getMonth() && now.getFullYear() === lastVisit.getFullYear();
    }).length,
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-teal-50 p-4 md:p-6 lg:p-8 font-sans">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-linear-to-r from-teal-500 to-emerald-600 rounded-2xl shadow-lg shadow-teal-200">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">Electronic Medical Records</h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">Sistem Rekam Medis Elektronik SentraCare</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200 w-fit">
            <button
              onClick={() => setActiveTab("records")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === "records" ? "bg-linear-to-r from-teal-500 to-emerald-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
            >
              📋 Rekam Medis
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === "add" ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
            >
              ➕ Tambah Rekam Medis
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === "analytics" ? "bg-linear-to-r from-purple-500 to-indigo-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
            >
              📊 Analytics
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari pasien berdasarkan nama, ID, atau nomor telepon..."
                  className="w-full px-4 py-3 pl-12 text-gray-800 placeholder:text-gray-400 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <select
                className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200 appearance-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="Active">Aktif</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Inactive">Tidak Aktif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Pasien</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-full">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pasien Aktif</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Perlu Follow-up</p>
                <p className="text-2xl font-bold text-amber-600">{stats.followUp}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Bulan Ini</p>
                <p className="text-2xl font-bold text-blue-600">{stats.newThisMonth}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- KIRI: Patients List --- */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patients List Card */}
          <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 transition-all duration-300 ${activeTab === "records" ? "ring-2 ring-teal-500" : ""}`}>
            <div className="bg-linear-to-r from-teal-600 to-emerald-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Daftar Pasien</h2>
                    <p className="text-white/80 text-sm">{filteredPatients.length} pasien ditemukan</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mb-4"></div>
                  <p className="text-gray-600 font-medium">Memuat data pasien...</p>
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="text-center py-16">
                  <div className="p-4 bg-linear-to-r from-gray-100 to-gray-200 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium text-lg">Tidak ada pasien ditemukan</p>
                  <p className="text-gray-400 mt-1">Coba gunakan kata kunci pencarian yang berbeda</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedPatient?.id === patient.id ? "bg-linear-to-r from-teal-50 to-emerald-50 border-teal-300 ring-2 ring-teal-100" : "bg-white border-gray-200 hover:border-teal-300 hover:bg-gray-50"
                      }`}
                      onClick={() => handleSelectPatient(patient)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${selectedPatient?.id === patient.id ? "bg-linear-to-r from-teal-500 to-emerald-600" : "bg-gray-100"}`}>
                            <svg className={`w-6 h-6 ${selectedPatient?.id === patient.id ? "text-white" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-bold text-gray-900">{patient.name}</h3>
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  patient.status === "Active" ? "bg-green-100 text-green-800" : patient.status === "Follow-up" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {patient.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                              <div className="text-sm">
                                <p className="text-gray-500">ID Pasien</p>
                                <p className="font-medium">{patient.patient_id}</p>
                              </div>
                              <div className="text-sm">
                                <p className="text-gray-500">Usia</p>
                                <p className="font-medium">{patient.age} tahun</p>
                              </div>
                              <div className="text-sm">
                                <p className="text-gray-500">Kunjungan Terakhir</p>
                                <p className="font-medium">{new Date(patient.last_visit).toLocaleDateString("id-ID")}</p>
                              </div>
                              <div className="text-sm">
                                <p className="text-gray-500">Jumlah Rekam Medis</p>
                                <p className="font-medium">{patient.medical_records?.length || 0}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={`p-2 rounded-full ${selectedPatient?.id === patient.id ? "bg-teal-100" : "bg-gray-100"}`}>
                          <svg className={`w-5 h-5 ${selectedPatient?.id === patient.id ? "text-teal-600" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- KANAN: Medical Records --- */}
        <div className="space-y-6">
          {/* Selected Patient Info */}
          {selectedPatient && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="bg-linear-to-r from-blue-600 to-cyan-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Informasi Pasien</h2>
                      <p className="text-white/80 text-sm">Detail pasien terpilih</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Nama Lengkap</p>
                      <p className="font-semibold text-gray-900">{selectedPatient.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Golongan Darah</p>
                      <p className="font-semibold text-gray-900">{selectedPatient.blood_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Jenis Kelamin</p>
                      <p className="font-semibold text-gray-900">{selectedPatient.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Alergi</p>
                      <p className="font-semibold text-gray-900">{selectedPatient.allergies}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Kontak Darurat</p>
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                      <p className="font-semibold text-red-700">{selectedPatient.emergency_contact}</p>
                      <p className="text-sm text-red-600">Hubungi dalam keadaan darurat</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Alamat</p>
                    <p className="text-gray-800">{selectedPatient.address}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Medical Record Form */}
          <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 transition-all duration-300 ${activeTab === "add" ? "ring-2 ring-blue-500" : ""}`}>
            <div className="bg-linear-to-r from-blue-500 to-cyan-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">Tambah Rekam Medis</h2>
                </div>
              </div>
            </div>

            <form onSubmit={handleAddRecord} className="p-6 space-y-5">
              {!selectedPatient ? (
                <div className="text-center py-8">
                  <div className="p-4 bg-linear-to-r from-gray-100 to-gray-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">Pilih pasien terlebih dahulu</p>
                  <p className="text-gray-400 text-sm mt-1">Klik pada nama pasien di daftar sebelah kiri</p>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">Menambahkan rekam medis untuk:</p>
                        <p className="text-lg font-bold text-blue-600">{selectedPatient.name}</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1.5 rounded-full">ID: {selectedPatient.patient_id}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Kunjungan</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        value={newRecord.visit_date}
                        onChange={(e) => setNewRecord({ ...newRecord, visit_date: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kunjungan</label>
                      <select
                        className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none"
                        value={newRecord.visit_type}
                        onChange={(e) => setNewRecord({ ...newRecord, visit_type: e.target.value })}
                        required
                      >
                        <option value="Konsultasi">Konsultasi</option>
                        <option value="Medical Check-Up">Medical Check-Up</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Emergency">Emergency</option>
                        <option value="Lab Test">Lab Test</option>
                        <option value="Vaksinasi">Vaksinasi</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                    <textarea
                      placeholder="Masukkan diagnosis utama..."
                      className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      rows="2"
                      value={newRecord.diagnosis}
                      onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tindakan & Pengobatan</label>
                    <textarea
                      placeholder="Jelaskan tindakan medis yang dilakukan..."
                      className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      rows="2"
                      value={newRecord.treatment}
                      onChange={(e) => setNewRecord({ ...newRecord, treatment: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resep Obat</label>
                    <textarea
                      placeholder="Tulis resep obat yang diberikan..."
                      className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      rows="2"
                      value={newRecord.prescription}
                      onChange={(e) => setNewRecord({ ...newRecord, prescription: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Dokter</label>
                    <input
                      type="text"
                      placeholder="Nama dokter yang menangani"
                      className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      value={newRecord.doctor_name}
                      onChange={(e) => setNewRecord({ ...newRecord, doctor_name: e.target.value })}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-linear-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3.5 rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Simpan Rekam Medis
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Medical Records History */}
      {selectedPatient && selectedPatient.medical_records && selectedPatient.medical_records.length > 0 && (
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="bg-linear-to-r from-purple-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Riwayat Rekam Medis</h2>
                    <p className="text-white/80 text-sm">{selectedPatient.medical_records.length} catatan medis</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {selectedPatient.medical_records.map((record, index) => (
                  <div key={record.id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-purple-300 transition-colors">
                    <div className="bg-linear-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{record.visit_type}</h3>
                            <p className="text-sm text-gray-600">{new Date(record.date).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">Oleh: {record.doctor}</span>
                          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">Catatan #{index + 1}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Diagnosis</h4>
                            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">{record.diagnosis}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Tindakan & Pengobatan</h4>
                            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">{record.treatment}</p>
                          </div>
                          {record.prescription && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-2">Resep Obat</h4>
                              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">{record.prescription}</p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Tanda Vital</h4>
                            <div className="grid grid-cols-2 gap-3">
                              {Object.entries(record.vital_signs).map(
                                ([key, value]) =>
                                  value && (
                                    <div key={key} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                      <p className="text-xs text-gray-500 capitalize">{key.replace("_", " ")}</p>
                                      <p className="font-semibold text-gray-800">{value}</p>
                                    </div>
                                  )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-linear-to-r from-teal-100 to-emerald-100 rounded-lg">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">SentraCare EMR System v1.0</p>
              <p className="text-xs text-gray-500">Sistem Rekam Medis Elektronik Terintegrasi</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">Status: {loading ? "Loading..." : "Connected ✓"}</span>
            <div className={`h-2 w-2 rounded-full ${loading ? "bg-yellow-500 animate-pulse" : "bg-green-500"}`}></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
