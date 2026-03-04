'use client';

import React, { useState } from 'react';
import Icon from '../shared/Icon';
import { getDeviceOptions } from '../../lib/mqttConfig';

const Login = ({ onLogin, onNavigateToAdmin }) => {
  const [selectedDevice, setSelectedDevice] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const deviceOptions = getDeviceOptions();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber.trim()) {
      setError('Masukkan nomor HP Anda');
      return;
    }

    if (!pin.trim()) {
      setError('Masukkan PIN Anda');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim(),
          pin: pin.trim(),
          ...(selectedDevice ? { deviceNumber: parseInt(selectedDevice, 10) } : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login gagal');
      }

      onLogin && onLogin({
        id: data.user.id,
        name: data.user.name,
        phone: data.user.phone,
        rw: data.user.rw,
        role: data.user.role,
        deviceId: data.user.deviceId,
        deviceNumber: data.user.deviceNumber,
        username: data.user.username,
        password: data.user.password,
      });
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 neo-card mb-4 border border-white/45">
            <Icon name="sparkles" size={40} color="#4CAF50" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Edu<span className="text-green-600">Pangan</span>
          </h1>
          <p className="text-gray-500 text-sm font-semibold tracking-wide">
            Masuk ke kebun pintar Anda
          </p>
        </div>

        <div className="neo-card p-6 max-w-md mx-auto w-full border border-white/45">
          <div className="mb-5 p-3 rounded-2xl bg-white/35 border border-white/40">
            <p className="text-xs text-gray-600">Masuk dengan nomor HP dan PIN yang terdaftar.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor HP
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon name="phone" size={20} />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="081234567890"
                  maxLength={13}
                  className="w-full pl-12 pr-4 py-3.5 neo-input text-gray-800 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                PIN
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon name="lock" size={20} />
                </div>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="4-6 digit"
                  maxLength={6}
                  className="w-full pl-12 pr-4 py-3.5 neo-input text-gray-800 placeholder-gray-400 tracking-widest"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pilih Device (Opsional)
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon name="deviceMobile" size={20} />
                </div>
                <select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 neo-input text-gray-800 appearance-none cursor-pointer bg-transparent"
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
              disabled={isLoading}
              className={`
                w-full py-4 rounded-xl font-semibold
                flex items-center justify-center gap-2
                transition-all duration-200
                ${isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 shadow-green'
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
          <div className="neo-card-sm p-4 flex items-start gap-3 border border-white/40">
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
          <p className="text-xs text-gray-400 mt-3">
            Admin/Kader?{' '}
            <button
              onClick={onNavigateToAdmin}
              className="text-blue-500 font-semibold hover:text-blue-600"
            >
              Login Admin
            </button>
          </p>
        </div>
      </div>

      <div className="text-center py-6 border-t border-gray-200/70 bg-white/20">
        <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
          <Icon name="sparkles" size={14} />
          <span>Smart Food Village v1.0</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">EduPangan x Telyuk</p>
      </div>
    </div>
  );
};

export default Login;
