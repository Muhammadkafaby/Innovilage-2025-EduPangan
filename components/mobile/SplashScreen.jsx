'use client';

import React, { useEffect, useState } from 'react';
import Icon from '../shared/Icon';

const SplashScreen = ({ onComplete }) => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const phase1 = setTimeout(() => setAnimationPhase(1), 500);
    const phase2 = setTimeout(() => setAnimationPhase(2), 1200);
    const phase3 = setTimeout(() => setAnimationPhase(3), 2000);
    const timer = setTimeout(() => {
      onComplete && onComplete();
    }, 3000);

    return () => {
      clearTimeout(phase1);
      clearTimeout(phase2);
      clearTimeout(phase3);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(134,239,172,0.28),transparent_40%),radial-gradient(circle_at_82%_28%,rgba(251,191,36,0.2),transparent_42%),radial-gradient(circle_at_50%_78%,rgba(59,130,246,0.12),transparent_38%)]" />
        <div className="absolute top-16 left-6 w-28 h-28 bg-white/40 rounded-full blur-2xl animate-pulse-slow" />
        <div className="absolute bottom-28 right-8 w-36 h-36 bg-orange-200/30 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-green-200/30 rounded-full blur-2xl animate-pulse-slow delay-500" />
      </div>

      <div className="absolute top-7 left-6 right-6 z-10 flex items-center justify-between text-xs text-gray-500">
        <div className="neo-card-sm px-3 py-1.5 rounded-full">Indramayu</div>
        <div className="neo-card-sm px-3 py-1.5 rounded-full">Demo UI</div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div
          className={`
            relative mb-8 transition-all duration-700 ease-out
            ${animationPhase >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
          `}
        >
          <div className="w-32 h-32 neo-card-lg flex items-center justify-center relative border border-white/40">
            <div className="absolute inset-2 rounded-[22px] bg-white/20" />
            <div
              className={`
                relative z-10 transition-all duration-500
                ${animationPhase >= 2 ? 'scale-100 rotate-0' : 'scale-75 rotate-12'}
              `}
            >
              <Icon name="sparkles" size={64} color="#4CAF50" />
            </div>
            <div className="absolute -top-3 -right-3 w-8 h-8 neo-button flex items-center justify-center border border-white/50">
              <Icon name="drop" size={18} color="#3B82F6" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 neo-button-sm flex items-center justify-center border border-white/50">
              <Icon name="sun" size={14} color="#F59E0B" />
            </div>
          </div>
          <div className="absolute -inset-4 bg-green-500/10 rounded-[50px] animate-pulse-slow" />
        </div>

        <div
          className={`
            text-center transition-all duration-700 delay-200
            ${animationPhase >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}
        >
          <h1 className="text-5xl font-extrabold text-gray-800 mb-2 tracking-tight">
            Edu<span className="text-green-500">Pangan</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-0.5 w-8 bg-gradient-to-r from-transparent to-green-500 rounded-full" />
            <span className="text-gray-500 text-sm font-semibold tracking-wide">Smart Food Village</span>
            <div className="h-0.5 w-8 bg-gradient-to-l from-transparent to-green-500 rounded-full" />
          </div>
        </div>

        <p
          className={`
            text-center text-gray-600 max-w-xs transition-all duration-700 delay-500
            ${animationPhase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}
        >
          Panen Cerdas,<br />
          <span className="font-semibold text-green-600">Gizi Keluarga Terjaga</span>
        </p>

        <div
          className={`
            mt-12 transition-all duration-500 delay-700
            ${animationPhase >= 3 ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div className="neo-card-sm px-4 py-3 rounded-2xl border border-white/35">
            <div className="flex items-center gap-2">
            <div className="w-2 h-2 neo-inset rounded-full">
              <div
                className="w-full h-full bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
            </div>
            <div className="w-2 h-2 neo-inset rounded-full">
              <div
                className="w-full h-full bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
            </div>
            <div className="w-2 h-2 neo-inset rounded-full">
              <div
                className="w-full h-full bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
              <span className="ml-2 text-xs font-semibold text-gray-500">Memuat pengalaman kebun</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 text-center px-6">
        <div className="neo-card-sm px-4 py-3 rounded-2xl border border-white/40">
          <p className="text-xs text-gray-500 font-semibold">
          Indramayu Smart Food Village
          </p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="text-xs text-gray-400">v1.0.0</span>
            <span className="text-xs text-gray-300">•</span>
            <span className="text-xs text-green-600 font-semibold">Beta</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
