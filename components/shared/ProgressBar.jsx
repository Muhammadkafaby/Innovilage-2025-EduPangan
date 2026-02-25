'use client';

import React from 'react';

export function ProgressBar({
  value = 0,
  max = 100,
  color = 'green',
  size = 'md',
  showLabel = false,
  label = '',
  className = '',
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const getColorByValue = (val) => {
    if (val >= 70) return 'bg-green-500';
    if (val >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const barColor = color === 'auto' ? getColorByValue(percentage) : colorClasses[color];

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-600">{label}</span>
          {showLabel && (
            <span className="text-xs font-bold text-gray-700">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]} overflow-hidden neo-inset`}>
        <div
          className={`${barColor} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function CircularProgress({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 10,
  color = 'green',
  showValue = true,
  label = '',
  className = '',
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colors = {
    green: '#4CAF50',
    blue: '#3B82F6',
    orange: '#F59E0B',
    red: '#EF4444',
    yellow: '#FBBF24',
    purple: '#8B5CF6',
  };

  const getColorByValue = (val) => {
    if (val >= 70) return colors.green;
    if (val >= 40) return colors.yellow;
    return colors.red;
  };

  const strokeColor = color === 'auto' ? getColorByValue(percentage) : colors[color];

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        {showValue && (
          <span className="text-2xl font-bold text-gray-800">
            {Math.round(percentage)}%
          </span>
        )}
        {label && (
          <span className="text-xs text-gray-500">{label}</span>
        )}
      </div>
    </div>
  );
}

export function Gauge({
  value = 0,
  label = '',
  minLabel = 'Min',
  maxLabel = 'Max',
  color = 'auto',
  size = 'md',
  className = '',
}) {
  const percentage = Math.min(Math.max(value, 0), 100);

  const sizes = {
    sm: { width: 100, height: 50 },
    md: { width: 140, height: 70 },
    lg: { width: 180, height: 90 },
  };

  const { width, height } = sizes[size];
  const radius = height - 10;
  const centerX = width / 2;
  const centerY = height - 5;

  const getColorByValue = (val) => {
    if (val >= 70) return '#4CAF50';
    if (val >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const colors = {
    green: '#4CAF50',
    blue: '#3B82F6',
    orange: '#F59E0B',
    red: '#EF4444',
  };

  const strokeColor = color === 'auto' ? getColorByValue(percentage) : colors[color];

  const angle = (percentage / 100) * 180 - 90;
  const radians = (angle * Math.PI) / 180;
  const needleLength = radius - 20;
  const needleX = centerX + needleLength * Math.cos(radians);
  const needleY = centerY + needleLength * Math.sin(radians);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#4CAF50" />
          </linearGradient>
        </defs>
        <path
          d={`M 10 ${centerY} A ${radius} ${radius} 0 0 1 ${width - 10} ${centerY}`}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={8}
          strokeLinecap="round"
        />
        <circle cx={centerX} cy={centerY} r={6} fill="#374151" />
        <line
          x1={centerX}
          y1={centerY}
          x2={needleX}
          y2={needleY}
          stroke="#374151"
          strokeWidth={2}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="text-center mt-1">
        <span className="text-xl font-bold" style={{ color: strokeColor }}>
          {Math.round(percentage)}%
        </span>
        {label && (
          <p className="text-xs text-gray-500">{label}</p>
        )}
      </div>
      <div className="flex justify-between w-full px-2 -mt-1">
        <span className="text-xs text-gray-400">{minLabel}</span>
        <span className="text-xs text-gray-400">{maxLabel}</span>
      </div>
    </div>
  );
}

export default ProgressBar;
