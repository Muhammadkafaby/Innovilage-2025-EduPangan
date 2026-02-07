'use client';

import React, { useState } from 'react';
import { useGardenData } from '../../hooks/useGardenData';
import { useNotifications } from '../../hooks/useNotifications';
import { vegetables } from '../../data/staticData';

/**
 * Kebun Saya Component
 * Halaman detail kebun pengguna dengan:
 * - Tanaman aktif
 * - Riwayat aktivitas
 * - Tambah tanaman baru
 * - Status panen
 */
const KebunSaya = ({ onNavigateBack, onNavigate }) => {
    const [showAddPlant, setShowAddPlant] = useState(false);
    const [selectedVegetable, setSelectedVegetable] = useState('');
    const [quantity, setQuantity] = useState('');

    const { plants, activities, stats, addPlant, updatePlant } = useGardenData();
    const { notifyPlanting } = useNotifications();

    // Handle adding new plant
    const handleAddPlant = () => {
        if (!selectedVegetable || !quantity) {
            alert('Pilih tanaman dan jumlah terlebih dahulu');
            return;
        }

        const vegetable = vegetables.find(v => v.name === selectedVegetable);
        if (vegetable) {
            addPlant({
                name: vegetable.name,
                quantity: parseInt(quantity),
                growthPeriod: vegetable.growthPeriod,
                category: vegetable.category
            });
            notifyPlanting(vegetable.name, quantity);
            setShowAddPlant(false);
            setSelectedVegetable('');
            setQuantity('');
        }
    };

    // Mark plant as ready to harvest
    const handleMarkReady = (plantId) => {
        updatePlant(plantId, { status: 'siap_panen' });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 pt-8 pb-6 px-6">
                <button
                    onClick={onNavigateBack}
                    className="text-white mb-4 flex items-center text-sm font-medium"
                >
                    <span className="mr-2">←</span> Kembali
                </button>
                <h1 className="text-2xl font-bold text-white mb-2">Kebun Saya</h1>
                <p className="text-green-100 text-sm">
                    Kelola tanaman dan pantau pertumbuhan kebun Anda
                </p>
            </div>

            {/* Stats Summary */}
            <div className="px-6 -mt-3">
                <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-3xl font-bold text-green-600">{stats.activePlants}</p>
                            <p className="text-xs text-gray-600">Tanaman Aktif</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-yellow-600">{stats.readyToHarvest}</p>
                            <p className="text-xs text-gray-600">Siap Panen</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-blue-600">{stats.totalHarvest}</p>
                            <p className="text-xs text-gray-600">Total Panen (kg)</p>
                        </div>
                    </div>
                </div>

                {/* Add Plant Button */}
                <button
                    onClick={() => setShowAddPlant(true)}
                    className="w-full bg-green-500 text-white py-4 rounded-xl font-semibold mb-4 flex items-center justify-center space-x-2 hover:bg-green-600 active:scale-95 shadow-lg"
                >
                    <span className="text-xl">🌱</span>
                    <span>Tambah Tanaman Baru</span>
                </button>

                {/* Active Plants */}
                <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
                    <h3 className="font-bold text-gray-800 mb-4">Tanaman Aktif</h3>

                    {plants.length === 0 ? (
                        <div className="text-center py-8">
                            <span className="text-5xl block mb-3">🌿</span>
                            <p className="text-gray-600 font-medium">Belum ada tanaman</p>
                            <p className="text-sm text-gray-500">Tambahkan tanaman pertama Anda!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {plants.map((plant) => {
                                const daysSincePlanted = Math.floor(
                                    (new Date() - new Date(plant.plantedDate)) / (1000 * 60 * 60 * 24)
                                );

                                return (
                                    <div
                                        key={plant.id}
                                        className={`p-4 rounded-xl border-2 ${plant.status === 'siap_panen'
                                                ? 'bg-yellow-50 border-yellow-300'
                                                : 'bg-green-50 border-green-200'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-2xl">
                                                    {plant.status === 'siap_panen' ? '✅' : '🌱'}
                                                </span>
                                                <div>
                                                    <p className="font-bold text-gray-800">{plant.name}</p>
                                                    <p className="text-xs text-gray-600">
                                                        {plant.quantity} bibit • Ditanam {daysSincePlanted} hari lalu
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${plant.status === 'siap_panen'
                                                    ? 'bg-yellow-200 text-yellow-800'
                                                    : 'bg-green-200 text-green-800'
                                                }`}>
                                                {plant.status === 'siap_panen' ? 'Siap Panen' : 'Tumbuh'}
                                            </span>
                                        </div>

                                        {plant.status === 'tumbuh' && (
                                            <button
                                                onClick={() => handleMarkReady(plant.id)}
                                                className="w-full mt-2 bg-yellow-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600"
                                            >
                                                Tandai Siap Panen
                                            </button>
                                        )}

                                        {plant.status === 'siap_panen' && (
                                            <button
                                                onClick={() => onNavigate('catat-panen')}
                                                className="w-full mt-2 bg-green-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-600"
                                            >
                                                Catat Panen
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-2xl shadow-lg p-5">
                    <h3 className="font-bold text-gray-800 mb-4">Aktivitas Terbaru</h3>

                    {activities.length === 0 ? (
                        <div className="text-center py-6">
                            <span className="text-4xl block mb-2">📝</span>
                            <p className="text-sm text-gray-500">Belum ada aktivitas tercatat</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activities.slice(0, 5).map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">
                                            {activity.type === 'tanam' ? '🌱' : activity.type === 'panen' ? '✅' : '💧'}
                                        </span>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-800">
                                                {activity.type === 'tanam' ? 'Menanam' :
                                                    activity.type === 'panen' ? 'Panen' : 'Aktivitas'} {activity.plantName}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {new Date(activity.date).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-green-600">
                                        {activity.quantity} {activity.unit || 'bibit'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Plant Modal */}
            {showAddPlant && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-gray-800">Tambah Tanaman Baru</h3>
                            <button
                                onClick={() => setShowAddPlant(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Pilih Tanaman
                                </label>
                                <select
                                    value={selectedVegetable}
                                    onChange={(e) => setSelectedVegetable(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none"
                                >
                                    <option value="">Pilih tanaman...</option>
                                    {vegetables.map((v) => (
                                        <option key={v.id} value={v.name}>
                                            {v.name} ({v.growthPeriod})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Jumlah Bibit
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="Masukkan jumlah"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none"
                                />
                            </div>

                            <button
                                onClick={handleAddPlant}
                                className="w-full bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 active:scale-95"
                            >
                                🌱 Tanam Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KebunSaya;
