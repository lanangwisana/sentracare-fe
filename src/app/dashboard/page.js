// src/App.jsx
import React from "react";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Sentracare Dashboard</h1>
        <div className="space-x-4">
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Dashboard
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Booking
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600">
            Auth
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-800">Selamat Datang di Sentracare</h2>
        <p className="mt-2 text-gray-600">Kelola pasien dan booking dengan mudah</p>
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Mulai Booking</button>
      </header>

      {/* Dashboard Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold">Total Pasien</h3>
          <p className="text-2xl font-bold text-blue-600">120</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold">Booking Hari Ini</h3>
          <p className="text-2xl font-bold text-green-600">35</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold">Auth Status</h3>
          <p className="text-2xl font-bold text-purple-600">Active</p>
        </div>
      </section>
    </div>
  );
}
