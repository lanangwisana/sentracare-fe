"use client";
import React, { useState, useEffect, useMemo } from "react";
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
  const [successMsg, setSuccessMsg] = useState(null);

  // State untuk form Add User
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    role: "Dokter",
    status: "Active",
    password: "",
    confirmPassword: "",
  });

  // State untuk form Edit User
  const [editUserForm, setEditUserForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    role: "Dokter",
    status: "Active",
  });

  // State untuk toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // State untuk edit form
  const [editFormError, setEditFormError] = useState(null);
  const [editFormSuccess, setEditFormSuccess] = useState(null);
  const API_BASE = "http://localhost:8088";
  // --- LOGIKA TAMBAHAN: HELPER PARSING ERROR ---
  const getErrorMessage = (errData) => {
    if (!errData || !errData.detail) return "An unknown error occurred";
    if (typeof errData.detail === "string") return errData.detail;
    if (Array.isArray(errData.detail)) {
      return errData.detail.map((e) => `${e.loc[e.loc.length - 1]}: ${e.msg}`).join(", ");
    }
    return JSON.stringify(errData.detail);
  };

  // Function fetch data users dari API
  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("Token missing. Please login.");
        setLoading(false);
        router.push("/auth/login");
        return;
      }

      // Gunakan endpoint REST dari backend auth service
      // http://localhost:8002/auth/admin/users
      // ${API_BASE}/auth/admin/users
      const res = await fetch(`${API_BASE}/auth/admin/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          setErrorMsg("Unauthorized. Please login again.");
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }
        if (res.status === 403) {
          setErrorMsg("Forbidden. You don't have permission to view users.");
          return;
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(getErrorMessage(errorData) || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      // Transform data dari API ke format frontend
      const formattedUsers = data.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        phoneNumber: user.phone_number || "",
        role: user.role,
        // LOGIKA: Normalisasi status agar sinkron dengan dropdown modal
        status: user.status === "ACTIVE" ? "Active" : user.status === "INACTIVE" ? "Inactive" : user.status,
        lastLogin: formatDate(user.last_login),
        createdAt: formatDate(user.created_at),
        avatarColor: getAvatarColor(user.role),
      }));

      setUsers(formattedUsers);
    } catch (err) {
      console.error("Fetch error:", err);
      setErrorMsg(`Error fetching users: ${err?.message || "Please check your connection"}`);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Panggil fetchUsers dalam async function
    const loadData = async () => {
      await fetchUsers();
    };

    loadData();
  }, []);

  // Handle input change untuk form Add User
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle input change untuk form Edit User
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit Add User
  const handleSubmitAddUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validasi
    if (newUser.password !== newUser.confirmPassword) {
      setErrorMsg("Password dan konfirmasi password tidak cocok!");
      setIsSubmitting(false);
      return;
    }

    if (!newUser.username || !newUser.email || !newUser.fullName || !newUser.password || !newUser.phoneNumber) {
      setErrorMsg("Harap isi semua field yang wajib diisi!");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("Token missing. Please login.");
        setIsSubmitting(false);
        router.push("/auth/login");
        return;
      }
      const userData = {
        full_name: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        phone_number: newUser.phoneNumber,
        password: newUser.password,
        role: newUser.role,
        status: newUser.status,
      };
      // http://localhost:8002/auth/admin/create-user
      // ${API_BASE}/auth/admin/create-user
      const res = await fetch(`${API_BASE}/auth/admin/create-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(getErrorMessage(errorData) || `Failed to create user: ${res.status}`);
      }

      await fetchUsers(); // Refresh data agar ID dan format sinkron

      // Reset form dan tutup modal
      resetNewUserForm();
      setShowPassword(false);
      setShowConfirmPassword(false);
      setShowAddUserModal(false);

      // Tampilkan success message
      setErrorMsg(null);
      alert(`User ${newUser.fullName} berhasil ditambahkan!`);
    } catch (error) {
      console.error("Error creating user:", error);
      setErrorMsg(error.message || "Gagal menambahkan user. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function untuk warna acak
  const getRandomColor = () => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500", "bg-pink-500", "bg-yellow-500", "bg-indigo-500", "bg-teal-500", "bg-orange-500"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Reset form Add User
  const resetNewUserForm = () => {
    setNewUser({
      username: "",
      email: "",
      fullName: "",
      phoneNumber: "",
      role: "Dokter",
      status: "Active",
      password: "",
      confirmPassword: "",
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role) => {
    if (!role) return "bg-gray-100 text-gray-800";
    const normalizedRole = role.toUpperCase();
    switch (normalizedRole) {
      case "SUPERADMIN":
        return "bg-red-100 text-red-800";
      case "DOKTER":
        return "bg-blue-100 text-blue-800";
      case "PASIEN":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarColor = (role) => {
    const colorMap = {
      SuperAdmin: "bg-red-500",
      Dokter: "bg-blue-500",
      Pasien: "bg-green-500",
    };
    return colorMap[role] || "bg-gray-500";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Filter users berdasarkan search dan filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.fullName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Stats calculation dari data real
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "Active" || u.status === "ACTIVE").length;
    const inactive = users.filter((u) => u.status === "Inactive" || u.status === "INACTIVE").length;
    const doctors = users.filter((u) => u.role === "Dokter").length;
    const superAdmins = users.filter((u) => u.role === "SuperAdmin").length;
    const patients = users.filter((u) => u.role === "Pasien").length;

    return { total, active, inactive, doctors, superAdmins, patients };
  }, [users]);

  // Handle edit user - buka modal dan set data user yang dipilih
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditUserForm({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      role: user.role,
      // LOGIKA: Samakan dengan value dropdown
      status: user.status === "Active" || user.status === "ACTIVE" ? "Active" : "Inactive",
    });
    setEditFormError(null);
    setEditFormSuccess(null);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  // --- LOGIKA UPDATE STATUS (TOGGLE) ---
  const handleToggleStatus = async (userId, currentStatus) => {
    setUpdatingId(userId);
    setErrorMsg(null);

    try {
      const token = localStorage.getItem("token");
      const userToUpdate = users.find((u) => u.id === userId);

      // PERBAIKAN: Gunakan format yang Backend minta (Case Sensitive)
      const newStatus = currentStatus === "Active" || currentStatus === "ACTIVE" ? "Inactive" : "Active";
      // http://localhost:8002/auth/admin/update-user/${userId}
      // ${API_BASE}/auth/admin/update-user/${userId}
      const res = await fetch(`${API_BASE}/auth/admin/update-user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          full_name: userToUpdate.fullName,
          username: userToUpdate.username,
          email: userToUpdate.email,
          status: newStatus,
          role: userToUpdate.role,
          phone_number: userToUpdate.phoneNumber,
        }),
      });

      if (!res.ok) throw new Error(getErrorMessage(await res.json()));
      fetchUsers();
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // --- LOGIKA DELETE PERMANEN ---
  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    setUpdatingId(selectedUser.id);
    try {
      const token = localStorage.getItem("token");
      // http://localhost:8002/auth/admin/delete-user/${selectedUser.id}
      // ${API_BASE}/auth/admin/delete-user/${selectedUser.id}
      const res = await fetch(`${API_BASE}/auth/admin/delete-user/${selectedUser.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(getErrorMessage(await res.json()));

      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setSuccessMsg(`User ${selectedUser.fullName} berhasil dihapus!`);
      setShowDeleteModal(false);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // --- LOGIKA UPDATE USER (FORM) ---
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setEditFormError(null);

    try {
      const token = localStorage.getItem("token");
      // PERBAIKAN: Gunakan status langsung dari state ("Active"/"Inactive") agar lolos validasi Backend
      const updateData = {
        full_name: editUserForm.fullName,
        username: editUserForm.username,
        email: editUserForm.email,
        phone_number: editUserForm.phoneNumber || "",
        role: editUserForm.role,
        status: editUserForm.status,
      };
      // http://localhost:8002/auth/admin/update-user/${selectedUser.id}
      // ${API_BASE}/auth/admin/update-user/${selectedUser.id}
      const res = await fetch(`${API_BASE}/auth/admin/update-user/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(getErrorMessage(errorData));
      }

      setEditFormSuccess(`User ${editUserForm.fullName} berhasil diupdate!`);
      setTimeout(() => {
        setShowEditModal(false);
        fetchUsers();
      }, 1500);
    } catch (error) {
      setEditFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Refresh data users
  const handleRefresh = () => {
    fetchUsers();
    setSuccessMsg("Data users berhasil di-refresh!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showAddUserModal || showEditModal || showDeleteModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showAddUserModal, showEditModal, showDeleteModal]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>User Management - Admin Dashboard</title>
        <meta name="description" content="Manage all users in the system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header/Navbar */}
      <nav className="bg-linear-to-r from-teal-600 to-emerald-700 text-white p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-bold text-2xl">
            SentraCare<span className="font-light"> Admin</span>
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="font-semibold text-white">S</span>
            </div>
            <span className="font-medium text-white">SuperAdmin</span>
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
            <span className="text-white">Logout</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">View and manage all users in the system</p>
            <p className="text-sm text-blue-600 mt-1">Data dinamis dari API: {users.length} user(s) loaded</p>
          </div>
          <div className="flex space-x-4">
            <button onClick={handleRefresh} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            <Link href="/admin/dashboard-admin">
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200">← Back to Dashboard</button>
            </Link>
          </div>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50/90 px-5 py-4 text-green-700 shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{successMsg}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50/90 px-5 py-4 text-red-700 shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Error: {errorMsg}</span>
            </div>
            <button onClick={fetchUsers} className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50/90 px-5 py-4 text-blue-700 shadow-sm">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <span className="font-medium">Fetching users data from API...</span>
            </div>
          </div>
        )}

        {/* Stats Cards - DATA DINAMIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-3">Live data from database</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Active Users</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.active}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-green-500 text-sm mt-3">Currently active</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Doctors</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.doctors}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-3">Medical staff</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Super Admins</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.superAdmins}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-3">Administrative staff</p>
          </div>
        </div>

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
                <option value="SuperAdmin">Super Admin</option>
                <option value="Dokter">Doctor</option>
                <option value="Pasien">Patient</option>
              </select>

              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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

        {/* Users Table - DATA DINAMIS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">All Users ({users.length})</h2>
              <div className="text-sm text-gray-500">
                Showing <span className="font-semibold">{filteredUsers.length}</span> of <span className="font-semibold">{users.length}</span> users
                {users.length > 0 && <span className="ml-2 text-green-600">✓ Live from API</span>}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username / Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                      <p className="mt-2 text-gray-500">Loading users data from API...</p>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5z"
                          />
                        </svg>
                        <p className="text-lg font-medium text-gray-700">No users found</p>
                        <p className="text-gray-500 mt-1">Try adding a new user or check your API connection</p>
                        <button onClick={fetchUsers} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          Retry Loading
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                      No users found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-10 w-10 rounded-full ${user.avatarColor} flex items-center justify-center text-white font-semibold`}>{getInitials(user.fullName)}</div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                            <div className="text-sm text-gray-500">ID: #{user.id.toString().padStart(3, "0")}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">@{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400 mt-1">Joined: {user.createdAt}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>{user.role}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>{user.status}</span>
                          <button
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            className="ml-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={`Toggle ${user.status === "Active" ? "Inactive" : "Active"}`}
                            disabled={updatingId === user.id}
                          >
                            {updatingId === user.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button onClick={() => handleEditUser(user)} className="text-blue-600 hover:text-blue-900 disabled:opacity-50" title="Edit User" disabled={updatingId === user.id}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => handleDeleteUser(user)} className="text-red-600 hover:text-red-900 disabled:opacity-50" title="Delete User" disabled={updatingId === user.id}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredUsers.length ? 1 : 0}</span> to <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">API Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Data Source</p>
                  <p className="text-sm text-gray-500">Connected to: http://localhost:8002/auth/admin/users</p>
                  <p className="text-xs text-gray-400 mt-1">Last fetched: Just now</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Total Records</p>
                  <p className="text-sm text-gray-500">{users.length} user(s) loaded from database</p>
                  <p className="text-xs text-gray-400 mt-1">Real-time data</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={handleRefresh} className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                <span className="text-sm font-medium text-gray-700">Refresh Data</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button onClick={handleAddUser} className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                <span className="text-sm font-medium text-gray-700">Add New User</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150">
                <span className="text-sm font-medium text-gray-700">Export User List</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* === MODAL ADD USER === */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300 overflow-y-auto">
          <div
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg border border-white/20 my-8"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100/50 flex justify-between items-center bg-linear-to-r from-white to-gray-50/50 rounded-t-2xl sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Add New User</h3>
                <p className="text-sm text-gray-500 mt-1">Create a new user account in the system</p>
              </div>
              <button
                onClick={() => {
                  resetNewUserForm();
                  setShowPassword(false);
                  setShowConfirmPassword(false);
                  setShowAddUserModal(false);
                }}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 p-2 rounded-full transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitAddUser} className="p-8">
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <div className="flex items-center mb-3">
                    <div className="w-2 h-5 bg-linear-to-b from-blue-500 to-blue-600 rounded-full mr-3"></div>
                    <label className="text-sm font-semibold text-gray-700 tracking-wide">
                      Full Name
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={newUser.fullName}
                    onChange={handleNewUserChange}
                    className="w-full px-5 py-3.5 bg-white border border-gray-200/80 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400 text-gray-800 shadow-sm"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                {/* Username and Email Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide">
                      Username
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">@</div>
                      <input
                        type="text"
                        name="username"
                        value={newUser.username}
                        onChange={handleNewUserChange}
                        className="w-full pl-10 pr-5 py-3.5 bg-white border border-gray-200/80 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400 text-gray-800 shadow-sm"
                        placeholder="username"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide">
                      Email
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newUser.email}
                      onChange={handleNewUserChange}
                      className="w-full px-5 py-3.5 bg-white border border-gray-200/80 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400 text-gray-800 shadow-sm"
                      placeholder="user@sentracare.local"
                      required
                    />
                  </div>
                </div>

                {/* Role and Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Role - Hanya 3 pilihan */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide">
                      Role
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="role"
                        value={newUser.role}
                        onChange={handleNewUserChange}
                        className="w-full px-5 py-3.5 bg-white border border-gray-200/80 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none text-gray-800 shadow-sm cursor-pointer pr-10"
                        required
                      >
                        <option value="SuperAdmin">Super Admin</option>
                        <option value="Dokter">Doctor</option>
                        <option value="Pasien">Patient</option>
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Status - Hanya 2 pilihan */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide">
                      Status
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="status"
                        value={newUser.status}
                        onChange={handleNewUserChange}
                        className="w-full px-5 py-3.5 bg-white border border-gray-200/80 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none text-gray-800 shadow-sm cursor-pointer pr-10"
                        required
                      >
                        <option value="Active" className="text-green-600">
                          Active
                        </option>
                        <option value="Inactive" className="text-gray-600">
                          Inactive
                        </option>
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <div className="flex items-center mb-3">
                    <div className="w-2 h-5 bg-linear-to-b from-blue-500 to-blue-600 rounded-full mr-3"></div>
                    <label className="text-sm font-semibold text-gray-700 tracking-wide">
                      Phone Number
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={newUser.phoneNumber}
                      onChange={handleNewUserChange}
                      className="w-full pl-12 pr-5 py-3.5 bg-white border border-gray-200/80 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400 text-gray-800 shadow-sm"
                      placeholder="+62 812-3456-7890"
                      required
                    />
                  </div>
                </div>

                {/* Password Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide">
                      Password
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={newUser.password}
                        onChange={handleNewUserChange}
                        className="w-full px-5 py-3.5 bg-white border border-gray-200/80 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400 text-gray-800 tracking-wider shadow-sm pr-12"
                        placeholder="••••••••"
                        required
                      />
                      <button type="button" onClick={togglePasswordVisibility} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide">
                      Confirm Password
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={newUser.confirmPassword}
                        onChange={handleNewUserChange}
                        className="w-full px-5 py-3.5 bg-white border border-gray-200/80 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400 text-gray-800 tracking-wider shadow-sm pr-12"
                        placeholder="••••••••"
                        required
                      />
                      <button type="button" onClick={toggleConfirmPasswordVisibility} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
                        {showConfirmPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {newUser.password && (
                  <div className="p-4 bg-linear-to-r from-gray-50/80 to-white border border-gray-100 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Password Strength</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${newUser.password.length >= 8 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {newUser.password.length >= 8 ? "Strong" : "Weak"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full transition-all duration-300 ${newUser.password.length >= 8 ? "bg-green-500 w-full" : "bg-yellow-500 w-1/2"}`}></div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className={`flex items-center text-xs ${newUser.password.length >= 8 ? "text-green-600" : "text-gray-500"}`}>
                        <div className={`w-3 h-3 rounded-full mr-2 ${newUser.password.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}></div>
                        8+ characters
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <div className="w-3 h-3 rounded-full mr-2 bg-gray-300"></div>
                        Uppercase letter
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <div className="w-3 h-3 rounded-full mr-2 bg-gray-300"></div>
                        Number
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <div className="w-3 h-3 rounded-full mr-2 bg-gray-300"></div>
                        Special character
                      </div>
                    </div>
                  </div>
                )}

                {/* Password Match Indicator */}
                {newUser.password && newUser.confirmPassword && (
                  <div className={`p-3 rounded-lg border ${newUser.password === newUser.confirmPassword ? "bg-green-50/80 border-green-200" : "bg-red-50/80 border-red-200"}`}>
                    <div className="flex items-center">
                      {newUser.password === newUser.confirmPassword ? (
                        <>
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium text-green-700">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium text-red-700">Passwords do not match</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="mt-10 pt-6 border-t border-gray-100/50 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    resetNewUserForm();
                    setShowPassword(false);
                    setShowConfirmPassword(false);
                    setShowAddUserModal(false);
                  }}
                  className="px-8 py-3.5 border border-gray-300/80 rounded-xl text-gray-700 hover:bg-gray-50/80 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm hover:shadow"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3.5 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center space-x-2 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Add User to Database</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === MODAL EDIT USER === */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300 overflow-y-auto">
          <div
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg border border-white/20 my-8"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100/50 flex justify-between items-center bg-linear-to-r from-white to-gray-50/50 rounded-t-2xl sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Edit User</h3>
                <p className="text-sm text-gray-500 mt-1">Update user account information</p>
                <p className="text-xs text-blue-600 mt-1">User ID: #{selectedUser.id.toString().padStart(3, "0")}</p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                  setEditFormError(null);
                }}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 p-2 rounded-full transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Success Message */}
            {editFormSuccess && (
              <div className="mx-8 mt-6 rounded-lg border border-green-200 bg-green-50/90 px-5 py-4 text-green-700">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{editFormSuccess}</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {editFormError && (
              <div className="mx-8 mt-6 rounded-lg border border-red-200 bg-red-50/90 px-5 py-4 text-red-700">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{editFormError}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="p-8">
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <div className="flex items-center mb-3">
                    <div className="w-2 h-5 bg-linear-to-b from-blue-500 to-blue-600 rounded-full mr-3"></div>
                    <label className="text-sm font-semibold text-gray-700 tracking-wide">
                      Full Name
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={editUserForm.fullName}
                    onChange={handleEditFormChange}
                    className="w-full px-5 py-3.5 bg-white border border-gray-200/80 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400 text-gray-800 shadow-sm"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                {/* Username and Email Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide">
                      Username
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">@</div>
                      <input
                        type="text"
                        name="username"
                        value={editUserForm.username}
                        onChange={handleEditFormChange}
                        className="w-full pl-10 pr-5 py-3.5 bg-white border border-gray-200/80 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400 text-gray-800 shadow-sm"
                        placeholder="username"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide">
                      Email
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editUserForm.email}
                      onChange={handleEditFormChange}
                      className="w-full px-5 py-3.5 bg-white border border-gray-200/80 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400 text-gray-800 shadow-sm"
                      placeholder="user@sentracare.local"
                      required
                    />
                  </div>
                </div>

                {/* Role and Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Role */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide">
                      Role
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="role"
                        value={editUserForm.role}
                        onChange={handleEditFormChange}
                        className="w-full px-5 py-3.5 bg-white border border-gray-200/80 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none text-gray-800 shadow-sm cursor-pointer pr-10"
                        required
                      >
                        <option value="SuperAdmin">Super Admin</option>
                        <option value="Dokter">Doctor</option>
                        <option value="Pasien">Patient</option>
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide">
                      Status
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="status"
                        value={editUserForm.status}
                        onChange={handleEditFormChange}
                        className="w-full px-5 py-3.5 bg-white border border-gray-200/80 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none text-gray-800 shadow-sm cursor-pointer pr-10"
                        required
                      >
                        <option value="Active" className="text-green-600">
                          Active
                        </option>
                        <option value="Inactive" className="text-gray-600">
                          Inactive
                        </option>
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <div className="flex items-center mb-3">
                    <div className="w-2 h-5 bg-linear-to-b from-blue-500 to-blue-600 rounded-full mr-3"></div>
                    <label className="text-sm font-semibold text-gray-700 tracking-wide">Phone Number</label>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={editUserForm.phoneNumber}
                      onChange={handleEditFormChange}
                      className="w-full pl-12 pr-5 py-3.5 bg-white border border-gray-200/80 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400 text-gray-800 shadow-sm"
                      placeholder="+62 812-3456-7890"
                    />
                  </div>
                </div>

                {/* Note about password */}
                <div className="p-4 bg-yellow-50/80 border border-yellow-200 rounded-xl">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Password Information</p>
                      <p className="text-xs text-yellow-700 mt-1">For security reasons, password cannot be changed here. Use the `Reset Password` feature if needed.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-10 pt-6 border-t border-gray-100/50 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                    setEditFormError(null);
                  }}
                  className="px-8 py-3.5 border border-gray-300/80 rounded-xl text-gray-700 hover:bg-gray-50/80 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm hover:shadow"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3.5 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center space-x-2 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Updating User...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-600 mb-4">
                Are you sure you want to permanently delete user <strong>{selectedUser.fullName}</strong> (@{selectedUser.username})?
                <br />
                <br />
                <span className="text-red-600 font-medium">This action cannot be undone and will remove the user from the database permanently.</span>
              </p>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50" disabled={updatingId === selectedUser.id}>
                  Cancel
                </button>
                <button onClick={handleDeleteConfirm} disabled={updatingId === selectedUser.id} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2">
                  {updatingId === selectedUser.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete Permanently</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
