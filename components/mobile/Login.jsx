import React, { useState } from 'react';

/**
 * Login Component
 * Halaman login dengan input nomor HP dan PIN
 * Design: Simple, clean, dan mudah digunakan
 */
const Login = ({ onLogin, onNavigateToRegister }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi
    if (phoneNumber.length < 10) {
      setError('Nomor HP harus minimal 10 digit');
      return;
    }

    if (pin.length < 4) {
      setError('PIN harus 4-6 digit');
      return;
    }

    setIsLoading(true);

    // Simulasi API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin && onLogin({ phoneNumber, pin });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-yellow-50 flex flex-col">
      {/* Header */}
      <div className="bg-green-500 pt-12 pb-24 px-6 rounded-b-[3rem] shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
            <span className="text-4xl">🌱</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Selamat Datang
        </h1>
        <p className="text-green-100 text-center text-sm">
          Masuk untuk mengelola kebun Anda
        </p>
      </div>

      {/* Form Container */}
      <div className="flex-1 px-6 -mt-16">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Phone Number Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor HP
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400">📱</span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="081234567890"
                  maxLength="13"
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none text-gray-800"
                  required
                />
              </div>
            </div>

            {/* PIN Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                PIN
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400">🔒</span>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="****"
                  maxLength="6"
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none text-gray-800 tracking-widest"
                  required
                />
              </div>
              <button
                type="button"
                className="text-xs text-green-600 font-medium mt-2 hover:text-green-700"
              >
                Lupa PIN?
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all shadow-lg ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 active:scale-95'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Memproses...
                </span>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">atau</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Register Link */}
          <button
            onClick={onNavigateToRegister}
            className="w-full py-4 border-2 border-green-500 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all active:scale-95"
          >
            Daftar Akun Baru
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <div className="flex items-start">
            <span className="text-2xl mr-3">💡</span>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">
                Belum punya akun?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Hubungi kader PKK RT/RW Anda untuk mendapatkan kode pendaftaran
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-xs text-gray-500">
        <p>EduPangan © 2025</p>
        <p className="mt-1">Indramayu Smart Food Village</p>
      </div>
    </div>
  );
};

export default Login;
