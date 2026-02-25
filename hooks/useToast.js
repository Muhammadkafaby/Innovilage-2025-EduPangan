'use client';

import { useState, useCallback, createContext, useContext } from 'react';

const ToastContext = createContext(null);

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

const defaultConfig = {
  duration: 3000,
  position: 'top',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = TOAST_TYPES.INFO, options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type,
      ...defaultConfig,
      ...options,
    };

    setToasts((prev) => [...prev, toast]);

    if (toast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (message, options = {}) => addToast(message, TOAST_TYPES.SUCCESS, options),
    [addToast]
  );

  const error = useCallback(
    (message, options = {}) => addToast(message, TOAST_TYPES.ERROR, options),
    [addToast]
  );

  const warning = useCallback(
    (message, options = {}) => addToast(message, TOAST_TYPES.WARNING, options),
    [addToast]
  );

  const info = useCallback(
    (message, options = {}) => addToast(message, TOAST_TYPES.INFO, options),
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default useToast;
