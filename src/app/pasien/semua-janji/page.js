"use client";
import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";

const CalendarIcon = () => (
  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
  </svg>
);
const ClockIcon = () => (
  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);
const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
  </svg>
);
const CheckIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);
const LabIcon = () => (
  <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
  </svg>
);
const VaccineIcon = () => (
  <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
    ></path>
  </svg>
);
const MedicalIcon = () => (
  <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
  </svg>
);
const BackIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
  </svg>
);

const SemuaJanjiPage = () => {
  const [semuaJanji, setSemuaJanji] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const query = `
      query {
        bookings {
          id
          namaLengkap
          jenisLayanan
          tanggalPemeriksaan
          jamPemeriksaan
          status
          doctorName
        }
      }
    `;

    fetch("http://localhost:8001/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("GraphQL bookings:", result);
        if (result.data && result.data.bookings) {
          const mapped = result.data.bookings.map((b) => ({
            id: b.id,
            nama: b.namaLengkap,
            tanggal: new Date(b.tanggalPemeriksaan).toLocaleDateString("id-ID"),
            waktu: b.jamPemeriksaan,
            tipe: b.jenisLayanan.toLowerCase().replace(" ", "-"), // lab-tes, vaksinasi, medical-checkup
            status: b.status.toLowerCase(), // confirmed / pending
            jenis: b.jenisLayanan,
          }));
          setSemuaJanji(mapped);
        } else {
          console.error("GraphQL error:", result.errors);
        }
      })
      .catch((err) => console.error("Error fetching bookings:", err));
  }, []);

  // Filter data berdasarkan tipe
  const janjiLabTes = semuaJanji.filter((j) => j.tipe === "lab-tes");
  const janjiVaksinasi = semuaJanji.filter((j) => j.tipe === "vaksinasi");
  const janjiMedicalCheckup = semuaJanji.filter((j) => j.tipe === "medical-checkup");

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header */}
      <div className="bg-emerald-600 text-white py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Semua Janji</h1>
              <p className="text-emerald-100 mt-1">Kelola dan pantau semua janji pasien</p>
            </div>
            <Link href="/pasien/dashboard-pasien" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium flex items-center">
              <BackIcon />
              Kembali
            </Link>
          </div>

          {/* Statistik Header */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-white/30 mr-3">
                  <LabIcon />
                </div>
                <div>
                  <p className="text-sm opacity-90">Total Lab Tes</p>
                  <p className="text-xl font-bold">{janjiLabTes.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-white/30 mr-3">
                  <VaccineIcon />
                </div>
                <div>
                  <p className="text-sm opacity-90">Total Vaksinasi</p>
                  <p className="text-xl font-bold">{janjiVaksinasi.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-white/30 mr-3">
                  <MedicalIcon />
                </div>
                <div>
                  <p className="text-sm opacity-90">Total Medical Checkup</p>
                  <p className="text-xl font-bold">{janjiMedicalCheckup.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Ringkasan Statistik */}
        <div className="mb-10 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Janji</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-xl">
              <p className="text-2xl font-bold text-emerald-600">{semuaJanji.length}</p>
              <p className="text-sm text-gray-600">Total Janji</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-xl">
              <p className="text-2xl font-bold text-emerald-600">{semuaJanji.filter((j) => j.status === "confirmed").length}</p>
              <p className="text-sm text-gray-600">Confirmed</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-xl">
              <p className="text-2xl font-bold text-amber-600">{semuaJanji.filter((j) => j.status === "pending").length}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-xl">
              <p className="text-2xl font-bold text-gray-600">
                {
                  semuaJanji.filter((j) => {
                    const [day, month, year] = j.tanggal.split("/");
                    const date = new Date(`${year}-${month}-${day}`);
                    return date > new Date();
                  }).length
                }
              </p>
              <p className="text-sm text-gray-600">Mendatang</p>
            </div>
          </div>
        </div>

        {/* Semua Janji Berdasarkan Kategori */}
        <div className="space-y-12">
          {/* Lab Tes Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <LabIcon />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Lab Tes</h2>
                  <p className="text-sm text-gray-600">{janjiLabTes.length} janji</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {janjiLabTes.map((janji) => (
                <div key={janji.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                        <LabIcon />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{janji.nama}</h3>
                        <p className="text-sm text-gray-600">{janji.jenis}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${janji.status === "confirmed" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200"}`}>
                      {janji.status === "confirmed" ? "Confirmed" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <CalendarIcon />
                        <span>{janji.tanggal}</span>
                      </div>
                      <div className="flex items-center">
                        <ClockIcon />
                        <span>{janji.waktu}</span>
                      </div>
                    </div>
                    <UserIcon />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Vaksinasi Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <VaccineIcon />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Vaksinasi</h2>
                  <p className="text-sm text-gray-600">{janjiVaksinasi.length} janji</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {janjiVaksinasi.map((janji) => (
                <div key={janji.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                        <VaccineIcon />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{janji.nama}</h3>
                        <p className="text-sm text-gray-600">{janji.jenis}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${janji.status === "confirmed" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200"}`}>
                      {janji.status === "confirmed" ? "Confirmed" : "Pending"}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{janji.deskripsi}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <CalendarIcon />
                        <span>{janji.tanggal}</span>
                      </div>
                      <div className="flex items-center">
                        <ClockIcon />
                        <span>{janji.waktu}</span>
                      </div>
                    </div>
                    <UserIcon />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Medical Checkup Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <MedicalIcon />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Medical Checkup</h2>
                  <p className="text-sm text-gray-600">{janjiMedicalCheckup.length} janji</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {janjiMedicalCheckup.map((janji) => (
                <div key={janji.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                        <MedicalIcon />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{janji.nama}</h3>
                        <p className="text-sm text-gray-600">{janji.jenis}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${janji.status === "confirmed" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200"}`}>
                      {janji.status === "confirmed" ? "Confirmed" : "Pending"}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{janji.deskripsi}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <CalendarIcon />
                        <span>{janji.tanggal}</span>
                      </div>
                      <div className="flex items-center">
                        <ClockIcon />
                        <span>{janji.waktu}</span>
                      </div>
                    </div>
                    <UserIcon />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm">
              <p className="flex items-center">
                <CheckIcon />
                Terakhir diperbarui: 27/12/2025
              </p>
              <p className="mt-1">Total {semuaJanji.length} janji ditemukan</p>
            </div>
            <Link href="/pasien/dashboard-pasien" className="mt-4 md:mt-0 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center">
              <BackIcon />
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SemuaJanjiPage;
