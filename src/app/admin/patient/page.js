"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";

export default function PatientEMRPage() {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [adminName, setAdminName] = useState("");
  const [activeTab, setActiveTab] = useState("records");
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const API_BASE = "http://localhost:8088";
  // --- 1. FUNGSI LOAD DATA (Sinkron ke Port 8004) ---
  const fetchAllPatients = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMsg("Token missing. Please login.");
        router.push("/auth/login");
        return;
      }
      // ${API_BASE}//patients/patients-list
      // http://localhost:8004/patients
      const res = await fetch(`${API_BASE}/patients/patients-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          setErrorMsg("Unauthorized. Please login again.");
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      console.error("Load Error:", err);
      setErrorMsg(`Error fetching patients: ${err?.message || "Please check your connection"}`);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // --- 2. FUNGSI SINKRONISASI MANUAL (Fallback) ---
  const handleSyncData = async () => {
    setIsSyncing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("Token missing. Please login.");
        setIsSyncing(false);
        router.push("/auth/login");
        return;
      }
      // http://localhost:8004/patients/sync-from-booking
      // ${API_BASE}/patients/sync-from-booking
      const res = await fetch(`${API_BASE}/patients/sync-from-booking`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to sync: ${res.status}`);
      }

      const result = await res.json();
      setSuccessMsg(result.message || "Synchronization successful!");

      // Refresh data
      fetchAllPatients();
    } catch (err) {
      console.error("Sync Error:", err);
      setErrorMsg(err.message || "Failed to sync data");
    } finally {
      setIsSyncing(false);
    }
  };

  // --- 3. LOGIKA FILTERING ---
  useEffect(() => {
    let filtered = patients;
    if (searchTerm) {
      filtered = filtered.filter((p) => p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || p.email.toLowerCase().includes(searchTerm.toLowerCase()) || (p.phone_number && p.phone_number.includes(searchTerm)));
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter((p) => p.status === filterStatus);
    }
    setFilteredPatients(filtered);
  }, [searchTerm, filterStatus, patients]);

  // --- 4. INITIAL LOAD ---
  useEffect(() => {
    setAdminName(localStorage.getItem("username") || "SuperAdmin");
    fetchAllPatients();
  }, [fetchAllPatients]);

  // --- 5. HITUNG STATISTIK BERDASARKAN DATA ASLI ---
  const stats = {
    total: patients.length,
    active: patients.filter((p) => p.status === "Active").length,
    followUp: patients.filter((p) => p.status === "Follow-up").length,
    newThisMonth: patients.filter((p) => {
      if (!p.records || p.records.length === 0) return false;
      const lastVisit = new Date(p.records[0].visit_date);
      const now = new Date();
      return now.getMonth() === lastVisit.getMonth() && now.getFullYear() === lastVisit.getFullYear();
    }).length,
    withEMR: patients.filter((p) => p.records && p.records.length > 0).length,
  };

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Follow-up":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getServiceColor = (service) => {
    const serviceMap = {
      "Konsultasi Umum": "bg-blue-100 text-blue-800",
      "Konsultasi Spesialis": "bg-purple-100 text-purple-800",
      "Tindakan Medis": "bg-red-100 text-red-800",
      "Pemeriksaan Lab": "bg-teal-100 text-teal-800",
      "Rawat Jalan": "bg-indigo-100 text-indigo-800",
    };
    return serviceMap[service] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Patient EMR Management - Admin Dashboard</title>
        <meta name="description" content="Manage and monitor patient Electronic Medical Records" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header/Navbar - Sama dengan view-users */}
      <nav className="bg-linear-to-r from-teal-600 to-emerald-700 text-white p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-bold text-2xl">
            SentraCare<span className="font-light"> Admin</span>
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="font-semibold text-white">S</span>
            </div>
            <span className="font-medium text-white">SuperAdmin</span>
          </div>
          <button
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full flex items-center space-x-2 transition duration-200"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userRole");
              localStorage.removeItem("username");
              router.push("/auth/login");
            }}
          >
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
            <h1 className="text-3xl font-bold text-gray-900">Patient EMR Management</h1>
            <p className="text-gray-600 mt-2">Monitor and manage Electronic Medical Records</p>
            <p className="text-sm text-blue-600 mt-1">Data dinamis dari API: {patients.length} patient(s) loaded</p>
          </div>
          <div className="flex space-x-4">
            <button onClick={fetchAllPatients} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            <Link href="/admin/dashboard-admin">
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200">← Back to Dashboard</button>
            </Link>
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
            <button onClick={fetchAllPatients} className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
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

        {/* Stats Cards - DATA DINAMIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Total Patients</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-3">All EMR records</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Active Patients</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.active}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-green-500 text-sm mt-3">Currently active</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Follow-up Needed</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.followUp}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-yellow-500 text-sm mt-3">Require attention</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Updated This Month</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.newThisMonth}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-purple-500 text-sm mt-3">Recent updates</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">With EMR</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.withEMR}</p>
              </div>
              <div className="bg-teal-50 p-3 rounded-lg">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-teal-500 text-sm mt-3">Completed records</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search patients by name, email, or phone..."
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Follow-up">Follow-up</option>
              </select>

              <button
                onClick={handleSyncData}
                disabled={isSyncing}
                className={`px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2 ${isSyncing ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isSyncing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Sync from Booking</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- KIRI: Patients List --- */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">All Patients ({patients.length})</h2>
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-semibold">{filteredPatients.length}</span> of <span className="font-semibold">{patients.length}</span> patients
                    {patients.length > 0 && <span className="ml-2 text-green-600">✓ Live from API</span>}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service & Doctor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMR Status</th>
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
                          <p className="mt-2 text-gray-500">Loading patient data from API...</p>
                        </td>
                      </tr>
                    ) : patients.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5z"
                              />
                            </svg>
                            <p className="text-lg font-medium text-gray-700">No patients found</p>
                            <p className="text-gray-500 mt-1">Try syncing data or check your API connection</p>
                            <button onClick={handleSyncData} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                              Sync Data
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : filteredPatients.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                          No patients found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map((patient) => (
                        <tr key={patient.id} className={`hover:bg-gray-50 transition duration-150 cursor-pointer ${selectedPatient?.id === patient.id ? "bg-blue-50" : ""}`} onClick={() => setSelectedPatient(patient)}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">{patient.full_name?.charAt(0) || "P"}</div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{patient.full_name}</div>
                                <div className="text-sm text-gray-500">ID: #{patient.id.toString().padStart(3, "0")}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{patient.email}</div>
                            <div className="text-sm text-gray-500">{patient.phone_number || "No phone"}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getServiceColor(patient.tipe_layanan)}`}>{patient.tipe_layanan || "No service"}</span>
                              <div className="text-xs text-gray-500">Dr. {patient.doctor_full_name || "Unassigned"}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(patient.status)}`}>{patient.status || "Unknown"}</span>
                              {patient.records && patient.records.length > 0 ? <span className="ml-2 text-green-500 text-xs">✓ {patient.records.length} record(s)</span> : <span className="ml-2 text-yellow-500 text-xs">⏳ Waiting</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPatient(patient);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{filteredPatients.length ? 1 : 0}</span> to <span className="font-medium">{filteredPatients.length}</span> of <span className="font-medium">{patients.length}</span> results
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">1</button>
                  <button className="px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">Next</button>
                </div>
              </div>
            </div>
          </div>

          {/* --- KANAN: Patient Details --- */}
          <div className="space-y-6">
            {selectedPatient ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-linear-to-r from-blue-600 to-teal-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white">Patient EMR Details</h2>
                  <p className="text-white/80 text-sm">
                    ID: {selectedPatient.id} • Booking: #{selectedPatient.booking_id}
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Patient Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase mb-1">Full Name</p>
                      <p className="font-semibold text-gray-900">{selectedPatient.full_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase mb-1">Contact</p>
                      <p className="font-semibold text-gray-900">{selectedPatient.phone_number || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase mb-1">Email</p>
                      <p className="font-semibold text-gray-900">{selectedPatient.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase mb-1">Status</p>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedPatient.status)}`}>{selectedPatient.status}</span>
                    </div>
                  </div>

                  {/* Service Info */}
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">Service Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Service Type:</span>
                        <span className="font-medium">{selectedPatient.tipe_layanan || "Not specified"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Assigned Doctor:</span>
                        <span className="font-medium">{selectedPatient.doctor_full_name || "Unassigned"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Doctor Email:</span>
                        <span className="font-medium">{selectedPatient.doctor_email || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* EMR Records */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-gray-800">Medical Records</h3>
                      <span className="text-xs text-gray-500">{selectedPatient.records?.length || 0} record(s)</span>
                    </div>

                    {selectedPatient.records && selectedPatient.records.length > 0 ? (
                      <div className="space-y-4">
                        {selectedPatient.records.slice(0, 2).map((record, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-medium text-gray-700">Visit Date: {formatDate(record.visit_date)}</span>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Record #{index + 1}</span>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Diagnosis</p>
                                <p className="text-sm text-gray-800">{record.diagnosis || "No diagnosis recorded"}</p>
                              </div>
                              {record.prescription && (
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Prescription</p>
                                  <p className="text-sm text-gray-800">{record.prescription}</p>
                                </div>
                              )}
                              {record.treatment && (
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Treatment</p>
                                  <p className="text-sm text-gray-800">{record.treatment}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-yellow-50 p-6 text-center rounded-lg border border-yellow-200">
                        <svg className="w-12 h-12 text-yellow-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.226 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-yellow-700 font-medium">No medical records available</p>
                        <p className="text-yellow-600 text-sm mt-1">Doctor has not input medical data for this patient</p>
                      </div>
                    )}
                  </div>

                  <button onClick={() => setSelectedPatient(null)} className="w-full py-3 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg border border-gray-300 transition duration-200">
                    Close Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 text-center border-2 border-dashed border-gray-300">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-gray-800 font-semibold mb-2">Select a Patient</h3>
                <p className="text-gray-500 text-sm">Choose a patient from the list to view detailed medical records</p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">EMR Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Patients with EMR</span>
                  <span className="font-semibold text-gray-900">
                    {stats.withEMR}/{stats.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.total ? (stats.withEMR / stats.total) * 100 : 0}%` }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-2">{((stats.withEMR / stats.total) * 100 || 0).toFixed(1)}% completion rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">API Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Data Source</p>
                  <p className="text-sm text-gray-500">Connected to: http://localhost:8004/patients</p>
                  <p className="text-xs text-gray-400 mt-1">Last fetched: Just now</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Total Records</p>
                  <p className="text-sm text-gray-500">{patients.length} patient(s) loaded from database</p>
                  <p className="text-xs text-gray-400 mt-1">Real-time data</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={fetchAllPatients} className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                <span className="text-sm font-medium text-gray-700">Refresh Data</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button onClick={handleSyncData} className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                <span className="text-sm font-medium text-gray-700">Sync from Booking</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                <span className="text-sm font-medium text-gray-700">Export EMR Data</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
