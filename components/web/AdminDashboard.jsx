'use client';

import React, { useState, useEffect } from 'react';
import Icon from '../shared/Icon';
import Badge, { StatusBadge } from '../shared/Badge';
import { CircularProgress } from '../shared/ProgressBar';
import { useAdminMqtt } from '../../hooks/useAdminMqtt';
import { vegetables } from '../../data/staticData';

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
  ];

  const deviceList = Object.values(devices).sort((a, b) => a.deviceNumber - b.deviceNumber);

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

  return (
    <div className="min-h-screen bg-[#E0E5EC] flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-[#E0E5EC] flex flex-col transition-all duration-300 border-r border-gray-200/50`}>
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
          <div className={`neo-inset p-3 rounded-xl flex items-center gap-2 ${isConnected ? 'bg-green-50' : 'bg-red-50'}`}>
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
              onClick={() => setActiveMenu(item.id)}
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
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-[#E0E5EC] px-8 py-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {menuItems.find((m) => m.id === activeMenu)?.label}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
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
            <div className="flex items-center gap-3">
              <button className="neo-button w-10 h-10 flex items-center justify-center">
                <Icon name="bell" size={20} color="#6B7280" />
              </button>
              <button className="neo-button w-10 h-10 flex items-center justify-center">
                <Icon name="settings" size={20} color="#6B7280" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                  <div key={idx} className="neo-card p-6">
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
              <div className="neo-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Device Overview</h3>
                  <Badge>{stats.totalDevices} Device</Badge>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-13 gap-3">
                  {deviceList.map((device) => (
                    <button
                      key={device.deviceId}
                      onClick={() => setSelectedDevice(device)}
                      className={`neo-button p-3 text-center transition-all ${
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
              <div className="neo-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Status Real-time</h3>
                  <button className="neo-button px-4 py-2 text-sm font-medium text-green-500">
                    <Icon name="refresh" size={16} color="#4CAF50" className="mr-2" />
                    Refresh
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {deviceList.filter(d => d.online).slice(0, 6).map((device) => (
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
              <div className="neo-card p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Semua Device</h3>
                  <Badge>{stats.totalDevices} terdeteksi</Badge>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
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
                      {deviceList.map((device) => (
                        <tr key={device.deviceId} className="border-b border-gray-100 hover:bg-white/50">
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
                            <div className="flex gap-2">
                              <button
                                onClick={() => sendCommand(device.deviceId, 'ON')}
                                disabled={!isConnected}
                                className="neo-button px-3 py-1.5 text-xs font-semibold text-blue-500 disabled:opacity-50"
                              >
                                ON
                              </button>
                              <button
                                onClick={() => sendCommand(device.deviceId, 'OFF')}
                                disabled={!isConnected}
                                className="neo-button px-3 py-1.5 text-xs font-semibold text-gray-500 disabled:opacity-50"
                              >
                                OFF
                              </button>
                              <button
                                onClick={() => setSelectedDevice(device)}
                                className="neo-button px-3 py-1.5 text-xs font-semibold text-green-500"
                              >
                                Detail
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'alerts' && (
            <div className="space-y-6">
              <div className="neo-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Device dengan Masalah</h3>
                  <Badge variant="error">
                    {deviceList.filter(d => !d.online || (d.moisture !== null && d.moisture < 30)).length} device
                  </Badge>
                </div>
                <div className="space-y-3">
                  {deviceList.filter(d => !d.online || (d.moisture !== null && d.moisture < 30)).map((device) => (
                    <div key={device.deviceId} className={`neo-inset p-4 rounded-xl ${!device.online ? 'opacity-60' : ''}`}>
                      <div className="flex items-center justify-between">
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
                            onClick={() => sendCommand(device.deviceId, 'ON')}
                            disabled={!isConnected}
                            className="neo-button px-6 py-3 font-semibold text-blue-500 disabled:opacity-50"
                          >
                            <Icon name="sparkles" size={18} color="#3B82F6" className="mr-2" />
                            Siram Sekarang
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {deviceList.filter(d => !d.online || (d.moisture !== null && d.moisture < 30)).length === 0 && (
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
              <div className="neo-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Stok Bibit</h3>
                  <Badge>{vegetables.length} jenis</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {vegetables.map((veg) => (
                    <div key={veg.id} className="neo-inset p-4 rounded-xl">
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
        </div>
      </div>

      {/* Device Detail Modal */}
      {selectedDevice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6" onClick={() => setSelectedDevice(null)}>
          <div className="neo-card w-full max-w-md p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 neo-inset rounded-xl flex items-center justify-center">
                  <Icon name="deviceMobile" size={24} color="#4CAF50" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-800">Telyuk_{selectedDevice.deviceId}</h3>
                  <p className="text-sm text-gray-500">Device Details</p>
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
              <div className="flex justify-center">
                <CircularProgress
                  value={selectedDevice.moisture || 0}
                  size={120}
                  strokeWidth={10}
                  color="auto"
                  label="Kelembapan"
                />
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
                onClick={() => sendCommand(selectedDevice.deviceId, 'ON')}
                disabled={!isConnected}
                className="neo-button py-4 flex flex-col items-center gap-2 text-blue-500 disabled:opacity-50"
              >
                <Icon name="sparkles" size={24} color={isConnected ? '#3B82F6' : '#9CA3AF'} />
                <span className="text-sm font-semibold">ON</span>
              </button>
              <button
                onClick={() => sendCommand(selectedDevice.deviceId, 'OFF')}
                disabled={!isConnected}
                className="neo-button py-4 flex flex-col items-center gap-2 text-gray-500 disabled:opacity-50"
              >
                <Icon name="stop" size={24} color={isConnected ? '#6B7280' : '#9CA3AF'} />
                <span className="text-sm font-semibold">OFF</span>
              </button>
              <button
                onClick={() => sendCommand(selectedDevice.deviceId, 'AUTO')}
                disabled={!isConnected}
                className="neo-button py-4 flex flex-col items-center gap-2 text-green-500 disabled:opacity-50"
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
