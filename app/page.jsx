'use client';

import React, { useState } from 'react';
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
import { ToastProvider } from '../hooks/useToast';
import ToastContainer from '../components/shared/Toast';
import { useGardenData } from '../hooks/useGardenData';
import { useNotifications } from '../hooks/useNotifications';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('splash');
  const [user, setUser] = useState(null);

  const { addPlant, plants } = useGardenData();
  const { notifyPlanting } = useNotifications();

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = (credentials) => {
    setUser({
      name: credentials.name,
      deviceNumber: credentials.deviceNumber,
      deviceId: credentials.deviceId,
      username: credentials.username,
      password: credentials.password,
      rw: '01',
    });
    navigate('dashboard');
  };

  const handleRegister = (formData) => {
    setUser({
      name: formData.fullName,
      rw: formData.rw,
      phone: formData.phoneNumber,
    });
    navigate('dashboard');
  };

  const handleOrder = (orderData) => {
    addPlant({
      name: orderData.vegetable.name,
      quantity: orderData.quantity,
      growthPeriod: orderData.vegetable.growthPeriod,
      category: orderData.vegetable.category
    });
    notifyPlanting(orderData.vegetable.name, orderData.quantity);
    alert(`Berhasil memesan ${orderData.quantity} bibit ${orderData.vegetable.name}!`);
    navigate('dashboard');
  };

  const handleSubmitPanen = (harvestData) => {
    alert(`Berhasil mencatat panen ${harvestData.quantity} ${harvestData.unit} ${harvestData.plantType}!`);
    navigate('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('login');
  };

  return (
    <ToastProvider>
      <div className="max-w-md mx-auto min-h-screen mobile-shell">
        <ToastContainer />
        
        {currentPage === 'splash' && (
          <SplashScreen onComplete={() => navigate('login')} />
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
          <Dashboard user={user} onNavigate={navigate} onLogout={handleLogout} />
        )}

        {currentPage === 'bank-bibit' && (
          <BankBibit
            onNavigateBack={() => navigate('dashboard')}
            onOrder={handleOrder}
          />
        )}

        {currentPage === 'catat-panen' && (
          <CatatPanen
            onNavigateBack={() => navigate('dashboard')}
            onSubmit={handleSubmitPanen}
          />
        )}

        {currentPage === 'menu-gizi' && (
          <MenuGizi
            onNavigateBack={() => navigate('dashboard')}
            userHarvests={plants}
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
          />
        )}

        {currentPage === 'profil' && (
          <Profil
            user={user}
            onNavigateBack={() => navigate('dashboard')}
            onLogout={handleLogout}
            onNavigate={navigate}
          />
        )}
      </div>
    </ToastProvider>
  );
}
