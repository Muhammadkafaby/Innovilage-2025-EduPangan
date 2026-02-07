'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Hook for managing notifications
 * Data persists in localStorage
 */
export function useNotifications() {
  const [notifications, setNotifications] = useLocalStorage('edupangan_notifications', []);

  // Add a new notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      date: new Date().toISOString(),
      read: false,
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  }, [setNotifications]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  }, [setNotifications]);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, [setNotifications]);

  // Remove a notification
  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, [setNotifications]);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);

  // Stats
  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length,
    [notifications]
  );

  // Create common notification types
  const notifyHarvest = useCallback((plantName, quantity, unit) => {
    return addNotification({
      type: 'harvest',
      title: 'Panen Berhasil!',
      message: `Berhasil mencatat panen ${quantity} ${unit} ${plantName}`,
      icon: '🌿'
    });
  }, [addNotification]);

  const notifyPlanting = useCallback((plantName, quantity) => {
    return addNotification({
      type: 'planting',
      title: 'Bibit Ditanam!',
      message: `${quantity} bibit ${plantName} telah ditanam`,
      icon: '🌱'
    });
  }, [addNotification]);

  const notifyWatering = useCallback((message) => {
    return addNotification({
      type: 'reminder',
      title: 'Pengingat Irigasi',
      message: message || 'Waktunya menyiram tanaman!',
      icon: '💧'
    });
  }, [addNotification]);

  const notifyMoisture = useCallback((moisture, status) => {
    return addNotification({
      type: 'sensor',
      title: status === 'low' ? '⚠️ Tanah Kering!' : 'Status Kelembapan',
      message: `Kelembapan tanah: ${moisture}%`,
      icon: status === 'low' ? '🔴' : '💧'
    });
  }, [addNotification]);

  return {
    // Data
    notifications,
    unreadCount,
    
    // Actions
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    
    // Helpers
    notifyHarvest,
    notifyPlanting,
    notifyWatering,
    notifyMoisture
  };
}

export default useNotifications;
