'use client';

import React, { useState, useEffect } from 'react';
import Icon from '../shared/Icon';
import Badge from '../shared/Badge';
import { Skeleton, GridSkeleton } from '../shared/Skeleton';
import { useApi } from '../../hooks/useApi';

const BankBibit = ({ onNavigateBack, onOrder, userId = 1 }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedVegetable, setSelectedVegetable] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [seeds, setSeeds] = useState([]);

  const { get, post, loading, error } = useApi('/api');

  const categories = [
    { id: 'Semua', icon: 'grid' },
    { id: 'Sayuran Hijau', icon: 'sparkles' },
    { id: 'Buah', icon: 'heart' },
    { id: 'Bumbu', icon: 'fire' },
    { id: 'Herbal', icon: 'sun' },
    { id: 'Kacang-kacangan', icon: 'gift' },
    { id: 'Umbi', icon: 'chart' },
  ];

  useEffect(() => {
    loadSeeds();
  }, []);

  const loadSeeds = async () => {
    try {
      const data = await get('/seeds', { type: 'stock' });
      setSeeds(data);
    } catch (err) {
      console.error('Failed to load seeds:', err);
    }
  };

  const filteredVegetables = seeds.filter((veg) => {
    const matchesSearch = veg.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || veg.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOrder = async () => {
    if (selectedVegetable && orderQuantity > 0) {
      try {
        await post('/seeds', {
          type: 'order',
          userId: userId,
          vegetableId: selectedVegetable.id,
          vegetableName: selectedVegetable.name,
          quantity: orderQuantity,
        });

        alert(`Berhasil memesan ${orderQuantity} bibit ${selectedVegetable.name}!`);

        onOrder && onOrder({
          vegetable: selectedVegetable,
          quantity: orderQuantity,
        });

        setSelectedVegetable(null);
        setOrderQuantity(1);
        loadSeeds();
      } catch (err) {
        alert('Gagal memesan: ' + (err.message || 'Terjadi kesalahan'));
      }
    }
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || 'sparkles';
  };

  const getStockStatus = (stock) => {
    if (stock > 100) return { variant: 'success', label: 'Tersedia' };
    if (stock > 50) return { variant: 'warning', label: 'Terbatas' };
    return { variant: 'error', label: 'Hampir Habis' };
  };

  if (selectedVegetable) {
    const stockStatus = getStockStatus(selectedVegetable.stockAvailable);

    return (
      <div className="min-h-screen bg-[#E0E5EC] pb-8">
        <div className="px-6 pt-8 pb-4">
          <button
            onClick={() => setSelectedVegetable(null)}
            className="neo-button w-10 h-10 flex items-center justify-center mb-4"
          >
            <Icon name="arrowLeft" size={20} color="#6B7280" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Detail Bibit</h1>
        </div>

        <div className="px-6 space-y-5">
          <div className="neo-card p-6">
            <div className="w-full h-48 neo-inset rounded-2xl flex items-center justify-center mb-4">
              <Icon name={getCategoryIcon(selectedVegetable.category)} size={80} color="#4CAF50" />
            </div>

            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedVegetable.name}</h2>
                <p className="text-sm text-gray-500 italic">{selectedVegetable.scientificName}</p>
              </div>
              <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Icon name="tag" size={16} color="#9CA3AF" />
              <span className="text-sm text-gray-600">{selectedVegetable.category}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="neo-inset p-3 rounded-xl text-center">
                <Icon name="clock" size={20} color="#4CAF50" className="mx-auto mb-1" />
                <p className="text-xs text-gray-500">Waktu Tumbuh</p>
                <p className="text-sm font-bold text-gray-800">{selectedVegetable.growthPeriod}</p>
              </div>
              <div className="neo-inset p-3 rounded-xl text-center">
                <Icon name="drop" size={20} color="#3B82F6" className="mx-auto mb-1" />
                <p className="text-xs text-gray-500">Keb. Air</p>
                <p className="text-sm font-bold text-gray-800">{selectedVegetable.waterNeeds}</p>
              </div>
              <div className="neo-inset p-3 rounded-xl text-center">
                <Icon name="chart" size={20} color="#F59E0B" className="mx-auto mb-1" />
                <p className="text-xs text-gray-500">Kesulitan</p>
                <p className="text-sm font-bold text-gray-800">{selectedVegetable.difficulty}</p>
              </div>
            </div>
          </div>

          <div className="neo-card p-5">
            <h3 className="font-bold text-gray-800 mb-3">Kandungan Gizi</h3>
            <div className="space-y-2">
              <div className="neo-inset p-3 rounded-xl flex justify-between">
                <span className="text-sm text-gray-600">Vitamin</span>
                <span className="text-sm font-semibold text-gray-800">{selectedVegetable.nutritionFacts?.vitamin}</span>
              </div>
              <div className="neo-inset p-3 rounded-xl flex justify-between">
                <span className="text-sm text-gray-600">Mineral</span>
                <span className="text-sm font-semibold text-gray-800">{selectedVegetable.nutritionFacts?.mineral}</span>
              </div>
              <div className="neo-inset p-3 rounded-xl flex justify-between">
                <span className="text-sm text-gray-600">Kalori</span>
                <span className="text-sm font-semibold text-gray-800">{selectedVegetable.nutritionFacts?.calories}</span>
              </div>
            </div>
          </div>

          <div className="neo-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="sun" size={20} color="#F59E0B" />
              <h3 className="font-bold text-gray-800">Tips Menanam</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{selectedVegetable.tips}</p>
          </div>

          <div className="neo-card p-5">
            <h3 className="font-bold text-gray-800 mb-4">Pesan Bibit</h3>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Jumlah Bibit</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 5))}
                  className="neo-button w-12 h-12 flex items-center justify-center"
                >
                  <Icon name="minus" size={20} color="#6B7280" />
                </button>
                <div className="flex-1 neo-inset py-3 text-center rounded-xl">
                  <span className="text-2xl font-bold text-gray-800">{orderQuantity}</span>
                </div>
                <button
                  onClick={() => setOrderQuantity(Math.min(selectedVegetable.stockAvailable, orderQuantity + 5))}
                  className="neo-button w-12 h-12 flex items-center justify-center"
                >
                  <Icon name="plus" size={20} color="#6B7280" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Maksimal: {selectedVegetable.stockAvailable} bibit
              </p>
            </div>

            <div className="neo-inset p-4 rounded-xl mb-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Harga per bibit</span>
                <span className="font-semibold text-gray-800">Rp {selectedVegetable.price?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Jumlah ({orderQuantity} bibit)</span>
                <span className="font-semibold text-gray-800">Rp {(selectedVegetable.price * orderQuantity)?.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="font-bold text-gray-800">Total Iuran</span>
                <span className="text-xl font-bold text-green-500">Rp {(selectedVegetable.price * orderQuantity)?.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleOrder}
              disabled={loading}
              className={`
                w-full py-4 rounded-xl font-semibold
                flex items-center justify-center gap-2
                transition-all
                ${loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-white active:neo-button-active shadow-neo-button'
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
                  <Icon name="shoppingBag" size={20} color="white" />
                  Pesan Sekarang
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              Bibit akan dikembalikan 2x lipat setelah panen
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E0E5EC] pb-8">
      <div className="px-6 pt-8 pb-4 sticky top-0 bg-[#E0E5EC] z-10">
        <button
          onClick={onNavigateBack}
          className="neo-button w-10 h-10 flex items-center justify-center mb-4"
        >
          <Icon name="arrowLeft" size={20} color="#6B7280" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Bank Bibit</h1>

        <div className="neo-inset rounded-xl flex items-center px-4 py-3">
          <Icon name="search" size={20} color="#9CA3AF" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari bibit..."
            className="flex-1 bg-transparent border-none outline-none ml-3 text-gray-800 placeholder-gray-400"
          />
        </div>
      </div>

      <div className="px-6 py-4 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap
                transition-all font-medium text-sm
                ${selectedCategory === cat.id
                  ? 'neo-button text-green-500'
                  : 'neo-inset text-gray-500'
                }
              `}
            >
              <Icon name={cat.icon} size={16} color={selectedCategory === cat.id ? '#4CAF50' : '#9CA3AF'} />
              {cat.id}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6">
        {loading && (
          <div className="space-y-4">
            <GridSkeleton count={4} columns={2} />
          </div>
        )}

        {error && (
          <div className="neo-card p-4 border-l-4 border-red-500 bg-red-50">
            <div className="flex items-center gap-3">
              <Icon name="errorCircle" size={20} color="#EF4444" />
              <p className="text-sm text-red-600">Error: {error}</p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {filteredVegetables.length} bibit tersedia
            </p>

            <div className="grid grid-cols-2 gap-4">
              {filteredVegetables.map((vegetable) => {
                const stockStatus = getStockStatus(vegetable.stockAvailable);
                return (
                  <button
                    key={vegetable.id}
                    onClick={() => setSelectedVegetable(vegetable)}
                    className="neo-card p-4 text-left active:neo-button-active transition-all"
                  >
                    <div className="w-full h-28 neo-inset rounded-xl flex items-center justify-center mb-3">
                      <Icon name={getCategoryIcon(vegetable.category)} size={48} color="#4CAF50" />
                    </div>

                    <h3 className="font-bold text-gray-800 text-sm mb-1">{vegetable.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{vegetable.category}</p>

                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="clock" size={12} color="#9CA3AF" />
                      <span className="text-xs text-gray-500">{vegetable.growthPeriod}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${
                        stockStatus.variant === 'success' ? 'text-green-500' :
                        stockStatus.variant === 'warning' ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        Stok: {vegetable.stockAvailable}
                      </span>
                      <span className="text-sm font-bold text-green-500">
                        Rp {vegetable.price?.toLocaleString()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {filteredVegetables.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 neo-inset rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon name="search" size={32} color="#9CA3AF" />
                </div>
                <p className="text-gray-500 font-medium">Bibit tidak ditemukan</p>
                <p className="text-sm text-gray-400 mt-1">Coba kata kunci lain</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BankBibit;
