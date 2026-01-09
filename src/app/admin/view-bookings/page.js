"use client";
import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ViewAllBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalAction, setModalAction] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'
  const API_BASE = "http://localhost:8088";
  // Tombol Confirm disable kalau status sudah CONFIRMED atau CANCELLED
  const isConfirmDisabled = (status) => {
    if (!status) return false;
    const s = status.trim().toUpperCase();
    return s === "CONFIRMED" || s === "CANCELLED";
  };

  const isCancelDisabled = (status) => {
    if (!status) return false;
    const s = status.trim().toUpperCase();
    return s === "CONFIRMED" || s === "CANCELLED";
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case "PENDING":
        return "bg-amber-50 text-amber-800 border border-amber-200";
      case "CONFIRMED":
        return "bg-emerald-50 text-emerald-800 border border-emerald-200";
      case "CANCELLED":
        return "bg-red-50 text-red-800 border border-red-200";
      default:
        return "bg-gray-50 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case "PENDING":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "CONFIRMED":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "CANCELLED":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatStatusForDisplay = (status) => {
    if (!status) return "";
    if (status === "Pending" || status === "Confirmed" || status === "Cancelled") {
      return status;
    }
    if (status === "PENDING" || status === "CONFIRMED" || status === "CANCELLED") {
      return status.charAt(0) + status.slice(1).toLowerCase();
    }
    return status;
  };

  const BOOKINGS_QUERY = `
    query {
      bookings {
        id
        namaLengkap
        jenisLayanan
        tanggalPemeriksaan
        jamPemeriksaan
        status
        doctorName
      }
    }
  `;

  const fetchBookings = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("Token missing. Please login.");
        setLoading(false);
        return;
      }
      // http://localhost:8001/graphql
      // ${API_BASE}/booking/graphql
      const res = await fetch(`${API_BASE}/booking/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: BOOKINGS_QUERY }),
      });

      const result = await res.json();

      if (result.errors) {
        const errorMessages = result.errors.map((e) => e.message || JSON.stringify(e)).join(" | ");
        setErrorMsg(`GraphQL Error: ${errorMessages}`);
      } else if (result.data && result.data.bookings) {
        setBookings(result.data.bookings);
      } else {
        setErrorMsg("No data returned from server");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setErrorMsg(`Network Error: ${err?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      // http://localhost:8002/auth/admin/users
      // ${API_BASE}/auth/admin/users
      const res = await fetch(`${API_BASE}/auth/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        // PERBAIKAN: Gunakan .toUpperCase() agar sinkron dengan Backend
        const filteredDoctors = data.filter((u) => u.role && u.role.toUpperCase() === "DOKTER");
        console.log("Doctors found:", filteredDoctors); // Cek di console browser
        setDoctors(filteredDoctors);
      }
    } catch (err) {
      console.error("Gagal ambil dokter:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    setErrorMsg(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("Token missing. Please login.");
        setUpdatingId(null);
        return;
      }
      const statusValue = modalAction === "confirm" ? "CONFIRMED" : "CANCELLED";

      const bodyPayload = { status: statusValue };
      if (modalAction === "confirm" && selectedDoctor) {
        if (!selectedDoctor) {
          alert("Silakan pilih dokter terlebih dahulu!");
          return;
        }
        bodyPayload.doctor_name = selectedDoctor.name;
        bodyPayload.doctor_email = selectedDoctor.email;
      }
      // http://localhost:8001/booking/${id}/status
      // ${API_BASE}/booking/${id}/status
      const res = await fetch(`${API_BASE}/booking/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to update status");
      }

      await res.json();
      fetchBookings();
      setSuccessMsg(`Booking berhasil di-${modalAction === "confirm" ? "konfirmasi" : "batal"}!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err.message || "Network error while updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    if (showConfirmModal || showCancelModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showConfirmModal, showCancelModal]);

  const openConfirmModal = (booking) => {
    setSelectedBooking(booking);
    setModalAction("confirm");
    setShowConfirmModal(true);
  };
  const openCancelModal = (booking) => {
    setSelectedBooking(booking);
    setModalAction("cancel");
    setShowCancelModal(true);
  };
  const closeModal = () => {
    setShowConfirmModal(false);
    setShowCancelModal(false);
    setSelectedBooking(null);
    setModalAction("");
    setCancelReason("");
    setSelectedDoctor(null);
  };

  const handleConfirmAction = async () => {
    if (!selectedBooking) return;
    if (modalAction === "confirm" && !selectedDoctor) {
      alert("Silakan pilih dokter terlebih dahulu!");
      return;
    }
    await updateStatus(selectedBooking.id);
    closeModal();
  };

  const stats = useMemo(() => {
    const total = bookings.length;
    const normalizeStatus = (status) => (status ? status.toUpperCase() : "");
    const pending = bookings.filter((b) => normalizeStatus(b.status) === "PENDING").length;
    const confirmed = bookings.filter((b) => normalizeStatus(b.status) === "CONFIRMED").length;
    const cancelled = bookings.filter((b) => normalizeStatus(b.status) === "CANCELLED").length;
    return { total, pending, confirmed, cancelled };
  }, [bookings]);

  const handleRefresh = () => {
    fetchBookings();
    setSuccessMsg("Data booking berhasil di-refresh!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-teal-50">
      <Head>
        <title>All Bookings - Admin Dashboard</title>
      </Head>
      {/* Header/Navbar */}
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Management</h1>
            <p className="text-gray-600">View and manage all patient bookings in the system</p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              <button onClick={() => setViewMode("table")} className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${viewMode === "table" ? "bg-teal-100 text-teal-700" : "text-gray-600 hover:bg-gray-100"}`}>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Table
                </span>
              </button>
              <button onClick={() => setViewMode("card")} className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${viewMode === "card" ? "bg-teal-100 text-teal-700" : "text-gray-600 hover:bg-gray-100"}`}>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  Cards
                </span>
              </button>
            </div>

            <button onClick={handleRefresh} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition duration-200 flex items-center space-x-2 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>

            <Link href="/admin/dashboard-admin">
              <button className="px-4 py-2 bg-linear-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:from-teal-700 hover:to-emerald-700 transition duration-200 flex items-center space-x-2 shadow-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center">
            <svg className="w-5 h-5 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-emerald-700">{successMsg}</span>
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700">{errorMsg}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Confirmed</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.confirmed}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Cancelled</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.cancelled}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Display */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mb-4"></div>
              <p className="text-gray-600 font-medium">Memuat data bookings...</p>
              <p className="text-gray-400 text-sm mt-1">Mohon tunggu sebentar</p>
            </div>
          </div>
        ) : viewMode === "table" ? (
          /* Table View */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Daftar Bookings</h2>
              <span className="text-sm text-gray-500">{bookings.length} bookings ditemukan</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID & Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">#{String(b.id).padStart(3, "0")}</p>
                          <p className="text-sm text-gray-600">{b.namaLengkap}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-800">{b.jenisLayanan}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{b.tanggalPemeriksaan}</p>
                          <p className="text-sm text-gray-500">{b.jamPemeriksaan}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-teal-600 text-sm font-medium">D</span>
                          </div>
                          <span className={`font-medium ${b.doctorName ? "text-teal-700" : "text-gray-400"}`}>{b.doctorName || "Belum ditugaskan"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className={`px-3 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 ${getStatusColor(b.status)}`}>
                            {getStatusIcon(b.status)}
                            {formatStatusForDisplay(b.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openConfirmModal(b)}
                            disabled={isConfirmDisabled(b.status)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition duration-200 flex items-center gap-1.5 ${
                              isConfirmDisabled(b.status) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            Confirm
                          </button>

                          <button
                            onClick={() => openCancelModal(b)}
                            disabled={isCancelDisabled(b.status)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition duration-200 flex items-center gap-1.5 ${
                              isCancelDisabled(b.status) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-red-50 text-red-700 hover:bg-red-100"
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">ID: #{String(b.id).padStart(3, "0")}</p>
                    <h3 className="font-bold text-gray-900 text-lg mt-1">{b.namaLengkap}</h3>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 ${getStatusColor(b.status)}`}>
                    {getStatusIcon(b.status)}
                    {formatStatusForDisplay(b.status)}
                  </span>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Layanan</p>
                      <p className="font-medium text-gray-800">{b.jenisLayanan}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tanggal & Waktu</p>
                      <p className="font-medium text-gray-800">
                        {b.tanggalPemeriksaan} • {b.jamPemeriksaan}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-50 rounded-lg">
                      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dokter</p>
                      <p className={`font-medium ${b.doctorName ? "text-teal-700" : "text-gray-400"}`}>{b.doctorName || "Belum ditugaskan"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => openConfirmModal(b)}
                    disabled={isConfirmDisabled(b.status)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition duration-200 flex items-center gap-1.5 ${
                      isConfirmDisabled(b.status) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() => openCancelModal(b)}
                    disabled={isCancelDisabled(b.status)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition duration-200 flex items-center gap-1.5 ${isCancelDisabled(b.status) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-red-50 text-red-700 hover:bg-red-100"}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Activity & Quick Actions */}
        {!loading && bookings.length > 0 && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                <span className="text-sm text-gray-500">Last 7 days</span>
              </div>
              <div className="space-y-4">
                {bookings.slice(0, 3).map((b) => (
                  <div key={b.id} className="flex items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors duration-150">
                    <div className={`p-2 rounded-lg mr-4 ${getStatusColor(b.status)}`}>{getStatusIcon(b.status)}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {b.namaLengkap} booked {b.jenisLayanan}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {b.tanggalPemeriksaan} • Status: {formatStatusForDisplay(b.status)}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">Just now</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { icon: "📋", label: "Create New Booking", color: "bg-blue-50 text-blue-600" },
                  { icon: "📊", label: "Export to Excel", color: "bg-emerald-50 text-emerald-600" },
                  { icon: "🔔", label: "Send Bulk Reminders", color: "bg-amber-50 text-amber-600" },
                  { icon: "📅", label: "View Calendar", color: "bg-purple-50 text-purple-600" },
                ].map((action) => (
                  <button key={action.label} className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition duration-150 group">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${action.color}`}>{action.icon}</div>
                      <span className="text-sm font-medium text-gray-700">{action.label}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {(showConfirmModal || showCancelModal) && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-white/20">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center">
                <div className={`p-3 rounded-xl mr-4 ${modalAction === "confirm" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                  {modalAction === "confirm" ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{modalAction === "confirm" ? "Confirm Booking" : "Cancel Booking"}</h3>
                  <p className="text-sm text-gray-600 mt-1">ID: #{String(selectedBooking.id).padStart(3, "0")}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Patient:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedBooking.namaLengkap}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Service:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedBooking.jenisLayanan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Date & Time:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedBooking.tanggalPemeriksaan} {selectedBooking.jamPemeriksaan}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Status:</span>
                    <span className={`px-2.5 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(selectedBooking.status)}`}>
                      {getStatusIcon(selectedBooking.status)}
                      {formatStatusForDisplay(selectedBooking.status)}
                    </span>
                  </div>
                </div>
              </div>

              {modalAction === "confirm" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign Doctor:</label>
                  <select
                    // Gunakan email sebagai value utama agar unik
                    value={selectedDoctor?.email || ""}
                    onChange={(e) => {
                      // Cari dokter berdasarkan email agar sinkron dengan value pilihan
                      const doctor = doctors.find((d) => d.email === e.target.value);
                      if (doctor) {
                        setSelectedDoctor({
                          name: doctor.full_name || doctor.username,
                          email: doctor.email,
                        });
                      } else {
                        setSelectedDoctor(null);
                      }
                    }}
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 appearance-none"
                  >
                    <option value="">-- Select Doctor --</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.email}>
                        {/* Di sini kita tampilkan Full Name, jika kosong baru tampilkan Username */}
                        Dr. {d.full_name || d.username}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {modalAction === "cancel" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Cancellation:</label>
                  <textarea
                    rows="3"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200"
                    placeholder="Enter reason for cancellation..."
                  />
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={closeModal} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition duration-200">
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={updatingId || (modalAction === "confirm" && !selectedDoctor)}
                className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl transition duration-200 flex items-center gap-2 ${
                  modalAction === "confirm"
                    ? "bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50"
                    : "bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:opacity-50"
                }`}
              >
                {updatingId ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : modalAction === "confirm" ? (
                  "Confirm Booking"
                ) : (
                  "Cancel Booking"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
