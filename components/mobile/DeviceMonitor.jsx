'use client';

import React, { useEffect } from 'react';
import Icon from '../shared/Icon';
import Badge from '../shared/Badge';
import { CircularProgress } from '../shared/ProgressBar';
import { useMqtt, MQTT_STATE } from '../../hooks/useMqtt';

const DeviceMonitor = ({ user, onNavigateBack }) => {
  const deviceNumber = user?.deviceNumber || 1;
  const {
    connectionState,
    isConnected,
    isConnecting,
    sensorData,
    error,
    lastUpdate,
    connect,
    disconnect,
    pumpOn,
    pumpOff,
    pumpAuto,
    getDeviceInfo
  } = useMqtt(deviceNumber);

  useEffect(() => {
    if (deviceNumber) {
      connect();
    }
    return () => disconnect();
  }, [deviceNumber, connect, disconnect]);

  const getStatusConfig = () => {
    switch (connectionState) {
      case MQTT_STATE.CONNECTED:
        return { label: 'Terhubung', variant: 'success', icon: 'wifi' };
      case MQTT_STATE.CONNECTING:
        return { label: 'Menghubungkan', variant: 'warning', icon: 'refresh' };
      case MQTT_STATE.ERROR:
        return { label: 'Error', variant: 'error', icon: 'errorCircle' };
      default:
        return { label: 'Terputus', variant: 'default', icon: 'wifi' };
    }
  };

  const getMoistureConfig = (value) => {
    if (value >= 70) return { status: 'Basah', color: '#3B82F6', level: 'high' };
    if (value >= 40) return { status: 'Normal', color: '#4CAF50', level: 'medium' };
    return { status: 'Kering', color: '#EF4444', level: 'low' };
  };

  const getPumpConfig = (status) => {
    switch (status) {
      case 'NYALA':
        return { label: 'Menyala', color: 'bg-blue-500', icon: 'drop', textColor: 'text-blue-500' };
      case 'ISTIRAHAT':
        return { label: 'Istirahat', color: 'bg-yellow-500', icon: 'pause', textColor: 'text-yellow-500' };
      default:
        return { label: 'Mati', color: 'bg-gray-400', icon: 'stop', textColor: 'text-gray-400' };
    }
  };

  const statusConfig = getStatusConfig();
  const moistureConfig = getMoistureConfig(sensorData?.kelembapan || 0);
  const pumpConfig = getPumpConfig(sensorData?.pompa);

  return (
    <div className="min-h-screen bg-transparent pb-8">
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onNavigateBack}
            className="neo-button w-10 h-10 flex items-center justify-center border border-white/45"
          >
            <Icon name="arrowLeft" size={20} color="#6B7280" />
          </button>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                connectionState === MQTT_STATE.CONNECTED ? 'bg-green-500 animate-pulse' :
                connectionState === MQTT_STATE.CONNECTING ? 'bg-yellow-500 animate-pulse' :
                connectionState === MQTT_STATE.ERROR ? 'bg-red-500' :
                'bg-gray-400'
              }`}
            />
            <span className="text-sm font-medium text-gray-600">{statusConfig.label}</span>
          </div>
        </div>

        <div className="neo-card p-4 border border-white/45">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 neo-inset rounded-xl flex items-center justify-center">
                <Icon name="deviceMobile" size={24} color="#3B82F6" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Device ID</p>
                <p className="font-bold text-gray-800">Telyuk_{user?.deviceId}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Mode</p>
              <p className="font-bold text-gray-800">{sensorData?.mode || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-5">
        {error && (
          <div className="neo-card p-4 border-l-4 border-red-500 bg-red-50 border border-red-100">
            <div className="flex items-center gap-3">
              <Icon name="errorCircle" size={24} color="#EF4444" />
              <div>
                <p className="font-semibold text-red-700">Koneksi Gagal</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!isConnected && !error && (
          <div className="neo-card p-4 border border-white/45">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 neo-inset rounded-xl flex items-center justify-center ${isConnecting ? 'animate-pulse' : ''}`}>
                  <Icon name={isConnecting ? 'refresh' : 'wifi'} size={24} color={isConnecting ? '#F59E0B' : '#9CA3AF'} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {isConnecting ? 'Menghubungkan...' : 'Tidak Terhubung'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isConnecting ? 'Mohon tunggu' : 'Tekan tombol untuk mencoba lagi'}
                  </p>
                </div>
              </div>
              {!isConnecting && (
                <button
                  onClick={connect}
                  className="neo-button px-4 py-2 text-sm font-semibold text-yellow-600 border border-white/40"
                >
                  Hubungkan
                </button>
              )}
            </div>
          </div>
        )}

        <div className="neo-card p-6 border border-white/45">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800">Kelembapan Tanah</h3>
            <Badge variant={moistureConfig.level === 'high' ? 'info' : moistureConfig.level === 'medium' ? 'success' : 'error'}>
              {moistureConfig.status}
            </Badge>
          </div>

          <div className="flex justify-center mb-6">
            <CircularProgress
              value={sensorData?.kelembapan ?? 0}
              size={160}
              strokeWidth={12}
              color="auto"
              label="Kelembapan"
            />
          </div>

          <div className="neo-inset p-3 rounded-xl">
            <div className="flex justify-between text-xs text-gray-500">
              <span>ADC: {sensorData?.adc_raw ?? '-'}</span>
              <span>Kering: {sensorData?.adc_dry ?? '-'}</span>
              <span>Basah: {sensorData?.adc_wet ?? '-'}</span>
            </div>
          </div>
        </div>

        <div className="neo-card p-5 border border-white/45">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Status Pompa</h3>
            <div className={`w-10 h-10 ${pumpConfig.color} rounded-xl flex items-center justify-center`}>
              <Icon name={pumpConfig.icon} size={20} color="white" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 neo-inset rounded-xl">
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${pumpConfig.color}`} />
              <span className={`font-semibold text-lg ${pumpConfig.textColor}`}>{pumpConfig.label}</span>
            </div>
            <Badge variant={sensorData?.mode === 'AUTO' ? 'success' : 'warning'}>
              {sensorData?.mode || 'MANUAL'}
            </Badge>
          </div>

          {sensorData?.status && sensorData.status !== 'NORMAL' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
              <Icon name="warning" size={18} color="#EF4444" />
              <span className="text-sm text-red-600">{sensorData.status}</span>
            </div>
          )}
        </div>

        <div className="neo-card p-5 border border-white/45">
          <h3 className="font-bold text-gray-800 mb-4">Kontrol Pompa</h3>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <button
              onClick={pumpOn}
              disabled={!isConnected}
              className={`
                neo-button py-5 flex flex-col items-center gap-2 transition-all
                ${!isConnected ? 'opacity-50 cursor-not-allowed' : 'active:neo-button-active'}
              `}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isConnected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Icon name="drop" size={24} color={isConnected ? '#3B82F6' : '#9CA3AF'} />
              </div>
              <span className={`text-sm font-semibold ${isConnected ? 'text-blue-500' : 'text-gray-400'}`}>
                NYALA
              </span>
            </button>

            <button
              onClick={pumpOff}
              disabled={!isConnected}
              className={`
                neo-button py-5 flex flex-col items-center gap-2 transition-all
                ${!isConnected ? 'opacity-50 cursor-not-allowed' : 'active:neo-button-active'}
              `}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isConnected ? 'bg-gray-200' : 'bg-gray-100'}`}>
                <Icon name="stop" size={24} color={isConnected ? '#6B7280' : '#9CA3AF'} />
              </div>
              <span className={`text-sm font-semibold ${isConnected ? 'text-gray-600' : 'text-gray-400'}`}>
                MATI
              </span>
            </button>

            <button
              onClick={pumpAuto}
              disabled={!isConnected}
              className={`
                neo-button py-5 flex flex-col items-center gap-2 transition-all
                ${!isConnected ? 'opacity-50 cursor-not-allowed' : 'active:neo-button-active'}
              `}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isConnected ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Icon name="sparkles" size={24} color={isConnected ? '#4CAF50' : '#9CA3AF'} />
              </div>
              <span className={`text-sm font-semibold ${isConnected ? 'text-green-500' : 'text-gray-400'}`}>
                AUTO
              </span>
            </button>
          </div>

          <div className="neo-inset p-3 rounded-xl">
            <p className="text-xs text-gray-500 text-center">
              {isConnected
                ? 'Mode AUTO: pompa menyala otomatis jika kelembapan di bawah 50%'
                : 'Hubungkan ke device untuk mengontrol pompa'
              }
            </p>
          </div>
        </div>

        <div className="neo-card p-5 border border-white/45">
          <h3 className="font-bold text-gray-800 mb-4">Info Koneksi</h3>

          <div className="space-y-3">
            <div className="neo-inset p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="wifi" size={20} color="#9CA3AF" />
                <span className="text-sm text-gray-700">WiFi Device</span>
              </div>
              <Badge variant={sensorData?.wifi === 'CONNECTED' ? 'success' : 'error'}>
                {sensorData?.wifi || 'Unknown'}
              </Badge>
            </div>

            <div className="neo-inset p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="globe" size={20} color="#9CA3AF" />
                <span className="text-sm text-gray-700">MQTT Broker</span>
              </div>
              <Badge variant={isConnected ? 'success' : 'default'}>
                {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </Badge>
            </div>

            {lastUpdate && (
              <div className="neo-inset p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="clock" size={20} color="#9CA3AF" />
                  <span className="text-sm text-gray-700">Update Terakhir</span>
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {lastUpdate.toLocaleTimeString('id-ID')}
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={getDeviceInfo}
          disabled={!isConnected}
          className={`
            w-full neo-button py-4 font-semibold flex items-center justify-center gap-2 transition-all
            ${isConnected ? 'text-blue-500 active:neo-button-active border border-white/45' : 'text-gray-400 cursor-not-allowed border border-white/45'}
          `}
        >
          <Icon name="clipboard" size={20} color={isConnected ? '#3B82F6' : '#9CA3AF'} />
          Ambil Info Device
        </button>
      </div>
    </div>
  );
};

export default DeviceMonitor;
