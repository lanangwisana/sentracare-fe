// app/semua-rekam-medis/page.js
"use client";
import React from "react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

// Icon components
const CalendarIcon = () => (
  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
  </svg>
);

const DoctorIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    ></path>
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const MedicalIcon = () => (
  <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
    ></path>
  </svg>
);

const FileIcon = () => (
  <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
  </svg>
);

const BackIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
  </svg>
);

const DetailIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const StatusBadge = ({ status }) => {
  const styles = status === "selesai" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200";
  const label = status === "selesai" ? "Selesai" : "Dalam Proses";
  return <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles}`}>{label}</span>;
};

const RekamMedisCard = ({ rekam, status }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${status === "selesai" ? "bg-emerald-50 border border-emerald-100" : "bg-amber-50 border border-amber-100"}`}>
            <MedicalIcon />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{rekam.visitType || rekam.jenis || "Pemeriksaan"}</h3>
            <p className="text-sm text-gray-600">{rekam.patientName || rekam.pasien || "-"}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mb-4">
        <p className="text-gray-700 font-medium mb-2">Diagnosa:</p>
        <p className="text-gray-600 italic">{rekam.diagnosis || rekam.diagnosa || "-"}</p>
      </div>

      {rekam.notes || rekam.catatan ? <p className="text-gray-700 mb-4 text-sm">{rekam.notes || rekam.catatan}</p> : null}

      <div className="space-y-3 text-sm text-gray-500">
        <div className="flex items-center">
          <CalendarIcon />
          <span>{rekam.visitDate || rekam.tanggal || "-"}</span>
        </div>
        <div className="flex items-center">
          <UserIcon />
          <span>{rekam.doctorName || rekam.dokter || "-"}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        {rekam.detailTersedia || rekam.id ? (
          <Link href={`/rekam-medis/${rekam.id}`}>
            <button className="w-full px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-medium transition-colors flex items-center justify-center">
              <DetailIcon />
              Lihat detail rekam medis
            </button>
          </Link>
        ) : (
          <button className="w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-lg font-medium cursor-not-allowed">Detail belum tersedia</button>
        )}
      </div>
    </div>
  );
};

