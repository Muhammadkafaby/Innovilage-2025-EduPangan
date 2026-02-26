'use client';

import React, { useEffect, useState } from 'react';
import SplashScreen from '../components/mobile/SplashScreen';
import Login from '../components/mobile/Login';
import Register from '../components/mobile/Register';
import Dashboard from '../components/mobile/Dashboard';
import BankBibit from '../components/mobile/BankBibit';
import CatatPanen from '../components/mobile/CatatPanen';
import MenuGizi from '../components/mobile/MenuGizi';
import Edukasi from '../components/mobile/Edukasi';
import DeviceMonitor from '../components/mobile/DeviceMonitor';
import KebunSaya from '../components/mobile/KebunSaya';
import Profil from '../components/mobile/Profil';
import AiFabChat from '../components/shared/AiFabChat';
import { ToastProvider } from '../hooks/useToast';
import ToastContainer from '../components/shared/Toast';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('splash');
  const [user, setUser] = useState(null);
  const [harvests, setHarvests] = useState([]);
  const { user: sessionUser, loading: authLoading, refreshUser, logout } = useAuth();
  const { get } = useApi('/api');

  useEffect(() => {
    if (!authLoading) {
      setUser(sessionUser);
    }
  }, [sessionUser, authLoading]);

  useEffect(() => {
    if (authLoading || currentPage === 'splash') return;
    if (!sessionUser && !['login', 'register'].includes(currentPage)) {
      setCurrentPage('login');
    }
  }, [authLoading, sessionUser, currentPage]);

  useEffect(() => {
    const loadHarvests = async () => {
      if (!user?.id) {
        setHarvests([]);
        return;
      }

      try {
        const data = await get('/garden', { userId: user.id, type: 'harvests' });
        setHarvests(data || []);
      } catch (error) {
        console.error('Failed to load harvests:', error);
        setHarvests([]);
      }
    };

    loadHarvests();
  }, [user?.id, get]);

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = (credentials) => {
    setUser(credentials);
    refreshUser();
    navigate('dashboard');
  };

  const handleRegister = (formData) => {
    setUser(null);
    alert('Pendaftaran berhasil. Silakan login untuk melanjutkan.');
    navigate('login');
  };

  const handleOrder = () => {
    navigate('dashboard');
  };

  const handleSubmitPanen = async () => {
    if (user?.id) {
      try {
        const data = await get('/garden', { userId: user.id, type: 'harvests' });
        setHarvests(data || []);
      } catch (error) {
        console.error('Failed to refresh harvests:', error);
      }
    }
    navigate('dashboard');
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setHarvests([]);
    navigate('login');
  };

  const handleSplashComplete = () => {
    if (sessionUser) {
      navigate('dashboard');
      return;
    }
    navigate('login');
  };

  return (
    <ToastProvider>
      <div className="max-w-md mx-auto min-h-screen mobile-shell">
        <ToastContainer />
        
        {currentPage === 'splash' && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}

        {currentPage === 'login' && (
          <Login
            onLogin={handleLogin}
            onNavigateToRegister={() => navigate('register')}
          />
        )}

        {currentPage === 'register' && (
          <Register
            onRegister={handleRegister}
            onNavigateToLogin={() => navigate('login')}
          />
        )}

        {currentPage === 'dashboard' && (
          <Dashboard user={user} onNavigate={navigate} onLogout={handleLogout} userId={user?.id} />
        )}

        {currentPage === 'bank-bibit' && (
          <BankBibit
            onNavigateBack={() => navigate('dashboard')}
            onOrder={handleOrder}
            userId={user?.id}
          />
        )}

        {currentPage === 'catat-panen' && (
          <CatatPanen
            onNavigateBack={() => navigate('dashboard')}
            onSubmit={handleSubmitPanen}
            userId={user?.id}
          />
        )}

        {currentPage === 'menu-gizi' && (
          <MenuGizi
            onNavigateBack={() => navigate('dashboard')}
            userHarvests={harvests}
          />
        )}

        {currentPage === 'edukasi' && (
          <Edukasi onNavigateBack={() => navigate('dashboard')} />
        )}

        {currentPage === 'device-monitor' && (
          <DeviceMonitor
            user={user}
            onNavigateBack={() => navigate('dashboard')}
          />
        )}

        {currentPage === 'kebun' && (
          <KebunSaya
            onNavigateBack={() => navigate('dashboard')}
            onNavigate={navigate}
            userId={user?.id}
          />
        )}

        {currentPage === 'profil' && (
          <Profil
            user={user}
            onNavigateBack={() => navigate('dashboard')}
            onLogout={handleLogout}
            onNavigate={navigate}
            userId={user?.id}
          />
        )}

        {currentPage !== 'splash' && currentPage !== 'login' && currentPage !== 'register' && (
          <AiFabChat mode="user" userName={user?.name} bottomOffsetClass="bottom-24" />
        )}
      </div>
    </ToastProvider>
  );
}
