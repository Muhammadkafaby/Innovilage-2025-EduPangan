'use client';

import React from 'react';
import { useToast, TOAST_TYPES } from '../../hooks/useToast';
import Icon from './Icon';

const typeStyles = {
  [TOAST_TYPES.SUCCESS]: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: 'success',
    iconColor: '#10B981',
  },
  [TOAST_TYPES.ERROR]: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'error',
    iconColor: '#EF4444',
  },
  [TOAST_TYPES.WARNING]: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: 'warningSolid',
    iconColor: '#F59E0B',
  },
  [TOAST_TYPES.INFO]: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'infoSolid',
    iconColor: '#3B82F6',
  },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col gap-2 max-w-sm w-full px-4">
      {toasts.map((toast) => {
        const style = typeStyles[toast.type] || typeStyles[TOAST_TYPES.INFO];

        return (
          <div
            key={toast.id}
            className={`
              ${style.bg} ${style.border} ${style.text}
              border rounded-2xl p-4 shadow-neo-card
              flex items-start gap-3
              animate-slide-down
              transition-all duration-300
            `}
          >
            <Icon
              name={style.icon}
              size={24}
              color={style.iconColor}
              className="flex-shrink-0"
            />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors"
            >
              <Icon name="xmark" size={18} color="currentColor" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
