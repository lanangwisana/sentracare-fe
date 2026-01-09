"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PharmacyPage() {
  const router = useRouter();
  const [editId, setEditId] = useState(null);
  const [obatList, setObatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("inventory");
  const [role, setRole] = useState(null);
  const [newObat, setNewObat] = useState({
    name: "",
    sku: "",
    stock: "",
    price: "",
    description: "",
    category: "",
  });
  const API_BASE = "http://localhost:8088";
  // Ambil role dari localStorage setelah client render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("userRole");
      setRole(storedRole);
    }
  }, []);

  // Helper ambil token
  const getAuthHeaders = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      return token ? { Authorization: `Bearer ${token}` } : {};
    }
    return {};
  };

  const fetchObat = async () => {
    try {
      // http://localhost:8003/graphql
      // ${API_BASE}/pharmacy/graphql
      const response = await fetch(`${API_BASE}/pharmacy/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          query: `
          query {
            obat_list {
              id
              name
              sku
              stock
              price
              description
              category
            }
          }
        `,
        }),
      });

      const result = await response.json();
      if (result.errors) {
        console.error(result.errors);
        alert("Gagal ambil data: " + result.errors[0].message);
      } else {
        setObatList(result.data.obat_list || []);
      }
    } catch (err) {
      console.error(err);
      alert("Error koneksi ke GraphQL");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchObat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle add new obat
  const handleAddObat = async (e) => {
    e.preventDefault();
    const payload = {
      ...newObat,
      stock: parseInt(newObat.stock) || 0,
      price: parseFloat(newObat.price) || 0,
    };

    try {
      // Tentukan URL dan Method berdasarkan mode (Add atau Edit)
      // http://localhost:8003/pharmacy/obat/${editId}
      // ${API_BASE}/pharmacy/obat/${editId}
      // http://localhost:8003/pharmacy/obat
      // ${API_BASE}/pharmacy/obat
      const url = editId ? `${API_BASE}/pharmacy/obat/${editId}` : `${API_BASE}/pharmacy/obat`;
      const method = editId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(editId ? "✅ Obat berhasil diperbarui!" : "✅ Obat berhasil ditambahkan!");
        // Reset form dan state
        setNewObat({ name: "", sku: "", stock: "", price: "", description: "", category: "" });
        setEditId(null);
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

  // Handle update stock
  const handleUpdateStock = async (id, newStock) => {
    try {
      // http://localhost:8003/pharmacy/obat/${id}/stock
      // ${API_BASE}/pharmacy/obat/${id}/stock
      const response = await fetch(`${API_BASE}/pharmacy/obat/${id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ stock: newStock }),
      });

      if (response.ok) {
        alert("✅ Stok berhasil diperbarui!");
        fetchObat();
      } else {
        const err = await response.json();
        alert("❌ Gagal: " + err.detail);
      }
    } catch (error) {
      alert("⚠️ Error connecting to server");
    }
  };

  // Handle delete obat
  const handleDeleteObat = async (id) => {
    try {
      // http://localhost:8003/pharmacy/obat/${id}
      // ${API_BASE}/pharmacy/obat/${id}
      const response = await fetch(`${API_BASE}/pharmacy/obat/${id}`, {
        method: "DELETE",
        headers: { ...getAuthHeaders() },
      });
      if (response.ok) {
        alert("🗑️ Obat dihapus");
        fetchObat();
      } else {
        const err = await response.json();
        alert("❌ Gagal: " + err.detail);
      }
    } catch (error) {
      alert("⚠️ Error connecting to server");
    }
  };

  // Hitung statistik
  const totalItems = obatList.length;
  const lowStock = obatList.filter((item) => item.stock <= 5).length;
  const avgStock = obatList.length > 0 ? Math.round(obatList.reduce((sum, item) => sum + item.stock, 0) / obatList.length) : 0;
  const totalValue = obatList.reduce((sum, item) => sum + item.stock * item.price, 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-slate-100 font-sans">
      {/* Header/Navbar - Full width */}
      <nav className="bg-linear-to-r from-teal-600 to-emerald-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
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
                  localStorage.removeItem("token");
                  localStorage.removeItem("userRole");
                  localStorage.removeItem("username");
                  router.push("/auth/login");
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-linear-to-r from-teal-600 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">💊</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Pharmacy Management</h1>
                <p className="text-gray-600 mt-2">Manage medication inventory</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Link href="/admin/dashboard-admin">
              <button className="px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center space-x-2 shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </button>
            </Link>
            <button onClick={fetchObat} className="px-4 py-2.5 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center space-x-2 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* STATISTICS CARDS - DIPINDAHKAN KE ATAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Items Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Items</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{totalItems}</p>
              </div>
              <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
                <span className="text-teal-600 text-2xl">📦</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">Total medications in inventory</p>
            </div>
          </div>

          {/* Low Stock Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Low Stock</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{lowStock}</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-2xl">⚠️</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">Items with stock ≤ 5 units</p>
            </div>
          </div>

          {/* Average Stock Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Avg Stock</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{avgStock}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-2xl">📊</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">Average stock per item</p>
            </div>
          </div>

          {/* Total Value Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Value</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">Rp {totalValue.toLocaleString("id-ID")}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                <span className="text-emerald-600 text-2xl">💰</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">Total inventory value</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-8 max-w-2xl mx-auto">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("inventory")}
              className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all flex items-center justify-center space-x-2 ${
                activeTab === "inventory" ? "bg-linear-to-r from-teal-600 to-emerald-600 text-white shadow" : "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
              }`}
            >
              <span>📦</span>
              <span>Inventory</span>
            </button>
            <button
              onClick={() => setActiveTab("tambah")}
              className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all flex items-center justify-center space-x-2 ${
                activeTab === "tambah" ? "bg-linear-to-r from-teal-600 to-emerald-600 text-white shadow" : "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
              }`}
            >
              <span>➕</span>
              <span>Add Medication</span>
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all flex items-center justify-center space-x-2 ${
                activeTab === "reports" ? "bg-linear-to-r from-teal-600 to-emerald-600 text-white shadow" : "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
              }`}
            >
              <span>📊</span>
              <span>Reports</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inventory Panel - Lebar penuh */}
          <div className={`${activeTab === "inventory" ? "lg:col-span-3" : "lg:col-span-2"}`}>
            <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 ${activeTab === "inventory" ? "ring-2 ring-teal-500 ring-opacity-30" : ""}`}>
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-linear-to-r from-white to-gray-50/50">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Medication Inventory</h2>
                  <p className="text-sm text-gray-500">Total {obatList.length} items • Updated in real-time</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 bg-teal-50 text-teal-700 text-sm font-medium rounded-full">{obatList.length} Items</div>
                  <button onClick={() => setActiveTab("tambah")} className="px-4 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition flex items-center gap-2">
                    <span>➕</span>
                    <span>Add New</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-10 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
                          </div>
                          <p className="mt-3 text-gray-500">Loading medication data...</p>
                        </td>
                      </tr>
                    ) : obatList.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5">
                              <span className="text-3xl">📦</span>
                            </div>
                            <h3 className="text-xl font-medium text-gray-700 mb-2">No medications found</h3>
                            <p className="text-gray-500 mb-6 max-w-md">Your medication inventory is empty. Add your first medication to get started.</p>
                            <button
                              onClick={() => setActiveTab("tambah")}
                              className="px-5 py-2.5 bg-linear-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 font-medium shadow-md hover:shadow-lg transition"
                            >
                              + Add First Medication
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      obatList.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.description || "No description"}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-block bg-gray-100 text-gray-800 text-xs font-mono px-3 py-1.5 rounded">{item.sku}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{item.category || "General"}</span>
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">Rp {item.price ? item.price.toLocaleString("id-ID") : "0"}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 text-sm font-medium rounded-full ${item.stock > 20 ? "bg-green-100 text-green-800" : item.stock > 5 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                                {item.stock}
                              </span>
                              <button
                                onClick={() => {
                                  const newStock = prompt(`Update stock for ${item.name}:`, item.stock);
                                  if (newStock !== null && !isNaN(newStock)) {
                                    handleUpdateStock(item.id, parseInt(newStock));
                                  }
                                }}
                                className="text-xs text-teal-600 hover:text-teal-800 font-medium px-2 py-1 hover:bg-teal-50 rounded"
                              >
                                Update
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs font-medium rounded ${item.stock > 5 ? "bg-teal-100 text-teal-800" : "bg-red-100 text-red-800"}`}>{item.stock > 5 ? "In Stock" : "Low Stock"}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-3">
                              <button
                                className="text-teal-600 hover:text-teal-800 text-sm font-medium hover:bg-teal-50 px-3 py-1.5 rounded transition"
                                onClick={() => {
                                  setActiveTab("tambah");
                                  setEditId(item.id); // <--- Simpan ID yang akan diedit
                                  setNewObat({
                                    name: item.name,
                                    sku: item.sku,
                                    stock: item.stock.toString(),
                                    price: item.price.toString(),
                                    description: item.description || "",
                                    category: item.category || "",
                                  });
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800 text-sm font-medium hover:bg-red-50 px-3 py-1.5 rounded transition"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
                                    handleDeleteObat(item.id);
                                  }
                                }}
                              >
                                Delete
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

          {/* Sidebar - Hanya untuk tambah obat dan reports */}
          {activeTab !== "inventory" && (
            <div className="lg:col-span-1 space-y-6">
              {/* Add Medicine Form */}
              {activeTab === "tambah" && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 ring-2 ring-teal-500 ring-opacity-30">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <span className="text-teal-600 text-xl">➕</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">Add New Medication</h2>
                      <p className="text-sm text-gray-500">Fill in the details below</p>
                    </div>
                  </div>

                  <form onSubmit={handleAddObat} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Medication Name *</label>
                      <input
                        type="text"
                        placeholder="Paracetamol 500mg"
                        className="w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition text-gray-900 bg-white"
                        value={newObat.name}
                        onChange={(e) => setNewObat({ ...newObat, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        placeholder="Pain reliever and fever reducer"
                        className="w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition text-gray-900 bg-white"
                        value={newObat.description}
                        onChange={(e) => setNewObat({ ...newObat, description: e.target.value })}
                        rows="2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">SKU Code *</label>
                        <input
                          type="text"
                          placeholder="PARA-500"
                          className="w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition text-gray-900 bg-white"
                          value={newObat.sku}
                          onChange={(e) => setNewObat({ ...newObat, sku: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Initial Stock *</label>
                        <input
                          type="number"
                          placeholder="100"
                          min="0"
                          className="w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition text-gray-900 bg-white"
                          value={newObat.stock}
                          onChange={(e) => setNewObat({ ...newObat, stock: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rp) *</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-3.5 text-gray-500">Rp</span>
                        <input
                          type="number"
                          placeholder="15000"
                          min="0"
                          step="100"
                          className="w-full p-3.5 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition text-gray-900 bg-white"
                          value={newObat.price}
                          onChange={(e) => setNewObat({ ...newObat, price: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        className="w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-900 transition"
                        onChange={(e) => setNewObat({ ...newObat, category: e.target.value })}
                        value={newObat.category || ""}
                      >
                        <option value="">Select category...</option>
                        <option value="Analgesik">Analgesic</option>
                        <option value="Antibiotik">Antibiotic</option>
                        <option value="Vitamin">Vitamin</option>
                        <option value="Antihipertensi">Antihypertensive</option>
                        <option value="Lainnya">Other</option>
                      </select>
                    </div>

                    <div className="pt-5 border-t border-gray-100">
                      <button
                        type="submit"
                        className="w-full bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium py-3.5 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                      >
                        Save Medication
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNewObat({
                            name: "",
                            sku: "",
                            stock: "",
                            price: "",
                            description: "",
                            category: "",
                          });
                        }}
                        className="w-full mt-3 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition"
                      >
                        Reset Form
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Reports Panel */}
              {activeTab === "reports" && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 ring-2 ring-teal-500 ring-opacity-30">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <span className="text-teal-600 text-xl">📊</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">Quick Reports</h2>
                      <p className="text-sm text-gray-500">Inventory insights</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-linear-to-r from-teal-50 to-emerald-50 rounded-lg border border-teal-100">
                      <h3 className="font-medium text-teal-800 mb-2">Stock Summary</h3>
                      <p className="text-sm text-teal-600">{lowStock} items need restocking</p>
                    </div>

                    <div className="p-4 bg-linear-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                      <h3 className="font-medium text-blue-800 mb-2">Value Analysis</h3>
                      <p className="text-sm text-blue-600">Total inventory value: Rp {totalValue.toLocaleString("id-ID")}</p>
                    </div>

                    <div className="p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                      <h3 className="font-medium text-green-800 mb-2">Category Distribution</h3>
                      <p className="text-sm text-green-600">{new Set(obatList.map((item) => item.category)).size} different categories</p>
                    </div>

                    <button className="w-full mt-4 border-2 border-teal-300 text-teal-700 font-medium py-3 px-4 rounded-lg hover:bg-teal-50 transition flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Export Report (PDF)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
