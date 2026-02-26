'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../shared/Icon';
import Badge from '../shared/Badge';
import { ListSkeleton } from '../shared/Skeleton';
import { useApi } from '../../hooks/useApi';
import { vegetables } from '../../data/staticData';

const KebunSaya = ({ onNavigateBack, onNavigate, userId = 1 }) => {
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [selectedVegetable, setSelectedVegetable] = useState('');
  const [quantity, setQuantity] = useState('');

  const [plants, setPlants] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    activePlants: 0,
    readyToHarvest: 0,
    totalHarvest: 0,
  });

  const { get, post, put, del, loading, error } = useApi('/api');

  const loadGardenData = useCallback(async () => {
    try {
      const plantsData = await get('/garden', { userId, type: 'plants' });
      const activitiesData = await get('/garden', { userId, type: 'activities' });

      setPlants(plantsData || []);
      setActivities(activitiesData || []);

      const activePlantsCount = (plantsData || []).filter(p => p.status === 'tumbuh').length;
      const readyToHarvestCount = (plantsData || []).filter(p => p.status === 'siap_panen').length;
      const totalHarvestCount = (activitiesData || [])
        .filter(a => a.type === 'panen')
        .reduce((sum, a) => sum + (parseFloat(a.quantity) || 0), 0);

      setStats({
        activePlants: activePlantsCount,
        readyToHarvest: readyToHarvestCount,
        totalHarvest: totalHarvestCount.toFixed(1),
      });
    } catch (err) {
      console.error('Failed to load garden data:', err);
    }
  }, [get, userId]);

  useEffect(() => {
    loadGardenData();
  }, [loadGardenData]);

  const handleAddPlant = async () => {
    if (!selectedVegetable || !quantity) {
      alert('Pilih tanaman dan jumlah terlebih dahulu');
      return;
    }

    try {
      const vegetable = vegetables.find(v => v.name === selectedVegetable);
      if (vegetable) {
        await post('/garden', {
          type: 'plant',
          userId: userId,
          data: {
            name: vegetable.name,
            quantity: parseInt(quantity),
            growthPeriod: vegetable.growthPeriod,
            category: vegetable.category,
          },
        });

        await post('/notifications', {
          userId,
          type: 'planting',
          title: 'Bibit Ditanam!',
          message: `${quantity} bibit ${vegetable.name} telah ditanam`,
          icon: '🌱',
        });

        alert('Tanaman berhasil ditambahkan!');

        loadGardenData();
        setShowAddPlant(false);
        setSelectedVegetable('');
        setQuantity('');
      }
    } catch (err) {
      alert('Gagal menambahkan tanaman: ' + (err.message || 'Terjadi kesalahan'));
    }
  };

  const handleMarkReady = async (plantId) => {
    try {
      await put('/garden', {
        plantId: plantId,
        updates: { status: 'siap_panen' },
      });

      alert('Tanaman ditandai siap panen!');
      loadGardenData();
    } catch (err) {
      alert('Gagal mengupdate status: ' + (err.message || 'Terjadi kesalahan'));
    }
  };

  const handleDeletePlant = async (plantId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tanaman ini?')) {
      return;
    }

    try {
      await del('/garden?type=plant&id=' + plantId);
      alert('Tanaman berhasil dihapus!');
      loadGardenData();
    } catch (err) {
      alert('Gagal menghapus tanaman: ' + (err.message || 'Terjadi kesalahan'));
    }
  };

  return (
    <div className="min-h-screen bg-transparent pb-8">
      <div className="px-6 pt-8 pb-4">
        <button
          onClick={onNavigateBack}
          className="neo-button w-10 h-10 flex items-center justify-center mb-4 border border-white/45"
        >
          <Icon name="arrowLeft" size={20} color="#6B7280" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Kebun Saya</h1>
        <p className="text-sm text-gray-500">Kelola tanaman dan pantau pertumbuhan</p>
      </div>

      <div className="px-6 space-y-5">
        <div className="neo-card p-5 border border-white/45">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="w-12 h-12 neo-inset rounded-xl flex items-center justify-center mx-auto mb-2">
                <Icon name="sparkles" size={24} color="#4CAF50" />
              </div>
              <p className="text-2xl font-bold text-green-500">{stats.activePlants}</p>
              <p className="text-xs text-gray-500">Tanaman Aktif</p>
            </div>
            <div>
              <div className="w-12 h-12 neo-inset rounded-xl flex items-center justify-center mx-auto mb-2">
                <Icon name="check" size={24} color="#F59E0B" />
              </div>
              <p className="text-2xl font-bold text-orange-500">{stats.readyToHarvest}</p>
              <p className="text-xs text-gray-500">Siap Panen</p>
            </div>
            <div>
              <div className="w-12 h-12 neo-inset rounded-xl flex items-center justify-center mx-auto mb-2">
                <Icon name="chart" size={24} color="#3B82F6" />
              </div>
              <p className="text-2xl font-bold text-blue-500">{stats.totalHarvest}</p>
              <p className="text-xs text-gray-500">Kg Panen</p>
            </div>
          </div>
        </div>

        {loading && <ListSkeleton count={3} />}

        {error && (
          <div className="neo-card p-4 border-l-4 border-red-500 bg-red-50 border border-red-100">
            <div className="flex items-center gap-3">
              <Icon name="errorCircle" size={20} color="#EF4444" />
              <p className="text-sm text-red-600">Error: {error}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowAddPlant(true)}
          className="w-full neo-button py-4 flex items-center justify-center gap-2 text-green-500 font-semibold border border-white/45"
        >
          <Icon name="plus" size={20} color="#4CAF50" />
          Tambah Tanaman Baru
        </button>

        <div className="neo-card p-5 border border-white/45">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Tanaman Aktif</h3>
            <Badge>{plants.length} tanaman</Badge>
          </div>

          {plants.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 neo-inset rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="sparkles" size={32} color="#9CA3AF" />
              </div>
              <p className="text-gray-600 font-medium">Belum ada tanaman</p>
              <p className="text-sm text-gray-400 mt-1">Tambahkan tanaman pertama Anda!</p>
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
                    className={`neo-inset p-4 rounded-xl ${
                      plant.status === 'siap_panen' ? 'border-l-4 border-orange-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          plant.status === 'siap_panen' ? 'bg-orange-100' : 'bg-green-100'
                        }`}>
                          <Icon
                            name={plant.status === 'siap_panen' ? 'check' : 'sparkles'}
                            size={24}
                            color={plant.status === 'siap_panen' ? '#F59E0B' : '#4CAF50'}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{plant.name}</p>
                          <p className="text-xs text-gray-500">
                            {plant.quantity} bibit - {daysSincePlanted} hari lalu
                          </p>
                        </div>
                      </div>
                      <Badge variant={plant.status === 'siap_panen' ? 'warning' : 'success'}>
                        {plant.status === 'siap_panen' ? 'Siap Panen' : 'Tumbuh'}
                      </Badge>
                    </div>

                    {plant.status === 'tumbuh' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMarkReady(plant.id)}
                           className="flex-1 py-2 neo-button text-orange-500 text-sm font-semibold border border-white/40"
                         >
                          Tandai Siap Panen
                        </button>
                        <button
                          onClick={() => handleDeletePlant(plant.id)}
                           className="py-2 px-4 neo-button text-red-500 text-sm font-semibold border border-white/40"
                         >
                          <Icon name="trash" size={16} color="#EF4444" />
                        </button>
                      </div>
                    )}

                    {plant.status === 'siap_panen' && (
                      <button
                        onClick={() => onNavigate('catat-panen')}
                         className="w-full py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl text-sm font-semibold"
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

        <div className="neo-card p-5 border border-white/45">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Aktivitas Terbaru</h3>
            <Icon name="clock" size={18} color="#9CA3AF" />
          </div>

          {activities.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 neo-inset rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Icon name="document" size={24} color="#9CA3AF" />
              </div>
              <p className="text-sm text-gray-400">Belum ada aktivitas tercatat</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="neo-inset p-3 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activity.type === 'tanam' ? 'bg-green-100' :
                      activity.type === 'panen' ? 'bg-orange-100' : 'bg-blue-100'
                    }`}>
                      <Icon
                        name={activity.type === 'tanam' ? 'sparkles' :
                              activity.type === 'panen' ? 'check' : 'drop'}
                        size={18}
                        color={
                          activity.type === 'tanam' ? '#4CAF50' :
                          activity.type === 'panen' ? '#F59E0B' : '#3B82F6'
                        }
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">
                        {activity.type === 'tanam' ? 'Menanam' :
                         activity.type === 'panen' ? 'Panen' : 'Aktivitas'} {activity.plantName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-green-500">
                    {activity.quantity} {activity.unit || 'bibit'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddPlant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="neo-card w-full max-w-md p-6 animate-scale-in border border-white/45">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-800">Tambah Tanaman</h3>
              <button
                onClick={() => setShowAddPlant(false)}
                className="neo-button w-8 h-8 flex items-center justify-center border border-white/40"
              >
                <Icon name="xmark" size={18} color="#6B7280" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pilih Tanaman
                </label>
                <div className="relative">
                  <select
                    value={selectedVegetable}
                    onChange={(e) => setSelectedVegetable(e.target.value)}
                    className="w-full px-4 py-3 neo-input appearance-none bg-transparent text-gray-800"
                  >
                    <option value="">Pilih tanaman...</option>
                    {vegetables.map((v) => (
                      <option key={v.id} value={v.name}>
                        {v.name} ({v.growthPeriod})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon name="chevronDown" size={18} color="#9CA3AF" />
                  </div>
                </div>
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
                  className="w-full px-4 py-3 neo-input text-gray-800"
                />
              </div>

              <button
                onClick={handleAddPlant}
                disabled={loading}
                className={`
                  w-full py-4 rounded-xl font-semibold
                  flex items-center justify-center gap-2
                  transition-all
                  ${loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                     : 'bg-gradient-to-r from-green-600 to-green-500 text-white active:neo-button-active shadow-green'
                   }
                 `}
               >
                {loading ? (
                  <>
                    <Icon name="refresh" size={20} className="animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Icon name="sparkles" size={20} color="white" />
                    Tanam Sekarang
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KebunSaya;
