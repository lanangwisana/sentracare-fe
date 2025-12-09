"use client";

import { useState, useEffect } from "react";

export default function PharmacyPage() {
  const [obatList, setObatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("inventory");

  // Form Tambah Obat
  const [newObat, setNewObat] = useState({
    name: "",
    sku: "",
    stock: 0,
    price: 0,
    description: "", // Field description ditambahkan
  });

  // Form Resep
  const [prescription, setPrescription] = useState({
    patient_id: 1,
    doctor_name: "Dr. Lanang",
    obat_id: "",
    quantity: 1,
    notes: "Diminum 3x sehari",
  });

  const API_URL = "http://localhost:8000";

  // 1. Fetch Data
  const fetchObat = async () => {
    try {
      const response = await fetch(`${API_URL}/pharmacy/obat`);
      if (response.ok) {
        const data = await response.json();
        setObatList(data);
      }
    } catch (error) {
      console.error("Gagal ambil data obat:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObat();
  }, []);

  // 2. Handle Tambah Obat
  const handleAddObat = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/pharmacy/obat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newObat),
      });

      if (response.ok) {
        alert("✅ Obat berhasil ditambahkan!");
        setNewObat({ name: "", sku: "", stock: 0, price: 0, description: "" }); // Reset description juga
        fetchObat();
        setActiveTab("inventory");
      } else {
        const err = await response.json();
        alert("❌ Gagal: " + err.detail);
      }
    } catch (error) {
      alert("⚠️ Error connecting to server");
    }
  };

  // 3. Handle Buat Resep
  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    if (!prescription.obat_id) return alert("⚠️ Pilih obat terlebih dahulu!");

    const selectedObat = obatList.find((obat) => obat.id == prescription.obat_id);
    if (selectedObat && prescription.quantity > selectedObat.stock) {
      return alert(`❌ Stok tidak mencukupi! Stok tersedia: ${selectedObat.stock}`);
    }

    try {
      const response = await fetch(`${API_URL}/pharmacy/prescriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prescription),
      });

      if (response.ok) {
        alert("✅ Resep berhasil dibuat & Stok berkurang!");
        fetchObat();
        setPrescription({
          ...prescription,
          obat_id: "",
          quantity: 1,
        });
      } else {
        const err = await response.json();
        alert("❌ Gagal: " + err.detail);
      }
    } catch (error) {
      alert("⚠️ Error connecting to server");
    }
  };

  // Reset form
  const resetForm = (formType) => {
    if (formType === "obat") {
      setNewObat({ name: "", sku: "", stock: 0, price: 0, description: "" }); // Reset description
    } else {
      setPrescription({
        patient_id: 1,
        doctor_name: "Dr. Lanang",
        obat_id: "",
        quantity: 1,
        notes: "Diminum 3x sehari",
      });
    }
  };

  // Stats calculations
  const stats = {
    total: obatList.length,
    lowStock: obatList.filter((obat) => obat.stock < 10).length,
    optimalStock: obatList.filter((obat) => obat.stock >= 10 && obat.stock <= 50).length,
    totalValue: obatList.reduce((sum, obat) => sum + obat.price * obat.stock, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6 lg:p-8 font-sans">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-lg shadow-blue-200">
              <span className="text-3xl text-white">💊</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">Apotek SentraCare</h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">Sistem Manajemen Stok & Resep Digital</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200 w-fit">
            <button
              onClick={() => setActiveTab("inventory")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === "inventory" ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
            >
              📦 Inventory
            </button>
            <button
              onClick={() => setActiveTab("tambah")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === "tambah" ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
            >
              ➕ Tambah Obat
            </button>
            <button
              onClick={() => setActiveTab("resep")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === "resep" ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
            >
              📝 Buat Resep
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Obat</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-xl">💊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Stok Rendah</p>
                <p className="text-2xl font-bold text-red-600">{stats.lowStock}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Stok Optimal</p>
                <p className="text-2xl font-bold text-green-600">{stats.optimalStock}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Nilai</p>
                <p className="text-2xl font-bold text-cyan-700">Rp {stats.totalValue.toLocaleString("id-ID")}</p>
              </div>
              <div className="p-2 bg-cyan-100 rounded-lg">
                <span className="text-cyan-600 text-xl">💰</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- KIRI: Inventory Card --- */}
        <div className="lg:col-span-2">
          <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 transition-all duration-300 ${activeTab === "inventory" ? "ring-2 ring-blue-500" : ""}`}>
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Daftar Obat</h2>
                    <p className="text-white/80 text-sm">Manajemen Stok Inventory</p>
                  </div>
                </div>
                <div className="text-white/90 text-sm bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/30">{obatList.length} Item</div>
              </div>
            </div>

            <div className="p-5">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                  <p className="text-gray-600 font-medium">Memuat data obat...</p>
                  <p className="text-gray-400 text-sm mt-1">Mohon tunggu sebentar</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center gap-2">
                            <span>💊</span>
                            Nama Obat & Deskripsi
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center gap-2">
                            <span>🏷️</span>
                            SKU
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center gap-2">
                            <span>💰</span>
                            Harga
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center gap-2">
                            <span>📊</span>
                            Stok
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {obatList.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-16 text-center">
                            <div className="flex flex-col items-center">
                              <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-4">
                                <span className="text-3xl text-gray-400">💊</span>
                              </div>
                              <p className="text-gray-600 font-medium text-lg">Belum ada data obat</p>
                              <p className="text-gray-400 mt-1">Tambahkan obat pertama Anda dengan mengklik `Tambah Obat`</p>
                              <button onClick={() => setActiveTab("tambah")} className="mt-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow">
                                ➕ Tambah Obat Baru
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        obatList.map((item) => (
                          <tr key={item.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${item.stock < 10 ? "bg-red-100" : item.stock < 20 ? "bg-yellow-100" : "bg-green-100"}`}>
                                  <span className={`text-lg ${item.stock < 10 ? "text-red-600" : item.stock < 20 ? "text-yellow-600" : "text-green-600"}`}>💊</span>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">{item.name}</p>
                                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                  <p className="text-xs text-gray-500 mt-2">ID: {item.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-block bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-300">{item.sku}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-transparent bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text text-lg">Rp {item.price.toLocaleString("id-ID")}</span>
                                <span className="text-xs text-gray-500">/unit</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                  <span className={`font-bold text-lg ${item.stock < 10 ? "text-red-600" : item.stock < 20 ? "text-yellow-600" : "text-green-600"}`}>{item.stock} unit</span>
                                  <span className="text-xs text-gray-500">{item.stock < 10 ? "⚠️ Rendah" : item.stock < 20 ? "⚠️ Menipis" : "✅ Aman"}</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      item.stock < 10 ? "bg-gradient-to-r from-red-500 to-red-400" : item.stock < 20 ? "bg-gradient-to-r from-yellow-500 to-yellow-400" : "bg-gradient-to-r from-green-500 to-emerald-400"
                                    }`}
                                    style={{ width: `${Math.min(100, (item.stock / 100) * 100)}%` }}
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
            </div>
          </div>
        </div>

        {/* --- KANAN: Form Section --- */}
        <div className="space-y-6">
          {/* Tambah Obat Form */}
          <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 transition-all duration-300 ${activeTab === "tambah" ? "ring-2 ring-emerald-500" : ""}`}>
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <span className="text-2xl">➕</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">Tambah Obat Baru</h2>
                </div>
                <button onClick={() => resetForm("obat")} className="text-white/90 hover:text-white text-sm bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-colors">
                  🔄 Reset
                </button>
              </div>
            </div>

            <form onSubmit={handleAddObat} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-emerald-600">💊</span>
                  Nama Obat
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Masukkan nama obat (cth: Paracetamol)"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                    value={newObat.name}
                    onChange={(e) => setNewObat({ ...newObat, name: e.target.value })}
                    required
                  />
                  {newObat.name && (
                    <button type="button" onClick={() => setNewObat({ ...newObat, name: "" })} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-emerald-600">📄</span>
                  Deskripsi / Dosis
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Contoh: 500 mg Tablet, 10 ml Syrup, 250 mg Kapsul"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                    value={newObat.description}
                    onChange={(e) => setNewObat({ ...newObat, description: e.target.value })}
                  />
                  {newObat.description && (
                    <button type="button" onClick={() => setNewObat({ ...newObat, description: "" })} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                      ✕
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Masukkan informasi dosis, bentuk sediaan, atau keterangan lain</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-emerald-600">🏷️</span>
                    Kode SKU
                  </label>
                  <input
                    type="text"
                    placeholder="CTH: PCT-500-TAB"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                    value={newObat.sku}
                    onChange={(e) => setNewObat({ ...newObat, sku: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-emerald-600">📦</span>
                    Stok Awal
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                    value={newObat.stock}
                    onChange={(e) => setNewObat({ ...newObat, stock: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-emerald-600">💰</span>
                  Harga (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                  <input
                    type="number"
                    placeholder="25000"
                    min="0"
                    step="100"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                    value={newObat.price}
                    onChange={(e) => setNewObat({ ...newObat, price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3.5 rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>💾</span>
                Simpan Obat Baru
              </button>
            </form>
          </div>

          {/* Buat Resep Form */}
          <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 transition-all duration-300 ${activeTab === "resep" ? "ring-2 ring-purple-500" : ""}`}>
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Buat Resep Obat</h2>
                    <p className="text-white/80 text-sm">Potong stok secara otomatis</p>
                  </div>
                </div>
                <button onClick={() => resetForm("resep")} className="text-white/90 hover:text-white text-sm bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-colors">
                  🔄 Reset
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-purple-600">⚡</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 font-medium">Integrasi EAI Real-time</p>
                    <p className="text-xs text-gray-600">Saat resep dibuat, stok obat otomatis berkurang secara instan</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleCreatePrescription} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-purple-600">💊</span>
                    Pilih Obat dari Inventori
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all bg-white text-gray-900 appearance-none"
                      value={prescription.obat_id}
                      onChange={(e) => setPrescription({ ...prescription, obat_id: e.target.value })}
                      required
                    >
                      <option value="" className="text-gray-400">
                        -- Klik untuk memilih obat --
                      </option>
                      {obatList.map((item) => (
                        <option key={item.id} value={item.id} className="py-2">
                          {item.name} • {item.description} • Stok: {item.stock} • Rp {item.price.toLocaleString("id-ID")}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <span className="text-gray-400">▼</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-purple-600">👨‍⚕️</span>
                      Nama Dokter
                    </label>
                    <input
                      type="text"
                      placeholder="Nama lengkap dokter"
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                      value={prescription.doctor_name}
                      onChange={(e) => setPrescription({ ...prescription, doctor_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-purple-600">🔢</span>
                      Jumlah
                    </label>
                    <input
                      type="number"
                      placeholder="1"
                      min="1"
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                      value={prescription.quantity}
                      onChange={(e) => setPrescription({ ...prescription, quantity: parseInt(e.target.value) || 1 })}
                      required
                    />
                  </div>
                </div>

                {prescription.obat_id && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">Detail Obat Terpilih</p>
                        <p className="text-xs text-gray-600">
                          {obatList.find((o) => o.id == prescription.obat_id)?.description || "Tidak ada deskripsi"} • 
                          Stok tersedia: {obatList.find((o) => o.id == prescription.obat_id)?.stock || 0} unit
                        </p>
                      </div>
                      <div className="text-lg font-bold text-blue-600">Total: Rp {((obatList.find((o) => o.id == prescription.obat_id)?.price || 0) * prescription.quantity).toLocaleString("id-ID")}</div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!prescription.obat_id}
                  className={`w-full text-white font-semibold py-3.5 rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 ${
                    prescription.obat_id ? "bg-gradient-to-r from-purple-500 to-indigo-500 hover:shadow-lg hover:shadow-purple-200" : "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                  }`}
                >
                  <span>📋</span>
                  Buat Resep & Kurangi Stok
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg">
              <span className="text-blue-600">🏥</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Apotek SentraCare Management</p>
              <p className="text-xs text-gray-500">Sistem terintegrasi untuk efisiensi farmasi</p>
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