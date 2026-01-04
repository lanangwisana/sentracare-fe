"use client";
import { useState, useEffect, Suspense } from "react"; 
import { useRouter, useSearchParams } from "next/navigation"; 

function BookingFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); // <--- Untuk menangkap data dari Dashboard
  
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    nomor_telepon: "",
    email: "",
    alamat: "",
    jenis_layanan: "",
    tipe_layanan: "",
    tanggal_pemeriksaan: "",
    jam_pemeriksaan: "",
    catatan: "",
  });


  useEffect(() => {
    const service = searchParams.get("service");
    if (service) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({ ...prev, jenis_layanan: service }));
    }
  }, [searchParams]);

  const isDataPribadiDone = formData.nama_lengkap && formData.tanggal_lahir && formData.jenis_kelamin;
  const isKontakDone = formData.nomor_telepon && formData.email && formData.alamat;
  const isLayananDone = formData.jenis_layanan && formData.tanggal_pemeriksaan && formData.jam_pemeriksaan;

  const tipeLayananOptions = {
    MEDICAL_CHECKUP: [{ value: "FULL_BODY", label: "Medical Check-Up Full Body" }],
    VAKSINASI: [
      { value: "HPV", label: "Vaksinasi HPV" },
      { value: "ANAK_BAYI", label: "Vaksinasi Anak dan Bayi" }
    ],
    LAB_TES: [
      { value: "TES_DARAH", label: "Tes Darah" },
      { value: "TES_HORMON", label: "Tes Hormon" },
      { value: "TES_URINE", label: "Tes Urine" }
    ]
  };

  const handleChange = (e) => {
    if (e.target.name === "jenis_layanan") {
      setFormData({ 
        ...formData, 
        [e.target.name]: e.target.value,
        tipe_layanan: "" 
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      const response = await fetch("http://127.0.0.1:8001/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert("Gagal kirim data: " + errorText);
        return;
      }

      const result = await response.json();
      alert("Booking berhasil dibuat dengan ID: " + result.booking.id);
      
      // REDIRECT KE DASHBOARD SETELAH BERHASIL
      router.push("/pasien/dashboard-pasien"); 
      
    } catch (error) {
      alert("Terjadi kesalahan saat booking");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-teal-50 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-teal-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Booking Layanan Kesehatan</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Isi formulir di bawah ini untuk mendaftar antrean online. Tim kami akan menghubungi Anda untuk konfirmasi.</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${isDataPribadiDone ? "bg-teal-600 text-white border-teal-600" : "bg-teal-100 text-teal-800 border-teal-600"}`}>1</div>
            <div className={`w-24 h-1 mx-2 transition-colors ${isDataPribadiDone ? "bg-teal-600" : "bg-teal-600"}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${isKontakDone ? "bg-teal-600 text-white border-teal-600" : "bg-teal-100 text-teal-800 border-teal-600"}`}>2</div>
            <div className={`w-24 h-1 mx-2 transition-colors ${isKontakDone ? "bg-teal-600" : "bg-teal-600"}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${isLayananDone ? "bg-teal-600 text-white border-teal-600" : "bg-teal-100 text-teal-800 border-teal-600"}`}>3</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className="bg-linear-to-r from-teal-600 to-emerald-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Formulir Pendaftaran</h2>
                <p className="text-teal-100 mt-1">SentraCare - Layanan Kesehatan Terpadu</p>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <span className="text-white font-medium">
                  {!isDataPribadiDone ? "Langkah 1/3" : !isKontakDone ? "Langkah 2/3" : "Langkah 3/3"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Data Pribadi Card */}
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="bg-teal-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Data Pribadi</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nama Lengkap <span className="text-red-500">*</span></label>
                  <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500" placeholder="Masukkan nama lengkap" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tanggal Lahir <span className="text-red-500">*</span></label>
                  <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-xl appearance-none scheme-light" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Jenis Kelamin <span className="text-red-500">*</span></label>
                  <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-xl appearance-none" required>
                    <option value="">Pilih jenis kelamin</option>
                    <option value="LAKI_LAKI">Laki-laki</option>
                    <option value="PEREMPUAN">Perempuan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Kontak Card */}
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Kontak dan Alamat</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nomor Telepon <span className="text-red-500">*</span></label>
                  <input type="tel" name="nomor_telepon" value={formData.nomor_telepon} onChange={handleChange} className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl" placeholder="08xxxxxxxxxx" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl" placeholder="nama@email.com" required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Alamat Lengkap <span className="text-red-500">*</span></label>
                  <textarea name="alamat" value={formData.alamat} onChange={handleChange} className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl" rows="3" placeholder="Jl. Contoh No. 123, Kota, Kode Pos" required />
                </div>
              </div>
            </div>

            {/* Pilihan Layanan Card */}
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Pilihan Layanan</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Jenis Layanan <span className="text-red-500">*</span></label>
                  <select name="jenis_layanan" value={formData.jenis_layanan} onChange={handleChange} className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-xl appearance-none" required>
                    <option value="">Pilih jenis layanan</option>
                    <option value="MEDICAL_CHECKUP">Medical Check Up</option>
                    <option value="VAKSINASI">Vaksinasi</option>
                    <option value="LAB_TES">Lab Tes</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tipe Layanan</label>
                  <select name="tipe_layanan" value={formData.tipe_layanan} onChange={handleChange} className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-xl appearance-none" disabled={!formData.jenis_layanan}>
                    <option value="">Pilih tipe layanan</option>
                    {formData.jenis_layanan && tipeLayananOptions[formData.jenis_layanan]?.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tanggal Pemeriksaan <span className="text-red-500">*</span></label>
                  <input type="date" name="tanggal_pemeriksaan" value={formData.tanggal_pemeriksaan} onChange={handleChange} className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Jam Pemeriksaan <span className="text-red-500">*</span></label>
                  <input type="time" name="jam_pemeriksaan" value={formData.jam_pemeriksaan} onChange={handleChange} className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl" required />
                </div>
              </div>
            </div>

            {/* Catatan Card */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="bg-amber-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Catatan Tambahan</h3>
              </div>
              <textarea name="catatan" value={formData.catatan} onChange={handleChange} className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500" rows="4" placeholder="Ketikkan catatan tambahan..." />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-gray-600 text-sm">
                <p>Dengan mengisi formulir ini, Anda menyetujui syarat dan ketentuan kami.</p>
              </div>
              <div className="flex gap-4">
                <button type="button" className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50" onClick={() => router.push("/pasien/dashboard-pasien")}>Kembali</button>
                <button type="submit" className="px-8 py-3 bg-linear-to-r from-teal-600 to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:from-teal-700 transition duration-200">Daftar Antrean Sekarang</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// EXPORT DEFAULT DENGAN SUSPENSE BOUNDARY (Wajib untuk useSearchParams di Next.js)
export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BookingFormContent />
    </Suspense>
  );
}