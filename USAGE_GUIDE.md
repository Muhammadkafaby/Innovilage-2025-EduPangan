# Panduan Penggunaan Komponen EduPangan UI

Dokumen ini menjelaskan cara menggunakan setiap komponen dalam sistem EduPangan.

## 📱 Komponen Mobile

### 1. SplashScreen

**Lokasi:** `components/mobile/SplashScreen.jsx`

**Penggunaan:**
```jsx
import SplashScreen from './components/mobile/SplashScreen';

function App() {
  const handleSplashComplete = () => {
    console.log('Splash screen selesai, navigasi ke login');
  };

  return <SplashScreen onComplete={handleSplashComplete} />;
}
```

**Props:**
- `onComplete` (function): Callback yang dipanggil setelah 3 detik

---

### 2. Login

**Lokasi:** `components/mobile/Login.jsx`

**Penggunaan:**
```jsx
import Login from './components/mobile/Login';

function App() {
  const handleLogin = (credentials) => {
    console.log('Login:', credentials);
    // { phoneNumber: "081234567890", pin: "1234" }
  };

  const handleNavigateToRegister = () => {
    console.log('Navigasi ke halaman register');
  };

  return (
    <Login
      onLogin={handleLogin}
      onNavigateToRegister={handleNavigateToRegister}
    />
  );
}
```

**Props:**
- `onLogin` (function): Callback dengan data login
- `onNavigateToRegister` (function): Callback untuk navigasi ke register

---

### 3. Register

**Lokasi:** `components/mobile/Register.jsx`

**Penggunaan:**
```jsx
import Register from './components/mobile/Register';

function App() {
  const handleRegister = (formData) => {
    console.log('Register:', formData);
    // {
    //   fullName: "Ibu Siti Aminah",
    //   rw: "02",
    //   phoneNumber: "081234567890",
    //   kaderCode: "PKK2025",
    //   pin: "1234",
    //   confirmPin: "1234"
    // }
  };

  const handleNavigateToLogin = () => {
    console.log('Navigasi ke halaman login');
  };

  return (
    <Register
      onRegister={handleRegister}
      onNavigateToLogin={handleNavigateToLogin}
    />
  );
}
```

**Props:**
- `onRegister` (function): Callback dengan data registrasi
- `onNavigateToLogin` (function): Callback untuk navigasi ke login

---

### 4. Dashboard

**Lokasi:** `components/mobile/Dashboard.jsx`

**Penggunaan:**
```jsx
import Dashboard from './components/mobile/Dashboard';

function App() {
  const user = {
    name: 'Ibu Siti Aminah',
    rw: '02',
    activePlants: 12,
  };

  const handleNavigate = (destination) => {
    console.log('Navigasi ke:', destination);
    // destination: 'kebun', 'bank-bibit', 'menu-gizi', 'edukasi', etc.
  };

  return (
    <Dashboard
      user={user}
      onNavigate={handleNavigate}
    />
  );
}
```

**Props:**
- `user` (object): Data pengguna yang sedang login
- `onNavigate` (function): Callback untuk navigasi ke halaman lain

---

### 5. Bank Bibit

**Lokasi:** `components/mobile/BankBibit.jsx`

**Penggunaan:**
```jsx
import BankBibit from './components/mobile/BankBibit';

function App() {
  const handleNavigateBack = () => {
    console.log('Kembali ke dashboard');
  };

  const handleOrder = (orderData) => {
    console.log('Pesanan:', orderData);
    // {
    //   vegetable: { id: 1, name: "Kangkung", ... },
    //   quantity: 20
    // }
  };

  return (
    <BankBibit
      onNavigateBack={handleNavigateBack}
      onOrder={handleOrder}
    />
  );
}
```

**Props:**
- `onNavigateBack` (function): Callback untuk kembali
- `onOrder` (function): Callback ketika pengguna memesan bibit

**Fitur:**
- Filter by category
- Search bibit
- Detail bibit dengan nutrisi dan tips
- Pemesanan dengan kalkulator harga

---

### 6. Catat Panen

**Lokasi:** `components/mobile/CatatPanen.jsx`

**Penggunaan:**
```jsx
import CatatPanen from './components/mobile/CatatPanen';

function App() {
  const handleNavigateBack = () => {
    console.log('Kembali ke dashboard');
  };

  const handleSubmit = (harvestData) => {
    console.log('Data panen:', harvestData);
    // {
    //   plantType: "Kangkung",
    //   quantity: "2.5",
    //   unit: "kg",
    //   harvestDate: "2025-01-12",
    //   notes: "Kualitas bagus",
    //   photo: "data:image/jpeg;base64,..."
    // }
  };

  return (
    <CatatPanen
      onNavigateBack={handleNavigateBack}
      onSubmit={handleSubmit}
    />
  );
}
```