const PrescriptionItem = ({ p }) => {
  return (
    <div className="flex items-start justify-between border rounded-lg p-4 bg-white">
      <div>
        <p className="text-sm text-gray-500">Nomor Resep</p>
        <p className="font-medium text-gray-900">{p.prescriptionNumber}</p>
        <p className="mt-2 text-sm text-gray-700">
          <span className="font-medium">Dokter:</span> {p.doctorName}
        </p>
        <p className="mt-1 text-sm text-gray-700">
          <span className="font-medium">Tanggal:</span> {new Date(p.createdAt).toLocaleDateString()}
        </p>
        <p className="mt-2 text-sm text-gray-700">
          <span className="font-medium">Instruksi:</span> {p.instructions || "-"}
        </p>
        {Array.isArray(p.medicines) && p.medicines.length > 0 ? (
          <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
            {p.medicines.map((m, idx) => (
              <li key={idx}>{typeof m === "string" ? m : m.name ? `${m.name} (${m.dosage || ""}, ${m.frequency || ""}, ${m.duration || ""})` : JSON.stringify(m)}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <Link href={`/resep/${p.id}`} className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
        Lihat detail resep
      </Link>
    </div>
  );
};

const SemuaRekamMedisPage = () => {
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [latestWeight, setLatestWeight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const email = typeof window !== "undefined" ? localStorage.getItem("username") : null;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const graphqlURL = "http://localhost:8004/graphql";
  const API_BASE = "http://localhost:8088";
  const query = `
    query GetPatientRecords($email: String!) {
      patientByEmail(email: $email) {
        records {
          id
          visitDate
          visitType
          diagnosis
          vitalSigns {
            weight
          }
        }
        prescriptions {
          id
          recordId
          prescriptionNumber
          doctorName
          medicines
          instructions
          createdAt
        }
      }
    }
  `;
  useEffect(() => {
    if (!email || !token || !graphqlURL) {
      setError("Kredensial atau konfigurasi tidak lengkap. Pastikan email, token, dan NEXT_PUBLIC_GRAPHQL_URL tersedia.");
      setLoading(false);
      return;
    }

    const fetchMedicalRecords = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/patients/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query,
            variables: { email },
          }),
        });

        const result = await res.json();
        if (result.errors) {
          throw new Error(result.errors?.[0]?.message || "Gagal memuat data GraphQL");
        }

        const payload = result.data?.patientByEmail;
        const fetchedRecords = payload?.records || [];
        const fetchedPrescriptions = payload?.prescriptions || [];

        // Sort records by date desc (assuming ISO string)
        const sortedRecords = [...fetchedRecords].sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));

        setRecords(sortedRecords);
        setPrescriptions(fetchedPrescriptions);

        if (sortedRecords.length > 0 && sortedRecords[0]?.vitalSigns?.weight) {
          setLatestWeight(sortedRecords[0].vitalSigns.weight);
        } else {
          setLatestWeight(null);
        }
      } catch (err) {
        setError(err.message || "Terjadi kesalahan memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, token, `${API_BASE}/patients/graphql`]);

  // Filter berdasarkan status
  const rekamSelesai = useMemo(() => records.filter((r) => (r.status || "").toLowerCase() === "selesai"), [records]);
  const rekamProses = useMemo(() => records.filter((r) => (r.status || "").toLowerCase() !== "selesai"), [records]);

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header */}
      <div className="bg-emerald-600 text-white py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Semua Rekam Medis & Resep</h1>
              <p className="text-emerald-100 mt-1">Akses lengkap riwayat kesehatan pasien</p>
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
                  <MedicalIcon />
                </div>
                <div>
                  <p className="text-sm opacity-90">Total Rekam Medis</p>
                  <p className="text-xl font-bold">{records.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-white/30 mr-3">
                  <FileIcon />
                </div>
                <div>
                  <p className="text-sm opacity-90">Selesai</p>
                  <p className="text-xl font-bold">{rekamSelesai.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-white/30 mr-3">
                  <DocumentIcon />
                </div>
                <div>
                  <p className="text-sm opacity-90">Dalam Proses</p>
                  <p className="text-xl font-bold">{rekamProses.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Loading & Error */}
        {loading && (
          <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <p className="text-gray-700">Memuat rekam medis dan resep...</p>
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 rounded-2xl shadow-sm border border-red-200 p-6">
            <p className="text-red-700 font-medium">Kesalahan: {error}</p>
            <p className="text-red-600 text-sm mt-1">Periksa koneksi, token, dan konfigurasi GraphQL URL.</p>
          </div>
        )}

        {/* Ringkasan Statistik */}
        {!loading && !error && (
          <div className="mb-10 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Rekam Medis</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border border-gray-200 rounded-xl">
                <p className="text-2xl font-bold text-emerald-600">{records.length}</p>
                <p className="text-sm text-gray-600">Total Rekam Medis</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-xl">
                <p className="text-2xl font-bold text-emerald-600">{rekamSelesai.length}</p>
                <p className="text-sm text-gray-600">Selesai</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-xl">
                <p className="text-2xl font-bold text-amber-600">{rekamProses.length}</p>
                <p className="text-sm text-gray-600">Dalam Proses</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-xl">
                <p className="text-2xl font-bold text-emerald-600">{typeof latestWeight === "number" ? `${latestWeight} kg` : "-"}</p>
                <p className="text-sm text-gray-600">Berat Badan Terbaru</p>
              </div>
            </div>
          </div>
        )}

        {/* Semua Rekam Medis */}
        {!loading && !error && (
          <div className="space-y-8">
            {/* Rekam Medis Selesai */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-emerald-100">
                    <FileIcon />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Rekam Medis Selesai</h2>
                    <p className="text-sm text-gray-600">{rekamSelesai.length} rekam medis</p>
                  </div>
                </div>
              </div>
              {rekamSelesai.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-gray-600">Belum ada rekam medis yang selesai.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rekamSelesai.map((rekam) => (
                    <RekamMedisCard key={rekam.id} rekam={rekam} status="selesai" />
                  ))}
                </div>
              )}
            </section>

            {/* Rekam Medis Dalam Proses */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-amber-100">
                    <DocumentIcon />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Dalam Proses</h2>
                    <p className="text-sm text-gray-600">{rekamProses.length} rekam medis</p>
                  </div>
                </div>
              </div>
              {rekamProses.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-gray-600">Tidak ada rekam medis dalam proses.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rekamProses.map((rekam) => (
                    <RekamMedisCard key={rekam.id} rekam={rekam} status="proses" />
                  ))}
                </div>
              )}
            </section>

            {/* Prescriptions */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <DocumentIcon />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Daftar Resep</h2>
                  <p className="text-sm text-gray-600">{prescriptions.length} resep</p>
                </div>
              </div>
              {prescriptions.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-gray-600">Belum ada resep.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                  {prescriptions.map((p) => (
                    <PrescriptionItem key={p.id} p={p} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm">
              <p className="flex items-center">
                <CheckIcon />
                Terakhir diperbarui: {new Date().toLocaleDateString()}
              </p>
              <p className="mt-1">Total {records.length} rekam medis ditemukan</p>
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

export default SemuaRekamMedisPage;
