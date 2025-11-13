import React, { useState } from 'react';
import { dashboardStats, gardenActivities, notifications } from '../../data/dummyData';

/**
 * Dashboard Component
 * Halaman utama aplikasi mobile dengan:
 * - Status Kebun
 * - Quick Actions
 * - Statistik Personal
 * - Notifikasi
 * - Bottom Navigation
 */
const Dashboard = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('home');

  // Mock user garden data
  const userGarden = {
    activePlants: 12,
    readyToHarvest: 2,
    totalHarvest: 45.5,
    seedBankContribution: 8500,
  };

  // Recent activities
  const recentActivities = gardenActivities.slice(0, 3);

  // Unread notifications
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 pt-8 pb-24 px-6 rounded-b-[2.5rem] shadow-lg">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-green-100 text-sm">Selamat Datang,</p>
            <h2 className="text-white text-xl font-bold">{user?.name || 'Ibu Siti'}</h2>
          </div>
          <button
            onClick={() => onNavigate('notifications')}
            className="relative bg-white/20 p-3 rounded-full"
          >
            <span className="text-2xl">🔔</span>
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {unreadNotifications}
              </span>
            )}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/95 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🌱</span>
              <span className="text-xs text-gray-500 font-medium">Aktif</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{userGarden.activePlants}</p>
            <p className="text-xs text-gray-600">Tanaman Tumbuh</p>
          </div>

          <div className="bg-white/95 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">✅</span>
              <span className="text-xs text-gray-500 font-medium">Siap</span>
            </div>
            <p className="text-2xl font-bold text-orange-500">{userGarden.readyToHarvest}</p>
            <p className="text-xs text-gray-600">Siap Panen</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-16 space-y-5">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h3 className="font-bold text-gray-800 mb-4 text-sm">Aksi Cepat</h3>
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={() => onNavigate('catat-panen')}
              className="flex flex-col items-center space-y-2 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors active:scale-95"
            >
              <span className="text-3xl">📝</span>
              <span className="text-xs font-medium text-gray-700 text-center">
                Catat<br />Panen
              </span>
            </button>

            <button
              onClick={() => onNavigate('bank-bibit')}
              className="flex flex-col items-center space-y-2 p-3 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors active:scale-95"
            >
              <span className="text-3xl">🌾</span>
              <span className="text-xs font-medium text-gray-700 text-center">
                Bank<br />Bibit
              </span>
            </button>

            <button
              onClick={() => onNavigate('menu-gizi')}
              className="flex flex-col items-center space-y-2 p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors active:scale-95"
            >
              <span className="text-3xl">🍽️</span>
              <span className="text-xs font-medium text-gray-700 text-center">
                Menu<br />Gizi
              </span>
            </button>

            <button
              onClick={() => onNavigate('edukasi')}
              className="flex flex-col items-center space-y-2 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors active:scale-95"
            >
              <span className="text-3xl">📚</span>
              <span className="text-xs font-medium text-gray-700 text-center">
                Edukasi
              </span>
            </button>
          </div>
        </div>

        {/* Status Kebun Saya */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 text-sm">Status Kebun Saya</h3>
            <button
              onClick={() => onNavigate('kebun')}
              className="text-green-600 text-xs font-semibold"
            >
              Lihat Semua →
            </button>
          </div>

          {/* Garden Health Indicators */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💧</span>
                <div>
                  <p className="font-semibold text-sm text-gray-800">Irigasi</p>
                  <p className="text-xs text-gray-600">Terakhir 2 jam lalu</p>
                </div>
              </div>
              <span className="text-green-600 font-bold">Baik</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🌿</span>
                <div>
                  <p className="font-semibold text-sm text-gray-800">Kesehatan Tanaman</p>
                  <p className="text-xs text-gray-600">12 tanaman sehat</p>
                </div>
              </div>
              <span className="text-yellow-600 font-bold">Normal</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🧪</span>
                <div>
                  <p className="font-semibold text-sm text-gray-800">Kompos</p>
                  <p className="text-xs text-gray-600">Stok cukup 2 minggu</p>
                </div>
              </div>
              <span className="text-orange-600 font-bold">Cukup</span>
            </div>
          </div>
        </div>

        {/* Bank Bibit Tersedia */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 text-sm">Bibit Tersedia</h3>
            <button
              onClick={() => onNavigate('bank-bibit')}
              className="text-green-600 text-xs font-semibold"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'Kangkung', stock: 150, icon: '🥬' },
              { name: 'Bayam', stock: 200, icon: '🌿' },
              { name: 'Cabai', stock: 80, icon: '🌶️' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200"
              >
                <div className="text-3xl mb-2 text-center">{item.icon}</div>
                <p className="font-semibold text-xs text-gray-800 text-center mb-1">
                  {item.name}
                </p>
                <p className="text-xs text-green-600 text-center font-bold">
                  {item.stock} bibit
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Saran Menu Harian */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl shadow-lg p-5 border-2 border-orange-200">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-3">🍽️</span>
            <h3 className="font-bold text-gray-800 text-sm">Saran Menu Hari Ini</h3>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">Tumis Kangkung Terasi</h4>
            <p className="text-xs text-gray-600 mb-3">
              Menggunakan kangkung dari kebun Anda • 85 kalori
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <span>⏱️ 15 menit</span>
                <span>•</span>
                <span>👨‍🍳 Mudah</span>
              </div>
              <button
                onClick={() => onNavigate('menu-gizi')}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-orange-600 active:scale-95"
              >
                Lihat Resep
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h3 className="font-bold text-gray-800 mb-4 text-sm">Aktivitas Terbaru</h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {activity.type === 'tanam' ? '🌱' : '✅'}
                  </span>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">
                      {activity.type === 'tanam' ? 'Menanam' : 'Panen'}{' '}
                      {activity.plantName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(activity.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-600">
                  {activity.quantity} {activity.unit || 'bibit'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 shadow-lg">
        <div className="flex justify-around items-center">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center space-y-1 ${
              activeTab === 'home' ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            <span className="text-2xl">🏠</span>
            <span className="text-xs font-medium">Beranda</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('kebun');
              onNavigate('kebun');
            }}
            className={`flex flex-col items-center space-y-1 ${
              activeTab === 'kebun' ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            <span className="text-2xl">🌱</span>
            <span className="text-xs font-medium">Kebun</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('bank-bibit');
              onNavigate('bank-bibit');
            }}
            className={`flex flex-col items-center space-y-1 ${
              activeTab === 'bank-bibit' ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            <span className="text-2xl">🌾</span>
            <span className="text-xs font-medium">Bibit</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('edukasi');
              onNavigate('edukasi');
            }}
            className={`flex flex-col items-center space-y-1 ${
              activeTab === 'edukasi' ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            <span className="text-2xl">📚</span>
            <span className="text-xs font-medium">Edukasi</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('profil');
              onNavigate('profil');
            }}
            className={`flex flex-col items-center space-y-1 ${
              activeTab === 'profil' ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            <span className="text-2xl">👤</span>
            <span className="text-xs font-medium">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
