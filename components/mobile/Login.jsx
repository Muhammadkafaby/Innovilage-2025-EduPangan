import React, { useState } from 'react';
import { getDeviceOptions, getDeviceCredentials } from '../../lib/mqttConfig';

/**
 * Login Component
 * Halaman login dengan pilihan Device ID (1-26)
 * Menggunakan kredensial MQTT: Telyuk_XXX / Telyuk_XXX_Sukses
 */
const Login = ({ onLogin, onNavigateToRegister }) => {
  const [selectedDevice, setSelectedDevice] = useState('');
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

    setIsLoading(true);

    // Get MQTT credentials for the selected device
    const credentials = getDeviceCredentials(parseInt(selectedDevice));

    // Simulate connection test (actual MQTT connection will be done in Dashboard)
    setTimeout(() => {
      setIsLoading(false);
      onLogin && onLogin({
        deviceNumber: parseInt(selectedDevice),
        deviceId: credentials.deviceId,
        username: credentials.username,
        password: credentials.password
      });
    }, 1000);
  };

  const selectedCredentials = selectedDevice
    ? getDeviceCredentials(parseInt(selectedDevice))
    : null;

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
          Smart Watering
        </h1>
        <p className="text-green-100 text-center text-sm">
          Pilih device untuk mulai monitoring
        </p>
      </div>

      {/* Form Container */}
      <div className="flex-1 px-6 -mt-16">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Device Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pilih Device
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400">📡</span>
                <select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none text-gray-800 bg-white appearance-none cursor-pointer"
                  required
                >
                  <option value="">-- Pilih Device (1-26) --</option>
                  {deviceOptions.map((device) => (
                    <option key={device.value} value={device.value}>
                      {device.label}
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 top-3.5 text-gray-400 pointer-events-none">▼</span>
              </div>
            </div>

            {/* Auto-generated Credentials Display */}
            {selectedCredentials && (
              <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Kredensial MQTT (otomatis):</p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">👤</span>
                    <span className="text-sm font-mono text-gray-700">{selectedCredentials.username}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">🔒</span>
                    <span className="text-sm font-mono text-gray-700">{selectedCredentials.password}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || !selectedDevice}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all shadow-lg ${isLoading || !selectedDevice
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
                  Menghubungkan...
                </span>
              ) : (
                'Masuk ke Dashboard'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">info</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* MQTT Info */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>MQTT Broker: EMQX Cloud</p>
            <p>Protocol: WSS (WebSocket Secure)</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <div className="flex items-start">
            <span className="text-2xl mr-3">💡</span>
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
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-xs text-gray-500">
        <p>Smart Watering System v3.2</p>
        <p className="mt-1">EduPangan × Telyuk</p>
      </div>
    </div>
  );
};

export default Login;
