import React, { useEffect } from 'react';

/**
 * SplashScreen Component
 * Tampilan awal aplikasi dengan logo dan tagline EduPangan
 * Auto-redirect ke halaman login setelah 3 detik
 */
const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete && onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-600 flex flex-col items-center justify-center p-6">
      {/* Logo Container */}
      <div className="relative mb-8 animate-bounce">
        {/* Icon Lingkaran dengan Tanaman */}
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
          <div className="text-6xl">🌱</div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-300 rounded-full opacity-75 animate-pulse"></div>
        <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-orange-300 rounded-full opacity-75 animate-pulse delay-150"></div>
      </div>

      {/* App Name */}
      <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
        EduPangan
      </h1>

      {/* Tagline */}
      <p className="text-xl text-white text-center font-medium px-8 mb-8">
        Panen Cerdas,<br />
        Gizi Keluarga Terjaga
      </p>

      {/* Subtitle */}
      <p className="text-sm text-green-100 text-center px-6 mb-12">
        Indramayu Smart Food Village
      </p>

      {/* Loading Indicator */}
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-100"></div>
        <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-200"></div>
      </div>

      {/* Version */}
      <p className="absolute bottom-8 text-xs text-green-100">
        v1.0.0 - Beta
      </p>
    </div>
  );
};

export default SplashScreen;
