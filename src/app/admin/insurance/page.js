"use client";

import { useState, useEffect } from "react";

export default function InsurancePage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("history");

  // State Form
  const [formData, setFormData] = useState({
    patient_name: "",
    bpjs_number: "",
    diagnosis_code: "",
    treatment_description: "",
    total_bill: 0,
  });

  // URL Backend Insurance
  const API_URL = "http://localhost:8005";

  // 1. Fetch Data Klaim
  const fetchClaims = async () => {
    try {
      const response = await fetch(`${API_URL}/insurance/claims`);
      if (response.ok) {
        const data = await response.json();
        setClaims(data);
      }
    } catch (error) {
      console.error("Gagal koneksi ke server insurance:", error);
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
    try {
      const response = await fetch(`${API_URL}/insurance/claims`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();

        if (result.status === "APPROVED") {
          alert(`✅ BERHASIL: Klaim Disetujui!\nID: ${result.id}\nPasien: ${result.patient_name}`);
        } else if (result.status === "REJECTED") {
          alert(`❌ DITOLAK: ${result.response_message}`);
        } else {
          alert(`⏳ PENDING: ${result.response_message}`);
        }

        setFormData({
          patient_name: "",
          bpjs_number: "",
          diagnosis_code: "",
          treatment_description: "",
          total_bill: 0,
        });
        fetchClaims();
        setActiveTab("history");
      } else {
        alert("Gagal mengirim data ke server.");
      }
    } catch (error) {
      alert("Error: Backend tidak merespon (Pastikan Docker port 8001 jalan).");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      patient_name: "",
      bpjs_number: "",
      diagnosis_code: "",
      treatment_description: "",
      total_bill: 0,
    });
  };

  // Stats calculations
  const stats = {
    total: claims.length,
    approved: claims.filter((c) => c.status === "APPROVED").length,
    rejected: claims.filter((c) => c.status === "REJECTED").length,
    pending: claims.filter((c) => c.status === "PENDING").length,
    totalBill: claims.reduce((sum, claim) => sum + claim.total_bill, 0),
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-purple-50 p-4 md:p-6 lg:p-8 font-sans">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-linear-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg shadow-purple-200">
              <span className="text-3xl text-white">🛡️</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-linear-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">Insurance Bridge System</h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">Simulasi Bridging V-Claim BPJS & Asuransi Swasta (HL7 Standard)</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200 w-fit">
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === "history" ? "bg-linear-to-r from-purple-500 to-indigo-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
            >
              📋 Riwayat
            </button>
            <button
              onClick={() => setActiveTab("submit")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === "submit" ? "bg-linear-to-r from-pink-500 to-rose-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
            >
              📝 Ajukan Klaim
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Klaim</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-purple-600 text-xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Disetujui</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Ditolak</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-red-600 text-xl">❌</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-yellow-600 text-xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Nilai</p>
                <p className="text-2xl font-bold text-indigo-700">Rp {stats.totalBill.toLocaleString("id-ID")}</p>
              </div>
              <div className="p-2 bg-indigo-100 rounded-lg">
                <span className="text-indigo-600 text-xl">💰</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- KIRI: Form Input Klaim --- */}
        <div className="lg:col-span-1">
          <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 transition-all duration-300 ${activeTab === "submit" ? "ring-2 ring-pink-500" : ""}`}>
            <div className="bg-linear-to-r from-pink-500 to-rose-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">Form Pengajuan Klaim</h2>
                </div>
                <button onClick={resetForm} className="text-white/90 hover:text-white text-sm bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-colors">
                  🔄 Reset
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-pink-600">👤</span>
                  Nama Pasien
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Masukkan nama lengkap pasien"
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
                  <span className="text-pink-600">🆔</span>
                  Nomor BPJS / Polis
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Contoh: 0001234567890"
                  value={formData.bpjs_number}
                  onChange={(e) => setFormData({ ...formData, bpjs_number: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-pink-600">🏥</span>
                    Kode Diagnosa
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                      placeholder="CTH: A01, Z99"
                      value={formData.diagnosis_code}
                      onChange={(e) => setFormData({ ...formData, diagnosis_code: e.target.value })}
                    />
                    <div className="absolute right-3 top-3.5 flex items-center gap-1">
                      <span className="text-xs text-gray-400">Z99 = tolak</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-pink-600">💰</span>
                    Total Tagihan
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                    <input
                      type="number"
                      required
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                      placeholder="0"
                      value={formData.total_bill}
                      onChange={(e) => setFormData({ ...formData, total_bill: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-pink-600">📋</span>
                  Deskripsi Tindakan Medis
                </label>
                <textarea
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400 h-32 resize-none"
                  placeholder="Jelaskan tindakan medis yang dilakukan, diagnosis, dan rencana pengobatan..."
                  value={formData.treatment_description}
                  onChange={(e) => setFormData({ ...formData, treatment_description: e.target.value })}
                ></textarea>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Status Simulasi:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded ${formData.diagnosis_code === "Z99" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {formData.diagnosis_code === "Z99" ? "🚫 Akan Ditolak" : "✅ Akan Disetujui"}
                      </span>
                      <span className="text-xs text-gray-400">(Kode Z99 = tolakan)</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-pink-500 to-rose-500 text-white font-semibold py-3.5 rounded-xl hover:shadow-lg hover:shadow-pink-200 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>🚀</span>
                  Kirim Data ke BPJS / Asuransi
                </button>
              </div>
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-linear-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-purple-600">ℹ️</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">HL7 Integration Info</p>
                <p className="text-xs text-gray-600 mt-1">Sistem ini mensimulasikan komunikasi HL7 standard dengan gateway BPJS dan asuransi swasta. Data dikirim dalam format V-Claim 2.0 dengan enkripsi end-to-end.</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- KANAN: Riwayat Klaim --- */}
        <div className="lg:col-span-2">
          <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 transition-all duration-300 ${activeTab === "history" ? "ring-2 ring-purple-500" : ""}`}>
            <div className="bg-linear-to-r from-purple-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Riwayat Pengajuan Klaim</h2>
                    <p className="text-white/80 text-sm">Data sinkronisasi real-time dengan Insurance Gateway</p>
                  </div>
                </div>
                <div className="text-white/90 text-sm bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/30">HL7 v2.5</div>
              </div>
            </div>

            <div className="p-5">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
                  <p className="text-gray-600 font-medium">Menghubungkan ke Insurance Gateway...</p>
                  <p className="text-gray-400 text-sm mt-1">Mengambil data klaim terbaru</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center gap-2">
                            <span>👤</span>
                            Pasien & Polis
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center gap-2">
                            <span>🏥</span>
                            Diagnosa & Keterangan
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center gap-2">
                            <span>💰</span>
                            Tagihan
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
                              <p className="text-gray-600 font-medium text-lg">Belum ada data klaim</p>
                              <p className="text-gray-400 mt-1">Ajukan klaim pertama Anda dengan mengklik Ajukan Klaim</p>
                              <button onClick={() => setActiveTab("submit")} className="mt-4 px-4 py-2 bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow">
                                📝 Ajukan Klaim Baru
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        claims.map((claim) => (
                          <tr key={claim.id} className="hover:bg-linear-to-r hover:from-purple-50/30 hover:to-indigo-50/30 transition-colors group">
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
                                <p className="text-sm text-gray-600 line-clamp-2">{claim.response_message || "Tidak ada keterangan tambahan"}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-transparent bg-linear-to-r from-indigo-700 to-purple-700 bg-clip-text text-lg">Rp {claim.total_bill.toLocaleString("id-ID")}</span>
                                </div>
                                <p className="text-xs text-gray-500">Tanggal: {new Date(claim.created_at || Date.now()).toLocaleDateString("id-ID")}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-2">
                                <div className="flex flex-col gap-1">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                                      claim.status === "APPROVED"
                                        ? "bg-linear-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                                        : claim.status === "REJECTED"
                                        ? "bg-linear-to-r from-red-100 to-rose-100 text-red-700 border border-red-200"
                                        : "bg-linear-to-r from-yellow-100 to-amber-100 text-yellow-700 border border-yellow-200"
                                    }`}
                                  >
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
                      <span className="font-medium">Total Data:</span> {claims.length} klaim •<span className="ml-2 font-medium">Nilai Total:</span> Rp {stats.totalBill.toLocaleString("id-ID")}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-600">Disetujui: {stats.approved}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-xs text-gray-600">Ditolak: {stats.rejected}</span>
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

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-linear-to-r from-purple-100 to-indigo-100 rounded-lg">
              <span className="text-purple-600">🛡️</span>
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
