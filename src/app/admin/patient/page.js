"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

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
  const [activeTab, setActiveTab] = useState("records"); // Untuk navigasi tab

  // --- 1. FUNGSI LOAD DATA (Sinkron ke Port 8004) ---
  const fetchAllPatients = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // Token SuperAdmin

      if (!token) {
        router.push("/auth/login");
        return;
      }

      const res = await fetch("http://localhost:8004/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setPatients(data);
        setFilteredPatients(data);
      } else {
        console.error("Gagal mengambil data dari server");
      }
    } catch (err) {
      console.error("Load Error:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // --- 2. FUNGSI SINKRONISASI MANUAL (Fallback) ---
  const handleSyncData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8004/patients/sync-from-booking", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      alert(result.message || "Sinkronisasi Berhasil");
      fetchAllPatients(); // Refresh data
    } catch (err) {
      alert("Gagal sinkronisasi data");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. LOGIKA FILTERING ---
  useEffect(() => {
    let filtered = patients;
    if (searchTerm) {
      filtered = filtered.filter((p) => p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || p.email.toLowerCase().includes(searchTerm.toLowerCase()));
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
      // Cek apakah ada record di bulan ini
      if (!p.records || p.records.length === 0) return false;
      const lastVisit = new Date(p.records[0].visit_date);
      const now = new Date();
      return now.getMonth() === lastVisit.getMonth() && now.getFullYear() === lastVisit.getFullYear();
    }).length,
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-teal-50 p-4 md:p-6 lg:p-8 font-sans">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Monitoring EMR Pasien</h1>
            <p className="text-gray-500">Administrator: {adminName}</p>
          </div>

          <div className="flex gap-3">
            <button onClick={handleSyncData} className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 flex items-center gap-2 transition shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Sinkronisasi Manual
            </button>

            <button onClick={() => router.push("/admin/dashboard-admin")} className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition duration-200 flex items-center space-x-2 shadow-md">
              <span>Dashboard Utama</span>
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
                  placeholder="Cari pasien berdasarkan nama atau email..."
                  className="w-full px-4 py-3 pl-12 text-gray-800 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-3.5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <select
                className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none appearance-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="Active">Aktif</option>
                <option value="Follow-up">Follow-up</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Total Pasien EMR</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">EMR Selesai</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Perlu Atensi</p>
            <p className="text-2xl font-bold text-amber-600">{stats.followUp}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Update Bulan Ini</p>
            <p className="text-2xl font-bold text-blue-600">{stats.newThisMonth}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- KIRI: Patients List (Global Monitoring) --- */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-bold">
                <tr>
                  <th className="p-4">Pasien & Layanan</th>
                  <th className="p-4">Dokter Penanggung Jawab</th>
                  <th className="p-4">Status Rekam Medis</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-gray-400">
                      Memuat data...
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedPatient(p)}>
                      <td className="p-4">
                        <p className="font-bold text-gray-800">{p.full_name}</p>
                        <p className="text-[10px] bg-blue-50 text-blue-600 w-fit px-2 py-0.5 rounded mt-1 font-bold">{p.tipe_layanan}</p>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-700">{p.doctor_full_name || "Belum Assign"}</span>
                          <span className="text-[10px] italic">{p.doctor_email || "-"}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {p.records && p.records.length > 0 ? (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">✅ Sudah Diisi</span>
                        ) : (
                          <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold border border-amber-200">⏳ Menunggu Dokter</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button className="text-teal-600 hover:text-teal-800 font-bold text-xs uppercase tracking-tighter">Pantau Detail</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- KANAN: MONITORING VIEW --- */}
        <div className="space-y-6">
          {selectedPatient ? (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-linear-to-r from-teal-600 to-emerald-600 p-6 text-white">
                <h2 className="text-xl font-bold">Hasil Rekam Medis</h2>
                <p className="text-xs opacity-80 mt-1">
                  ID Pasien: {selectedPatient.id} | Booking: #{selectedPatient.booking_id}
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Identitas Ringkas */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-[10px] font-bold uppercase">Nama</p>
                    <p className="font-bold">{selectedPatient.full_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] font-bold uppercase">Kontak</p>
                    <p className="font-bold">{selectedPatient.phone_number}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-teal-500"></div> Riwayat Terakhir
                  </h3>

                  {selectedPatient.records && selectedPatient.records.length > 0 ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-xl border">
                        <p className="text-[10px] text-gray-400 font-bold mb-1">DIAGNOSA DOKTER ({selectedPatient.records[0].visit_date})</p>
                        <p className="text-sm text-gray-700">{selectedPatient.records[0].diagnosis}</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p className="text-[10px] text-blue-400 font-bold mb-1">RESEP OBAT / TINDAKAN</p>
                        <p className="text-sm text-blue-800">{selectedPatient.records[0].prescription || selectedPatient.records[0].treatment}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 p-6 text-center rounded-xl border border-red-100">
                      <p className="text-red-500 text-sm italic font-medium">Dokter penanggung jawab belum menginput data medis untuk antrean ini.</p>
                    </div>
                  )}
                </div>

                <button onClick={() => setSelectedPatient(null)} className="w-full py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition">
                  Tutup Detail
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-gray-800 font-bold">Pilih Pasien</h3>
              <p className="text-gray-400 text-xs mt-1">Pilih dari daftar di kiri untuk memantau detail pemeriksaan dokter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
