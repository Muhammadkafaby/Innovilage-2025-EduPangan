# EduPangan - Smart Food Village UI/UX Design

Aplikasi mobile dan website untuk proyek Indramayu Smart Food Village yang bertujuan meningkatkan ketahanan pangan keluarga melalui pekarangan cerdas dan bank bibit komunitas.

## 🎨 Design System

### Color Palette
- **Primary Green**: `#4CAF50` - Hijau alami untuk elemen utama
- **Light Yellow**: `#FFF9C4` - Kuning muda untuk highlight dan background
- **Soft Orange**: `#FFB74D` - Oranye lembut untuk aksen dan call-to-action
- **White**: `#FFFFFF` - Background utama
- **Dark Green**: `#2E7D32` - Text dan elemen gelap
- **Light Green**: `#C8E6C9` - Background card dan section
- **Grey**: `#757575` - Text sekunder

### Typography
- **Primary Font**: Inter atau Nunito Sans
- **Heading**: Bold 600-700
- **Body**: Regular 400
- **Small**: 300

### Icons
Menggunakan ikon bertema pertanian, air, bibit, dan makanan dengan style sederhana dan friendly.

## 📱 Mobile Components

### 1. SplashScreen
- Logo EduPangan
- Tagline: "Panen Cerdas, Gizi Keluarga Terjaga"

### 2. Authentication
- Login dengan nomor HP dan PIN
- Register dengan nama, RW, nomor HP, kode kader

### 3. Dashboard
- Status Kebun Saya
- Bank Bibit Tersedia
- Saran Menu Harian
- Quick Actions (Catat Panen, Pesan Bibit)

### 4. Fitur Utama
- **Bank Bibit**: Katalog bibit tersedia, stok, dan pemesanan
- **Catat Panen**: Input hasil panen dengan foto
- **Menu Gizi**: Rekomendasi menu berdasarkan hasil panen
- **Edukasi**: Artikel, video, dan kuis

### 5. Tracking & Monitoring
- Status tanaman (progress tracker)
- Jadwal irigasi dan pemupukan
- Riwayat panen

## 💻 Website Components

### Admin Panel
- Dashboard statistik
- Manajemen stok bibit
- Rekap log pengguna
- Laporan dan analytics

### Landing Page Publik
- Hero section
- Tentang program
- Artikel edukasi
- Kalender kegiatan
- Kontak dan FAQ

## 🚀 Tech Stack

- React 18+
- Tailwind CSS 3+
- Progressive Web App (PWA)
- Offline-first architecture
- Responsive mobile-first design

## 📦 Installation

```bash
npm install
npm run dev
```

## 🎯 Design Principles

1. **Simplicity**: Mudah digunakan untuk pengguna non-teknis
2. **Accessibility**: Desain ramah untuk berbagai usia
3. **Performance**: Ringan dan cepat untuk ponsel mid-range
4. **Offline-capable**: Fitur utama tetap bisa diakses offline
5. **Local Context**: Menggunakan bahasa dan konteks lokal Indramayu

## 📁 Project Structure

```
edupangan-ui/
├── components/
│   ├── mobile/          # Komponen mobile
│   ├── web/             # Komponen website
│   └── shared/          # Komponen reusable
├── styles/              # Global styles dan theme
├── assets/              # Images, icons, fonts
├── data/                # Dummy data dan constants
└── utils/               # Helper functions
```

## 👥 Target Users

1. **Ibu Rumah Tangga**: Pengguna utama aplikasi mobile
2. **Kader PKK**: Koordinator dan edukator
3. **Petani Lokal**: Kontributor bibit dan mentor
4. **Admin Desa/BUMDes**: Pengelola sistem dan data

## 📊 Dummy Data Included

- 15+ jenis sayuran lokal
- 20+ resep menu sehat
- 10+ artikel edukasi
- Video tutorial
- Data pengguna sample
- Transaksi bank bibit