**Props:**
- `onNavigateBack` (function): Callback untuk kembali
- `onSubmit` (function): Callback dengan data panen

**Fitur:**
- Pilih jenis tanaman dari dropdown
- Input jumlah dengan satuan (kg, gram, ikat, buah)
- Upload foto hasil panen
- Catatan tambahan
- Riwayat panen terbaru

---

### 7. Menu Gizi

**Lokasi:** `components/mobile/MenuGizi.jsx`

**Penggunaan:**
```jsx
import MenuGizi from './components/mobile/MenuGizi';

function App() {
  const userHarvests = [
    { plantName: 'Kangkung', quantity: 2.5 },
    { plantName: 'Bayam', quantity: 1.8 },
  ];

  const handleNavigateBack = () => {
    console.log('Kembali ke dashboard');
  };

  return (
    <MenuGizi
      onNavigateBack={handleNavigateBack}
      userHarvests={userHarvests}
    />
  );
}
```

**Props:**
- `onNavigateBack` (function): Callback untuk kembali
- `userHarvests` (array): Data hasil panen pengguna

**Fitur:**
- Filter by category (Sayuran, Lauk, Salad, Sup)
- Toggle "Dari Kebun Saya"
- Detail resep dengan langkah-langkah
- Informasi nutrisi per porsi
- Target gizi harian

---

### 8. Edukasi

**Lokasi:** `components/mobile/Edukasi.jsx`

**Penggunaan:**
```jsx
import Edukasi from './components/mobile/Edukasi';

function App() {
  const handleNavigateBack = () => {
    console.log('Kembali ke dashboard');
  };

  return (
    <Edukasi onNavigateBack={handleNavigateBack} />
  );
}
```

**Props:**
- `onNavigateBack` (function): Callback untuk kembali

**Fitur:**
- Tab: Artikel, Video, Kuis
- Artikel edukasi lengkap dengan tag
- Video tutorial
- Kuis interaktif (coming soon)

---

## 💻 Komponen Website

### Admin Dashboard

**Lokasi:** `components/web/AdminDashboard.jsx`

**Penggunaan:**
```jsx
import AdminDashboard from './components/web/AdminDashboard';

function App() {
  return <AdminDashboard />;
}
```

**Fitur:**
- Sidebar navigation
- Dashboard dengan statistik
- Manajemen pengguna
- Manajemen stok bibit
- Riwayat transaksi
- Laporan dan analytics

**Menu:**
1. **Dashboard**: Overview statistik keseluruhan
2. **Kelola Pengguna**: Daftar dan detail pengguna
3. **Stok Bibit**: Manajemen inventory bibit
4. **Transaksi**: Riwayat transaksi bank bibit
5. **Laporan**: Analytics dan reporting
6. **Konten Edukasi**: Manajemen artikel dan video

---

## 🎨 Komponen Shared (Reusable)

### Button

**Lokasi:** `components/shared/Button.jsx`

**Penggunaan:**
```jsx
import Button from './components/shared/Button';

function Example() {
  return (
    <div>
      {/* Primary Button */}
      <Button variant="primary" size="md">
        Simpan
      </Button>

      {/* Outline Button */}
      <Button variant="outline" size="lg" fullWidth>
        Batalkan
      </Button>

      {/* Loading State */}
      <Button loading={true}>
        Processing...
      </Button>

      {/* With onClick */}
      <Button
        variant="secondary"
        onClick={() => console.log('Clicked!')}
      >
        Klik Saya
      </Button>
    </div>
  );
}
```

**Props:**
- `children` (node): Konten button
- `variant` (string): 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size` (string): 'sm' | 'md' | 'lg'
- `fullWidth` (boolean): Lebar penuh
- `disabled` (boolean): Button disabled
- `loading` (boolean): Tampilkan loading spinner
- `onClick` (function): Handler klik
- `type` (string): 'button' | 'submit' | 'reset'
- `className` (string): Custom classes

---

### Card

**Lokasi:** `components/shared/Card.jsx`

**Penggunaan:**
```jsx
import Card from './components/shared/Card';

