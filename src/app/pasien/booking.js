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
      const result = await response.json();
      console.log("Response dari backend:", result);
      alert("Booking berhasil dibuat dengan ID: " + result.id);
    } catch (error) {
      console.error("Error saat kirim data:", error);
      alert("Terjadi kesalahan saat booking");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-600">Booking Service - Pendaftaran Antrean Online</h2>

        {/* Nama Lengkap */}
        <div>
          <label className="block text-sm font-medium">Nama Lengkap</label>
          <input type="text" name="namaLengkap" value={formData.namaLengkap} onChange={handleChange} className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-blue-300" required />
        </div>

        {/* Tanggal Lahir */}
        <div>
          <label className="block text-sm font-medium">Tanggal Lahir</label>
          <input type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange} className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-blue-300" required />
        </div>

        {/* Jenis Kelamin */}
        <div>
          <label className="block text-sm font-medium">Jenis Kelamin</label>
          <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange} className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-blue-300" required>
            <option value="">Pilih...</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        {/* Nomor Telepon */}
        <div>
          <label className="block text-sm font-medium">Nomor Telepon</label>
          <input type="tel" name="nomorTelepon" value={formData.nomorTelepon} onChange={handleChange} className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-blue-300" required />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-blue-300" required />
        </div>

        {/* Alamat */}
        <div>
          <label className="block text-sm font-medium">Alamat</label>
          <textarea name="alamat" value={formData.alamat} onChange={handleChange} className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-blue-300" rows="2" required />
        </div>

        {/* Jenis Layanan */}
        <div>
          <label className="block text-sm font-medium">Jenis Layanan</label>
          <select name="jenisLayanan" value={formData.jenisLayanan} onChange={handleChange} className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-blue-300" required>
            <option value="">Pilih...</option>
            <option value="Medical Check Up">Medical Check Up</option>
            <option value="Vaksinasi">Vaksinasi</option>
            <option value="Lab Tes">Lab Tes</option>
          </select>
        </div>

        {/* Tipe Layanan */}
        <div>
          <label className="block text-sm font-medium">Tipe Layanan</label>
          <select name="tipeLayanan" value={formData.tipeLayanan} onChange={handleChange} className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-blue-300">
            <option value="">Pilih...</option>
            <option value="Medical Check Up Full Body">Medical Check Up Full Body</option>
            <option value="Vaksinasi HPV">Vaksinasi HPV</option>
            <option value="Vaksinasi Anak dan Bayi">Vaksinasi Anak dan Bayi</option>
            <option value="Tes Darah">Tes Darah</option>
            <option value="Tes Hormon">Tes Hormon</option>
            <option value="Tes Urine">Tes Urine</option>
          </select>
        </div>

        {/* Tanggal Pemeriksaan */}
        <div>
          <label className="block text-sm font-medium">Tanggal Pemeriksaan</label>
          <input type="date" name="tanggalPemeriksaan" value={formData.tanggalPemeriksaan} onChange={handleChange} className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-blue-300" required />
        </div>

        {/* Jam Pemeriksaan */}
        <div>
          <label className="block text-sm font-medium">Jam Pemeriksaan</label>
          <input type="time" name="jamPemeriksaan" value={formData.jamPemeriksaan} onChange={handleChange} className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-blue-300" required />
        </div>

        {/* Catatan Tambahan */}
        <div>
          <label className="block text-sm font-medium">Catatan Tambahan</label>
          <textarea name="catatan" value={formData.catatan} onChange={handleChange} className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-blue-300" rows="2" />
        </div>

        {/* Submit */}
        <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition">
          Daftar Antrean
        </button>
      </form>
    </div>
  );
}
