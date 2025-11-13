import React, { useState } from 'react';
import { vegetables } from '../../data/dummyData';

/**
 * Bank Bibit Component
 * Katalog bibit yang tersedia dengan fitur:
 * - Filter kategori
 * - Search
 * - Detail bibit
 * - Pemesanan
 */
const BankBibit = ({ onNavigateBack, onOrder }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedVegetable, setSelectedVegetable] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);

  const categories = [
    'Semua',
    'Sayuran Hijau',
    'Buah',
    'Bumbu',
    'Herbal',
    'Kacang-kacangan',
    'Umbi',
  ];

  // Filter vegetables
  const filteredVegetables = vegetables.filter((veg) => {
    const matchesSearch = veg.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Semua' || veg.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOrder = () => {
    if (selectedVegetable && orderQuantity > 0) {
      onOrder &&
        onOrder({
          vegetable: selectedVegetable,
          quantity: orderQuantity,
        });
      setSelectedVegetable(null);
      setOrderQuantity(1);
    }
  };

  // Detail Modal
  if (selectedVegetable) {
    return (
      <div className="min-h-screen bg-gray-50 pb-8">
        {/* Header */}
        <div className="bg-green-500 pt-8 pb-6 px-6">
          <button
            onClick={() => setSelectedVegetable(null)}
            className="text-white mb-4 flex items-center text-sm font-medium"
          >
            <span className="mr-2">←</span> Kembali
          </button>
          <h1 className="text-2xl font-bold text-white">Detail Bibit</h1>
        </div>

        {/* Content */}
        <div className="px-6 -mt-2">
          {/* Image Placeholder */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
            <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4">
              <span className="text-8xl">🌿</span>
            </div>

            {/* Basic Info */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedVegetable.name}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedVegetable.stockAvailable > 100
                      ? 'bg-green-100 text-green-700'
                      : selectedVegetable.stockAvailable > 50
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  Stok: {selectedVegetable.stockAvailable}
                </span>
              </div>
              <p className="text-sm text-gray-600 italic mb-1">
                {selectedVegetable.scientificName}
              </p>
              <p className="text-sm text-gray-700">
                Kategori: {selectedVegetable.category}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">Waktu Tumbuh</p>
                <p className="text-sm font-bold text-green-600">
                  {selectedVegetable.growthPeriod}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">Air</p>
                <p className="text-sm font-bold text-blue-600">
                  {selectedVegetable.waterNeeds}
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">Kesulitan</p>
                <p className="text-sm font-bold text-orange-600">
                  {selectedVegetable.difficulty}
                </p>
              </div>
            </div>

            {/* Nutrition Facts */}
            <div className="border-t pt-4 mb-4">
              <h3 className="font-bold text-gray-800 mb-3 text-sm">
                Kandungan Gizi
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vitamin:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedVegetable.nutritionFacts.vitamin}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mineral:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedVegetable.nutritionFacts.mineral}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kalori:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedVegetable.nutritionFacts.calories}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">💡</span>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">
                    Tips Menanam
                  </h4>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {selectedVegetable.tips}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4">Pesan Bibit</h3>

            {/* Quantity Selector */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jumlah Bibit
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 5))}
                  className="w-12 h-12 bg-gray-200 rounded-lg font-bold text-xl hover:bg-gray-300 active:scale-95"
                >
                  -
                </button>
                <input
                  type="number"
                  value={orderQuantity}
                  onChange={(e) =>
                    setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="flex-1 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg py-2"
                  min="1"
                  max={selectedVegetable.stockAvailable}
                />
                <button
                  onClick={() =>
                    setOrderQuantity(
                      Math.min(
                        selectedVegetable.stockAvailable,
                        orderQuantity + 5
                      )
                    )
                  }
                  className="w-12 h-12 bg-gray-200 rounded-lg font-bold text-xl hover:bg-gray-300 active:scale-95"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Maksimal: {selectedVegetable.stockAvailable} bibit
              </p>
            </div>

            {/* Price Calculation */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Harga per bibit:</span>
                <span className="font-semibold text-gray-800">
                  Rp {selectedVegetable.price.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Jumlah ({orderQuantity} bibit):
                </span>
                <span className="font-semibold text-gray-800">
                  Rp {(selectedVegetable.price * orderQuantity).toLocaleString()}
                </span>
              </div>
              <div className="border-t border-green-300 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">Total Iuran:</span>
                  <span className="text-xl font-bold text-green-600">
                    Rp {(selectedVegetable.price * orderQuantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Button */}
            <button
              onClick={handleOrder}
              className="w-full bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 active:scale-95 transition-all"
            >
              Pesan Sekarang
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              Bibit akan dikembalikan 2x lipat setelah panen
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Catalog View
  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-green-500 pt-8 pb-6 px-6 sticky top-0 z-10">
        <button
          onClick={onNavigateBack}
          className="text-white mb-4 flex items-center text-sm font-medium"
        >
          <span className="mr-2">←</span> Kembali
        </button>
        <h1 className="text-2xl font-bold text-white mb-4">Bank Bibit</h1>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari bibit..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border-0 shadow-md outline-none"
          />
          <span className="absolute left-4 top-3.5 text-xl">🔍</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-6 py-4 overflow-x-auto">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Vegetables Grid */}
      <div className="px-6">
        <p className="text-sm text-gray-600 mb-4">
          {filteredVegetables.length} bibit tersedia
        </p>

        <div className="grid grid-cols-2 gap-4">
          {filteredVegetables.map((vegetable) => (
            <button
              key={vegetable.id}
              onClick={() => setSelectedVegetable(vegetable)}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow active:scale-95 text-left"
            >
              {/* Image Placeholder */}
              <div className="w-full h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mb-3">
                <span className="text-5xl">🌿</span>
              </div>

              {/* Info */}
              <h3 className="font-bold text-gray-800 text-sm mb-1">
                {vegetable.name}
              </h3>
              <p className="text-xs text-gray-600 mb-2">{vegetable.category}</p>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-600">⏱️ {vegetable.growthPeriod}</span>
              </div>

              {/* Stock & Price */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-semibold ${
                    vegetable.stockAvailable > 100
                      ? 'text-green-600'
                      : vegetable.stockAvailable > 50
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  Stok: {vegetable.stockAvailable}
                </span>
                <span className="text-sm font-bold text-green-600">
                  Rp {vegetable.price.toLocaleString()}
                </span>
              </div>
            </button>
          ))}
        </div>

        {filteredVegetables.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-gray-600">Bibit tidak ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankBibit;