function Example() {
  return (
    <div>
      {/* Simple Card */}
      <Card>
        <p>Content goes here</p>
      </Card>

      {/* Card with Title */}
      <Card title="Status Kebun" subtitle="12 tanaman aktif">
        <p>Garden details...</p>
      </Card>

      {/* Card with Icon */}
      <Card
        title="Bank Bibit"
        icon="🌾"
        shadow="lg"
        padding="lg"
      >
        <p>Seed bank info...</p>
      </Card>

      {/* Clickable Card */}
      <Card
        title="Kangkung"
        onClick={() => console.log('Card clicked!')}
      >
        <p>Details...</p>
      </Card>
    </div>
  );
}
```

**Props:**
- `children` (node): Konten card
- `title` (string): Judul card
- `subtitle` (string): Subtitle card
- `icon` (string): Emoji atau icon
- `padding` (string): 'sm' | 'md' | 'lg'
- `shadow` (string): 'none' | 'sm' | 'md' | 'lg' | 'xl'
- `onClick` (function): Handler klik
- `className` (string): Custom classes

---

## 📊 Data & Theme

### Dummy Data

**Lokasi:** `data/dummyData.js`

**Export:**
- `vegetables`: 15 jenis sayuran dengan detail lengkap
- `recipes`: 6 resep masakan dengan nutrisi
- `educationArticles`: 5 artikel edukasi
- `videoTutorials`: 4 video tutorial
- `users`: 3 sample pengguna
- `gardenActivities`: Aktivitas menanam & panen
- `seedBankTransactions`: Transaksi bank bibit
- `notifications`: Notifikasi sistem
- `upcomingEvents`: Jadwal kegiatan
- `quizQuestions`: Soal kuis
- `dashboardStats`: Statistik dashboard

**Contoh Penggunaan:**
```jsx
import { vegetables, recipes } from './data/dummyData';

function Example() {
  return (
    <div>
      <h2>Sayuran Tersedia: {vegetables.length}</h2>
      <h2>Resep Tersedia: {recipes.length}</h2>
    </div>
  );
}
```

---

### Theme Configuration

**Lokasi:** `styles/theme.js`

**Export:**
- `colors`: Palet warna lengkap
- `typography`: Font family, size, weight
- `spacing`: Spacing scale
- `borderRadius`: Border radius values
- `shadows`: Shadow presets
- `breakpoints`: Responsive breakpoints
- `zIndex`: Z-index scale

**Contoh Penggunaan:**
```jsx
import theme from './styles/theme';

function Example() {
  return (
    <div
      style={{
        backgroundColor: theme.colors.primary.main,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.xl,
        boxShadow: theme.shadows.lg,
      }}
    >
      Styled with theme
    </div>
  );
}
```

---

## 🎯 Best Practices

### 1. Navigation Pattern

Gunakan callback untuk navigasi antar halaman:

```jsx
function App() {
  const [currentPage, setCurrentPage] = useState('splash');

  const navigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {currentPage === 'splash' && (
        <SplashScreen onComplete={() => navigate('login')} />
      )}
      {currentPage === 'login' && (
        <Login
          onLogin={() => navigate('dashboard')}
          onNavigateToRegister={() => navigate('register')}
        />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard onNavigate={navigate} />
      )}
    </>
  );
}
```

### 2. State Management

Untuk data yang kompleks, gunakan Context API atau state management library:

```jsx
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
```

### 3. API Integration

Ganti dummy data dengan API calls:

```jsx
import { useState, useEffect } from 'react';

function BankBibit() {
  const [vegetables, setVegetables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/vegetables')
      .then(res => res.json())
      .then(data => {
        setVegetables(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {vegetables.map(veg => (
        <div key={veg.id}>{veg.name}</div>
      ))}
    </div>
  );
}
```

### 4. Responsive Design

Semua komponen sudah responsive dengan Tailwind CSS. Gunakan breakpoints untuk customization:

```jsx
// Mobile-first approach
<div className="px-4 md:px-8 lg:px-12">
  <h1 className="text-2xl md:text-3xl lg:text-4xl">
    Responsive Heading
  </h1>
</div>
```

### 5. Progressive Web App (PWA)

Untuk mengubah menjadi PWA, tambahkan:

1. **manifest.json**:
```json
{
  "name": "EduPangan",
  "short_name": "EduPangan",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#4CAF50",
  "theme_color": "#4CAF50",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

2. **Service Worker** untuk offline support

---

## 🐛 Troubleshooting

### Issue: Gambar tidak muncul
**Solusi**: Ganti placeholder emoji dengan path gambar sebenarnya di folder `/public/images/`

### Issue: Tailwind classes tidak bekerja
**Solusi**: Pastikan Tailwind sudah dikonfigurasi dengan benar:
```js
// tailwind.config.js
module.exports = {
  content: [
    "./components/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Issue: Form validation tidak bekerja
**Solusi**: Komponen sudah include basic validation. Untuk validasi lebih kompleks, gunakan library seperti Formik atau React Hook Form.

---

## 📞 Support

Untuk pertanyaan atau issue, silakan hubungi tim development atau buka issue di repository GitHub.

**Happy Coding!** 🌱
