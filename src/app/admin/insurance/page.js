"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InsurancePage() {
  const router = useRouter();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("history");
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // State Form
  const [formData, setFormData] = useState({
    patient_name: "",
    bpjs_number: "",
    diagnosis_code: "",
    treatment_description: "",
    total_bill: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // URL Backend Insurance
  const API_URL = "http://localhost:8005";

  // 1. Fetch Data Klaim
  const fetchClaims = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch(`${API_URL}/insurance/claims`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setClaims(data);
    } catch (error) {
      console.error("Gagal koneksi ke server insurance:", error);
      setErrorMsg("Tidak dapat terhubung ke server insurance. Pastikan backend berjalan di port 8005.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  // 2. Submit Klaim Baru
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Validasi
      if (!formData.patient_name || !formData.bpjs_number || !formData.diagnosis_code || !formData.total_bill) {
        setErrorMsg("Harap isi semua field yang wajib diisi!");
        setIsSubmitting(false);
        return;
      }

      // Pastikan total_bill dikirim sebagai angka ke backend
      const payload = {
        ...formData,
        total_bill: parseFloat(formData.total_bill) || 0,
      };

      const response = await fetch(`${API_URL}/insurance/claims`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to create claim: ${response.status}`);
      }

      const result = await response.json();

      // Tampilkan pesan berdasarkan status
      if (result.status === "APPROVED") {
        setSuccessMsg(`✅ Klaim disetujui! ID: ${result.id}, Pasien: ${result.patient_name}`);
      } else if (result.status === "REJECTED") {
        setErrorMsg(`❌ Klaim ditolak: ${result.response_message}`);
      } else {
        setSuccessMsg(`⏳ Klaim sedang diproses: ${result.response_message}`);
      }

      // Reset form
      setFormData({
        patient_name: "",
        bpjs_number: "",
        diagnosis_code: "",
        treatment_description: "",
        total_bill: "",
      });

      // Refresh data
      fetchClaims();
      setActiveTab("history");
    } catch (error) {
      console.error("Error creating claim:", error);
      setErrorMsg(error.message || "Gagal mengirim klaim. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      patient_name: "",
      bpjs_number: "",
      diagnosis_code: "",
      treatment_description: "",
      total_bill: "",
    });
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
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Stats calculations
  const stats = {
    total: claims.length,
    approved: claims.filter((c) => c.status === "APPROVED").length,
    rejected: claims.filter((c) => c.status === "REJECTED").length,
    pending: claims.filter((c) => c.status === "PENDING").length,
    totalBill: claims.reduce((sum, claim) => sum + (claim.total_bill || 0), 0),
  };

  // Prevent body scroll when modal is open (if needed in future)
  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg(null);
        setErrorMsg(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Insurance Management - Admin Dashboard</title>
        <meta name="description" content="Manage insurance claims and bridge with BPJS" />
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
            <h1 className="text-3xl font-bold text-gray-900">Insurance Bridge System</h1>
            <p className="text-gray-600 mt-2">Manage insurance claims and bridge with BPJS (HL7 Standard)</p>
            <p className="text-sm text-blue-600 mt-1">Data dinamis dari API: {claims.length} klaim(s) loaded</p>
          </div>
          <div className="flex space-x-4">
            <button onClick={fetchClaims} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center space-x-2">
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
            <button onClick={fetchClaims} className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50/90 px-5 py-4 text-blue-700 shadow-sm">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <span className="font-medium">Fetching insurance claims from API...</span>
            </div>
          </div>
        )}

        {/* Stats Cards - DATA DINAMIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Total Claims</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-3">Live data from database</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Approved</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.approved}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-green-500 text-sm mt-3">Successfully processed</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Rejected</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.rejected}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <p className="text-red-500 text-sm mt-3">Claims denied</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pending}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-yellow-500 text-sm mt-3">Under review</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Total Value</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">Rp {stats.totalBill.toLocaleString("id-ID")}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-3">Cumulative amount</p>
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
                  className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search claims by patient name or BPJS number..."
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="all">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="PENDING">Pending</option>
              </select>

              <button onClick={() => setActiveTab("submit")} className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Submit New Claim</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- KIRI: Form Input Klaim --- */}
          <div className="lg:col-span-1">
            <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 transition-all duration-300 ${activeTab === "submit" ? "ring-2 ring-blue-500" : ""}`}>
              <div className="bg-linear-to-r from-blue-600 to-teal-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <span className="text-2xl">📝</span>
                    </div>
                    <h2 className="text-xl font-bold text-white">Submit New Claim</h2>
                  </div>
                  <button onClick={resetForm} className="text-white/90 hover:text-white text-sm bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-colors">
                    🔄 Reset
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">👤</span>
                    Patient Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Enter patient's full name"
                      value={formData.patient_name}
                      onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                    />
                    {formData.patient_name && (
                      <button type="button" onClick={() => setFormData({ ...formData, patient_name: "" })} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">🆔</span>
                    BPJS / Policy Number *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Example: 0001234567890"
                    value={formData.bpjs_number}
                    onChange={(e) => setFormData({ ...formData, bpjs_number: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-blue-600">🏥</span>
                      Diagnosis Code *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                        placeholder="Example: A01, Z99"
                        value={formData.diagnosis_code}
                        onChange={(e) => setFormData({ ...formData, diagnosis_code: e.target.value })}
                      />
                      <div className="absolute right-3 top-3.5 flex items-center gap-1">
                        <span className="text-xs text-gray-400">Z99 = reject</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-blue-600">💰</span>
                      Total Bill *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                      <input
                        type="number"
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                        placeholder="0"
                        value={formData.total_bill}
                        onChange={(e) => setFormData({ ...formData, total_bill: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">📋</span>
                    Medical Treatment Description
                  </label>
                  <textarea
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400 h-32 resize-none"
                    placeholder="Describe medical treatment, diagnosis, and treatment plan..."
                    value={formData.treatment_description}
                    onChange={(e) => setFormData({ ...formData, treatment_description: e.target.value })}
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Simulation Status:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded ${formData.diagnosis_code === "Z99" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                          {formData.diagnosis_code === "Z99" ? "🚫 Will be Rejected" : "✅ Will be Approved"}
                        </span>
                        <span className="text-xs text-gray-400">(Code Z99 = rejection)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-linear-to-r from-blue-600 to-teal-600 text-white font-semibold py-3.5 rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Submitting to BPJS...</span>
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        Submit to BPJS / Insurance
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-linear-to-r from-blue-50 to-teal-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-blue-600">ℹ️</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">HL7 Integration Info</p>
                  <p className="text-xs text-gray-600 mt-1">This system simulates HL7 standard communication with BPJS and private insurance gateways. Data is sent in V-Claim 2.0 format with end-to-end encryption.</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- KANAN: Riwayat Klaim --- */}
          <div className="lg:col-span-2">
            <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 transition-all duration-300 ${activeTab === "history" ? "ring-2 ring-blue-500" : ""}`}>
              <div className="bg-linear-to-r from-blue-600 to-teal-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <span className="text-2xl">📋</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Claims History</h2>
                      <p className="text-white/80 text-sm">Real-time synchronization with Insurance Gateway</p>
                    </div>
                  </div>
                  <div className="text-white/90 text-sm bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/30">HL7 v2.5</div>
                </div>
              </div>

              <div className="p-5">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-600 font-medium">Connecting to Insurance Gateway...</p>
                    <p className="text-gray-400 text-sm mt-1">Fetching latest claim data</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full">
                      <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <span>👤</span>
                              Patient & Policy
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <span>🏥</span>
                              Diagnosis & Details
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <span>💰</span>
                              Bill
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <span>📊</span>
                              Status
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {claims.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="px-6 py-16 text-center">
                              <div className="flex flex-col items-center">
                                <div className="p-4 bg-linear-to-r from-gray-100 to-gray-200 rounded-full mb-4">
                                  <span className="text-3xl text-gray-400">📋</span>
                                </div>
                                <p className="text-gray-600 font-medium text-lg">No claims data available</p>
                                <p className="text-gray-400 mt-1">Submit your first claim by clicking Submit New Claim</p>
                                <button onClick={() => setActiveTab("submit")} className="mt-4 px-4 py-2 bg-linear-to-r from-blue-600 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow">
                                  📝 Submit New Claim
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          claims.map((claim) => (
                            <tr key={claim.id} className="hover:bg-linear-to-r hover:from-blue-50/30 hover:to-teal-50/30 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="flex items-start gap-3">
                                  <div className={`p-2 rounded-lg ${claim.status === "APPROVED" ? "bg-green-100" : claim.status === "REJECTED" ? "bg-red-100" : "bg-yellow-100"}`}>
                                    <span className={`text-lg ${claim.status === "APPROVED" ? "text-green-600" : claim.status === "REJECTED" ? "text-red-600" : "text-yellow-600"}`}>👤</span>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900">{claim.patient_name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs text-gray-500">BPJS: {claim.bpjs_number}</span>
                                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">ID: {claim.id}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-2">
                                  <div>
                                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-300">{claim.diagnosis_code}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 line-clamp-2">{claim.response_message || "No additional notes"}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-transparent bg-linear-to-r from-blue-700 to-teal-700 bg-clip-text text-lg">Rp {(claim.total_bill || 0).toLocaleString("id-ID")}</span>
                                  </div>
                                  <p className="text-xs text-gray-500">Date: {formatDate(claim.created_at)}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-2">
                                  <div className="flex flex-col gap-1">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(claim.status)}`}>
                                      {claim.status === "APPROVED" && <span>✅</span>}
                                      {claim.status === "REJECTED" && <span>❌</span>}
                                      {claim.status === "PENDING" && <span>⏳</span>}
                                      {claim.status}
                                    </span>
                                  </div>
                                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        claim.status === "APPROVED" ? "bg-linear-to-r from-green-500 to-emerald-400" : claim.status === "REJECTED" ? "bg-linear-to-r from-red-500 to-rose-400" : "bg-linear-to-r from-yellow-500 to-amber-400"
                                      }`}
                                      style={{ width: "100%" }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {claims.length > 0 && (
                  <div className="mt-6 p-4 bg-linear-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Total Data:</span> {claims.length} claims •<span className="ml-2 font-medium">Total Value:</span> Rp {stats.totalBill.toLocaleString("id-ID")}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-xs text-gray-600">Approved: {stats.approved}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-xs text-gray-600">Rejected: {stats.rejected}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span className="text-xs text-gray-600">Pending: {stats.pending}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
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
                  <p className="text-sm text-gray-500">Connected to: http://localhost:8005/insurance/claims</p>
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
                  <p className="text-sm text-gray-500">{claims.length} claim(s) loaded from database</p>
                  <p className="text-xs text-gray-400 mt-1">Real-time data</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={fetchClaims} className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                <span className="text-sm font-medium text-gray-700">Refresh Data</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button onClick={() => setActiveTab("submit")} className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                <span className="text-sm font-medium text-gray-700">Submit New Claim</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                <span className="text-sm font-medium text-gray-700">Export Claims List</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-linear-to-r from-blue-100 to-teal-100 rounded-lg">
              <span className="text-blue-600">🛡️</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Insurance Bridge System v2.0</p>
              <p className="text-xs text-gray-500">HL7 V-Claim 2.0 • Real-time Integration • End-to-end Encryption</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">Gateway Status: {loading ? "Connecting..." : "Connected ✓"}</span>
            <div className={`h-2 w-2 rounded-full ${loading ? "bg-yellow-500 animate-pulse" : "bg-green-500"}`}></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
