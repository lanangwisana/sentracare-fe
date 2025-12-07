// pages/dashboard.tsx
import Head from "next/head";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>SentraCare Dashboard</title>
      </Head>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-teal-700 text-white flex flex-col p-4 space-y-6">
          <h1 className="text-2xl font-bold">SentraCare</h1>
          <nav className="flex flex-col space-y-4">
            <a href="#" className="bg-teal-900 px-3 py-2 rounded">
              Dashboard
            </a>
            <a href="pasien/booking">Booking</a>
            <a href="#">Hasil Tes</a>
            <a href="#">Layanan</a>
            <a href="#">Profil</a>
            <a href="#">Logout</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Selamat Datang,</h2>
              <h3 className="text-2xl font-bold text-teal-700">Sallamah Agnia Putri</h3>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Notifikasi</span>
              <img src="/avatar.png" alt="Avatar" className="w-10 h-10 rounded-full" />
            </div>
          </div>

          {/* Banner */}
          <section className="bg-white p-6 rounded-lg shadow mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">Pemeriksaan Kesehatan Mudah & Terpercaya</h1>
              <p className="mt-2 text-gray-700 max-w-md">SentraCare membantu Anda melakukan pemesanan medical check-up dan layanan kesehatan digital tanpa antre dengan hasil yang cepat dan akurat.</p>
              <div className="mt-4 space-x-4">
                <button className="bg-teal-600 text-white px-4 py-2 rounded">Mulai Sekarang</button>
                <button className="border border-teal-600 text-teal-600 px-4 py-2 rounded">Pelajari Lebih Lanjut</button>
              </div>
            </div>
            <img src="/illustration.png" alt="Healthcare Illustration" className="w-64" />
          </section>

          {/* Layanan */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Pilih Layanan Anda</h2>
            <div className="grid grid-cols-3 gap-6">
              <ServiceCard title="Booking Tes Darah" icon="🧪" />
              <ServiceCard title="Booking Medical Check-Up" icon="🩺" />
              <ServiceCard title="Booking Vaksinasi" icon="💉" />
            </div>
          </section>

          {/* Ringkasan */}
          <section className="mt-8 grid grid-cols-2 gap-6">
            <SummaryCard title="Jumlah Kunjungan" value="20" />
            <SummaryCard title="Berat Badan" value="65.0 kg" />
          </section>
        </main>
      </div>
    </>
  );
}

function ServiceCard({ title, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow text-center">
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
      <h3 className="text-gray-700 font-semibold">{title}</h3>
      <span className="text-2xl font-bold text-teal-700">{value}</span>
    </div>
  );
}
