'use client';

import React from 'react';

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    primary: 'bg-primary-100 text-primary-700',
  };

  const dotColors = {
    default: 'bg-gray-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    primary: 'bg-primary-500',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}

export function StatusBadge({ status, className = '' }) {
  const statusConfig = {
    active: { label: 'Aktif', variant: 'success', dot: true },
    inactive: { label: 'Nonaktif', variant: 'default', dot: true },
    pending: { label: 'Menunggu', variant: 'warning', dot: true },
    success: { label: 'Sukses', variant: 'success', dot: true },
    error: { label: 'Gagal', variant: 'error', dot: true },
    connected: { label: 'Terhubung', variant: 'success', dot: true },
    disconnected: { label: 'Terputus', variant: 'error', dot: true },
    connecting: { label: 'Menghubungkan', variant: 'warning', dot: true },
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <Badge variant={config.variant} dot={config.dot} className={className}>
      {config.label}
    </Badge>
  );
}

export function CountBadge({ count = 0, max = 99, className = '' }) {
  const displayCount = count > max ? `${max}+` : count;

  if (count === 0) return null;

  return (
    <span
      className={`
        inline-flex items-center justify-center
        min-w-[20px] h-5 px-1.5
        bg-red-500 text-white
        text-xs font-bold
        rounded-full
        ${className}
      `}
    >
      {displayCount}
    </span>
  );
}

export default Badge;
