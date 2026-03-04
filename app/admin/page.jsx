'use client';

import React, { useState } from 'react';
import AdminDashboard from '../../components/web/AdminDashboard';
import Icon from '../../components/shared/Icon';
import { useAuth } from '../../hooks/useAuth';

/**
 * Admin Panel Page
 * Route: /admin
 */
export default function AdminPage() {
  const { user, loading, login, logout } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'admin' || user?.role === 'kader';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber.trim() || !pin.trim()) {
      setError('Nomor HP dan PIN wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login({
        phoneNumber: phoneNumber.trim(),
        pin: pin.trim(),
      });

      if (result?.user?.role !== 'admin' && result?.user?.role !== 'kader') {
        await logout();
        setError('Akun ini tidak memiliki akses admin');
      }
    } catch (err) {
      setError(err.message || 'Login admin gagal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setPhoneNumber('');
    setPin('');
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="neo-card px-5 py-4 flex items-center gap-2 text-gray-600">
          <Icon name="refresh" size={16} className="animate-spin" />
          Memuat sesi admin...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md neo-card p-6 border border-white/45">
          <div className="text-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-green-500 mx-auto flex items-center justify-center mb-3">
              <Icon name="settings" size={26} color="white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Login Admin EduPangan</h1>
            <p className="text-sm text-gray-500 mt-1">Masuk dengan akun kader/admin</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor HP</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="081234567890"
                className="w-full neo-inset rounded-xl px-3 py-2.5 bg-transparent text-sm text-gray-800 outline-none"
                maxLength={13}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">PIN</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="4-6 digit"
                className="w-full neo-inset rounded-xl px-3 py-2.5 bg-transparent text-sm text-gray-800 outline-none"
                maxLength={6}
                required
              />
            </div>

            {error && (
              <div className="neo-inset rounded-xl px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-xl font-semibold disabled:opacity-60"
            >
              {isSubmitting ? 'Memproses...' : 'Masuk ke Panel Admin'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md neo-card p-6 border border-white/45 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-100 mx-auto flex items-center justify-center mb-3">
            <Icon name="warning" size={26} color="#DC2626" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Akses Ditolak</h2>
          <p className="text-sm text-gray-600 mt-2">Akun Anda tidak memiliki hak akses ke panel admin.</p>
          <button
            onClick={handleLogout}
            className="mt-4 neo-button px-4 py-2 text-sm font-semibold text-gray-700 border border-white/40"
          >
            Keluar
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard adminUser={user} onLogout={handleLogout} />;
}
