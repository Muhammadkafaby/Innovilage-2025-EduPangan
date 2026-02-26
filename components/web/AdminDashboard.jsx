'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Icon from '../shared/Icon';
import Badge from '../shared/Badge';
import { CircularProgress } from '../shared/ProgressBar';
import AiFabChat from '../shared/AiFabChat';
import { useAdminMqtt } from '../../hooks/useAdminMqtt';
import { vegetables } from '../../data/staticData';
import { useApi } from '../../hooks/useApi';

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('device');
  const [commandFeedback, setCommandFeedback] = useState(null);
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [articleEditor, setArticleEditor] = useState(null);
  const [showCreateArticle, setShowCreateArticle] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Gizi Keluarga',
    readTime: '5 menit',
    author: 'Admin EduPangan',
    status: 'draft',
    tags: '',
  });
  const [isCreatingArticle, setIsCreatingArticle] = useState(false);
  const [isDeletingArticle, setIsDeletingArticle] = useState(false);
  const [isSavingArticle, setIsSavingArticle] = useState(false);
  const [articleError, setArticleError] = useState('');
  const { get, post, patch, delete: del } = useApi('/api');

  const {
    isConnected,
    devices,
    stats,
    connectionError,
    lastUpdate,
    connect,
    disconnect,
    sendCommand
  } = useAdminMqtt();

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'chart' },
    { id: 'devices', label: 'Semua Device', icon: 'deviceMobile' },
    { id: 'alerts', label: 'Notifikasi', icon: 'bell' },
    { id: 'seeds', label: 'Stok Bibit', icon: 'gift' },
    { id: 'articles', label: 'Artikel Gizi', icon: 'document' },
  ];

  const deviceList = useMemo(
    () => Object.values(devices).sort((a, b) => a.deviceNumber - b.deviceNumber),
    [devices]
  );
  const problemDevices = useMemo(
    () => deviceList.filter(d => !d.online || (d.moisture !== null && d.moisture < 30)),
    [deviceList]
  );
  const onlinePreview = useMemo(
    () => deviceList.filter(d => d.online).slice(0, 6),
    [deviceList]
  );

  const filteredDevices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let items = [...deviceList];

    if (query) {
      items = items.filter((device) => {
        const id = String(device.deviceId || '').toLowerCase();
        return id.includes(query) || `telyuk_${id}`.includes(query);
      });
    }

    if (statusFilter !== 'all') {
      items = items.filter((device) => {
        if (statusFilter === 'online') return device.online;
        if (statusFilter === 'offline') return !device.online;
        if (statusFilter === 'low') return device.moisture !== null && device.moisture < 30;
        return true;
      });
    }

    items.sort((a, b) => {
      if (sortBy === 'moistureAsc') {
        const aa = a.moisture ?? Number.POSITIVE_INFINITY;
        const bb = b.moisture ?? Number.POSITIVE_INFINITY;
        return aa - bb;
      }

      if (sortBy === 'moistureDesc') {
        const aa = a.moisture ?? Number.NEGATIVE_INFINITY;
        const bb = b.moisture ?? Number.NEGATIVE_INFINITY;
        return bb - aa;
      }

      if (sortBy === 'lastSeen') {
        const aa = a.lastSeen ? new Date(a.lastSeen).getTime() : 0;
        const bb = b.lastSeen ? new Date(b.lastSeen).getTime() : 0;
        return bb - aa;
      }

      return (a.deviceNumber || 0) - (b.deviceNumber || 0);
    });

    return items;
  }, [deviceList, searchQuery, statusFilter, sortBy]);

  useEffect(() => {
    if (!commandFeedback) return;
    const timer = setTimeout(() => setCommandFeedback(null), 2200);
    return () => clearTimeout(timer);
  }, [commandFeedback]);

  useEffect(() => {
    if (activeMenu !== 'articles') return;

    const loadArticles = async () => {
      setArticlesLoading(true);
      setArticleError('');
      try {
        const data = await post('/articles', { status: 'all', limit: 200 });
        setArticles(Array.isArray(data) ? data : []);
      } catch (error) {
        setArticleError(error.message || 'Gagal memuat artikel');
      } finally {
        setArticlesLoading(false);
      }
    };

    loadArticles();
  }, [activeMenu, post]);

  const openArticleEditor = async (slug) => {
    try {
      const detail = await get(`/articles/${slug}`);
      setArticleEditor({
        originalSlug: detail.slug,
        slug: detail.slug,
        title: detail.title || '',
        excerpt: detail.excerpt || '',
        content: detail.content || '',
        category: detail.category || 'Gizi Keluarga',
        readTime: detail.readTime || '5 menit',
        author: detail.author || 'Tim EduPangan',
        status: detail.status || 'published',
        tags: Array.isArray(detail.tags) ? detail.tags.join(', ') : '',
      });
      setArticleError('');
    } catch (error) {
      setArticleError(error.message || 'Gagal memuat detail artikel');
    }
  };

  const closeArticleEditor = () => {
    setArticleEditor(null);
    setIsSavingArticle(false);
  };

  const resetNewArticle = () => {
    setNewArticle({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Gizi Keluarga',
      readTime: '5 menit',
      author: 'Admin EduPangan',
      status: 'draft',
      tags: '',
    });
  };

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    setIsCreatingArticle(true);
    setArticleError('');

    try {
      const payload = {
        action: 'create',
        title: newArticle.title.trim(),
        slug: newArticle.slug.trim() || undefined,
        excerpt: newArticle.excerpt.trim(),
        content: newArticle.content.trim(),
        category: newArticle.category.trim(),
        readTime: newArticle.readTime.trim(),
        author: newArticle.author.trim(),
        status: newArticle.status,
        tags: newArticle.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      const result = await post('/articles', payload);
      const created = result.article;

      setArticles((prev) => [created, ...prev]);
      setCommandFeedback({
        type: 'success',
        message: `Artikel "${created.title}" berhasil dibuat`,
      });
      setShowCreateArticle(false);
      resetNewArticle();
    } catch (error) {
      setArticleError(error.message || 'Gagal membuat artikel');
    } finally {
      setIsCreatingArticle(false);
    }
  };

  const handleDeleteArticle = async (slug, title) => {
    if (!confirm(`Hapus artikel "${title}"?`)) return;

    setIsDeletingArticle(true);
    setArticleError('');
    try {
      await del(`/articles/${slug}`);
      setArticles((prev) => prev.filter((item) => item.slug !== slug));
      if (articleEditor?.originalSlug === slug) {
        closeArticleEditor();
      }
      setCommandFeedback({
        type: 'success',
        message: `Artikel "${title}" berhasil dihapus`,
      });
    } catch (error) {
      setArticleError(error.message || 'Gagal menghapus artikel');
    } finally {
      setIsDeletingArticle(false);
    }
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    if (!articleEditor?.originalSlug) return;

    setIsSavingArticle(true);
    setArticleError('');

    try {
      const payload = {
        title: articleEditor.title.trim(),
        slug: articleEditor.slug.trim(),
        excerpt: articleEditor.excerpt.trim(),
        content: articleEditor.content.trim(),
        category: articleEditor.category.trim(),
        readTime: articleEditor.readTime.trim(),
        author: articleEditor.author.trim(),
        status: articleEditor.status,
        tags: articleEditor.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      const result = await patch(`/articles/${articleEditor.originalSlug}`, payload);
      const updated = result.article;

      setArticles((prev) => prev.map((item) => (
        item.id === updated.id ? updated : item
      )));

      setCommandFeedback({
        type: 'success',
        message: `Artikel "${updated.title}" berhasil diperbarui`,
      });
      closeArticleEditor();
    } catch (error) {
      setArticleError(error.message || 'Gagal menyimpan artikel');
    } finally {
      setIsSavingArticle(false);
    }
  };

  const getStatusBadge = (device) => {
    if (!device.online) {
      return <Badge variant="default">Offline</Badge>;
    }
    if (device.pumpStatus === 'ON' || device.pumpStatus === 'NYALA') {
      return <Badge variant="info">Pompa ON</Badge>;
    }
    if (device.moisture !== null && device.moisture < 30) {
      return <Badge variant="error">Kering</Badge>;
    }
    return <Badge variant="success">Normal</Badge>;
  };

  const getMoistureColor = (moisture) => {
    if (moisture === null) return '#9CA3AF';
    if (moisture < 30) return '#EF4444';
    if (moisture < 50) return '#F59E0B';
    return '#4CAF50';
  };

  const statCards = [
    {
      label: 'Device Online',
      value: `${stats.onlineDevices}/${stats.totalDevices}`,
      icon: 'bolt',
      color: 'green',
      percentage: stats.totalDevices > 0 ? ((stats.onlineDevices / stats.totalDevices) * 100).toFixed(0) : 0,
    },
    {
      label: 'Rata-rata Kelembapan',
      value: `${stats.averageMoisture}%`,
      icon: 'cloud',
      color: 'blue',
    },
    {
      label: 'Pompa Aktif',
      value: stats.pumpOnCount,
      icon: 'sparkles',
      color: 'cyan',
    },
    {
      label: 'Perlu Penyiraman',
      value: stats.lowMoistureCount,
      icon: 'warning',
      color: 'red',
    },
  ];

  const handleSendCommand = (deviceId, cmd) => {
    const ok = sendCommand(deviceId, cmd);
    setCommandFeedback({
      type: ok ? 'success' : 'error',
      message: ok
        ? `Perintah ${cmd} dikirim ke Telyuk_${deviceId}`
        : `Gagal mengirim perintah ${cmd} ke Telyuk_${deviceId}`,
    });
  };

  const renderDeviceActions = (device, compact = false) => (
    <div className={`flex ${compact ? 'flex-wrap' : ''} gap-2`}>
      <button
        onClick={() => handleSendCommand(device.deviceId, 'ON')}
        disabled={!isConnected}
        className="neo-button px-3 py-1.5 text-xs font-semibold text-blue-500 disabled:opacity-50 border border-white/40"
      >
        ON
      </button>
      <button
        onClick={() => handleSendCommand(device.deviceId, 'OFF')}
        disabled={!isConnected}
        className="neo-button px-3 py-1.5 text-xs font-semibold text-gray-500 disabled:opacity-50 border border-white/40"
      >
        OFF
      </button>
      <button
        onClick={() => setSelectedDevice(device)}
        className="neo-button px-3 py-1.5 text-xs font-semibold text-green-500 border border-white/40"
      >
        Detail
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent flex relative">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/25 lg:hidden"
        />
      )}
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 z-40 h-screen ${sidebarCollapsed ? 'w-20' : 'w-64'} bg-[#edf2ea]/95 lg:bg-transparent flex flex-col transition-all duration-300 border-r border-white/40 backdrop-blur-md lg:backdrop-blur-[2px] ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Logo */}
        <div className="p-4">
          <div className="neo-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon name="sparkles" size={24} color="white" />
            </div>
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-gray-800">EduPangan</h1>
                <p className="text-xs text-gray-500">Admin IoT Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Connection Status */}
        <div className="px-4 mb-4">
          <div className={`neo-inset p-3 rounded-xl flex items-center gap-2 border ${isConnected ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            {!sidebarCollapsed && (
              <span className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
                {isConnected ? 'MQTT Connected' : 'Disconnected'}
              </span>
            )}
          </div>
          {connectionError && !sidebarCollapsed && (
            <p className="text-xs text-red-600 mt-2 px-2">{connectionError}</p>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
             <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeMenu === item.id
                    ? 'neo-button text-green-500'
                  : 'neo-inset text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon
                name={item.icon}
                size={20}
                color={activeMenu === item.id ? '#4CAF50' : '#9CA3AF'}
              />
              {!sidebarCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Reconnect Button */}
        {!isConnected && (
          <div className="p-4">
            <button
              onClick={connect}
              className="w-full neo-button py-3 flex items-center justify-center gap-2 text-green-500 font-semibold"
            >
              <Icon name="refresh" size={18} />
              {!sidebarCollapsed && <span>Reconnect</span>}
            </button>
          </div>
        )}

        {/* Toggle Sidebar */}
        <div className="p-4 border-t border-gray-200/50">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full neo-inset p-3 rounded-xl flex items-center justify-center"
          >
            <Icon
              name={sidebarCollapsed ? 'chevronRight' : 'chevronLeft'}
              size={20}
              color="#6B7280"
            />
          </button>
        </div>

        {/* Admin Profile */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200/50">
            <div className="neo-card p-3 flex items-center gap-3">
              <div className="w-10 h-10 neo-inset rounded-xl flex items-center justify-center">
                <Icon name="user" size={20} color="#4CAF50" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-sm text-gray-800">Admin BUMDes</p>
                <p className="text-xs text-gray-500">{stats.totalDevices || 0} Device</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {commandFeedback && (
          <div className="fixed right-4 top-4 z-[70]">
            <div className={`neo-card px-4 py-3 border ${commandFeedback.type === 'success' ? 'border-green-200 bg-green-50/85' : 'border-red-200 bg-red-50/85'}`}>
              <div className="flex items-center gap-2">
                <Icon
                  name={commandFeedback.type === 'success' ? 'check' : 'warning'}
                  size={16}
                  color={commandFeedback.type === 'success' ? '#16A34A' : '#DC2626'}
                />
                <p className={`text-sm font-medium ${commandFeedback.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                  {commandFeedback.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/20 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-4 lg:py-6 border-b border-white/35">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="neo-button w-10 h-10 flex items-center justify-center border border-white/45 lg:hidden"
              >
                <Icon name="menu" size={20} color="#6B7280" />
              </button>
              <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {menuItems.find((m) => m.id === activeMenu)?.label}
              </h2>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-1 flex-wrap">
                <Icon name="calendar" size={14} />
                <span>
                  {new Date().toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                {lastUpdate && (
                  <>
                    <span className="text-green-500">•</span>
                    <Icon name="clock" size={14} color="#4CAF50" />
                    <span className="text-green-500">
                      Update: {new Date(lastUpdate).toLocaleTimeString('id-ID')}
                    </span>
                  </>
                )}
              </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <button className="neo-button w-10 h-10 flex items-center justify-center border border-white/45">
                <Icon name="bell" size={20} color="#6B7280" />
              </button>
              <button className="neo-button w-10 h-10 flex items-center justify-center border border-white/45">
                <Icon name="settings" size={20} color="#6B7280" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 lg:p-8">
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                  <div key={idx} className="neo-card p-6 border border-white/45">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 neo-inset rounded-xl flex items-center justify-center ${
                        stat.color === 'green' ? 'bg-green-50' :
                        stat.color === 'blue' ? 'bg-blue-50' :
                        stat.color === 'cyan' ? 'bg-cyan-50' :
                        'bg-red-50'
                      }`}>
                        <Icon
                          name={stat.icon}
                          size={24}
                          color={
                            stat.color === 'green' ? '#4CAF50' :
                            stat.color === 'blue' ? '#3B82F6' :
                            stat.color === 'cyan' ? '#06B6D4' :
                            '#EF4444'
                          }
                        />
                      </div>
                      {stat.percentage !== undefined && (
                        <Badge variant={parseInt(stat.percentage) > 80 ? 'success' : 'warning'}>
                          {stat.percentage}%
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Device Grid */}
              <div className="neo-card p-6 border border-white/45">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Device Overview</h3>
                  <Badge>{stats.totalDevices} Device</Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => {
                      setActiveMenu('devices');
                      setStatusFilter('online');
                    }}
                    className="neo-button px-3 py-1.5 text-xs font-semibold text-green-600 border border-white/40"
                  >
                    Online ({stats.onlineDevices})
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('devices');
                      setStatusFilter('offline');
                    }}
                    className="neo-button px-3 py-1.5 text-xs font-semibold text-gray-600 border border-white/40"
                  >
                    Offline ({stats.offlineDevices})
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenu('devices');
                      setStatusFilter('low');
                    }}
                    className="neo-button px-3 py-1.5 text-xs font-semibold text-red-600 border border-white/40"
                  >
                    Kelembapan Rendah ({stats.lowMoistureCount})
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-12 gap-3">
                  {filteredDevices.slice(0, 24).map((device) => (
                    <button
                      key={device.deviceId}
                      onClick={() => setSelectedDevice(device)}
                      className={`neo-button p-3 text-center transition-all border border-white/40 ${
                        !device.online
                          ? 'opacity-60'
                          : device.moisture !== null && device.moisture < 30
                            ? ''
                            : ''
                      }`}
                    >
                      <p className="text-sm font-bold text-gray-800">{device.deviceId}</p>
                      <p className="text-xs font-semibold mt-1" style={{ color: getMoistureColor(device.moisture) }}>
                        {device.moisture !== null ? `${device.moisture}%` : '-'}
                      </p>
                      <div className={`w-2 h-2 rounded-full mx-auto mt-2 ${device.online ? 'bg-green-500' : 'bg-gray-400'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Alerts */}
              <div className="neo-card p-6 border border-white/45">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Status Real-time</h3>
                  <button className="neo-button px-4 py-2 text-sm font-medium text-green-500">
                    <Icon name="refresh" size={16} color="#4CAF50" className="mr-2" />
                    Refresh
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {onlinePreview.map((device) => (
                    <div key={device.deviceId} className="neo-inset p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 neo-button rounded-lg flex items-center justify-center">
                            <Icon name="deviceMobile" size={16} color="#6B7280" />
                          </div>
                          <span className="font-bold text-gray-800">Telyuk_{device.deviceId}</span>
                        </div>
                        {getStatusBadge(device)}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Kelembapan</p>
                          <p className="font-bold text-lg" style={{ color: getMoistureColor(device.moisture) }}>
                            {device.moisture !== null ? `${device.moisture}%` : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Pompa</p>
                          <p className={`font-bold text-lg ${device.pumpStatus === 'ON' || device.pumpStatus === 'NYALA' ? 'text-blue-500' : 'text-gray-500'}`}>
                            {device.pumpStatus || 'OFF'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'devices' && (
            <div className="space-y-6">
              <div className="neo-card p-6 overflow-hidden border border-white/45">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Semua Device</h3>
                  <Badge>{filteredDevices.length}/{stats.totalDevices} terdeteksi</Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr_1fr] gap-3 mb-4">
                  <div className="neo-inset rounded-xl px-4 py-3 flex items-center gap-3 border border-white/35">
                    <Icon name="search" size={18} color="#9CA3AF" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari device (contoh: 008 / telyuk_008)"
                      className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                    />
                  </div>

                  <div className="neo-inset rounded-xl px-3 py-2 border border-white/35">
                    <label className="block text-[11px] text-gray-500 mb-1">Filter Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full bg-transparent outline-none text-sm text-gray-800"
                    >
                      <option value="all">Semua</option>
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                      <option value="low">Kelembapan Rendah</option>
                    </select>
                  </div>

                  <div className="neo-inset rounded-xl px-3 py-2 border border-white/35">
                    <label className="block text-[11px] text-gray-500 mb-1">Urutkan</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-transparent outline-none text-sm text-gray-800"
                    >
                      <option value="device">Nomor Device</option>
                      <option value="moistureAsc">Kelembapan (rendah)</option>
                      <option value="moistureDesc">Kelembapan (tinggi)</option>
                      <option value="lastSeen">Update terbaru</option>
                    </select>
                  </div>
                </div>
                <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/40 bg-white/20">
                  <table className="w-full min-w-[700px]">
                    <thead className="sticky top-0 z-10 bg-[#edf2ea]/85 backdrop-blur-sm">
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Device ID</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Kelembapan</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Pompa</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Mode</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Last Seen</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDevices.map((device) => (
                        <tr key={device.deviceId} className="border-b border-gray-100/70 hover:bg-white/45">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 neo-inset rounded-lg flex items-center justify-center">
                                <Icon name="deviceMobile" size={16} color="#6B7280" />
                              </div>
                              <span className="font-bold text-gray-800">Telyuk_{device.deviceId}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{getStatusBadge(device)}</td>
                          <td className="py-3 px-4">
                            <span className="font-bold" style={{ color: getMoistureColor(device.moisture) }}>
                              {device.moisture !== null ? `${device.moisture}%` : '-'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-semibold ${device.pumpStatus === 'ON' || device.pumpStatus === 'NYALA' ? 'text-blue-500' : 'text-gray-500'}`}>
                              {device.pumpStatus || 'OFF'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={device.pumpMode === 'AUTO' ? 'success' : 'default'}>
                              {device.pumpMode || 'MANUAL'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-500">
                              {device.lastSeen
                                ? new Date(device.lastSeen).toLocaleTimeString('id-ID')
                                : '-'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {renderDeviceActions(device)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-3">
                  {filteredDevices.map((device) => (
                    <div key={device.deviceId} className="neo-inset p-4 rounded-xl border border-white/35">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 neo-button rounded-lg flex items-center justify-center">
                            <Icon name="deviceMobile" size={16} color="#6B7280" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">Telyuk_{device.deviceId}</p>
                            <p className="text-xs text-gray-500">{device.lastSeen ? new Date(device.lastSeen).toLocaleTimeString('id-ID') : 'Belum ada data'}</p>
                          </div>
                        </div>
                        {getStatusBadge(device)}
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="neo-button p-2 rounded-lg text-center">
                          <p className="text-[11px] text-gray-500">Kelembapan</p>
                          <p className="text-xs font-bold" style={{ color: getMoistureColor(device.moisture) }}>
                            {device.moisture !== null ? `${device.moisture}%` : '-'}
                          </p>
                        </div>
                        <div className="neo-button p-2 rounded-lg text-center">
                          <p className="text-[11px] text-gray-500">Pompa</p>
                          <p className="text-xs font-bold text-gray-700">{device.pumpStatus || 'OFF'}</p>
                        </div>
                        <div className="neo-button p-2 rounded-lg text-center">
                          <p className="text-[11px] text-gray-500">Mode</p>
                          <p className="text-xs font-bold text-gray-700">{device.pumpMode || 'MANUAL'}</p>
                        </div>
                      </div>

                      {renderDeviceActions(device, true)}
                    </div>
                  ))}
                </div>

                {filteredDevices.length === 0 && (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 neo-inset rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Icon name="search" size={24} color="#9CA3AF" />
                    </div>
                    <p className="font-semibold text-gray-700">Tidak ada device yang cocok</p>
                    <p className="text-sm text-gray-500 mt-1">Coba ubah kata kunci, filter, atau urutan</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeMenu === 'alerts' && (
            <div className="space-y-6">
              <div className="neo-card p-6 border border-white/45">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Device dengan Masalah</h3>
                  <Badge variant="error">
                    {problemDevices.length} device
                  </Badge>
                </div>
                <div className="space-y-3">
                  {problemDevices.map((device) => (
                    <div key={device.deviceId} className={`neo-inset p-4 rounded-xl border border-white/30 ${!device.online ? 'opacity-60' : ''}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${!device.online ? 'bg-gray-100' : 'bg-red-100'}`}>
                            <Icon
                              name={!device.online ? 'wifi' : 'warning'}
                              size={24}
                              color={!device.online ? '#9CA3AF' : '#EF4444'}
                            />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">Telyuk_{device.deviceId}</p>
                            <p className="text-sm text-gray-500">
                              {!device.online
                                ? 'Device tidak terhubung'
                                : `Kelembapan rendah: ${device.moisture}%`
                              }
                            </p>
                          </div>
                        </div>
                        {device.online && (
                          <button
                            onClick={() => handleSendCommand(device.deviceId, 'ON')}
                            disabled={!isConnected}
                            className="neo-button px-4 lg:px-6 py-3 font-semibold text-blue-500 disabled:opacity-50 border border-white/40"
                          >
                            <Icon name="sparkles" size={18} color="#3B82F6" className="mr-2" />
                            Siram Sekarang
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {problemDevices.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 neo-inset rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Icon name="check" size={40} color="#4CAF50" />
                      </div>
                      <p className="text-gray-600 font-medium">Semua device dalam kondisi baik</p>
                      <p className="text-sm text-gray-400 mt-1">Tidak ada alert saat ini</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'seeds' && (
            <div className="space-y-6">
              <div className="neo-card p-6 border border-white/45">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Stok Bibit</h3>
                  <Badge>{vegetables.length} jenis</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {vegetables.map((veg) => (
                    <div key={veg.id} className="neo-inset p-4 rounded-xl border border-white/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 neo-button rounded-xl flex items-center justify-center">
                          <Icon name="sparkles" size={24} color="#4CAF50" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{veg.name}</p>
                          <p className="text-xs text-gray-500">{veg.category}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                        <span className="text-sm text-gray-500">Stok tersedia</span>
                        <span className={`font-bold ${veg.stockAvailable > 100 ? 'text-green-500' : veg.stockAvailable > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                          {veg.stockAvailable} bibit
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'articles' && (
            <div className="space-y-6">
              <div className="neo-card p-6 border border-white/45">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-bold text-gray-800">Manajemen Artikel Gizi</h3>
                    <p className="text-sm text-gray-500">Edit artikel untuk halaman edukasi mobile</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{articles.length} artikel</Badge>
                    <button
                      onClick={() => {
                        setShowCreateArticle(true);
                        setArticleError('');
                      }}
                      className="neo-button px-3 py-2 text-xs font-semibold text-green-600 border border-white/40"
                    >
                      <Icon name="plus" size={14} color="#16A34A" className="mr-1" />
                      Buat Artikel
                    </button>
                  </div>
                </div>

                {articleError && (
                  <div className="neo-inset p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm mb-4">
                    {articleError}
                  </div>
                )}

                {articlesLoading ? (
                  <div className="neo-inset p-4 rounded-xl flex items-center gap-2 text-sm text-gray-600">
                    <Icon name="refresh" size={16} className="animate-spin" />
                    Memuat daftar artikel...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {articles.map((article) => (
                      <div key={article.id} className="neo-inset p-4 rounded-xl border border-white/35">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-bold text-gray-800 truncate">{article.title}</p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{article.excerpt}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Icon name="eye" size={12} /> {article.views} views
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="clock" size={12} /> {article.readTime}
                              </span>
                              <Badge variant={article.status === 'published' ? 'success' : 'default'}>
                                {article.status}
                              </Badge>
                            </div>
                          </div>
                          <button
                            onClick={() => openArticleEditor(article.slug)}
                            className="neo-button px-4 py-2 text-sm font-semibold text-green-600 border border-white/40"
                          >
                            <Icon name="settings" size={16} color="#16A34A" className="mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.slug, article.title)}
                            disabled={isDeletingArticle}
                            className="neo-button px-4 py-2 text-sm font-semibold text-red-600 border border-white/40 disabled:opacity-60"
                          >
                            <Icon name="trash" size={16} color="#DC2626" className="mr-2" />
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}

                    {articles.length === 0 && (
                      <div className="text-center py-10">
                        <div className="w-16 h-16 neo-inset rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <Icon name="document" size={24} color="#9CA3AF" />
                        </div>
                        <p className="font-semibold text-gray-700">Belum ada artikel</p>
                        <p className="text-sm text-gray-500 mt-1">Jalankan seed atau generator artikel AI.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {showCreateArticle && (
                <div className="neo-card p-6 border border-white/45">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-800">Buat Artikel Baru</h4>
                      <p className="text-sm text-gray-500">Tambahkan artikel edukasi gizi baru</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowCreateArticle(false);
                        resetNewArticle();
                      }}
                      className="neo-button w-10 h-10 flex items-center justify-center"
                    >
                      <Icon name="xmark" size={18} color="#6B7280" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateArticle} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Judul</label>
                        <input
                          value={newArticle.title}
                          onChange={(e) => setNewArticle((prev) => ({ ...prev, title: e.target.value }))}
                          className="w-full neo-inset rounded-xl px-3 py-2.5 bg-transparent text-sm text-gray-800 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (opsional)</label>
                        <input
                          value={newArticle.slug}
                          onChange={(e) => setNewArticle((prev) => ({ ...prev, slug: e.target.value }))}
                          className="w-full neo-inset rounded-xl px-3 py-2.5 bg-transparent text-sm text-gray-800 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                        <input
                          value={newArticle.category}
                          onChange={(e) => setNewArticle((prev) => ({ ...prev, category: e.target.value }))}
                          className="w-full neo-inset rounded-xl px-3 py-2.5 bg-transparent text-sm text-gray-800 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Durasi Baca</label>
                        <input
                          value={newArticle.readTime}
                          onChange={(e) => setNewArticle((prev) => ({ ...prev, readTime: e.target.value }))}
                          className="w-full neo-inset rounded-xl px-3 py-2.5 bg-transparent text-sm text-gray-800 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Penulis</label>
                        <input
                          value={newArticle.author}
                          onChange={(e) => setNewArticle((prev) => ({ ...prev, author: e.target.value }))}
                          className="w-full neo-inset rounded-xl px-3 py-2.5 bg-transparent text-sm text-gray-800 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                        <select
                          value={newArticle.status}
                          onChange={(e) => setNewArticle((prev) => ({ ...prev, status: e.target.value }))}
                          className="w-full neo-inset rounded-xl px-3 py-2.5 bg-transparent text-sm text-gray-800 outline-none"
                        >
                          <option value="draft">draft</option>
                          <option value="published">published</option>
                          <option value="archived">archived</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ringkasan</label>
                      <textarea
                        rows={3}
                        value={newArticle.excerpt}
                        onChange={(e) => setNewArticle((prev) => ({ ...prev, excerpt: e.target.value }))}
                        className="w-full neo-inset rounded-xl px-3 py-2.5 bg-transparent text-sm text-gray-800 outline-none resize-y"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Konten</label>
                      <textarea
                        rows={6}
                        value={newArticle.content}
                        onChange={(e) => setNewArticle((prev) => ({ ...prev, content: e.target.value }))}
                        className="w-full neo-inset rounded-xl px-3 py-2.5 bg-transparent text-sm text-gray-800 outline-none resize-y"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (pisahkan dengan koma)</label>
                      <input
                        value={newArticle.tags}
                        onChange={(e) => setNewArticle((prev) => ({ ...prev, tags: e.target.value }))}
                        className="w-full neo-inset rounded-xl px-3 py-2.5 bg-transparent text-sm text-gray-800 outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateArticle(false);
                          resetNewArticle();
                        }}
                        className="neo-button px-4 py-2.5 text-sm font-semibold text-gray-600 border border-white/45"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isCreatingArticle}
                        className="bg-gradient-to-r from-green-600 to-green-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60"
                      >
                        {isCreatingArticle ? 'Membuat...' : 'Simpan Artikel'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {articleEditor && (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4" onClick={closeArticleEditor}>
          <div className="neo-card w-full max-w-3xl p-5 sm:p-6 border border-white/45 max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-xl text-gray-800">Edit Artikel</h3>
                <p className="text-sm text-gray-500">Perbarui konten artikel edukasi gizi</p>
              </div>
              <button onClick={closeArticleEditor} className="neo-button w-10 h-10 flex items-center justify-center">
                <Icon name="xmark" size={20} color="#6B7280" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Judul</label>
                  <input
                    value={articleEditor.title}
                    onChange={(e) => setArticleEditor((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full neo-inset rounded-xl px-3 py-2.5 bg-transparent text-sm text-gray-800 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Slug</label>
                  <input
                    value={articleEditor.slug}
                    onChange={(e) => setArticleEditor((prev) => ({ ...prev, slug: e.target.value }))}
                    className="w-full neo-inset rounded-xl px-3 py-2.5 bg-transparent text-sm text-gray-800 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                  <input
                    value={articleEditor.category}
                    onChange={(e) => setArticleEditor((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full neo-inset rounded-xl px-3 py-2.5 bg-transparent text-sm text-gray-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Durasi Baca</label>
                  <input
                    value={articleEditor.readTime}
                    onChange={(e) => setArticleEditor((prev) => ({ ...prev, readTime: e.target.value }))}
                    className="w-full neo-inset rounded-xl px-3 py-2.5 bg-transparent text-sm text-gray-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Penulis</label>
                  <input
                    value={articleEditor.author}
                    onChange={(e) => setArticleEditor((prev) => ({ ...prev, author: e.target.value }))}
                    className="w-full neo-inset rounded-xl px-3 py-2.5 bg-transparent text-sm text-gray-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={articleEditor.status}
                    onChange={(e) => setArticleEditor((prev) => ({ ...prev, status: e.target.value }))}
                    className="w-full neo-inset rounded-xl px-3 py-2.5 bg-transparent text-sm text-gray-800 outline-none"
                  >
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                    <option value="archived">archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ringkasan</label>
                <textarea
                  rows={3}
                  value={articleEditor.excerpt}
                  onChange={(e) => setArticleEditor((prev) => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full neo-inset rounded-xl px-3 py-2.5 bg-transparent text-sm text-gray-800 outline-none resize-y"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Konten</label>
                <textarea
                  rows={8}
                  value={articleEditor.content}
                  onChange={(e) => setArticleEditor((prev) => ({ ...prev, content: e.target.value }))}
                  className="w-full neo-inset rounded-xl px-3 py-2.5 bg-transparent text-sm text-gray-800 outline-none resize-y"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (pisahkan dengan koma)</label>
                <input
                  value={articleEditor.tags}
                  onChange={(e) => setArticleEditor((prev) => ({ ...prev, tags: e.target.value }))}
                  className="w-full neo-inset rounded-xl px-3 py-2.5 bg-transparent text-sm text-gray-800 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={closeArticleEditor} className="neo-button px-4 py-2.5 text-sm font-semibold text-gray-600 border border-white/45">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingArticle}
                  className="bg-gradient-to-r from-green-600 to-green-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60"
                >
                  {isSavingArticle ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AiFabChat mode="admin" userName="Admin" bottomOffsetClass="bottom-6" />

      {/* Device Detail Modal */}
      {selectedDevice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6" onClick={() => setSelectedDevice(null)}>
          <div className="neo-card w-full max-w-lg p-5 sm:p-6 animate-scale-in border border-white/45 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 neo-inset rounded-xl flex items-center justify-center">
                  <Icon name="deviceMobile" size={24} color="#4CAF50" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-800">Telyuk_{selectedDevice.deviceId}</h3>
                  <p className="text-sm text-gray-500">Detail Perangkat</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDevice(null)}
                className="neo-button w-10 h-10 flex items-center justify-center"
              >
                <Icon name="xmark" size={20} color="#6B7280" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Moisture Circular Progress */}
              <div className="neo-inset rounded-2xl p-4 border border-white/30">
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
                <CircularProgress
                  value={selectedDevice.moisture || 0}
                  size={120}
                  strokeWidth={10}
                  color="auto"
                  label="Kelembapan"
                />
                  <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                    <div className="neo-button p-3 rounded-xl text-center border border-white/30">
                      <p className="text-xs text-gray-500">Last Seen</p>
                      <p className="text-xs font-semibold text-gray-700">
                        {selectedDevice.lastSeen ? new Date(selectedDevice.lastSeen).toLocaleTimeString('id-ID') : '-'}
                      </p>
                    </div>
                    <div className="neo-button p-3 rounded-xl text-center border border-white/30">
                      <p className="text-xs text-gray-500">Device</p>
                      <p className="text-xs font-semibold text-gray-700">{selectedDevice.deviceId}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="neo-inset p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="wifi" size={18} color="#6B7280" />
                  <span className="text-gray-600">Status</span>
                </div>
                {getStatusBadge(selectedDevice)}
              </div>

              <div className="neo-inset p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="sparkles" size={18} color="#6B7280" />
                  <span className="text-gray-600">Pompa</span>
                </div>
                <span className={`font-bold ${selectedDevice.pumpStatus === 'ON' || selectedDevice.pumpStatus === 'NYALA' ? 'text-blue-500' : 'text-gray-500'}`}>
                  {selectedDevice.pumpStatus || 'OFF'}
                </span>
              </div>

              <div className="neo-inset p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="settings" size={18} color="#6B7280" />
                  <span className="text-gray-600">Mode</span>
                </div>
                <Badge variant={selectedDevice.pumpMode === 'AUTO' ? 'success' : 'default'}>
                  {selectedDevice.pumpMode || 'MANUAL'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSendCommand(selectedDevice.deviceId, 'ON')}
                disabled={!isConnected}
                className="neo-button py-4 flex flex-col items-center gap-2 text-blue-500 disabled:opacity-50 border border-white/40"
              >
                <Icon name="sparkles" size={24} color={isConnected ? '#3B82F6' : '#9CA3AF'} />
                <span className="text-sm font-semibold">ON</span>
              </button>
              <button
                onClick={() => handleSendCommand(selectedDevice.deviceId, 'OFF')}
                disabled={!isConnected}
                className="neo-button py-4 flex flex-col items-center gap-2 text-gray-500 disabled:opacity-50 border border-white/40"
              >
                <Icon name="stop" size={24} color={isConnected ? '#6B7280' : '#9CA3AF'} />
                <span className="text-sm font-semibold">OFF</span>
              </button>
              <button
                onClick={() => handleSendCommand(selectedDevice.deviceId, 'AUTO')}
                disabled={!isConnected}
                className="neo-button py-4 flex flex-col items-center gap-2 text-green-500 disabled:opacity-50 border border-white/40"
              >
                <Icon name="refresh" size={24} color={isConnected ? '#4CAF50' : '#9CA3AF'} />
                <span className="text-sm font-semibold">AUTO</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
