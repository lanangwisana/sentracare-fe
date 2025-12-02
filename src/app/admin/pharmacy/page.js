import React from "react";

export default function App() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Pharmacy</h1>

      {/* Stok Obat */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Stok Obat</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Nama Obat</th>
              <th className="border p-2">Kategori</th>
              <th className="border p-2">Stok</th>
              <th className="border p-2">Harga</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Paracetamol</td>
              <td className="border p-2">Analgesik</td>
              <td className="border p-2 text-green-600">120</td>
              <td className="border p-2">Rp 5.000</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Resep Digital */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Buat Resep</h2>
        <form className="space-y-4">
          <input type="text" placeholder="Nama Pasien" className="border p-2 w-full" />
          <select className="border p-2 w-full">
            <option>Pilih Obat</option>
            <option>Paracetamol</option>
            <option>Amoxicillin</option>
          </select>
          <input type="number" placeholder="Jumlah" className="border p-2 w-full" />
          <textarea placeholder="Aturan Pakai" className="border p-2 w-full"></textarea>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Simpan Resep</button>
        </form>
      </section>
    </div>
  );
}
