'use client';

import React, { useEffect } from 'react';
import { useMqtt, MQTT_STATE } from '../../hooks/useMqtt';

/**
 * DeviceMonitor Component
 * Dedicated IoT monitoring dengan:
 * - Real-time sensor data dari MQTT
 * - Kontrol pompa (ON/OFF/AUTO)
 * - Status koneksi
 */
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

    // Auto-connect on mount
    useEffect(() => {
        if (deviceNumber) {
            connect();
        }
        return () => disconnect();
    }, [deviceNumber]);

    // Get status color
    const getStatusColor = () => {
        switch (connectionState) {
            case MQTT_STATE.CONNECTED: return 'bg-green-500';
            case MQTT_STATE.CONNECTING: return 'bg-yellow-500 animate-pulse';
            case MQTT_STATE.ERROR: return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    // Get moisture level color
    const getMoistureColor = (value) => {
        if (value >= 70) return 'text-green-600';
        if (value >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    // Get pump status display
    const getPumpDisplay = (status) => {
        switch (status) {
            case 'NYALA': return { text: 'Menyala', color: 'bg-blue-500', icon: '💧' };
            case 'ISTIRAHAT': return { text: 'Istirahat', color: 'bg-yellow-500', icon: '⏸️' };
            default: return { text: 'Mati', color: 'bg-gray-400', icon: '⏹️' };
        }
    };

    const pumpDisplay = getPumpDisplay(sensorData?.pompa);

    return (
        <div className="min-h-screen bg-gray-50 pb-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 pt-8 pb-6 px-6 rounded-b-3xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={onNavigateBack}
                        className="bg-white/20 p-2 rounded-full hover:bg-white/30"
                    >
                        <span className="text-xl">←</span>
                    </button>
                    <h1 className="text-xl font-bold text-white">Device Monitor</h1>
                    <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
                        <span className="text-xs text-white/80">
                            {connectionState.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Device Info */}
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-xs">Device ID</p>
                            <p className="text-white font-bold text-lg">Telyuk_{user?.deviceId}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-blue-100 text-xs">Mode</p>
                            <p className="text-white font-bold">{sensorData?.mode || '-'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 mt-6 space-y-5">
                {/* Connection Error */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                        <div className="flex items-center">
                            <span className="text-xl mr-3">⚠️</span>
                            <div>
                                <p className="font-semibold text-red-700 text-sm">Error</p>
                                <p className="text-red-600 text-xs">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Connection Status Card */}
                {!isConnected && !error && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="text-xl mr-3">{isConnecting ? '🔄' : '📡'}</span>
                                <div>
                                    <p className="font-semibold text-yellow-700 text-sm">
                                        {isConnecting ? 'Menghubungkan...' : 'Tidak Terhubung'}
                                    </p>
                                    <p className="text-yellow-600 text-xs">
                                        {isConnecting ? 'Mohon tunggu' : 'Tekan tombol untuk mencoba lagi'}
                                    </p>
                                </div>
                            </div>
                            {!isConnecting && (
                                <button
                                    onClick={connect}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600"
                                >
                                    Hubungkan
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Moisture Card */}
                <div className="bg-white rounded-2xl shadow-lg p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-800 text-sm">Kelembapan Tanah</h3>
                        <span className="text-2xl">💧</span>
                    </div>

                    <div className="text-center">
                        <p className={`text-5xl font-bold ${getMoistureColor(sensorData?.kelembapan || 0)}`}>
                            {sensorData?.kelembapan ?? '--'}%
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                            ADC Raw: {sensorData?.adc_raw ?? '-'} | Kering: {sensorData?.adc_dry ?? '-'} | Basah: {sensorData?.adc_wet ?? '-'}
                        </p>
                    </div>

                    {/* Moisture Progress Bar */}
                    <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${(sensorData?.kelembapan || 0) >= 70 ? 'bg-green-500' :
                                    (sensorData?.kelembapan || 0) >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                            style={{ width: `${sensorData?.kelembapan || 0}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Kering</span>
                        <span>Normal</span>
                        <span>Basah</span>
                    </div>
                </div>

                {/* Pump Status Card */}
                <div className="bg-white rounded-2xl shadow-lg p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-800 text-sm">Status Pompa</h3>
                        <span className="text-2xl">{pumpDisplay.icon}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${pumpDisplay.color}`}></div>
                            <span className="font-semibold text-lg text-gray-800">{pumpDisplay.text}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${sensorData?.mode === 'AUTO' ? 'bg-green-500' : 'bg-orange-500'
                            }`}>
                            {sensorData?.mode || 'UNKNOWN'}
                        </span>
                    </div>

                    {/* System Status */}
                    {sensorData?.status && sensorData.status !== 'NORMAL' && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-600 text-sm font-medium">⚠️ {sensorData.status}</p>
                        </div>
                    )}
                </div>

                {/* Pump Control */}
                <div className="bg-white rounded-2xl shadow-lg p-5">
                    <h3 className="font-bold text-gray-800 text-sm mb-4">Kontrol Pompa</h3>

                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={pumpOn}
                            disabled={!isConnected}
                            className={`py-4 rounded-xl font-semibold text-sm transition-all ${isConnected
                                    ? 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <span className="text-2xl block mb-1">💧</span>
                            NYALA
                        </button>

                        <button
                            onClick={pumpOff}
                            disabled={!isConnected}
                            className={`py-4 rounded-xl font-semibold text-sm transition-all ${isConnected
                                    ? 'bg-gray-500 text-white hover:bg-gray-600 active:scale-95'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <span className="text-2xl block mb-1">⏹️</span>
                            MATI
                        </button>

                        <button
                            onClick={pumpAuto}
                            disabled={!isConnected}
                            className={`py-4 rounded-xl font-semibold text-sm transition-all ${isConnected
                                    ? 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <span className="text-2xl block mb-1">🤖</span>
                            AUTO
                        </button>
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-4">
                        {isConnected
                            ? 'Mode AUTO: pompa otomatis jika kelembapan < 50%'
                            : 'Hubungkan ke device untuk mengontrol pompa'
                        }
                    </p>
                </div>

                {/* WiFi & Connection Info */}
                <div className="bg-white rounded-2xl shadow-lg p-5">
                    <h3 className="font-bold text-gray-800 text-sm mb-4">Info Koneksi</h3>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <span className="text-xl">📶</span>
                                <span className="text-sm text-gray-700">WiFi Device</span>
                            </div>
                            <span className={`text-sm font-semibold ${sensorData?.wifi === 'CONNECTED' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {sensorData?.wifi || '-'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <span className="text-xl">🌐</span>
                                <span className="text-sm text-gray-700">MQTT Broker</span>
                            </div>
                            <span className={`text-sm font-semibold ${isConnected ? 'text-green-600' : 'text-gray-400'}`}>
                                {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                            </span>
                        </div>

                        {lastUpdate && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <span className="text-xl">🕐</span>
                                    <span className="text-sm text-gray-700">Update Terakhir</span>
                                </div>
                                <span className="text-sm text-gray-600">
                                    {lastUpdate.toLocaleTimeString('id-ID')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Get Device Info Button */}
                <button
                    onClick={getDeviceInfo}
                    disabled={!isConnected}
                    className={`w-full py-4 rounded-xl font-semibold transition-all ${isConnected
                            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 active:scale-95'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    📋 Ambil Info Device
                </button>
            </div>
        </div>
    );
};

export default DeviceMonitor;
