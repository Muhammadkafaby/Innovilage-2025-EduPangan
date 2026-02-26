'use client';

import React, { useState } from 'react';
import Icon from '../shared/Icon';

const Register = ({ onRegister, onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    rw: '',
    phoneNumber: '',
    kaderCode: '',
    pin: '',
    confirmPin: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPin, setShowPin] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.fullName.length < 3) {
      newErrors.fullName = 'Nama minimal 3 karakter';
    }

    if (!formData.rw || formData.rw === '') {
      newErrors.rw = 'Pilih RW Anda';
    }

    if (formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = 'Nomor HP tidak valid';
    }

    if (formData.kaderCode.length < 4) {
      newErrors.kaderCode = 'Kode kader tidak valid';
    }

    if (formData.pin.length < 4 || formData.pin.length > 6) {
      newErrors.pin = 'PIN harus 4-6 digit';
    }

    if (formData.pin !== formData.confirmPin) {
      newErrors.confirmPin = 'PIN tidak sama';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          rw: formData.rw,
          kaderCode: formData.kaderCode,
          pin: formData.pin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Pendaftaran gagal');
      }

      onRegister && onRegister({
        ...formData,
        id: data.user?.id,
      });
    } catch (err) {
      setErrors({ submit: err.message || 'Terjadi kesalahan' });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E0E5EC] pb-8">
      <div className="px-6 pt-8 pb-4">
        <button
          onClick={onNavigateToLogin}
          className="neo-button w-10 h-10 flex items-center justify-center mb-4"
        >
          <Icon name="arrowLeft" size={20} color="#6B7280" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Daftar Akun</h1>
        <p className="text-gray-500 text-sm">Bergabung dengan program EduPangan</p>
      </div>

      <div className="px-6">
        <div className="neo-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon name="user" size={18} />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Ibu Siti Aminah"
                  className={`w-full pl-12 pr-4 py-3 neo-input text-gray-800 placeholder-gray-400 ${
                    errors.fullName ? 'ring-2 ring-red-300' : ''
                  }`}
                  required
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <Icon name="warning" size={12} color="#EF4444" />
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                RW <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon name="location" size={18} />
                </div>
                <select
                  name="rw"
                  value={formData.rw}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-10 py-3 neo-input text-gray-800 appearance-none bg-transparent ${
                    errors.rw ? 'ring-2 ring-red-300' : ''
                  }`}
                  required
                >
                  <option value="">Pilih RW</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={String(n).padStart(2, '0')}>
                      RW {String(n).padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="chevronDown" size={18} color="#9CA3AF" />
                </div>
              </div>
              {errors.rw && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <Icon name="warning" size={12} color="#EF4444" />
                  {errors.rw}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor HP <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon name="phone" size={18} />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: 'phoneNumber',
                        value: e.target.value.replace(/\D/g, ''),
                      },
                    })
                  }
                  placeholder="081234567890"
                  maxLength={13}
                  className={`w-full pl-12 pr-4 py-3 neo-input text-gray-800 placeholder-gray-400 ${
                    errors.phoneNumber ? 'ring-2 ring-red-300' : ''
                  }`}
                  required
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <Icon name="warning" size={12} color="#EF4444" />
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kode Kader <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon name="id" size={18} />
                </div>
                <input
                  type="text"
                  name="kaderCode"
                  value={formData.kaderCode}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: 'kaderCode',
                        value: e.target.value.toUpperCase(),
                      },
                    })
                  }
                  placeholder="Contoh: PKK2025"
                  maxLength={10}
                  className={`w-full pl-12 pr-4 py-3 neo-input text-gray-800 placeholder-gray-400 ${
                    errors.kaderCode ? 'ring-2 ring-red-300' : ''
                  }`}
                  required
                />
              </div>
              {errors.kaderCode && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <Icon name="warning" size={12} color="#EF4444" />
                  {errors.kaderCode}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Icon name="info" size={12} />
                Hubungi kader PKK untuk mendapatkan kode
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Buat PIN <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon name="lock" size={18} />
                </div>
                <input
                  type={showPin ? 'text' : 'password'}
                  name="pin"
                  value={formData.pin}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: 'pin',
                        value: e.target.value.replace(/\D/g, ''),
                      },
                    })
                  }
                  placeholder="4-6 digit"
                  maxLength={6}
                  className={`w-full pl-12 pr-12 py-3 neo-input text-gray-800 placeholder-gray-400 tracking-widest ${
                    errors.pin ? 'ring-2 ring-red-300' : ''
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <Icon name={showPin ? 'eyeSlash' : 'eye'} size={18} />
                </button>
              </div>
              {errors.pin && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <Icon name="warning" size={12} color="#EF4444" />
                  {errors.pin}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Konfirmasi PIN <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon name="lock" size={18} />
                </div>
                <input
                  type={showPin ? 'text' : 'password'}
                  name="confirmPin"
                  value={formData.confirmPin}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: 'confirmPin',
                        value: e.target.value.replace(/\D/g, ''),
                      },
                    })
                  }
                  placeholder="Ulangi PIN"
                  maxLength={6}
                  className={`w-full pl-12 pr-4 py-3 neo-input text-gray-800 placeholder-gray-400 tracking-widest ${
                    errors.confirmPin ? 'ring-2 ring-red-300' : ''
                  }`}
                  required
                />
              </div>
              {errors.confirmPin && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <Icon name="warning" size={12} color="#EF4444" />
                  {errors.confirmPin}
                </p>
              )}
            </div>

            <div className="neo-inset p-3 rounded-xl">
              <label className="flex items-start text-xs text-gray-700">
                <input type="checkbox" className="mt-0.5 mr-2" required />
                <span>
                  Saya setuju untuk mengikuti program EduPangan dan bersedia
                  mengelola pekarangan rumah untuk ketahanan pangan keluarga
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-4 rounded-xl font-semibold
                flex items-center justify-center gap-2
                transition-all
                ${isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-white active:neo-button-active shadow-neo-button'
                }
              `}
            >
              {isLoading ? (
                <>
                  <Icon name="refresh" size={20} className="animate-spin" />
                  Mendaftar...
                </>
              ) : (
                <>
                  <Icon name="sparkles" size={20} color="white" />
                  Daftar Sekarang
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Sudah punya akun?{' '}
              <button
                onClick={onNavigateToLogin}
                className="text-green-500 font-semibold hover:text-green-600"
              >
                Masuk di sini
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
