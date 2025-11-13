import React, { useState } from 'react';

/**
 * Register Component
 * Form pendaftaran untuk pengguna baru
 * Input: Nama, RW, Nomor HP, Kode Kader, PIN
 */
const Register = ({ onRegister, onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    rw: '',
    phoneNumber: '',
    kaderCode: '',
    pin: '',
    confirmPin: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error saat user mulai mengetik
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.fullName.length < 3) {
      newErrors.fullName = 'Nama minimal 3 karakter';
    }

    if (!formData.rw || formData.rw === '') {
      newErrors.rw = 'Pilih RW Anda';
    }

    if (formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = 'Nomor HP tidak valid';
    }

    if (formData.kaderCode.length < 4) {
      newErrors.kaderCode = 'Kode kader tidak valid';
    }

    if (formData.pin.length < 4 || formData.pin.length > 6) {
      newErrors.pin = 'PIN harus 4-6 digit';
    }

    if (formData.pin !== formData.confirmPin) {
      newErrors.confirmPin = 'PIN tidak sama';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulasi API call
    setTimeout(() => {
      setIsLoading(false);
      onRegister && onRegister(formData);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-yellow-50 pb-8">
      {/* Header */}
      <div className="bg-green-500 pt-8 pb-20 px-6 rounded-b-[3rem] shadow-lg">
        <button
          onClick={onNavigateToLogin}
          className="text-white mb-4 flex items-center text-sm font-medium"
        >
          <span className="mr-2">←</span> Kembali
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">
          Daftar Akun Baru
        </h1>
        <p className="text-green-100 text-sm">
          Bergabung dengan program EduPangan
        </p>
      </div>

      {/* Form Container */}
      <div className="px-6 -mt-12">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ibu Siti Aminah"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 transition-all outline-none ${
                  errors.fullName
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-green-500'
                }`}
                required
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* RW Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                RW <span className="text-red-500">*</span>
              </label>
              <select
                name="rw"
                value={formData.rw}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 transition-all outline-none appearance-none bg-white ${
                  errors.rw
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-green-500'
                }`}
                required
              >
                <option value="">Pilih RW</option>
                <option value="01">RW 01</option>
                <option value="02">RW 02</option>
                <option value="03">RW 03</option>
                <option value="04">RW 04</option>
                <option value="05">RW 05</option>
                <option value="06">RW 06</option>
                <option value="07">RW 07</option>
                <option value="08">RW 08</option>
              </select>
              {errors.rw && (
                <p className="text-red-500 text-xs mt-1">{errors.rw}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor HP <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: 'phoneNumber',
                      value: e.target.value.replace(/\D/g, ''),
                    },
                  })
                }
                placeholder="081234567890"
                maxLength="13"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 transition-all outline-none ${
                  errors.phoneNumber
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-green-500'
                }`}
                required
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Kader Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kode Kader <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="kaderCode"
                value={formData.kaderCode}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: 'kaderCode',
                      value: e.target.value.toUpperCase(),
                    },
                  })
                }
                placeholder="Contoh: PKK2025"
                maxLength="10"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 transition-all outline-none ${
                  errors.kaderCode
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-green-500'
                }`}
                required
              />
              {errors.kaderCode && (
                <p className="text-red-500 text-xs mt-1">{errors.kaderCode}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Hubungi kader PKK untuk mendapatkan kode
              </p>
            </div>

            {/* PIN */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Buat PIN <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="pin"
                value={formData.pin}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: 'pin',
                      value: e.target.value.replace(/\D/g, ''),
                    },
                  })
                }
                placeholder="4-6 digit"
                maxLength="6"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 transition-all outline-none tracking-widest ${
                  errors.pin
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-green-500'
                }`}
                required
              />
              {errors.pin && (
                <p className="text-red-500 text-xs mt-1">{errors.pin}</p>
              )}
            </div>

            {/* Confirm PIN */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Konfirmasi PIN <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPin"
                value={formData.confirmPin}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: 'confirmPin',
                      value: e.target.value.replace(/\D/g, ''),
                    },
                  })
                }
                placeholder="Ulangi PIN"
                maxLength="6"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-200 transition-all outline-none tracking-widest ${
                  errors.confirmPin
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200 focus:border-green-500'
                }`}
                required
              />
              {errors.confirmPin && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPin}</p>
              )}
            </div>

            {/* Terms */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <label className="flex items-start text-xs text-gray-700">
                <input
                  type="checkbox"
                  className="mt-0.5 mr-2"
                  required
                />
                <span>
                  Saya setuju untuk mengikuti program EduPangan dan bersedia
                  mengelola pekarangan rumah untuk ketahanan pangan keluarga
                </span>
              </label>
            </div>

            {/* Submit Button */}
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
                  Mendaftar...
                </span>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <button
                onClick={onNavigateToLogin}
                className="text-green-600 font-semibold hover:text-green-700"
              >
                Masuk di sini
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
