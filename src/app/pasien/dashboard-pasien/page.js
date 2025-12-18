// pages/dashboard.tsx
"use client";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function getDisplayName(user) {
  return user?.full_name || user?.username || "";
}

function getInitials(name) {
  if (!name) return "PS";
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetch("http://localhost:8002/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token invalid");
        return res.json();
      })
      .then((data) => {
        console.log("User data:", data);
        setUser(data);
      })
      .catch((err) => console.error("Error fetching user data:", err));
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const query = `
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

    console.log("Token JWT:", token);
    fetch("http://127.0.0.1:8001/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.data && result.data.bookings) {
          setBookings(result.data.bookings);
        } else {
          console.error("GraphQL error:", result.errors || result);
          if (result.errors) {
            result.errors.forEach((err) => console.error("GraphQL detail:", err.message));
          }
          setBookings([]); // fallback kosong
        }
      })
      .catch((err) => console.error("Error fetching bookings:", err));
  }, [router]);

  return (
    <>
      <Head>
        <title>SentraCare Dashboard Pasien</title>
      </Head>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
        {/* Modern Sidebar */}
        <aside className="w-72 bg-gradient-to-b from-teal-700 to-emerald-800 text-white flex flex-col p-6 space-y-8 shadow-xl">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-white/20 p-2 rounded-xl">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">
              SentraCare<span className="font-light"> Pasien</span>
            </h1>
          </div>

          {/* User Profile */}
          <div className="bg-white/10 rounded-2xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">{user ? getInitials(getDisplayName(user)) : "PS"}</div>
              <div>
                <p className="font-medium">{user ? getDisplayName(user) : "Pasien"}</p>
                <p className="text-sm text-teal-100 opacity-80">ID: {user ? `P-${user.id}` : "-"}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <div className="space-y-2">
              <NavItem icon="📊" label="Dashboard" active={true} />
              <Link href="/pasien/booking">
                <NavItem icon="📅" label="Booking" />
              </Link>
              <NavItem icon="📋" label="Hasil Tes" />
              <NavItem icon="🏥" label="Layanan" />
              <NavItem icon="👤" label="Profil" />
            </div>
          </nav>

          {/* Logout */}
          <div className="mt-auto pt-6 border-t border-white/20">
            <button
              onClick={() => {
                localStorage.removeItem("token"); // hapus token
                localStorage.removeItem("userRole"); // kalau ada role disimpan
                localStorage.removeItem("username"); // kalau ada username disimpan
                router.push("/auth/login"); // redirect ke login
              }}
              className="flex items-center space-x-3 text-white/80 hover:text-white hover:bg-white/10 w-full p-3 rounded-xl transition duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Keluar</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-lg text-gray-600 font-medium">Selamat Datang Kembali,</h2>
              <h1 className="text-3xl font-bold text-gray-800 mt-1">{user ? getDisplayName(user) : "Pasien"}</h1>
              <p className="text-gray-500 mt-2">Hari ini: {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button className="relative p-2 text-gray-600 hover:text-teal-600 transition duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </button>
              <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">SA</div>
                <div className="hidden md:block">
                  <p className="font-medium text-gray-800">{user ? user.full_name : "Pasien"}</p>
                  <p className="text-xs text-gray-500">Pasien</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Kunjungan</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">20</p>
                </div>
                <div className="bg-teal-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-green-600 text-sm font-medium">+2 dari bulan lalu</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Berat Badan</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">65.0 kg</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-green-600 text-sm font-medium">Stabil</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Kunjungan Berikutnya</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">2 Hari</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-amber-600 text-sm font-medium">Check-up rutin</span>
              </div>
            </div>
          </div>

          {/* Welcome Banner */}
          <section className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white p-8 rounded-2xl shadow-lg mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3">
                <h1 className="text-3xl font-bold mb-4">Pemeriksaan Kesehatan Mudah & Terpercaya</h1>
                <p className="text-teal-100 mb-6 max-w-2xl">SentraCare membantu Anda melakukan pemesanan medical check-up dan layanan kesehatan digital tanpa antre dengan hasil yang cepat dan akurat.</p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-white text-teal-700 hover:bg-gray-100 font-bold px-6 py-3 rounded-xl transition duration-200 flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Buat Janji Baru</span>
                  </button>
                  <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium px-6 py-3 rounded-xl transition duration-200">Pelajari Lebih Lanjut</button>
                </div>
              </div>
              <div className="mt-8 md:mt-0">
                <img src="/illustration.png" alt="Healthcare Illustration" className="w-64 h-auto" />
              </div>
            </div>
          </section>

          {/* Layanan */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Pilih Layanan Anda</h2>
              <Link href="/pasien/booking">
                <span className="text-teal-600 hover:text-teal-800 font-medium text-sm cursor-pointer">Lihat semua →</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ServiceCard title="Booking Tes Darah" icon="🧪" description="Pemeriksaan darah lengkap untuk mengetahui kondisi kesehatan Anda" bgColor="bg-red-50" iconColor="text-red-600" />
              <ServiceCard title="Booking Medical Check-Up" icon="🩺" description="Pemeriksaan kesehatan menyeluruh untuk deteksi dini penyakit" bgColor="bg-blue-50" iconColor="text-blue-600" />
              <ServiceCard title="Booking Vaksinasi" icon="💉" description="Vaksinasi untuk pencegahan penyakit sesuai kebutuhan Anda" bgColor="bg-green-50" iconColor="text-green-600" />
            </div>
          </section>

          {/* Recent Activity & Upcoming Appointments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800">Janji Berikutnya</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <div key={b.id} className="flex items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition duration-150">
                      <div className="bg-teal-100 p-3 rounded-lg mr-4">
                        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{b.jenisLayanan}</h4>
                        <p className="text-gray-600 text-sm">{b.namaLengkap}</p>
                        <div className="flex items-center text-gray-500 text-xs mt-1">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {new Date(b.tanggalPemeriksaan).toLocaleDateString("id-ID")} • {b.jamPemeriksaan}
                        </div>
                      </div>
                      <span className="bg-teal-100 text-teal-800 text-xs font-medium px-3 py-1 rounded-full">{b.status}</span>
                    </div>
                  ))}
                  <div className="mt-6">
                    <button className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition duration-200">Lihat Semua Janji</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Test Results */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800">Hasil Tes Terbaru</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                    <div>
                      <h4 className="font-bold text-gray-800">Tes Darah Lengkap</h4>
                      <p className="text-gray-600 text-sm">28 Nov 2025</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">Normal</span>
                      <button className="block text-teal-600 hover:text-teal-800 font-medium text-sm mt-2">Lihat Detail</button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                    <div>
                      <h4 className="font-bold text-gray-800">Kolesterol</h4>
                      <p className="text-gray-600 text-sm">15 Nov 2025</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full">Perlu Perhatian</span>
                      <button className="block text-teal-600 hover:text-teal-800 font-medium text-sm mt-2">Lihat Detail</button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                    <div>
                      <h4 className="font-bold text-gray-800">Gula Darah Puasa</h4>
                      <p className="text-gray-600 text-sm">01 Nov 2025</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">Normal</span>
                      <button className="block text-teal-600 hover:text-teal-800 font-medium text-sm mt-2">Lihat Detail</button>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition duration-200">Lihat Riwayat Lengkap</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function NavItem({ icon, label, active = false }) {
  return (
    <div className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition duration-200 ${active ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"}`}>
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
  );
}

function ServiceCard({ title, icon, description, bgColor, iconColor }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition duration-300 cursor-pointer group">
      <div className={`${bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition duration-300`}>
        <span className={`text-3xl ${iconColor}`}>{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex items-center text-teal-600 font-medium">
        <span>Booking sekarang</span>
        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </div>
  );
}
