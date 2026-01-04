// app/page.js
import React from "react";
import Link from "next/link";

// Ikon SVG sederhana
const HospitalIcon = () => (
  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
  </svg>
);

const MedicalIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
    ></path>
  </svg>
);

const DoctorIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    ></path>
  </svg>
);

const FileIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    ></path>
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    ></path>
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
  </svg>
);

const MapIcon = () => (
  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4 ml-2 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
  </svg>
);

// Data layanan
const services = [
  {
    icon: <MedicalIcon />,
    title: "Konsultasi Medis",
    description: "Konsultasi dengan dokter spesialis untuk diagnosa dan pengobatan yang tepat",
  },
  {
    icon: <CalendarIcon />,
    title: "Manajemen Janji",
    description: "Sistem pemesanan janji yang mudah dan fleksibel untuk kenyamanan pasien",
  },
  {
    icon: <FileIcon />,
    title: "Rekam Medis Digital",
    description: "Penyimpanan data kesehatan elektronik yang aman dan terintegrasi",
  },
  {
    icon: <DoctorIcon />,
    title: "Laboratorium & Diagnostik",
    description: "Fasilitas pemeriksaan lengkap dengan teknologi terkini",
  },
  {
    icon: <HospitalIcon />,
    title: "Perawatan Rawat Jalan",
    description: "Layanan perawatan medis tanpa perlu rawat inap",
  },
  {
    icon: <ShieldIcon />,
    title: "Pencegahan & Vaksinasi",
    description: "Program kesehatan preventif dan imunisasi untuk semua usia",
  },
];

// Data keunggulan
const advantages = ["Tim dokter spesialis berpengalaman", "Teknologi medis terkini", "Layanan 24/7 untuk keadaan darurat", "Asuransi kesehatan diterima", "Fasilitas lengkap dan modern", "Lokasi strategis dan mudah dijangkau"];

const SentraCareLandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <MedicalIcon className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-emerald-600">SentraCare</h1>
                <p className="text-sm text-gray-500">Klinik Kesehatan Terpadu</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#tentang" className="text-gray-700 hover:text-emerald-600 font-medium">
                Tentang
              </a>
              <a href="#layanan" className="text-gray-700 hover:text-emerald-600 font-medium">
                Layanan
              </a>
              <a href="#fasilitas" className="text-gray-700 hover:text-emerald-600 font-medium">
                Fasilitas
              </a>
              <a href="#kontak" className="text-gray-700 hover:text-emerald-600 font-medium">
                Kontak
              </a>
              <Link href="/auth/login" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">
                Masuk Sistem
              </Link>
            </div>
            <button className="md:hidden text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-emerald-600 to-emerald-700 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Pelayanan Kesehatan <span className="text-emerald-200">Terbaik</span> untuk Anda dan Keluarga
              </h1>
              <p className="text-lg text-emerald-100 mb-8">SentraCare adalah klinik kesehatan terpadu yang menyediakan layanan medis komprehensif dengan standar tinggi dan perhatian personal untuk setiap pasien.</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/auth/login" className="px-6 py-3 bg-white text-emerald-600 hover:bg-emerald-50 rounded-lg font-semibold transition-colors flex items-center">
                  Buat Janji Konsultasi
                  <ArrowRightIcon />
                </Link>
                <a href="#layanan" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg font-semibold transition-colors">
                  Lihat Layanan Kami
                </a>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 lg:w-80 lg:h-80 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                  <div className="text-center">
                    <HospitalIcon className="w-20 h-20 mx-auto mb-4" />
                    <p className="text-xl font-semibold">SentraCare</p>
                    <p className="text-emerald-200 mt-2">Healthcare Excellence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tentang Kami Section */}
      <div id="tentang" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Tentang SentraCare</h2>
          <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            SentraCare didirikan dengan visi untuk memberikan layanan kesehatan yang komprehensif, terjangkau, dan berkualitas tinggi. Dengan fasilitas modern dan tim medis berpengalaman, kami berkomitmen untuk menjadi mitra kesehatan
            terpercaya bagi masyarakat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-emerald-50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Tim Profesional</h3>
            <p className="text-gray-600">Dokter spesialis dan tenaga medis berpengalaman yang siap memberikan perawatan terbaik</p>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldIcon className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Standar Tinggi</h3>
            <p className="text-gray-600">Mengikuti standar pelayanan kesehatan internasional dengan teknologi terkini</p>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HospitalIcon className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Fasilitas Lengkap</h3>
            <p className="text-gray-600">Dilengkapi dengan peralatan medis modern dan ruang perawatan yang nyaman</p>
          </div>
        </div>
      </div>

      {/* Layanan Section */}
      <div id="layanan" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Layanan Kami</h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">Berbagai layanan kesehatan komprehensif yang kami sediakan untuk memenuhi kebutuhan medis Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
                <div className="p-3 bg-emerald-100 rounded-lg w-fit mb-4">
                  <div className="text-emerald-600">{service.icon}</div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fasilitas Section */}
      <div id="fasilitas" className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Mengapa Memilih SentraCare?</h2>
            <p className="text-gray-600 mb-8">Kami berkomitmen untuk memberikan pengalaman terbaik dalam setiap layanan kesehatan yang kami berikan. Dari konsultasi hingga perawatan lanjutan, kami hadir untuk Anda.</p>

            <div className="space-y-4">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-start">
                  <CheckIcon />
                  <span className="ml-3 text-gray-700">{advantage}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link href="/auth/login" className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors">
                Buat Janji Sekarang
                <ArrowRightIcon />
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="bg-emerald-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">50+</div>
                  <p className="text-gray-600">Dokter Spesialis</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">24/7</div>
                  <p className="text-gray-600">Layanan Darurat</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">10+</div>
                  <p className="text-gray-600">Tahun Pengalaman</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">15+</div>
                  <p className="text-gray-600">Kamar Perawatan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-emerald-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Siap Menjaga Kesehatan Anda?</h2>
          <p className="text-lg text-emerald-100 mb-8">Jadwalkan konsultasi dengan dokter spesialis kami hari ini dan dapatkan pelayanan kesehatan terbaik untuk Anda dan keluarga.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login" className="px-8 py-3 bg-white text-emerald-600 hover:bg-emerald-50 rounded-lg font-semibold transition-colors">
              Buat Janji Online
            </Link>
            <a href="#kontak" className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg font-semibold transition-colors">
              Hubungi Kami
            </a>
          </div>
        </div>
      </div>

      {/* Kontak Section */}
      <div id="kontak" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Hubungi Kami</h2>
          <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-3xl mx-auto">Kami siap membantu kebutuhan kesehatan Anda. Jangan ragu untuk menghubungi kami</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PhoneIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Telepon</h3>
            <p className="text-gray-600">(021) 1234-5678</p>
            <p className="text-sm text-gray-500 mt-1">Senin - Minggu, 24 Jam</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MailIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600">info@sentracare.com</p>
            <p className="text-sm text-gray-500 mt-1">Respon dalam 24 jam</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Lokasi</h3>
            <p className="text-gray-600">Jl. Kesehatan No. 123, Jakarta</p>
            <p className="text-sm text-gray-500 mt-1">Buka Setiap Hari</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-emerald-600 rounded-lg">
                  <MedicalIcon />
                </div>
                <div>
                  <h3 className="text-xl font-bold">SentraCare</h3>
                  <p className="text-emerald-300 text-sm">Klinik Kesehatan Terpadu</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">Memberikan layanan kesehatan terbaik dengan standar tinggi dan perhatian personal.</p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Layanan</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#layanan" className="text-gray-400 hover:text-white transition-colors">
                    Konsultasi Medis
                  </a>
                </li>
                <li>
                  <a href="#layanan" className="text-gray-400 hover:text-white transition-colors">
                    Laboratorium
                  </a>
                </li>
                <li>
                  <a href="#layanan" className="text-gray-400 hover:text-white transition-colors">
                    Vaksinasi
                  </a>
                </li>
                <li>
                  <a href="#layanan" className="text-gray-400 hover:text-white transition-colors">
                    Medical Checkup
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Tautan Cepat</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/semua-janji" className="text-gray-400 hover:text-white transition-colors">
                    Buat Janji
                  </Link>
                </li>
                <li>
                  <Link href="/semua-rekam-medis" className="text-gray-400 hover:text-white transition-colors">
                    Rekam Medis
                  </Link>
                </li>
                <li>
                  <a href="#tentang" className="text-gray-400 hover:text-white transition-colors">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#kontak" className="text-gray-400 hover:text-white transition-colors">
                    Kontak
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Jam Operasional</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Senin - Jumat: 07:00 - 21:00</li>
                <li>Sabtu - Minggu: 08:00 - 18:00</li>
                <li className="text-emerald-300">Layanan Darurat: 24/7</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} SentraCare. All rights reserved.</p>
            <p className="text-gray-500 text-sm mt-2">Jl. Kesehatan No. 123, Jakarta | (021) 1234-5678 | info@sentracare.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SentraCareLandingPage;
