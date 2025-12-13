"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8002/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.detail || "Login gagal. Periksa username dan password Anda.");
        return;
      }

      const data = await res.json();
      const token = data.access_token;

      // decode JWT untuk ambil role
      const payload = JSON.parse(atob(token.split(".")[1]));

      // simpan token di localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", payload.role);
      localStorage.setItem("username", form.username);

      // redirect sesuai role
      if (payload.role === "Pasien") {
        router.push("/pasien/dashboard-pasien");
      } else if (payload.role === "SuperAdmin") {
        router.push("/admin/dashboard-admin");
      } else if (payload.role === "Dokter") {
        router.push("/dashboard-dokter");
      } else {
        setError("Role tidak dikenali");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi. Periksa koneksi internet Anda.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center p-4 md:p-6">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Container */}
      <div className="relative w-full max-w-md">
        {/* Logo & Brand Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Sentra<span className="text-teal-600">Care</span>
          </h1>
          <p className="text-gray-600">Layanan Kesehatan Terpadu</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-700 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Masuk ke Akun Anda</h2>
            <p className="text-teal-100 text-sm mt-1">Selamat datang kembali di SentraCare</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleLogin}>
              {/* Username Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Username atau Email</label>
                <div className="relative">
                  <input
                    type="text"
                    name="identifier"
                    value={form.identifier}
                    onChange={handleChange}
                    placeholder="Masukkan username atau email"
                    className="w-full px-4 py-3 pl-12 text-gray-800 placeholder:text-gray-400 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
                    required
                  />
                  <div className="absolute left-3 top-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <Link href="/auth/forgot-password" className="text-sm text-teal-600 hover:text-teal-800">
                    Lupa password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Masukkan password Anda"
                    className="w-full px-4 py-3 pl-12 text-gray-800 placeholder:text-gray-400 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
                    required
                  />
                  <div className="absolute left-3 top-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Remember Me & Error Message */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input type="checkbox" id="remember" className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Ingat saya
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-600 text-sm">{error}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white font-bold py-3 rounded-xl shadow-lg transition duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Masuk
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-gray-500 text-sm">Atau</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Demo Accounts Info */}
            <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Akun Demo
              </h4>
              <p className="text-blue-700 text-sm">
                Gunakan <span className="font-semibold">admin</span> untuk SuperAdmin, <span className="font-semibold">dokter</span> untuk Dokter, atau <span className="font-semibold">pasien</span> untuk Pasien
              </p>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Belum punya akun?{" "}
                <Link href="/auth/register" className="text-teal-600 hover:text-teal-800 font-semibold transition duration-200">
                  Daftar sebagai Pasien
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} SentraCare. Hak Cipta Dilindungi.</p>
          <p className="text-gray-400 text-xs mt-1">Layanan kesehatan digital terpercaya</p>
        </div>
      </div>

      {/* Add CSS for blob animation */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
