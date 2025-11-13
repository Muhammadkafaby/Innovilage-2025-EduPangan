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

/**
 * Main App Component
 * Demo application untuk EduPangan UI Components
 */
export default function Home() {
  const [currentPage, setCurrentPage] = useState('splash');
  const [user, setUser] = useState(null);

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = (credentials) => {
    console.log('Login:', credentials);
    // Simulasi login
    setUser({
      name: 'Ibu Siti Aminah',
      rw: '02',
      phone: credentials.phoneNumber,
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
        <Dashboard user={user} onNavigate={navigate} />
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
    </div>
  );
}
