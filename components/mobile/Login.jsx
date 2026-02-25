'use client';

import React, { useState } from 'react';
import Icon from '../shared/Icon';
import { getDeviceOptions, getDeviceCredentials } from '../../lib/mqttConfig';

const Login = ({ onLogin, onNavigateToRegister }) => {
  const [selectedDevice, setSelectedDevice] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const deviceOptions = getDeviceOptions();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedDevice) {
      setError('Pilih device terlebih dahulu');
      return;
    }

    if (!userName.trim()) {
      setError('Masukkan nama Anda');
      return;
    }

    setIsLoading(true);

    const credentials = getDeviceCredentials(parseInt(selectedDevice));

    setTimeout(() => {
      setIsLoading(false);
      onLogin && onLogin({
        name: userName.trim(),
        deviceNumber: parseInt(selectedDevice),
        deviceId: credentials.deviceId,
        username: credentials.username,
        password: credentials.password
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#E0E5EC] flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 neo-card mb-4">
            <Icon name="sparkles" size={40} color="#4CAF50" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Smart <span className="text-green-500">Watering</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Sistem Penyiraman Otomatis
          </p>
        </div>

        <div className="neo-card p-6 max-w-md mx-auto w-full">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Anda
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon name="user" size={20} />
                </div>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Contoh: Ibu Siti Aminah"
                  className="w-full pl-12 pr-4 py-3.5 neo-input text-gray-800 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pilih Device
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon name="deviceMobile" size={20} />
                </div>
                <select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 neo-input text-gray-800 appearance-none cursor-pointer bg-transparent"
                  required
                >
                  <option value="">-- Pilih Device (1-26) --</option>
                  {deviceOptions.map((device) => (
                    <option key={device.value} value={device.value}>
                      {device.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Icon name="chevronDown" size={20} />
                </div>
              </div>
            </div>

            {error && (
              <div className="neo-inset p-3 rounded-xl flex items-center gap-3 bg-red-50 border-l-4 border-red-500">
                <Icon name="warning" size={20} color="#EF4444" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !selectedDevice || !userName.trim()}
              className={`
                w-full py-4 rounded-xl font-semibold
                flex items-center justify-center gap-2
                transition-all duration-200
                ${isLoading || !selectedDevice || !userName.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600 active:neo-button-active shadow-neo-button'
                }
              `}
            >
              {isLoading ? (
                <>
                  <Icon name="refresh" size={20} className="animate-spin" />
                  <span>Menghubungkan...</span>
                </>
              ) : (
                <>
                  <Icon name="arrowRight" size={20} />
                  <span>Masuk ke Dashboard</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 max-w-md mx-auto w-full">
          <div className="neo-card-sm p-4 flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 neo-button flex items-center justify-center">
                <Icon name="info" size={20} color="#3B82F6" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">
                Tentang Device
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Setiap device (1-26) terhubung dengan sensor kelembapan tanah dan pompa air otomatis.
                Pilih device yang ingin Anda monitor.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Belum punya akun?{' '}
            <button
              onClick={onNavigateToRegister}
              className="text-green-500 font-semibold hover:text-green-600"
            >
              Daftar di sini
            </button>
          </p>
        </div>
      </div>

      <div className="text-center py-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
          <Icon name="sparkles" size={14} />
          <span>Smart Watering System v3.2</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">EduPangan x Telyuk</p>
      </div>
    </div>
  );
};

export default Login;
