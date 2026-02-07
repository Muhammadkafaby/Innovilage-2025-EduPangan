'use client';

import React, { useState } from 'react';
import { useGardenData } from '../../hooks/useGardenData';
import { useNotifications } from '../../hooks/useNotifications';

/**
 * Profil Component
 * Halaman profil pengguna dengan:
 * - Info user
 * - Statistik kebun
 * - Pengaturan
 * - Logout
 */
const Profil = ({ user, onNavigateBack, onLogout, onNavigate }) => {
    const [showSettings, setShowSettings] = useState(false);
    const [showClearDataConfirm, setShowClearDataConfirm] = useState(false);

    const { stats, clearAllData } = useGardenData();
    const { unreadCount, clearAll: clearNotifications } = useNotifications();

    // Handle clear all data
    const handleClearAllData = () => {
        clearAllData();
        clearNotifications();
        setShowClearDataConfirm(false);
        alert('Semua data berhasil dihapus!');
    };

    // Menu items
    const menuItems = [
        {
            icon: '🌱',
            title: 'Kebun Saya',
            subtitle: `${stats.activePlants} tanaman aktif`,
            action: () => onNavigate('kebun'),
            color: 'green'
        },
        {
            icon: '📊',
            title: 'Statistik Panen',
            subtitle: `${stats.totalHarvest} kg total panen`,
            action: () => onNavigate('catat-panen'),
            color: 'blue'
        },
        {
            icon: '🔔',
            title: 'Notifikasi',
            subtitle: `${unreadCount} belum dibaca`,
            action: () => { },
            color: 'orange'
        },
        {
            icon: '📡',
            title: 'Monitor IoT',
            subtitle: 'Pantau sensor kebun',
            action: () => onNavigate('device-monitor'),
            color: 'purple'
        }
    ];

    const settingsItems = [
        {
            icon: '🔧',
            title: 'Pengaturan Akun',
            action: () => alert('Fitur dalam pengembangan')
        },
        {
            icon: '🔔',
            title: 'Pengaturan Notifikasi',
            action: () => alert('Fitur dalam pengembangan')
        },
        {
            icon: '❓',
            title: 'Bantuan & FAQ',
            action: () => alert('Fitur dalam pengembangan')
        },
        {
            icon: '📞',
            title: 'Hubungi Kami',
            action: () => alert('Fitur dalam pengembangan')
        },
        {
            icon: '🗑️',
            title: 'Hapus Semua Data',
            action: () => setShowClearDataConfirm(true),
            danger: true
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 pt-8 pb-16 px-6">
                <button
                    onClick={onNavigateBack}
                    className="text-white mb-4 flex items-center text-sm font-medium"
                >
                    <span className="mr-2">←</span> Kembali
                </button>
                <h1 className="text-2xl font-bold text-white mb-2">Profil Saya</h1>
                <p className="text-green-100 text-sm">
                    Kelola akun dan pengaturan Anda
                </p>
            </div>

            {/* Profile Card */}
            <div className="px-6 -mt-10">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-4xl">👩</span>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-800">
                                {user?.name || 'Pengguna EduPangan'}
                            </h2>
                            <p className="text-sm text-gray-600">
                                RW {user?.rw || '01'} • Device {user?.deviceId || '-'}
                            </p>
                            <div className="flex items-center mt-2">
                                <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                                    🌿 Petani Aktif
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{stats.activePlants}</p>
                            <p className="text-xs text-gray-600">Tanaman</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{stats.totalHarvest}</p>
                            <p className="text-xs text-gray-600">Kg Panen</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-orange-600">{stats.totalActivities}</p>
                            <p className="text-xs text-gray-600">Aktivitas</p>
                        </div>
                    </div>
                </div>

                {/* Quick Access Menu */}
                <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
                    <h3 className="font-bold text-gray-800 mb-4">Akses Cepat</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {menuItems.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={item.action}
                                className="p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 active:scale-95 transition-all"
                            >
                                <span className="text-3xl block mb-2">{item.icon}</span>
                                <p className="font-semibold text-sm text-gray-800">{item.title}</p>
                                <p className="text-xs text-gray-600">{item.subtitle}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Settings Menu */}
                <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
                    <h3 className="font-bold text-gray-800 mb-4">Pengaturan</h3>
                    <div className="space-y-2">
                        {settingsItems.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={item.action}
                                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${item.danger
                                    ? 'bg-red-50 hover:bg-red-100'
                                    : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-xl">{item.icon}</span>
                                    <span className={`font-medium text-sm ${item.danger ? 'text-red-600' : 'text-gray-800'
                                        }`}>
                                        {item.title}
                                    </span>
                                </div>
                                <span className="text-gray-400">→</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={onLogout}
                    className="w-full bg-red-500 text-white py-4 rounded-xl font-semibold hover:bg-red-600 active:scale-95 shadow-lg flex items-center justify-center space-x-2"
                >
                    <span>🚪</span>
                    <span>Keluar Akun</span>
                </button>

                {/* App Version */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    EduPangan v1.0.0 • Smart Watering System
                </p>
            </div>

            {/* Clear Data Confirmation Modal */}
            {showClearDataConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center">
                        <span className="text-5xl block mb-4">⚠️</span>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">
                            Hapus Semua Data?
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Tindakan ini akan menghapus semua data tanaman, panen, dan aktivitas.
                            Data tidak dapat dikembalikan.
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowClearDataConfirm(false)}
                                className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleClearAllData}
                                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profil;
