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

/**
 * Main App Component
 * EduPangan + Smart Watering System dengan MQTT
 */
export default function Home() {
  const [currentPage, setCurrentPage] = useState('splash');
  const [user, setUser] = useState(null);

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = (credentials) => {
    console.log('Login:', credentials);
    // Set user with name and device info from MQTT credentials
    setUser({
      name: credentials.name,
      deviceNumber: credentials.deviceNumber,
      deviceId: credentials.deviceId,
      username: credentials.username,
      password: credentials.password,
      rw: '01', // Default RW for demo
    });
    navigate('dashboard');
  };

  const handleRegister = (formData) => {
    console.log('Register:', formData);
    // Simulasi register
    setUser({
      name: formData.fullName,
      rw: formData.rw,
      phone: formData.phoneNumber,
    });
    navigate('dashboard');
  };

  const handleOrder = (orderData) => {
    console.log('Order:', orderData);
    alert(`Berhasil memesan ${orderData.quantity} bibit ${orderData.vegetable.name}!`);
    navigate('dashboard');
  };

  const handleSubmitPanen = (harvestData) => {
    console.log('Panen:', harvestData);
    alert(`Berhasil mencatat panen ${harvestData.quantity} ${harvestData.unit} ${harvestData.plantType}!`);
    navigate('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('login');
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
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
          userHarvests={[]}
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
  );
}
