'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../shared/Icon';
import Badge from '../shared/Badge';
import { useApi } from '../../hooks/useApi';

const Profil = ({ user, onNavigateBack, onLogout, onNavigate, userId = 1 }) => {
  const [showClearDataConfirm, setShowClearDataConfirm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [stats, setStats] = useState({
    activePlants: 0,
    totalHarvest: 0,
    totalActivities: 0,
  });
  const { get, put, delete: del } = useApi('/api');

  const loadStats = useCallback(async () => {
    if (!userId) {
      setStats({ activePlants: 0, totalHarvest: 0, totalActivities: 0 });
      return;
    }

    try {
      const [plantsData, activitiesData] = await Promise.all([
        get('/garden', { userId, type: 'plants' }),
        get('/garden', { userId, type: 'activities' }),
      ]);

      const plants = plantsData || [];
      const activities = activitiesData || [];
      const totalHarvest = activities
        .filter((a) => a.type === 'panen')
        .reduce((sum, a) => sum + (parseFloat(a.quantity) || 0), 0)
        .toFixed(1);

      setStats({
        activePlants: plants.filter((p) => p.status === 'tumbuh').length,
        totalHarvest,
        totalActivities: activities.length,
      });
    } catch (err) {
      console.error('Failed to load profile stats:', err);
    }
  }, [get, userId]);

  const loadNotifications = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      const notificationsData = await get('/notifications', { userId });
      setNotifications(notificationsData || []);
      setUnreadCount((notificationsData || []).filter(n => !n.read).length);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  }, [get, userId]);

  useEffect(() => {
    loadStats();
    loadNotifications();
  }, [loadNotifications, loadStats]);

  const handleClearAllData = async () => {
    try {
      await del(`/garden?type=all&userId=${userId}`);
      setShowClearDataConfirm(false);
      alert('Semua data berhasil dihapus!');
      loadStats();
      loadNotifications();
    } catch (err) {
      alert('Gagal menghapus data: ' + (err.message || 'Terjadi kesalahan'));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await put('/notifications', { markAll: true, userId });
      loadNotifications();
      alert('Semua notifikasi ditandai sudah dibaca!');
    } catch (err) {
      alert('Gagal menandai notifikasi: ' + (err.message || 'Terjadi kesalahan'));
    }
  };

  const menuItems = [
    {
      icon: 'sparkles',
      title: 'Kebun Saya',
      subtitle: `${stats.activePlants} tanaman aktif`,
      action: () => onNavigate('kebun'),
      color: 'green'
    },
    {
      icon: 'chart',
      title: 'Statistik Panen',
      subtitle: `${stats.totalHarvest} kg total panen`,
      action: () => onNavigate('catat-panen'),
      color: 'blue'
    },
    {
      icon: 'bell',
      title: 'Notifikasi',
      subtitle: `${unreadCount} belum dibaca`,
      action: () => {
        if (notifications.length === 0) {
          alert('Belum ada notifikasi');
        } else {
          alert(`Anda memiliki ${unreadCount} notifikasi belum dibaca`);
          handleMarkAllRead();
        }
      },
      color: 'orange'
    },
    {
      icon: 'bolt',
      title: 'Monitor IoT',
      subtitle: 'Pantau sensor kebun',
      action: () => onNavigate('device-monitor'),
      color: 'purple'
    }
  ];

  const settingsItems = [
    {
      icon: 'settings',
      title: 'Pengaturan Akun',
      action: () => alert('Fitur dalam pengembangan')
    },
    {
      icon: 'bell',
      title: 'Pengaturan Notifikasi',
      action: () => alert('Fitur dalam pengembangan')
    },
    {
      icon: 'question',
      title: 'Bantuan & FAQ',
      action: () => alert('Fitur dalam pengembangan')
    },
    {
      icon: 'phone',
      title: 'Hubungi Kami',
      action: () => alert('Fitur dalam pengembangan')
    },
    {
      icon: 'trash',
      title: 'Hapus Semua Data',
      action: () => setShowClearDataConfirm(true),
      danger: true
    }
  ];

  return (
    <div className="min-h-screen bg-transparent pb-8">
      <div className="px-6 pt-8 pb-4">
        <button
          onClick={onNavigateBack}
          className="neo-button w-10 h-10 flex items-center justify-center mb-4 border border-white/45"
        >
          <Icon name="arrowLeft" size={20} color="#6B7280" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Profil Saya</h1>
      </div>

      <div className="px-6 space-y-5">
        <div className="neo-card p-6 border border-white/45">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 neo-inset rounded-full flex items-center justify-center">
              <Icon name="user" size={40} color="#4CAF50" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">
                {user?.name || 'Pengguna EduPangan'}
              </h2>
              <p className="text-sm text-gray-500">
                RW {user?.rw || '01'} - Pengguna EduPangan
              </p>
              <div className="flex items-center mt-2">
                <Badge variant="success" dot> Petani Aktif</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{stats.activePlants}</p>
              <p className="text-xs text-gray-500">Tanaman</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">{stats.totalHarvest}</p>
              <p className="text-xs text-gray-500">Kg Panen</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{stats.totalActivities}</p>
              <p className="text-xs text-gray-500">Aktivitas</p>
            </div>
          </div>
        </div>

        <div className="neo-card p-5 border border-white/45">
          <h3 className="font-bold text-gray-800 mb-4">Akses Cepat</h3>
          <div className="grid grid-cols-2 gap-3">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className="neo-button p-4 text-left active:neo-button-active transition-all border border-white/40"
              >
                <div className={`w-12 h-12 neo-inset rounded-xl flex items-center justify-center mb-3 ${
                  item.color === 'green' ? 'bg-green-50' :
                  item.color === 'blue' ? 'bg-blue-50' :
                  item.color === 'orange' ? 'bg-orange-50' :
                  'bg-purple-50'
                }`}>
                  <Icon
                    name={item.icon}
                    size={24}
                    color={
                      item.color === 'green' ? '#4CAF50' :
                      item.color === 'blue' ? '#3B82F6' :
                      item.color === 'orange' ? '#F97316' :
                      '#8B5CF6'
                    }
                  />
                </div>
                <p className="font-semibold text-sm text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-500">{item.subtitle}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="neo-card p-5 border border-white/45">
          <h3 className="font-bold text-gray-800 mb-4">Pengaturan</h3>
          <div className="space-y-2">
            {settingsItems.map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className={`
                  w-full flex items-center justify-between p-4 rounded-xl transition-all
                  ${item.danger ? 'neo-inset bg-red-50' : 'neo-button'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.danger ? 'bg-red-100' : 'neo-inset'
                  }`}>
                    <Icon
                      name={item.icon}
                      size={18}
                      color={item.danger ? '#EF4444' : '#6B7280'}
                    />
                  </div>
                  <span className={`font-medium text-sm ${item.danger ? 'text-red-600' : 'text-gray-800'}`}>
                    {item.title}
                  </span>
                </div>
                <Icon name="chevronRight" size={18} color={item.danger ? '#EF4444' : '#9CA3AF'} />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full neo-card py-4 flex items-center justify-center gap-2 text-red-500 font-semibold border border-red-100"
        >
          <Icon name="arrowRight" size={20} color="#EF4444" className="rotate-180" />
          Keluar Akun
        </button>

        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Icon name="sparkles" size={14} color="#9CA3AF" />
            <span>EduPangan v1.0.0</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Smart Watering System</p>
        </div>
      </div>

      {showClearDataConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="neo-card w-full max-w-md p-6 animate-scale-in border border-white/45">
            <div className="w-16 h-16 neo-inset rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="warning" size={32} color="#EF4444" />
            </div>
            <h3 className="font-bold text-lg text-gray-800 text-center mb-2">
              Hapus Semua Data?
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              Tindakan ini akan menghapus semua data tanaman, panen, dan aktivitas.
              Data tidak dapat dikembalikan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearDataConfirm(false)}
                className="flex-1 py-3 neo-button font-semibold text-gray-700"
              >
                Batal
              </button>
              <button
                onClick={handleClearAllData}
                 className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-semibold"
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
