"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.full_name.trim()) newErrors.full_name = "Nama lengkap wajib diisi";
    if (!form.username.trim()) newErrors.username = "Username wajib diisi";
    if (!form.email.trim()) newErrors.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Format email tidak valid";
    if (!form.password) newErrors.password = "Password wajib diisi";
    else if (form.password.length < 6) newErrors.password = "Password minimal 6 karakter";
    if (!form.confirm_password) newErrors.confirm_password = "Konfirmasi password wajib diisi";
    else if (form.password !== form.confirm_password) newErrors.confirm_password = "Password tidak cocok";
    if (!form.phone_number.trim()) newErrors.phone_number = "Nomor telepon wajib diisi";
    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const registerData = {
        full_name: form.full_name,
        username: form.username,
        email: form.email,
        phone_number: form.phone_number,
        password: form.password,
        confirm_password: form.confirm_password,
        address: form.address,
        role: "Pasien", // Default role for registration
      };

      const res = await fetch("http://localhost:8002/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const result = await res.json();

      if (!res.ok) {
        const message = typeof result.detail === "string" ? result.detail : Array.isArray(result.detail) ? result.detail.map((e) => e.detail || JSON.stringify(e)).join(", ") : JSON.stringify(result.detail);
        throw new Error(message);
      }

      setSuccessMessage("Registrasi berhasil! Anda akan diarahkan ke halaman login.");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      if (typeof err === "string") {
        setErrors({ general: err });
      } else if (err instanceof Error) {
        setErrors({ general: err.message });
      } else if (Array.isArray(err)) {
        const messages = err.map((e) => e.detail || JSON.stringify(e)).join(", ");
        setErrors({ general: messages });
      } else {
        setErrors({ general: "Terjadi kesalahan saat registrasi." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center p-4 md:p-6">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      {/* Register Container */}
      <div className="relative w-full max-w-2xl">
        {/* Logo & Brand Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Daftar di <span className="text-teal-600">SentraCare</span>
          </h1>
          <p className="text-gray-600">Bergabunglah dengan layanan kesehatan terpadu kami</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-700 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Buat Akun Pasien Baru</h2>
            <p className="text-teal-100 text-sm mt-1">Isi formulir di bawah untuk mendaftar</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleRegister}>
              {/* Success Message */}
              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-700">{successMessage}</span>
                  </div>
                </div>
              )}

              {/* General Error Message */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-600">{errors.general}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap"
                      className={`w-full px-4 py-3 pl-12 text-gray-800 placeholder:text-gray-400 bg-white border ${
                        errors.full_name ? "border-red-300" : "border-gray-300"
                      } rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200`}
                    />
                    <div className="absolute left-3 top-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
                </div>

                {/* Username Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="Buat username unik"
                      className={`w-full px-4 py-3 pl-12 text-gray-800 placeholder:text-gray-400 bg-white border ${
                        errors.username ? "border-red-300" : "border-gray-300"
                      } rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200`}
                    />
                    <div className="absolute left-3 top-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="contoh@email.com"
                      className={`w-full px-4 py-3 pl-12 text-gray-800 placeholder:text-gray-400 bg-white border ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      } rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200`}
                    />
                    <div className="absolute left-3 top-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone_number"
                      value={form.phone_number}
                      onChange={handleChange}
                      placeholder="08xxxxxxxxxx"
                      className={`w-full px-4 py-3 pl-12 text-gray-800 placeholder:text-gray-400 bg-white border ${
                        errors.phone_number ? "border-red-300" : "border-gray-300"
                      } rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200`}
                    />
                    <div className="absolute left-3 top-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Minimal 6 karakter"
                      className={`w-full px-4 py-3 pl-12 text-gray-800 placeholder:text-gray-400 bg-white border ${
                        errors.password ? "border-red-300" : "border-gray-300"
                      } rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200`}
                    />
                    <div className="absolute left-3 top-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  <p className="text-gray-500 text-xs mt-1">Gunakan kombinasi huruf, angka, dan simbol</p>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konfirmasi Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirm_password"
                      value={form.confirm_password}
                      onChange={handleChange}
                      placeholder="Ulangi password"
                      className={`w-full px-4 py-3 pl-12 text-gray-800 placeholder:text-gray-400 bg-white border ${
                        errors.confirm_password ? "border-red-300" : "border-gray-300"
                      } rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200`}
                    />
                    <div className="absolute left-3 top-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}
                </div>

                {/* Address Field (Full width) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                  <div className="relative">
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Masukkan alamat lengkap (opsional)"
                      className="w-full px-4 py-3 text-gray-800 placeholder:text-gray-400 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
                      rows="3"
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Alamat akan digunakan untuk pengiriman obat atau informasi medis</p>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="mt-6 mb-8">
                <div className="flex items-start">
                  <input type="checkbox" id="terms" className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 mt-1" required />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    Saya setuju dengan{" "}
                    <Link href="/terms" className="text-teal-600 hover:text-teal-800 font-medium">
                      Syarat & Ketentuan
                    </Link>{" "}
                    dan{" "}
                    <Link href="/privacy" className="text-teal-600 hover:text-teal-800 font-medium">
                      Kebijakan Privasi
                    </Link>{" "}
                    SentraCare
                  </label>
                </div>
              </div>

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
                    Membuat Akun...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Daftar Sekarang
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Sudah punya akun?{" "}
                <Link href="/auth/login" className="text-teal-600 hover:text-teal-800 font-semibold transition duration-200">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} SentraCare. Hak Cipta Dilindungi.</p>
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
