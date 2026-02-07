'use client';

import React, { useState } from 'react';
import { useGardenData } from '../../hooks/useGardenData';
import { useNotifications } from '../../hooks/useNotifications';
import { vegetables } from '../../data/staticData';

/**
 * Dashboard Component
 * Halaman utama aplikasi mobile dengan:
 * - Status Kebun (real data dari localStorage)
 * - Quick Actions
 * - Statistik Personal
 * - Notifikasi
 * - Bottom Navigation
 */
const Dashboard = ({ user, onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState('home');

  // Real data from hooks
  const { stats, activities, plants } = useGardenData();
  const { unreadCount, notifications } = useNotifications();

  // Garden stats from real data
  const userGarden = {
    activePlants: stats.activePlants || 0,
    readyToHarvest: stats.readyToHarvest || 0,
    totalHarvest: stats.totalHarvest || 0,
    seedBankContribution: 0,
  };

  // Recent activities from real data
  const recentActivities = stats.recentActivities || [];

  // Get top 3 vegetables from staticData for bibit display
  const topVegetables = vegetables.slice(0, 3).map(v => ({
    name: v.name,
    stock: v.stockAvailable,
    icon: v.category === 'Sayuran Hijau' ? '🥬' : v.category === 'Bumbu' ? '🌶️' : '🌿'
  }));

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 pt-8 pb-24 px-6 rounded-b-[2.5rem] shadow-lg">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-green-100 text-sm">Device: Telyuk_{user?.deviceId || '001'}</p>
            <h2 className="text-white text-xl font-bold">Smart Watering</h2>
          </div>
          <button
            onClick={() => onNavigate('notifications')}
            className="relative bg-white/20 p-3 rounded-full"
          >
            <span className="text-2xl">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {unreadCount}
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
          <div className="grid grid-cols-5 gap-2">
            <button
              onClick={() => onNavigate('device-monitor')}
              className="flex flex-col items-center space-y-2 p-3 bg-blue-100 rounded-xl hover:bg-blue-200 transition-colors active:scale-95 border-2 border-blue-300"
            >
              <span className="text-2xl">📡</span>
              <span className="text-xs font-medium text-blue-700 text-center">
                IoT
              </span>
            </button>

            <button
              onClick={() => onNavigate('catat-panen')}
              className="flex flex-col items-center space-y-2 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors active:scale-95"
            >
              <span className="text-2xl">📝</span>
              <span className="text-xs font-medium text-gray-700 text-center">
                Panen
              </span>
            </button>

            <button
              onClick={() => onNavigate('bank-bibit')}
              className="flex flex-col items-center space-y-2 p-3 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors active:scale-95"
            >
              <span className="text-2xl">🌾</span>
              <span className="text-xs font-medium text-gray-700 text-center">
                Bibit
              </span>
            </button>

            <button
              onClick={() => onNavigate('menu-gizi')}
              className="flex flex-col items-center space-y-2 p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors active:scale-95"
            >
              <span className="text-2xl">🍽️</span>
              <span className="text-xs font-medium text-gray-700 text-center">
                Gizi
              </span>
            </button>

            <button
              onClick={() => onNavigate('edukasi')}
              className="flex flex-col items-center space-y-2 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors active:scale-95"
            >
              <span className="text-2xl">📚</span>
              <span className="text-xs font-medium text-gray-700 text-center">
                Edu
              </span>
            </button>
          </div>
        </div>

        {/* Status Kebun Saya */}
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 text-sm">Status Kebun Saya</h3>
            <button
              onClick={() => onNavigate('device-monitor')}
              className="text-green-600 text-xs font-semibold"
            >
              Monitor IoT →
            </button>
          </div>

          {/* Garden Health Indicators - Dynamic */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🌱</span>
                <div>
                  <p className="font-semibold text-sm text-gray-800">Tanaman Aktif</p>
                  <p className="text-xs text-gray-600">{userGarden.activePlants} tanaman terdaftar</p>
                </div>
              </div>
              <span className={`font-bold ${userGarden.activePlants > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                {userGarden.activePlants > 0 ? 'Aktif' : 'Kosong'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold text-sm text-gray-800">Siap Panen</p>
                  <p className="text-xs text-gray-600">{userGarden.readyToHarvest} tanaman siap</p>
                </div>
              </div>
              <span className={`font-bold ${userGarden.readyToHarvest > 0 ? 'text-yellow-600' : 'text-gray-400'}`}>
                {userGarden.readyToHarvest > 0 ? 'Ada' : '-'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="font-semibold text-sm text-gray-800">Total Panen</p>
                  <p className="text-xs text-gray-600">{userGarden.totalHarvest} kg tercatat</p>
                </div>
              </div>
              <span className="text-blue-600 font-bold">{userGarden.totalHarvest} kg</span>
            </div>
          </div>
        </div>

        {/* Bank Bibit Tersedia - Dynamic */}
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
            {topVegetables.map((item, idx) => (
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
            className={`flex flex-col items-center space-y-1 ${activeTab === 'home' ? 'text-green-600' : 'text-gray-400'
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
            className={`flex flex-col items-center space-y-1 ${activeTab === 'kebun' ? 'text-green-600' : 'text-gray-400'
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
            className={`flex flex-col items-center space-y-1 ${activeTab === 'bank-bibit' ? 'text-green-600' : 'text-gray-400'
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
            className={`flex flex-col items-center space-y-1 ${activeTab === 'edukasi' ? 'text-green-600' : 'text-gray-400'
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
            className={`flex flex-col items-center space-y-1 ${activeTab === 'profil' ? 'text-green-600' : 'text-gray-400'
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
