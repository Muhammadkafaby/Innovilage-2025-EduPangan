'use client';

import React, { useState, useEffect } from 'react';
import { useAdminMqtt } from '../../hooks/useAdminMqtt';
import { vegetables } from '../../data/staticData';

/**
 * Admin Dashboard Component
 * Panel admin untuk memantau semua 26 device IoT
 * Features:
 * - Real-time monitoring semua device
 * - Status koneksi MQTT
 * - Kontrol pompa untuk setiap device
 */
const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [selectedDevice, setSelectedDevice] = useState(null);

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

  // Auto-connect on mount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  // Sidebar Menu Items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard IoT', icon: '📊' },
    { id: 'devices', label: 'Semua Device', icon: '📡' },
    { id: 'alerts', label: 'Notifikasi', icon: '🔔' },
    { id: 'seeds', label: 'Stok Bibit', icon: '🌾' },
  ];

  // Get device array sorted by ID
  const deviceList = Object.values(devices).sort((a, b) => a.deviceNumber - b.deviceNumber);

  // Device status badge
  const getStatusBadge = (device) => {
    if (!device.online) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-600">Offline</span>;
    }
    if (device.pumpStatus === 'ON') {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">Pompa ON</span>;
    }
    if (device.moisture !== null && device.moisture < 30) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Kering</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Normal</span>;
  };

  // Moisture color
  const getMoistureColor = (moisture) => {
    if (moisture === null) return 'text-gray-400';
    if (moisture < 30) return 'text-red-600';
    if (moisture < 50) return 'text-yellow-600';
    return 'text-green-600';
  };

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
              <p className="text-xs text-gray-500">Admin IoT Panel</p>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="p-4 border-b">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${isConnected ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
              {isConnected ? 'MQTT Connected' : 'Disconnected'}
            </span>
          </div>
          {connectionError && (
            <p className="text-xs text-red-600 mt-2 px-2">{connectionError}</p>
          )}
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

        {/* Reconnect Button */}
        {!isConnected && (
          <div className="p-4 border-t">
            <button
              onClick={connect}
              className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600"
            >
              🔄 Reconnect
            </button>
          </div>
        )}

        {/* Admin Profile */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-xl">👨‍💼</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-800">Admin BUMDes</p>
              <p className="text-xs text-gray-500">Monitoring {stats.totalDevices || 0} Device</p>
            </div>
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
                {lastUpdate && (
                  <span className="ml-2 text-green-600">
                    • Update: {new Date(lastUpdate).toLocaleTimeString('id-ID')}
                  </span>
                )}
              </p>
            </div>
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
                    <span className="text-3xl">📡</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${stats.onlineDevices > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                      {((stats.onlineDevices / stats.totalDevices) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">
                    {stats.onlineDevices}/{stats.totalDevices}
                  </h3>
                  <p className="text-sm text-gray-600">Device Online</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">💧</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">
                    {stats.averageMoisture}%
                  </h3>
                  <p className="text-sm text-gray-600">Rata-rata Kelembapan</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-cyan-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">🚿</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">
                    {stats.pumpOnCount}
                  </h3>
                  <p className="text-sm text-gray-600">Pompa Aktif</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">⚠️</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">
                    {stats.lowMoistureCount}
                  </h3>
                  <p className="text-sm text-gray-600">Perlu Penyiraman</p>
                </div>
              </div>

              {/* Device Grid */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-800 mb-4">Device Overview ({stats.totalDevices} aktif)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-13 gap-3">
                  {deviceList.map((device) => (
                    <button
                      key={device.deviceId}
                      onClick={() => setSelectedDevice(device)}
                      className={`p-3 rounded-xl text-center transition-all hover:scale-105 ${device.online
                        ? device.moisture !== null && device.moisture < 30
                          ? 'bg-red-100 border-2 border-red-300'
                          : 'bg-green-100 border-2 border-green-300'
                        : 'bg-gray-100 border-2 border-gray-200'
                        }`}
                    >
                      <p className="text-xl font-bold">{device.deviceId}</p>
                      <p className={`text-sm font-semibold ${getMoistureColor(device.moisture)}`}>
                        {device.moisture !== null ? `${device.moisture}%` : '-'}
                      </p>
                      <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${device.online ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Alerts */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-800 mb-4">Status Real-time</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {deviceList.filter(d => d.online).slice(0, 6).map((device) => (
                    <div key={device.deviceId} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-800">Device {device.deviceId}</span>
                        {getStatusBadge(device)}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Kelembapan</p>
                          <p className={`font-bold ${getMoistureColor(device.moisture)}`}>
                            {device.moisture !== null ? `${device.moisture}%` : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Pompa</p>
                          <p className={`font-bold ${device.pumpStatus === 'ON' ? 'text-blue-600' : 'text-gray-600'}`}>
                            {device.pumpStatus}
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
              {/* Device Table */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-800 mb-4">Semua Device ({stats.totalDevices} terdeteksi)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
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
                        <tr key={device.deviceId} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <span className="font-bold">Telyuk_{device.deviceId}</span>
                          </td>
                          <td className="py-3 px-4">{getStatusBadge(device)}</td>
                          <td className="py-3 px-4">
                            <span className={`font-bold ${getMoistureColor(device.moisture)}`}>
                              {device.moisture !== null ? `${device.moisture}%` : '-'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-semibold ${device.pumpStatus === 'ON' ? 'text-blue-600' : 'text-gray-600'}`}>
                              {device.pumpStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-600">{device.pumpMode}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-500">
                              {device.lastSeen
                                ? new Date(device.lastSeen).toLocaleTimeString('id-ID')
                                : '-'
                              }
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => sendCommand(device.deviceId, 'ON')}
                                disabled={!isConnected}
                                className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                              >
                                ON
                              </button>
                              <button
                                onClick={() => sendCommand(device.deviceId, 'OFF')}
                                disabled={!isConnected}
                                className="px-3 py-1 bg-gray-500 text-white text-xs rounded-lg hover:bg-gray-600 disabled:bg-gray-300"
                              >
                                OFF
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
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-800 mb-4">Device dengan Masalah</h3>
                <div className="space-y-3">
                  {deviceList.filter(d => !d.online || (d.moisture !== null && d.moisture < 30)).map((device) => (
                    <div key={device.deviceId} className={`p-4 rounded-xl border-2 ${!device.online ? 'bg-gray-50 border-gray-300' : 'bg-red-50 border-red-300'
                      }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{!device.online ? '📴' : '⚠️'}</span>
                          <div>
                            <p className="font-bold text-gray-800">Device {device.deviceId}</p>
                            <p className="text-sm text-gray-600">
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
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300"
                          >
                            Siram Sekarang
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {deviceList.filter(d => !d.online || (d.moisture !== null && d.moisture < 30)).length === 0 && (
                    <div className="text-center py-8">
                      <span className="text-5xl">✅</span>
                      <p className="text-gray-600 mt-2">Semua device dalam kondisi baik</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'seeds' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-800 mb-4">Stok Bibit</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vegetables.map((veg) => (
                    <div key={veg.id} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-3xl">🌿</span>
                        <div>
                          <p className="font-bold text-gray-800">{veg.name}</p>
                          <p className="text-xs text-gray-600">{veg.category}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm text-gray-600">Stok tersedia</span>
                        <span className="font-bold text-green-600">{veg.stockAvailable}</span>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-gray-800">Device {selectedDevice.deviceId}</h3>
              <button
                onClick={() => setSelectedDevice(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >×</button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Status</span>
                {getStatusBadge(selectedDevice)}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Kelembapan</span>
                <span className={`font-bold text-xl ${getMoistureColor(selectedDevice.moisture)}`}>
                  {selectedDevice.moisture !== null ? `${selectedDevice.moisture}%` : '-'}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Pompa</span>
                <span className={`font-bold ${selectedDevice.pumpStatus === 'ON' ? 'text-blue-600' : 'text-gray-600'}`}>
                  {selectedDevice.pumpStatus}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    sendCommand(selectedDevice.deviceId, 'ON');
                  }}
                  disabled={!isConnected}
                  className="py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 disabled:bg-gray-300"
                >
                  💧 ON
                </button>
                <button
                  onClick={() => {
                    sendCommand(selectedDevice.deviceId, 'OFF');
                  }}
                  disabled={!isConnected}
                  className="py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 disabled:bg-gray-300"
                >
                  ⏹️ OFF
                </button>
                <button
                  onClick={() => {
                    sendCommand(selectedDevice.deviceId, 'AUTO');
                  }}
                  disabled={!isConnected}
                  className="py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 disabled:bg-gray-300"
                >
                  🔄 AUTO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
