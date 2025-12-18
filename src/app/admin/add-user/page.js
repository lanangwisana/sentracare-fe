"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ViewAllUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // State untuk form Add User
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    fullName: "",
    role: "Perawat",
    status: "Active",
    password: "",
    confirmPassword: "",
  });

  // Data dummy untuk contoh (ganti dengan API call)
  const sampleUsers = [
    {
      id: 1,
      username: "dr_budi",
      email: "dr.budi@sentracare.local",
      fullName: "Dr. Budi Santoso",
      role: "Dokter",
      status: "Active",
      lastLogin: "2025-12-14 14:30:00",
      createdAt: "2025-11-01",
      avatarColor: "bg-blue-500",
    },
    // ... (data dummy lainnya tetap sama)
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Simulasi API call
        setTimeout(() => {
          setUsers(sampleUsers);
          setLoading(false);
        }, 500);
      } catch (error) {
        setErrorMsg("Failed to fetch users. Please try again.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Reset form Add User
  const resetNewUserForm = () => {
    setNewUser({
      username: "",
      email: "",
      fullName: "",
      role: "Perawat",
      status: "Active",
      password: "",
      confirmPassword: "",
    });
  };

  // Handle input change untuk form Add User
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit Add User
  const handleSubmitAddUser = async (e) => {
    e.preventDefault();

    // Validasi
    if (newUser.password !== newUser.confirmPassword) {
      setErrorMsg("Password dan konfirmasi password tidak cocok!");
      return;
    }

    if (!newUser.username || !newUser.email || !newUser.fullName || !newUser.password) {
      setErrorMsg("Harap isi semua field yang wajib diisi!");
      return;
    }

    try {
      // Simulasi API call untuk add user
      const newUserData = {
        id: users.length + 1,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        status: newUser.status,
        lastLogin: new Date().toISOString().split("T")[0] + " " + new Date().toTimeString().split(" ")[0],
        createdAt: new Date().toISOString().split("T")[0],
        avatarColor: getRandomColor(),
      };

      // Tambah user ke state (simulasi)
      setUsers((prev) => [newUserData, ...prev]);

      // Reset form dan tutup modal
      resetNewUserForm();
      setShowAddUserModal(false);

      // Tampilkan success message
      setErrorMsg(null);
      alert(`User ${newUser.fullName} berhasil ditambahkan!`);
    } catch (error) {
      setErrorMsg("Gagal menambahkan user. Silakan coba lagi.");
    }
  };

  // Helper function untuk warna acak
  const getRandomColor = () => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500", "bg-pink-500", "bg-yellow-500", "bg-indigo-500", "bg-teal-500", "bg-orange-500"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // ... (fungsi getStatusColor, getRoleColor, getInitials tetap sama)

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "superadmin":
        return "bg-red-100 text-red-800";
      case "dokter":
        return "bg-blue-100 text-blue-800";
      case "perawat":
        return "bg-green-100 text-green-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "resepsionis":
        return "bg-indigo-100 text-indigo-800";
      case "lab technician":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Filter users berdasarkan search dan filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.fullName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "Active").length,
    inactive: users.filter((u) => u.status === "Inactive").length,
    doctors: users.filter((u) => u.role === "Dokter").length,
    nurses: users.filter((u) => u.role === "Perawat").length,
    admins: users.filter((u) => u.role === "Admin" || u.role === "SuperAdmin").length,
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleToggleStatus = async (userId) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" } : user)));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>User Management - Admin Dashboard</title>
        <meta name="description" content="Manage all users in the system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header/Navbar */}
      <nav className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5z"
              />
            </svg>
          </div>
          <h1 className="font-bold text-2xl">
            SentraCare<span className="font-light"> Admin</span>
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="font-semibold">S</span>
            </div>
            <span className="font-medium">SuperAdmin</span>
          </div>
          <button
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full flex items-center space-x-2 transition duration-200"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userRole");
              localStorage.removeItem("username");
              router.push("/auth/login");
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">View and manage all users in the system</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/admin/dashboard-admin">
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200">← Back to Dashboard</button>
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50/90 px-5 py-4 text-red-700 shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Stats Cards - tetap sama */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">{/* ... stats cards tetap sama ... */}</div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search users by name, username, or email..."
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="all">All Roles</option>
                <option value="SuperAdmin">SuperAdmin</option>
                <option value="Dokter">Doctor</option>
                <option value="Perawat">Nurse</option>
                <option value="Admin">Admin</option>
                <option value="Resepsionis">Receptionist</option>
                <option value="Lab Technician">Lab Technician</option>
              </select>

              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>

              <button onClick={handleAddUser} className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add New User</span>
              </button>
            </div>
          </div>
        </div>

        {/* Users Table - tetap sama */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">{/* ... table tetap sama ... */}</div>

        {/* Quick Stats - tetap sama */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">{/* ... quick stats tetap sama ... */}</div>
      </main>

      {/* === MODAL ADD USER (DIPERBAIKI) === */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">Add New User</h3>
              <button
                onClick={() => {
                  resetNewUserForm();
                  setShowAddUserModal(false);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitAddUser} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={newUser.fullName}
                    onChange={handleNewUserChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
                    <input
                      type="text"
                      name="username"
                      value={newUser.username}
                      onChange={handleNewUserChange}
                      className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="username"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="user@sentracare.local"
                    required
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select name="role" value={newUser.role} onChange={handleNewUserChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                    <option value="Perawat">Nurse</option>
                    <option value="Dokter">Doctor</option>
                    <option value="Admin">Admin</option>
                    <option value="SuperAdmin">SuperAdmin</option>
                    <option value="Resepsionis">Receptionist</option>
                    <option value="Lab Technician">Lab Technician</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={newUser.status}
                    onChange={handleNewUserChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={newUser.confirmPassword}
                    onChange={handleNewUserChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Password Requirements */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <svg className={`w-4 h-4 mr-2 ${newUser.password.length >= 8 ? "text-green-500" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Minimum 8 characters
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    At least one uppercase letter
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    At least one number
                  </li>
                </ul>
              </div>

              {/* Form Actions */}
              <div className="mt-8 flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    resetNewUserForm();
                    setShowAddUserModal(false);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal - tetap sama */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit User: {selectedUser.fullName}</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-600 mb-4">Edit functionality is under development.</p>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal - tetap sama */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete user <strong>{selectedUser.fullName}</strong> (@{selectedUser.username})? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
                    setShowDeleteModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
