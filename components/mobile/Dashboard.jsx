'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Icon from '../shared/Icon';
import Badge, { CountBadge } from '../shared/Badge';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { useApi } from '../../hooks/useApi';

const Dashboard = ({ user, onNavigate, userId = 1 }) => {
  const [activeTab, setActiveTab] = useState('home');
  const containerRef = useRef(null);
  const [stats, setStats] = useState({
    activePlants: 0,
    readyToHarvest: 0,
    totalHarvest: 0,
    recentActivities: [],
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [topVegetables, setTopVegetables] = useState([]);
  const { get } = useApi('/api');

  const userGarden = {
    activePlants: stats.activePlants || 0,
    readyToHarvest: stats.readyToHarvest || 0,
    totalHarvest: stats.totalHarvest || 0,
    seedBankContribution: 0,
  };

  const recentActivities = stats.recentActivities || [];

  const loadDashboardData = useCallback(async () => {
    if (!userId) {
      setStats({
        activePlants: 0,
        readyToHarvest: 0,
        totalHarvest: 0,
        recentActivities: [],
      });
      setUnreadCount(0);
      setTopVegetables([]);
      return;
    }

    try {
      const [plantsData, activitiesData, notificationsData, seedsData] = await Promise.all([
        get('/garden', { userId, type: 'plants' }),
        get('/garden', { userId, type: 'activities' }),
        get('/notifications', { userId }),
        get('/seeds', { type: 'stock' }),
      ]);

      const plants = plantsData || [];
      const activities = activitiesData || [];
      const notifications = notificationsData || [];

      const activePlants = plants.filter((p) => p.status === 'tumbuh').length;
      const readyToHarvest = plants.filter((p) => p.status === 'siap_panen').length;
      const totalHarvest = activities
        .filter((a) => a.type === 'panen')
        .reduce((sum, a) => sum + (parseFloat(a.quantity) || 0), 0)
        .toFixed(1);

      setStats({
        activePlants,
        readyToHarvest,
        totalHarvest,
        recentActivities: activities.slice(0, 5),
      });
      setUnreadCount(notifications.filter((n) => !n.read).length);
      setTopVegetables(
        (seedsData || []).slice(0, 3).map((seed) => ({
          name: seed.name,
          stock: seed.stockAvailable,
          category: seed.category,
        }))
      );
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  }, [get, userId]);

  const handleRefresh = useCallback(async () => {
    await loadDashboardData();
  }, [loadDashboardData]);

  const { isRefreshing, pullDistance, bindEvents } = usePullToRefresh(handleRefresh);

  useEffect(() => {
    const cleanup = bindEvents(containerRef.current);
    return () => {
      if (cleanup) cleanup();
    };
  }, [bindEvents]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const getVegetableIcon = (category) => {
    if (category?.includes('Hijau')) return 'chart';
    if (category?.includes('Bumbu')) return 'fire';
    return 'sparkles';
  };

  const quickActions = [
    { id: 'device-monitor', icon: 'bolt', label: 'IoT', color: 'blue' },
    { id: 'catat-panen', icon: 'document', label: 'Panen', color: 'green' },
    { id: 'bank-bibit', icon: 'gift', label: 'Bibit', color: 'yellow' },
    { id: 'menu-gizi', icon: 'heart', label: 'Gizi', color: 'orange' },
    { id: 'edukasi', icon: 'education', label: 'Edu', color: 'purple' },
  ];

  const navItems = [
    { id: 'home', icon: 'home', iconSolid: 'homeSolid', label: 'Beranda' },
    { id: 'kebun', icon: 'sparkles', label: 'Kebun' },
    { id: 'bank-bibit', icon: 'gift', label: 'Bibit' },
    { id: 'edukasi', icon: 'book', label: 'Edukasi' },
    { id: 'profil', icon: 'user', iconSolid: 'userSolid', label: 'Profil' },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-transparent pb-24 relative">
      {pullDistance > 0 && !isRefreshing && (
        <div className="fixed top-2 left-0 right-0 z-40 flex justify-center pointer-events-none">
          <div className="neo-card-sm px-4 py-2 text-xs text-gray-600 border border-white/45">
            Tarik untuk memperbarui
          </div>
        </div>
      )}

      {isRefreshing && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
          <div className="neo-card-sm px-4 py-2 flex items-center gap-2 border border-white/45">
            <Icon name="refresh" size={16} className="animate-spin text-green-500" />
            <span className="text-sm text-gray-600">Memperbarui...</span>
          </div>
        </div>
      )}

      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Icon name="deviceMobile" size={14} color="#9CA3AF" />
              <p className="text-gray-400 text-xs">Telyuk_{user?.deviceId || '001'}</p>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Halo, <span className="text-green-500">{user?.name || 'Petani'}</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">Pantau kebun, panen, dan aktivitas harian Anda</p>
          </div>
          <button
            onClick={() => onNavigate('profil')}
            className="relative neo-button w-12 h-12 flex items-center justify-center border border-white/45"
          >
            <Icon name="bell" size={24} color="#6B7280" />
            {unreadCount > 0 && (
              <CountBadge count={unreadCount} className="absolute -top-1 -right-1" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => onNavigate('kebun')}
            className="neo-card p-4 text-left hover:scale-[1.02] transition-transform border border-white/45"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 neo-inset rounded-xl flex items-center justify-center">
                <Icon name="sparkles" size={20} color="#4CAF50" />
              </div>
              <Badge variant="success" dot> Aktif</Badge>
            </div>
            <p className="text-3xl font-bold text-green-500">{userGarden.activePlants}</p>
            <p className="text-xs text-gray-500 mt-1">Tanaman Tumbuh</p>
          </button>

          <button
            onClick={() => onNavigate('catat-panen')}
            className="neo-card p-4 text-left hover:scale-[1.02] transition-transform border border-white/45"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 neo-inset rounded-xl flex items-center justify-center">
                <Icon name="check" size={20} color="#F59E0B" />
              </div>
              <Badge variant="warning" dot> Siap</Badge>
            </div>
            <p className="text-3xl font-bold text-orange-500">{userGarden.readyToHarvest}</p>
            <p className="text-xs text-gray-500 mt-1">Siap Panen</p>
          </button>
        </div>
      </div>

      <div className="px-6 space-y-5">
        <div className="neo-card p-5 border border-white/45">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Aksi Cepat</h3>
            <Icon name="grid" size={18} color="#9CA3AF" />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => onNavigate(action.id)}
                className="neo-button p-3 flex flex-col items-center gap-2 active:neo-button-active border border-white/40"
              >
                <Icon
                  name={action.icon}
                  size={22}
                  color={
                    action.color === 'blue' ? '#3B82F6' :
                    action.color === 'green' ? '#4CAF50' :
                    action.color === 'yellow' ? '#F59E0B' :
                    action.color === 'orange' ? '#F97316' :
                    '#8B5CF6'
                  }
                />
                <span className="text-xs font-medium text-gray-600">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="neo-card p-5 border border-white/45">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Status Kebun</h3>
            <button
              onClick={() => onNavigate('device-monitor')}
              className="text-green-500 text-xs font-semibold flex items-center gap-1"
            >
              <Icon name="bolt" size={14} />
              Monitor IoT
            </button>
          </div>

          <div className="space-y-3">
            <div className="neo-inset p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Icon name="sparkles" size={20} color="#4CAF50" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">Tanaman Aktif</p>
                  <p className="text-xs text-gray-500">{userGarden.activePlants} tanaman terdaftar</p>
                </div>
              </div>
              <span className={`font-bold text-sm ${userGarden.activePlants > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                {userGarden.activePlants > 0 ? 'Aktif' : 'Kosong'}
              </span>
            </div>

            <div className="neo-inset p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Icon name="check" size={20} color="#F59E0B" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">Siap Panen</p>
                  <p className="text-xs text-gray-500">{userGarden.readyToHarvest} tanaman siap</p>
                </div>
              </div>
              <span className={`font-bold text-sm ${userGarden.readyToHarvest > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                {userGarden.readyToHarvest > 0 ? 'Ada' : '-'}
              </span>
            </div>

            <div className="neo-inset p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Icon name="chart" size={20} color="#3B82F6" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">Total Panen</p>
                  <p className="text-xs text-gray-500">{userGarden.totalHarvest} kg tercatat</p>
                </div>
              </div>
              <span className="font-bold text-sm text-blue-500">{userGarden.totalHarvest} kg</span>
            </div>
          </div>
        </div>

        <div className="neo-card p-5 border border-white/45">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Bibit Tersedia</h3>
            <button
              onClick={() => onNavigate('bank-bibit')}
              className="text-green-500 text-xs font-semibold flex items-center gap-1"
            >
              Lihat Semua
              <Icon name="chevronRight" size={14} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {topVegetables.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate('bank-bibit')}
                className="neo-button p-3 text-center active:neo-button-active border border-white/40"
              >
                <div className="w-10 h-10 neo-inset rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Icon
                    name={getVegetableIcon(item.category)}
                    size={20}
                    color="#4CAF50"
                  />
                </div>
                <p className="font-semibold text-xs text-gray-800 mb-1">{item.name}</p>
                <p className="text-xs text-green-500 font-bold">{item.stock} bibit</p>
              </button>
            ))}
          </div>
        </div>

        <div className="neo-card p-5 border border-white/45">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Icon name="heart" size={20} color="#F97316" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Saran Menu Hari Ini</h3>
              <p className="text-xs text-gray-500">Dari kebun Anda</p>
            </div>
          </div>

          <div className="neo-inset p-4 rounded-xl">
            <h4 className="font-bold text-gray-800 mb-2">Tumis Kangkung Terasi</h4>
            <p className="text-xs text-gray-600 mb-3">
              Menggunakan kangkung dari kebun Anda - 85 kalori
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Icon name="clock" size={12} /> 15 menit
                </span>
                <span>-</span>
                <span>Mudah</span>
              </div>
              <button
                onClick={() => onNavigate('menu-gizi')}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Icon name="arrowRight" size={14} color="white" />
                Resep
              </button>
            </div>
          </div>
        </div>

        <div className="neo-card p-5 border border-white/45">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Aktivitas Terbaru</h3>
            <Icon name="clock" size={18} color="#9CA3AF" />
          </div>

          {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 neo-inset rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Icon name="document" size={28} color="#9CA3AF" />
              </div>
              <p className="text-gray-500 text-sm">Belum ada aktivitas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="neo-inset p-3 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activity.type === 'tanam' ? 'bg-green-100' : 'bg-orange-100'
                    }`}>
                      <Icon
                        name={activity.type === 'tanam' ? 'sparkles' : 'check'}
                        size={18}
                        color={activity.type === 'tanam' ? '#4CAF50' : '#F59E0B'}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">
                        {activity.type === 'tanam' ? 'Menanam' : 'Panen'} {activity.plantName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-green-500">
                    {activity.quantity} {activity.unit || 'bibit'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 safe-bottom pointer-events-none">
        <div className="max-w-md mx-auto neo-card-sm border border-white/45 backdrop-blur-md bg-white/35 pointer-events-auto px-2 py-2 rounded-2xl flex justify-around items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id !== 'home') onNavigate(item.id);
              }}
              className={`
                flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all
                ${activeTab === item.id
                  ? 'neo-button text-green-500'
                  : 'text-gray-400'
                }
              `}
            >
              <Icon
                name={activeTab === item.id ? (item.iconSolid || item.icon) : item.icon}
                size={24}
                color={activeTab === item.id ? '#4CAF50' : '#9CA3AF'}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
