"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [obatList, setObatList] = useState([]);

  // Fetch graphQL data booking
  useEffect(() => {
    fetch("http://localhost:8001/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
        {
          bookings {
            id
            namaLengkap
            jenisLayanan
            tanggalPemeriksaan
            jamPemeriksaan
            status
          }
        }
      `,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.data && result.data.bookings) {
          setBookings(result.data.bookings);
        } else {
          console.error("GraphQL error:", result.errors);
          setBookings([]); // fallback kosong
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setBookings([]); // fallback kosong
      });
  }, []);

  // Fetch graphQL data obat
  useEffect(() => {
    fetch("http://localhost:8003/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
        {
          obatList {
            id
            name
            stock
            description
          }
        }
      `,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.data && result.data.obatList) {
          setObatList(result.data.obatList);
        } else {
          console.error("GraphQL error:", result.errors);
          setObatList([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setObatList([]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Navbar */}
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
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full flex items-center space-x-2 transition duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
          <p className="text-gray-600 mt-1">Welcome back, SuperAdmin. Here`s what`s happening today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">156</p>
              </div>
              <div className="bg-teal-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-6.5a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121.5 8.5z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">+12% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Today`s Bookings</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">24</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">+3 from yesterday</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Patients</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">89</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">+8% from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">7</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-red-600 text-sm font-medium">Need attention</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Management Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">User Management</h2>
              <button className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Tambah User</span>
              </button>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm border-b border-gray-100">
                      <th className="pb-3 font-medium">Username</th>
                      <th className="pb-3 font-medium">Email</th>
                      <th className="pb-3 font-medium">Role</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-50 hover:bg-gray-50 transition duration-150">
                      <td className="py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-teal-600 font-medium">B</span>
                          </div>
                          <span className="font-medium">dr_budi</span>
                        </div>
                      </td>
                      <td className="py-4 text-gray-600">dr.budi@sentracare.local</td>
                      <td className="py-4">
                        <span className="bg-teal-100 text-teal-800 text-xs font-medium px-3 py-1 rounded-full">Dokter</span>
                      </td>
                      <td className="py-4">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">Active</span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-50 hover:bg-gray-50 transition duration-150">
                      <td className="py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-medium">A</span>
                          </div>
                          <span className="font-medium">nurse_ani</span>
                        </div>
                      </td>
                      <td className="py-4 text-gray-600">nurse.ani@sentracare.local</td>
                      <td className="py-4">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">Perawat</span>
                      </td>
                      <td className="py-4">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">Active</span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-50 hover:bg-gray-50 transition duration-150">
                      <td className="py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-purple-600 font-medium">R</span>
                          </div>
                          <span className="font-medium">admin_rizki</span>
                        </div>
                      </td>
                      <td className="py-4 text-gray-600">admin.rizki@sentracare.local</td>
                      <td className="py-4">
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">Admin</span>
                      </td>
                      <td className="py-4">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">Active</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 text-center">
                <button className="text-teal-600 hover:text-teal-800 font-medium text-sm">View all users →</button>
              </div>
            </div>
          </div>

          {/* Booking Management Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Booking Management</h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm border-b border-gray-100">
                      <th className="pb-3 font-medium">ID</th>
                      <th className="pb-3 font-medium">Pasien</th>
                      <th className="pb-3 font-medium">Tanggal</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition duration-150">
                        <td className="py-4 font-medium text-gray-800">#{b.id}</td>
                        <td className="py-4">
                          <div>
                            <p className="font-medium text-gray-800">{b.namaLengkap}</p>
                            <p className="text-gray-800 text-sm">{b.jenisLayanan}</p>
                          </div>
                        </td>
                        <td className="py-4">
                          <div>
                            <p className="font-medium text-gray-800">{b.tanggalPemeriksaan}</p>
                            <p className="text-gray-800 text-sm">{b.jamPemeriksaan}</p>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">{b.status}</span>
                        </td>
                        <td className="py-4">
                          <button className="text-teal-600 hover:text-teal-800 font-medium text-sm">Manage</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 text-center">
                <button className="text-teal-600 hover:text-teal-800 font-medium text-sm">View all bookings →</button>
              </div>
            </div>
          </div>

          {/* Patient Records Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Patient Records</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition duration-150">
                  <div className="bg-teal-100 p-3 rounded-lg mr-4">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">Lanang Wisana</h3>
                        <p className="text-gray-600 text-sm mt-1">Rekam Medis: Check-up 2025</p>
                        <p className="text-gray-500 text-xs mt-1">Updated: 2025-12-05</p>
                      </div>
                      <span className="bg-teal-100 text-teal-800 text-xs font-medium px-3 py-1 rounded-full">Active</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition duration-150">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">Sari Dewi</h3>
                        <p className="text-gray-600 text-sm mt-1">Rekam Medis: Pemeriksaan Rutin</p>
                        <p className="text-gray-500 text-xs mt-1">Updated: 2025-12-03</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">Follow-up</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button className="text-teal-600 hover:text-teal-800 font-medium text-sm">View all patient records →</button>
              </div>
            </div>
          </div>

          {/* Pharmacy Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Pharmacy Stock</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-lg mr-4">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Paracetamol</h3>
                      <p className="text-gray-600 text-sm mt-1">500mg Tablet</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">120</p>
                    <p className="text-green-600 text-sm font-medium">In Stock</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
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
                      <h3 className="font-bold text-gray-800">Amoxicillin</h3>
                      <p className="text-gray-600 text-sm mt-1">250mg Capsule</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">80</p>
                    <p className="text-amber-600 text-sm font-medium">Medium Stock</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                  <div className="flex items-center">
                    <div className="bg-red-100 p-3 rounded-lg mr-4">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Cetirizine</h3>
                      <p className="text-gray-600 text-sm mt-1">10mg Tablet</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">15</p>
                    <p className="text-red-600 text-sm font-medium">Low Stock</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button className="text-teal-600 hover:text-teal-800 font-medium text-sm">View all pharmacy items →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
