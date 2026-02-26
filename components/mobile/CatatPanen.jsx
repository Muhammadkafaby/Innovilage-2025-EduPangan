'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Icon from '../shared/Icon';
import Badge from '../shared/Badge';
import { vegetables } from '../../data/staticData';
import { useApi } from '../../hooks/useApi';

const CatatPanen = ({ onNavigateBack, onSubmit, userId = 1 }) => {
  const [formData, setFormData] = useState({
    plantType: '',
    quantity: '',
    unit: 'kg',
    harvestDate: new Date().toISOString().split('T')[0],
    notes: '',
    photo: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [recentHarvests, setRecentHarvests] = useState([]);

  const { get, post } = useApi('/api');

  const loadRecentHarvests = useCallback(async () => {
    try {
      const harvestsData = await get('/garden', { userId, type: 'harvests' });
      setRecentHarvests(harvestsData || []);
    } catch (err) {
      console.error('Failed to load harvests:', err);
    }
  }, [get, userId]);

  useEffect(() => {
    loadRecentHarvests();
  }, [loadRecentHarvests]);

  const plantOptions = vegetables.map((v) => ({
    id: v.id,
    name: v.name,
    category: v.category,
  }));

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setErrors((prev) => ({
          ...prev,
          photo: 'Ukuran foto maksimal 5MB',
        }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('photo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.plantType) {
      newErrors.plantType = 'Pilih jenis tanaman';
    }

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Masukkan jumlah panen yang valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await post('/garden', {
        type: 'harvest',
        userId: userId,
        data: {
          plantType: formData.plantType,
          plantName: formData.plantType,
          quantity: parseFloat(formData.quantity),
          unit: formData.unit,
          harvestDate: formData.harvestDate,
          notes: formData.notes,
          photo: formData.photo,
        },
      });

      await post('/notifications', {
        userId,
        type: 'harvest',
        title: 'Panen Berhasil!',
        message: `Berhasil mencatat panen ${formData.quantity} ${formData.unit} ${formData.plantType}`,
        icon: '🌿',
      });

      alert('Catatan panen berhasil disimpan!');

      loadRecentHarvests();

      setIsSubmitting(false);
      onSubmit && onSubmit(formData);

      setFormData({
        plantType: '',
        quantity: '',
        unit: 'kg',
        harvestDate: new Date().toISOString().split('T')[0],
        notes: '',
        photo: null,
      });
    } catch (err) {
      alert('Gagal menyimpan catatan: ' + (err.message || 'Terjadi kesalahan'));
      setIsSubmitting(false);
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Catat Panen</h1>
        <p className="text-sm text-gray-500">Catat hasil panen untuk tracking gizi keluarga</p>
      </div>

      <div className="px-6 space-y-5">
        <div className="neo-card p-6 border border-white/45">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jenis Tanaman <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon name="sparkles" size={18} />
                </div>
                <select
                  value={formData.plantType}
                  onChange={(e) => handleChange('plantType', e.target.value)}
                  className={`w-full pl-12 pr-10 py-3 neo-input appearance-none bg-transparent text-gray-800 ${
                    errors.plantType ? 'ring-2 ring-red-300' : ''
                  }`}
                >
                  <option value="">Pilih tanaman...</option>
                  {plantOptions.map((plant) => (
                    <option key={plant.id} value={plant.name}>
                      {plant.name} - {plant.category}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="chevronDown" size={18} color="#9CA3AF" />
                </div>
              </div>
              {errors.plantType && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <Icon name="warning" size={12} color="#EF4444" />
                  {errors.plantType}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jumlah Panen <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon name="chart" size={18} />
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                    placeholder="0.0"
                    className={`w-full pl-12 pr-4 py-3 neo-input text-gray-800 ${
                      errors.quantity ? 'ring-2 ring-red-300' : ''
                    }`}
                  />
                </div>
                <select
                  value={formData.unit}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  className="px-4 py-3 neo-input bg-transparent text-gray-800 w-24"
                >
                  <option value="kg">Kg</option>
                  <option value="gram">Gram</option>
                  <option value="ikat">Ikat</option>
                  <option value="buah">Buah</option>
                </select>
              </div>
              {errors.quantity && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <Icon name="warning" size={12} color="#EF4444" />
                  {errors.quantity}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tanggal Panen
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon name="calendar" size={18} />
                </div>
                <input
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => handleChange('harvestDate', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full pl-12 pr-4 py-3 neo-input text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Foto Hasil Panen (Opsional)
              </label>

              {formData.photo ? (
                <div className="relative">
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden neo-inset">
                    <Image
                      src={formData.photo}
                      alt="Preview hasil panen"
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChange('photo', null)}
                    className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center neo-button"
                  >
                    <Icon name="xmark" size={16} color="white" />
                  </button>
                </div>
              ) : (
                  <label className="block neo-inset rounded-2xl p-8 text-center cursor-pointer border border-white/40">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="w-16 h-16 neo-button rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="camera" size={28} color="#9CA3AF" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Tap untuk upload foto
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Maksimal 5MB (JPG, PNG)
                  </p>
                </label>
              )}
              {errors.photo && (
                <p className="text-red-500 text-xs mt-1">{errors.photo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Catatan Tambahan (Opsional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Contoh: Kualitas bagus, warna hijau segar"
                rows={3}
                maxLength={200}
                className="w-full px-4 py-3 neo-input text-gray-800 resize-none"
              />
              <p className="text-xs text-gray-400 text-right mt-1">
                {formData.notes.length}/200
              </p>
            </div>

            <div className="neo-inset p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 neo-button rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name="info" size={18} color="#3B82F6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">
                    Data Tersimpan Otomatis
                  </h3>
                  <p className="text-xs text-gray-600">
                    Catatan panen Anda akan tersimpan dan muncul di Dashboard
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full py-4 rounded-xl font-semibold
                flex items-center justify-center gap-2
                transition-all
                ${isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-500 text-white active:neo-button-active shadow-green'
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <Icon name="refresh" size={20} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Icon name="check" size={20} color="white" />
                  Simpan Catatan Panen
                </>
              )}
            </button>
          </form>
        </div>

        <div className="neo-card p-5 border border-white/45">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Panen Terbaru</h3>
            <Badge>{recentHarvests.length} catatan</Badge>
          </div>

          {recentHarvests.length > 0 ? (
            <div className="space-y-3">
              {recentHarvests.slice(0, 3).map((harvest) => (
                <div
                  key={harvest.id}
                  className="neo-inset p-4 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Icon name="check" size={20} color="#4CAF50" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">
                        {harvest.plantType || harvest.plantName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(harvest.date || harvest.harvestDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-green-500">
                    {harvest.quantity} {harvest.unit}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 neo-inset rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Icon name="document" size={24} color="#9CA3AF" />
              </div>
              <p className="text-gray-500 text-sm">Belum ada catatan panen</p>
              <p className="text-xs text-gray-400 mt-1">Mulai catat hasil panen pertama Anda!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatatPanen;
