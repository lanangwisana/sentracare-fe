"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [obatList, setObatList] = useState([]);
  const [patients, setPatients] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [showDoctorAuth, setShowDoctorAuth] = useState(false);
  const [docAuthData, setDocAuthData] = useState({ identifier: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState("");

  const handleDoctorLogin = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError("");
    try {
      const res = await fetch("http://localhost:8002/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docAuthData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login Gagal");

      const meRes = await fetch("http://localhost:8002/auth/me", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      const meData = await meRes.json();

      if (meData.role.toUpperCase() !== "DOKTER") {
        throw new Error("Akses Ditolak: Hanya Dokter yang dapat mengakses rekam medis.");
      }

      localStorage.setItem("activeDoctorName", meData.full_name);
      localStorage.setItem("doctorToken", data.access_token);
      setShowDoctorAuth(false);

      // Navigasi ke halaman patient setelah verifikasi berhasil
      router.push("/admin/patient");
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // fetch graphQL data users
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetch("http://localhost:8002/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
        {
          activeAdminsAndDoctors {
            id
            username
            email
            role
            status
          }
        }
        `,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.data && result.data.activeAdminsAndDoctors) {
          setUsers(result.data.activeAdminsAndDoctors);
        } else {
          console.error("GraphQL error:", result.errors);
          setUsers([]); // fallback kosong
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setUsers([]); // fallback kosong
      });
  }, [router]);

  // Fetch graphQL data bookings
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetch("http://127.0.0.1:8001/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
          setBookings([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setBookings([]);
      });
  }, [router]);

  // Fetch graphQL data obat
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetch("http://127.0.0.1:8003/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
        {
          obat_list {
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
        if (result.data && result.data.obat_list) {
          setObatList(result.data.obat_list);
        } else {
          console.error("GraphQL error:", result.errors);
          setObatList([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setObatList([]);
      });
  }, [router]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("doctorToken");
        const doctorName = localStorage.getItem("activeDoctorName");

        if (!token || !doctorName) {
          throw new Error("Dokter belum login");
        }

        const res = await fetch("http://localhost:8004/graphql", {
          // ganti port sesuai patient service
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // kirim JWT ke backend
          },
          body: JSON.stringify({
            query: `
              query {
                patientsByDoctor(doctorUsername: "${doctorName}") {
                  id
                  fullName
                  email
                  phoneNumber
                  records {
                    id
                    diagnosis
                    notes
                    doctorUsername
                    createdAt
                  }
                }
              }
            `,
          }),
        });

        const data = await res.json();
        if (data.errors) {
          throw new Error(data.errors[0].message);
        }

        setPatients(data.data.patientsByDoctor);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPatients();
  }, []);

  // Calculate statistics
  const stats = {
    lowStockItems: obatList.filter((obat) => obat.stock < 10).length,
    pendingBookings: bookings.filter((b) => b.status === "Pending" || b.status === "PENDING").length,
    confirmedBookings: bookings.filter((b) => b.status === "Confirmed" || b.status === "CONFIRMED").length,
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-teal-50 font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-linear-to-b from-teal-700 to-emerald-800 text-white flex flex-col p-6 space-y-8 shadow-xl">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-white/20 p-2 rounded-xl">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">
            SentraCare<span className="font-light"> Admin</span>
          </h1>
        </div>

        {/* User Profile */}
        <div className="bg-white/10 rounded-2xl p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-linear-to-r from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">S</div>
            <div>
              <p className="font-medium">SuperAdmin</p>
              <p className="text-sm text-teal-100 opacity-80">Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <div className="space-y-2">
            <button
              onClick={() => setActiveSection("overview")}
              className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition duration-200 w-full text-left ${activeSection === "overview" ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard Overview</span>
            </button>

            <button onClick={() => router.push("/admin/view-users")} className="flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition duration-200 w-full text-left text-white/80 hover:bg-white/10 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-6.5a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121.5 8.5z"
                />
              </svg>
              <span>User Management</span>
            </button>

            <button onClick={() => router.push("/admin/view-bookings")} className="flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition duration-200 w-full text-left text-white/80 hover:bg-white/10 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Booking Management</span>
            </button>

            <button onClick={() => setShowDoctorAuth(true)} className="flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition duration-200 w-full text-left text-white/80 hover:bg-white/10 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Patient Records</span>
            </button>

            <button onClick={() => router.push("/admin/pharmacy")} className="flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition duration-200 w-full text-left text-white/80 hover:bg-white/10 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Pharmacy Stock</span>
            </button>

            <button
              onClick={() => setActiveSection("insurance")}
              className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition duration-200 w-full text-left ${activeSection === "insurance" ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Insurance Bridge</span>
            </button>
          </div>
        </nav>

        {/* Logout */}
        <div className="mt-auto pt-6 border-t border-white/20">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userRole");
              localStorage.removeItem("username");
              router.push("/auth/login");
            }}
            className="flex items-center space-x-3 text-white/80 hover:text-white hover:bg-white/10 w-full p-3 rounded-xl transition duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Modern Navbar */}
        <nav className="bg-linear-to-r from-teal-600 to-emerald-700 text-white p-4 flex justify-between items-center shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="font-bold text-2xl">
              SentraCare<span className="font-light"> Admin Dashboard</span>
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-white/80 text-sm">{new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
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
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
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

            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Today`s Bookings</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{bookings.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-green-600 text-sm font-medium">{stats.pendingBookings} pending</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
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

            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Low Stock Items</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stats.lowStockItems}</p>
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
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="bg-linear-to-r from-teal-600 to-emerald-700 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">User Management</h2>
                <button onClick={() => router.push("/admin/add-user")} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-200">
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
                      {users.slice(0, 3).map((u) => (
                        <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition duration-150">
                          <td className="py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-teal-600 font-medium">{u.username.charAt(0).toUpperCase()}</span>
                              </div>
                              <span className="font-medium">{u.username}</span>
                            </div>
                          </td>
                          <td className="py-4 text-gray-600">{u.email}</td>
                          <td className="py-4">
                            <span className="bg-teal-100 text-teal-800 text-xs font-medium px-3 py-1 rounded-full">{u.role}</span>
                          </td>
                          <td className="py-4">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">{u.status}</span>
                          </td>
                        </tr>
                      ))}

                      {/* Tambahkan kondisi untuk empty state */}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan="4" className="py-8 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-5a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z" />
                              </svg>
                              <span>Belum ada data pengguna</span>
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* Pembatas dan info jumlah data tersisa */}
                      {users.length > 3 && (
                        <tr>
                          <td colSpan="4" className="py-4">
                            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center text-gray-600">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm">Menampilkan 3 dari {users.length} pengguna</span>
                              </div>
                              <div className="text-teal-600 text-sm font-medium">+{users.length - 3} lainnya</div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">{users.length > 0 ? <span>Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}</span> : <span>Tidak ada data pengguna</span>}</div>
                    <button
                      onClick={() => router.push("/admin/view-users")}
                      disabled={users.length === 0}
                      className={`text-teal-600 hover:text-teal-800 font-medium text-sm flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition duration-200 ${
                        users.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-50"
                      }`}
                    >
                      <span>View all users</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Booking Management Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="bg-linear-to-r from-blue-600 to-cyan-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Booking Management</h2>
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
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 3).map((b) => (
                        <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition duration-150">
                          <td className="py-4 font-medium text-gray-800">#{String(b.id).padStart(3, "0")}</td>
                          <td className="py-4">
                            <div>
                              <p className="font-medium text-gray-800">{b.namaLengkap}</p>
                              <p className="text-gray-500 text-sm">{b.jenisLayanan}</p>
                            </div>
                          </td>
                          <td className="py-4">
                            <div>
                              <p className="font-sm text-gray-800">{b.tanggalPemeriksaan}</p>
                              <p className="text-gray-500 text-sm">{b.jamPemeriksaan}</p>
                            </div>
                          </td>
                          <td className="py-4">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                b.status === "Pending" || b.status === "PENDING" ? "bg-amber-100 text-amber-800" : b.status === "Confirmed" || b.status === "CONFIRMED" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 text-center">
                  <button onClick={() => router.push("/admin/view-bookings")} className="text-teal-600 hover:text-teal-800 font-medium text-sm flex items-center justify-center gap-1">
                    <span>View all bookings</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Patient Records Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="bg-linear-to-r from-purple-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Patient Records</h2>
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
                  <button onClick={() => setShowDoctorAuth(true)} className="text-teal-600 hover:text-teal-800 font-medium text-sm flex items-center justify-center gap-1">
                    <span>Access Patient Records</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Pharmacy Stock Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="bg-linear-to-r from-green-600 to-emerald-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Pharmacy Stock</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {obatList.slice(0, 3).map((o) => (
                    <div key={o.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition duration-150">
                      <div className="flex items-center">
                        <div className={`p-3 rounded-lg mr-4 ${o.stock < 10 ? "bg-red-100" : o.stock < 20 ? "bg-amber-100" : "bg-green-100"}`}>
                          <svg className={`w-5 h-5 ${o.stock < 10 ? "text-red-600" : o.stock < 20 ? "text-amber-600" : "text-green-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{o.name}</h3>
                          <p className="text-gray-600 text-sm mt-1">{o.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${o.stock < 10 ? "text-red-600" : o.stock < 20 ? "text-amber-600" : "text-gray-800"}`}>{o.stock}</p>
                        <p className={`text-sm font-medium ${o.stock < 10 ? "text-red-600" : o.stock < 20 ? "text-amber-600" : "text-green-600"}`}>{o.stock < 10 ? "Low Stock" : o.stock < 20 ? "Medium Stock" : "In Stock"}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <button onClick={() => router.push("/admin/pharmacy")} className="text-teal-600 hover:text-teal-800 font-medium text-sm flex items-center justify-center gap-1">
                    <span>View all pharmacy items</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Insurance Bridge Card */}
          <div className="mt-6 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Insurance Bridge Service</h2>
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">Active</span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-5 bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Connected Insurers</p>
                      <p className="text-2xl font-bold text-gray-800">8</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">BPJS, AXA, Allianz, Prudential, Manulife, Sinarmas, Bumiputera, Cigna</p>
                </div>

                <div className="p-5 bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Claims This Month</p>
                      <p className="text-2xl font-bold text-gray-800">156</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">92 approved • 42 pending • 22 rejected</p>
                </div>

                <div className="p-5 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Covered</p>
                      <p className="text-2xl font-bold text-gray-800">Rp 450M</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Average approval time: 2.3 days</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm text-gray-600">API Status: Connected</span>
                </div>
                <button className="px-4 py-2 bg-linear-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition duration-200 flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Manage Insurance Bridge</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL POP-UP LOGIN DOKTER */}
      {showDoctorAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-white/20">
            <div className="bg-linear-to-r from-teal-600 to-emerald-600 px-6 py-5">
              <div className="flex items-center">
                <div className="p-2 bg-white/20 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Doctor Verification Required</h3>
              </div>
            </div>

            <form onSubmit={handleDoctorLogin} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Email</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
                  placeholder="doctor_username"
                  onChange={(e) => setDocAuthData({ ...docAuthData, identifier: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
                  placeholder="password"
                  onChange={(e) => setDocAuthData({ ...docAuthData, password: e.target.value })}
                />
              </div>

              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{authError}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowDoctorAuth(false)} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition duration-200">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="flex-1 px-4 py-3 bg-linear-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:from-teal-700 hover:to-emerald-700 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAuthenticating ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    "Verify Credentials"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
