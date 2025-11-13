import React, { useState } from 'react';
import { vegetables } from '../../data/dummyData';

/**
 * Catat Panen Component
 * Form untuk mencatat hasil panen dengan:
 * - Pilih jenis tanaman
 * - Input jumlah panen
 * - Upload foto (optional)
 * - Catatan tambahan
 */
const CatatPanen = ({ onNavigateBack, onSubmit }) => {
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

  // Get list of vegetables for dropdown
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
        // 5MB limit
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

    // Simulasi API call
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit && onSubmit(formData);

      // Reset form
      setFormData({
        plantType: '',
        quantity: '',
        unit: 'kg',
        harvestDate: new Date().toISOString().split('T')[0],
        notes: '',
        photo: null,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-green-500 pt-8 pb-6 px-6">
        <button
          onClick={onNavigateBack}
          className="text-white mb-4 flex items-center text-sm font-medium"
        >
          <span className="mr-2">←</span> Kembali
        </button>
        <h1 className="text-2xl font-bold text-white mb-2">Catat Panen</h1>
        <p className="text-green-100 text-sm">
          Catat hasil panen Anda untuk tracking gizi keluarga
        </p>
      </div>

      {/* Form */}
      <div className="px-6 -mt-2">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
          {/* Plant Type Selection */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jenis Tanaman <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.plantType}
              onChange={(e) => handleChange('plantType', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 transition-all outline-none appearance-none bg-white ${
                errors.plantType
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-200 focus:border-green-500'
              }`}
            >
              <option value="">Pilih tanaman...</option>
              {plantOptions.map((plant) => (
                <option key={plant.id} value={plant.name}>
                  {plant.name} - {plant.category}
                </option>
              ))}
            </select>
            {errors.plantType && (
              <p className="text-red-500 text-xs mt-1">{errors.plantType}</p>
            )}
          </div>

          {/* Quantity Input */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jumlah Panen <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-3">
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                placeholder="0.0"
                className={`flex-1 px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 transition-all outline-none ${
                  errors.quantity
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-green-500'
                }`}
              />
              <select
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none bg-white"
              >
                <option value="kg">Kg</option>
                <option value="gram">Gram</option>
                <option value="ikat">Ikat</option>
                <option value="buah">Buah</option>
              </select>
            </div>
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
            )}
          </div>

          {/* Harvest Date */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tanggal Panen
            </label>
            <input
              type="date"
              value={formData.harvestDate}
              onChange={(e) => handleChange('harvestDate', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
            />
          </div>

          {/* Photo Upload */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Foto Hasil Panen (Opsional)
            </label>

            {formData.photo ? (
              <div className="relative">
                <img
                  src={formData.photo}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => handleChange('photo', null)}
                  className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <span className="text-5xl mb-3 block">📷</span>
                <p className="text-sm text-gray-600 font-medium">
                  Tap untuk upload foto
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Maksimal 5MB (JPG, PNG)
                </p>
              </label>
            )}
            {errors.photo && (
              <p className="text-red-500 text-xs mt-1">{errors.photo}</p>
            )}
          </div>

          {/* Notes */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Catatan Tambahan (Opsional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Contoh: Kualitas bagus, warna hijau segar"
              rows="3"
              maxLength="200"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none resize-none"
            />
            <p className="text-xs text-gray-500 text-right mt-1">
              {formData.notes.length}/200
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-5">
            <div className="flex items-start">
              <span className="text-2xl mr-3">💡</span>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">
                  Kenapa Catat Panen?
                </h3>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Monitoring konsumsi gizi keluarga</li>
                  <li>• Analisis produktivitas kebun</li>
                  <li>• Dapatkan rekomendasi menu sehat</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all shadow-lg ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 active:scale-95'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
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
                Menyimpan...
              </span>
            ) : (
              '✓ Simpan Catatan Panen'
            )}
          </button>
        </form>

        {/* Recent Harvests */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-4">
          <h3 className="font-bold text-gray-800 mb-4 text-sm">
            Panen Terbaru Anda
          </h3>
          <div className="space-y-3">
            {[
              { plant: 'Bayam', amount: '2.5 kg', date: '8 Jan' },
              { plant: 'Kangkung', amount: '3.0 kg', date: '5 Jan' },
              { plant: 'Cabai', amount: '0.8 kg', date: '2 Jan' },
            ].map((harvest, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">
                      {harvest.plant}
                    </p>
                    <p className="text-xs text-gray-600">{harvest.date}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-600">
                  {harvest.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatatPanen;
