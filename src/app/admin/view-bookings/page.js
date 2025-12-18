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
  const [modalAction, setModalAction] = useState(""); // 'confirm' atau 'cancel'
  const [cancelReason, setCancelReason] = useState("");

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      }
    }
  `;

  const UPDATE_BOOKING_STATUS_MUTATION = `
    mutation UpdateBookingStatus($id: Int!, $status: String!) {
      updateBookingStatus(id: $id, status: $status) {
        id
        status
      }
    }
  `;
  {
    /* Function fetch data booking*/
  }
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

      const res = await fetch("http://localhost:8001/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: BOOKINGS_QUERY }),
      });

      const result = await res.json();

      if (result.errors) {
        // Tampilkan error dengan format yang benar
        const errorMessages = result.errors
          .map((e) => {
            if (typeof e === "string") return e;
            if (e.message) return e.message;
            return JSON.stringify(e);
          })
          .join(" | ");
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

  useEffect(() => {
    fetchBookings();
  }, []);

  {
    /* Update status function */
  }
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
      // DEBUG: Cek apa yang benar-benar dikirim
      console.log("modalAction:", modalAction);
      console.log("selectedBooking ID:", id);
      // Tentukan status berdasarkan modalAction
      const statusValue = modalAction === "confirm" ? "CONFIRMED" : "CANCELLED";
      // VALIDASI: Pastikan tidak ada typo "CONTENING"
      if (!["CONFIRMED", "CANCELLED", "PENDING"].includes(statusValue.toUpperCase())) {
        setErrorMsg(`Invalid status value: ${statusValue}`);
        return;
      }

      console.log("Sending status:", statusValue); // Debug
      // Gunakan REST API
      const res = await fetch(`http://localhost:8001/booking/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: statusValue }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to update status");
      }

      const updatedBooking = await res.json();

      // Update local state
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: updatedBooking.status } : b)));
    } catch (err) {
      setErrorMsg(err.message || "Network error while updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    // Prevent body scroll when modal is open
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
  };

  const handleConfirmAction = async () => {
    if (!selectedBooking) return;
    await updateStatus(selectedBooking.id);
    closeModal();
  };

  const stats = useMemo(() => {
    const total = bookings.length;
    const normalizeStatus = (status) => {
      if (!status) return "";
      return status.toUpperCase();
    };
    const pending = bookings.filter((b) => normalizeStatus(b.status) === "PENDING").length;
    const confirmed = bookings.filter((b) => normalizeStatus(b.status) === "CONFIRMED").length;
    const cancelled = bookings.filter((b) => normalizeStatus(b.status) === "CANCELLED").length;
    return { total, pending, confirmed, cancelled };
  }, [bookings]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>All Bookings - Admin Dashboard</title>
        <meta name="description" content="View all bookings in the system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header/Navbar */}
      <nav className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white p-4 flex justify-between items-center shadow-lg">
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
              <span className="font-semibold">S</span>
            </div>
            <span className="font-medium">SuperAdmin</span>
          </div>
          <button
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full flex items-center space-x-2 transition duration-200"
            onClick={() => {
              localStorage.removeItem("token"); // hapus token
              localStorage.removeItem("userRole"); // kalau ada role disimpan
              localStorage.removeItem("username"); // kalau ada username disimpan
              router.push("/auth/login"); // redirect ke login
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
            <p className="text-gray-600 mt-2">View and manage all bookings in the system</p>
          </div>
          <Link href="/admin/dashboard-admin">
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200">← Back to Dashboard</button>
          </Link>
        </div>

        {/* Error / Loading */}
        {errorMsg && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50/90 backdrop-blur-sm px-5 py-4 text-red-700 shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Error: {errorMsg}</span>
            </div>
            <div className="mt-2 text-sm">
              <p className="text-red-600">Tips: Periksa konfigurasi GraphQL server atau hubungi developer backend.</p>
            </div>
          </div>
        )}
        {loading && <div className="mb-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-700">Loading bookings…</div>}

        {/* Stats Cards (dinamis) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-3">Live</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pending}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-3">Need attention</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Confirmed</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.confirmed}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <p className="text-green-500 text-sm mt-3">Ready for service</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Cancelled</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.cancelled}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-3">Cancelled bookings</p>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">All Bookings</h2>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">+ New Booking</button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">Filter</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">#00{b.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{b.namaLengkap}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{b.jenisLayanan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {b.tanggalPemeriksaan} {b.jamPemeriksaan}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(b.status)}`}>{b.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4 disabled:opacity-50" disabled={updatingId === b.id || b.status === "Confirmed" || b.status === "Cancelled"} onClick={() => openConfirmModal(b)}>
                        {b.status === "Confirmed" || b.status === "CONFIRMED" ? "Confirmed" : "Confirm"}
                      </button>
                      <button className="text-red-600 hover:text-red-900 disabled:opacity-50" disabled={updatingId === b.id || b.status === "Cancelled" || b.status === "CANCELLED"} onClick={() => openCancelModal(b)}>
                        {b.status === "Cancelled" || b.status === "CANCELLED" ? "Cancelled" : "Cancel"}
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && bookings.length === 0 && (
                  <tr>
                    <td className="px-6 py-10 text-center text-gray-500" colSpan={6}>
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination (placeholder) */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{bookings.length ? 1 : 0}</span> to <span className="font-medium">{bookings.length}</span> of <span className="font-medium">{bookings.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">Previous</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">Next</button>
            </div>
          </div>
          {/* Modal untuk Confirm & Cancel */}
        </div>

        {/* Recent Activity (static example as before) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Activity</h3>
            <div className="space-y-4">
              {/* Keep your static activity items or wire up later */}
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">New booking created</p>
                  <p className="text-sm text-gray-500">Activity stream placeholder</p>
                  <p className="text-xs text-gray-400 mt-1">Just now</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                <span className="text-sm font-medium text-gray-700">Create New Booking</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                <span className="text-sm font-medium text-gray-700">Export to Excel</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </button>
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                <span className="text-sm font-medium text-gray-700">Send Bulk Reminders</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  ></path>
                </svg>
              </button>
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                <span className="text-sm font-medium text-gray-700">View Calendar</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
      {/* Modal untuk Confirm & Cancel */}
      {(showConfirmModal || showCancelModal) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gradient-to-br from-slate-900/10 to-gray-800/15 backdrop-blur-sm" onClick={closeModal}></div>

          <div className="relative bg-gradient-to-br from-white via-white/97 to-white/95 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto border border-white/40">
            <div className="px-7 py-5 border-b border-gray-200/50">
              <div className="flex items-center">
                <div className={`p-3 rounded-xl mr-4 ${modalAction === "confirm" ? "bg-gradient-to-r from-green-400/15 to-emerald-400/15" : "bg-gradient-to-r from-red-400/15 to-pink-400/15"}`}>
                  {modalAction === "confirm" ? (
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{modalAction === "confirm" ? "Confirm Booking" : "Cancel Booking"}</h3>
                  <p className="text-sm text-gray-600 mt-1">{modalAction === "confirm" ? "Confirm this booking appointment" : "Cancel this booking appointment"}</p>
                </div>
              </div>
            </div>

            <div className="px-7 py-6">
              {selectedBooking && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3 text-base">Booking Details:</h4>
                  <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 p-4 rounded-xl border border-gray-200/50 backdrop-blur-sm">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="text-gray-700 w-1/3 text-sm">ID:</div>
                        <div className="font-semibold text-gray-900">#{selectedBooking.id}</div>
                      </div>

                      <div className="flex items-center">
                        <div className="text-gray-700 w-1/3 text-sm">Patient:</div>
                        <div className="font-semibold text-gray-900">{selectedBooking.namaLengkap}</div>
                      </div>

                      <div className="flex items-center">
                        <div className="text-gray-700 w-1/3 text-sm">Service:</div>
                        <div className="font-semibold text-gray-900">{selectedBooking.jenisLayanan}</div>
                      </div>

                      <div className="flex items-center">
                        <div className="text-gray-700 w-1/3 text-sm">Date & Time:</div>
                        <div className="font-semibold text-gray-900">
                          {selectedBooking.tanggalPemeriksaan} {selectedBooking.jamPemeriksaan}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="text-gray-700 w-1/3 text-sm">Status:</div>
                        <div className="font-semibold">
                          <span className={`px-2.5 py-1 text-xs rounded-full ${getStatusColor(selectedBooking.status)}`}>{formatStatusForDisplay(selectedBooking.status)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="bg-blue-50/60 border border-blue-200/50 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {modalAction === "confirm" ? "Are you sure you want to confirm this booking? The patient will be notified about the confirmation." : "Are you sure you want to cancel this booking? This action cannot be undone."}
                  </p>
                </div>
              </div>

              {modalAction === "cancel" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for cancellation (optional)</label>
                  <textarea
                    rows="3"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition duration-200"
                    placeholder="Enter reason for cancellation..."
                  />
                </div>
              )}
            </div>

            <div className="px-7 py-5 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50 flex justify-end space-x-4">
              <button onClick={closeModal} className="px-5 py-2.5 text-sm font-medium border border-gray-300/60 rounded-lg text-gray-700 hover:bg-gray-100/80 transition duration-200">
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={updatingId === selectedBooking?.id}
                className={`px-5 py-2.5 text-sm font-medium rounded-lg text-white transition duration-200 ${
                  modalAction === "confirm" ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {updatingId === selectedBooking?.id ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
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
