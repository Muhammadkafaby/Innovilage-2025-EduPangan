import React, { useState } from 'react';
import { dashboardStats, users, seedBankTransactions, vegetables } from '../../data/staticData';

/**
 * Admin Dashboard Component
 * Panel admin untuk mengelola sistem EduPangan
 * Features:
 * - Statistik keseluruhan
 * - Manajemen pengguna
 * - Manajemen stok bibit
 * - Laporan dan analytics
 */
const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState(null);

  // Sidebar Menu Items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Kelola Pengguna', icon: '👥' },
    { id: 'seeds', label: 'Stok Bibit', icon: '🌾' },
    { id: 'transactions', label: 'Transaksi', icon: '💳' },
    { id: 'reports', label: 'Laporan', icon: '📈' },
    { id: 'content', label: 'Konten Edukasi', icon: '📚' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🌱</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-lg">EduPangan</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all ${activeMenu === item.id
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-800">Admin BUMDes</p>
              <p className="text-xs text-gray-500">admin@edupangan.id</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">⚙️</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white shadow-sm px-8 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {menuItems.find((m) => m.id === activeMenu)?.label}
              </h2>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <button className="bg-green-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-600 transition-colors">
              + Tambah Data
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">👥</span>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                      +{dashboardStats.weeklyGrowth}%
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">
                    {dashboardStats.totalUsers}
                  </h3>
                  <p className="text-sm text-gray-600">Total Pengguna</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {dashboardStats.activeUsers} aktif minggu ini
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">✅</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">
                    {dashboardStats.totalHarvest} kg
                  </h3>
                  <p className="text-sm text-gray-600">Total Panen</p>
                  <p className="text-xs text-gray-500 mt-1">Bulan ini</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">🌾</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">
                    {dashboardStats.seedBankStock}
                  </h3>
                  <p className="text-sm text-gray-600">Stok Bibit</p>
                  <p className="text-xs text-gray-500 mt-1">15 jenis tersedia</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">💰</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">
                    Rp {dashboardStats.monthlyContribution.toLocaleString()}
                  </h3>
                  <p className="text-sm text-gray-600">Iuran Bulanan</p>
                  <p className="text-xs text-gray-500 mt-1">Januari 2025</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Chart */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Aktivitas Pengguna</h3>
                  <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Chart: Line graph aktivitas 7 hari terakhir</p>
                  </div>
                </div>

                {/* Top Vegetables */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Bibit Terpopuler</h3>
                  <div className="space-y-3">
                    {vegetables.slice(0, 5).map((veg, idx) => (
                      <div key={veg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">🌿</span>
                          <div>
                            <p className="font-semibold text-sm">{veg.name}</p>
                            <p className="text-xs text-gray-600">{veg.category}</p>
                          </div>
                        </div>
                        <span className="font-bold text-green-600">{veg.stockAvailable}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-800 mb-4">Aktivitas Terbaru</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Waktu</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Pengguna</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Aktivitas</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-600">10:{i}0 WIB</td>
                          <td className="py-3 px-4 text-sm font-medium">Ibu Siti</td>
                          <td className="py-3 px-4 text-sm text-gray-700">Catat panen bayam 2.5kg</td>
                          <td className="py-3 px-4">
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                              Selesai
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'users' && (
            <div className="space-y-6">
              {/* User Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h4 className="text-sm text-gray-600 mb-2">Total Pengguna</h4>
                  <p className="text-3xl font-bold text-gray-800">{users.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h4 className="text-sm text-gray-600 mb-2">Pengguna Aktif</h4>
                  <p className="text-3xl font-bold text-green-600">{users.filter(u => u.totalHarvest > 0).length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h4 className="text-sm text-gray-600 mb-2">Kader PKK</h4>
                  <p className="text-3xl font-bold text-orange-600">{users.filter(u => u.role === 'kader').length}</p>
                </div>
              </div>

              {/* User Table */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Daftar Pengguna</h3>
                  <input
                    type="text"
                    placeholder="Cari pengguna..."
                    className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-green-500"
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nama</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">No. HP</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">RW</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total Panen</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <span>👤</span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.joinDate}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">{user.phone}</td>
                          <td className="py-3 px-4 text-sm font-medium">{user.rw}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'kader'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-blue-100 text-blue-700'
                              }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm font-bold text-green-600">{user.totalHarvest} kg</td>
                          <td className="py-3 px-4">
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                              Detail →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'seeds' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-800 mb-4">Manajemen Stok Bibit</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vegetables.map((veg) => (
                    <div key={veg.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-gray-800">{veg.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${veg.stockAvailable > 100 ? 'bg-green-100 text-green-700' :
                            veg.stockAvailable > 50 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                          }`}>
                          {veg.stockAvailable}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{veg.category}</p>
                      <p className="text-sm font-semibold text-green-600 mb-3">Rp {veg.price.toLocaleString()}/bibit</p>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-green-500 text-white py-2 rounded-lg text-xs font-semibold hover:bg-green-600">
                          + Stok
                        </button>
                        <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'transactions' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-4">Riwayat Transaksi</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tanggal</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Pengguna</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Jenis</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Bibit</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Jumlah</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Iuran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seedBankTransactions.map((trans) => (
                      <tr key={trans.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">{new Date(trans.date).toLocaleDateString('id-ID')}</td>
                        <td className="py-3 px-4 text-sm font-medium">
                          {users.find(u => u.id === trans.userId)?.name}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${trans.transactionType === 'ambil'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-green-100 text-green-700'
                            }`}>
                            {trans.transactionType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">{trans.vegetableName}</td>
                        <td className="py-3 px-4 text-sm font-medium">{trans.quantity} bibit</td>
                        <td className="py-3 px-4 text-sm font-bold text-green-600">
                          Rp {(trans.contributionPaid || trans.contributionReceived || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
