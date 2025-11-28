"use client";
import { useState } from "react";

export default function BookingForm() {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8001/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error:", errorText);
        alert("Gagal kirim data: " + errorText);
        return;
      }

      const result = await response.json();
      console.log("Response dari backend:", result);
      alert("Booking berhasil dibuat dengan ID: " + result.booking.id);
    } catch (error) {
      console.error("Error saat kirim data:", error);
      alert("Terjadi kesalahan saat booking");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-5xl flex flex-col gap-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-700">Booking Service</h2>
          <p className="text-gray-600 mt-1">Pendaftaran Antrean Online Layanan Kesehatan</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data Pribadi */}
          <div className="flex flex-col gap-4 border border-blue-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-600">Data Pribadi</h3>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input type="text" name="nama_lengkap" value={formData.namaLengkap} onChange={handleChange} className=" text-black mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-400" required />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Tanggal Lahir</label>
              <input type="date" name="tanggal_lahir" value={formData.tanggalLahir} onChange={handleChange} className=" text-black mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-400" required />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Jenis Kelamin</label>
              <select name="jenis_kelamin" value={formData.jenisKelamin} onChange={handleChange} className="text-black mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-400" required>
                <option value="">Pilih...</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          {/* Kontak */}
          <div className="flex flex-col gap-4 border border-blue-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-600">Kontak</h3>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Nomor Telepon</label>
              <input type="tel" name="nomor_telepon" value={formData.nomorTelepon} onChange={handleChange} className="text-black mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-400" required />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="text-black mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-400" required />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Alamat</label>
              <textarea name="alamat" value={formData.alamat} onChange={handleChange} className="text-black mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-400" rows="2" required />
            </div>
          </div>

          {/* Layanan */}
          <div className="flex flex-col gap-4 border border-blue-100 rounded-xl p-6 shadow-sm md:col-span-2">
            <h3 className="text-lg font-semibold text-blue-600">Layanan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Jenis Layanan</label>
                <select name="jenis_layanan" value={formData.jenisLayanan} onChange={handleChange} className="text-black mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-400" required>
                  <option value="">Pilih...</option>
                  <option value="Medical Check-Up">Medical Check Up</option>
                  <option value="Vaksinasi">Vaksinasi</option>
                  <option value="Lab Tes">Lab Tes</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Tipe Layanan</label>
                <select name="tipe_layanan" value={formData.tipeLayanan} onChange={handleChange} className="text-black mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-400">
                  <option value="">Pilih...</option>
                  <option value="Medical Check-Up Full Body">Medical Check-Up Full Body</option>
                  <option value="Vaksinasi HPV">Vaksinasi HPV</option>
                  <option value="Vaksinasi Anak & Bayi">Vaksinasi Anak dan Bayi</option>
                  <option value="Tes Darah">Tes Darah</option>
                  <option value="Tes Hormon">Tes Hormon</option>
                  <option value="Tes Urine">Tes Urine</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Tanggal Pemeriksaan</label>
                <input type="date" name="tanggal_pemeriksaan" value={formData.tanggalPemeriksaan} onChange={handleChange} className="text-black mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-400" required />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">Jam Pemeriksaan</label>
                <input type="time" name="jam_pemeriksaan" value={formData.jamPemeriksaan} onChange={handleChange} className="text-black mt-1 border rounded-md p-2 focus:ring-2 focus:ring-blue-400" required />
              </div>
            </div>
          </div>

          {/* Catatan Tambahan */}
          <div className="flex flex-col gap-4 border border-blue-100 rounded-xl p-6 shadow-sm md:col-span-2">
            <h3 className="text-lg font-semibold text-blue-600">Catatan Tambahan</h3>
            <textarea name="catatan" value={formData.catatan} onChange={handleChange} className="text-black w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400" rows="3" />
          </div>
        </div>

        {/* Submit */}
        <div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105">
            Daftar Antrean
          </button>
        </div>
      </form>
    </div>
  );
}
