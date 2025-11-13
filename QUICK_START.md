# Quick Start Guide - EduPangan UI

Panduan cepat untuk menjalankan aplikasi EduPangan UI.

## 🚀 Instalasi & Setup

### 1. Masuk ke folder project

```bash
cd edupangan-ui
```

### 2. Install dependencies

```bash
npm install
```

**Dependencies yang akan diinstall:**
- React 18
- Next.js 14
- Tailwind CSS 3
- PostCSS & Autoprefixer

### 3. Jalankan development server

```bash
npm run dev
```

Server akan berjalan di: **http://localhost:3000**

---

## 📱 Melihat Komponen

### Mobile App (Default)
- Buka: **http://localhost:3000**
- Tampilan mobile app dengan flow lengkap dari Splash → Login → Dashboard

### Admin Panel
- Buka: **http://localhost:3000/admin**
- Panel admin untuk BUMDes/Admin Desa

---

## 🎯 Flow Aplikasi Mobile

1. **Splash Screen** (3 detik)
2. **Login**
   - Test credentials: masukkan nomor HP dan PIN apapun (dummy)
3. **Dashboard**
   - Lihat status kebun
   - Quick actions
   - Statistik
4. **Navigasi ke fitur:**
   - 🌾 Bank Bibit
   - 📝 Catat Panen
   - 🍽️ Menu Gizi
   - 📚 Edukasi

---

## 📂 Struktur File Penting

```
edupangan-ui/
├── app/
│   ├── page.jsx           # Main mobile app
│   ├── admin/page.jsx     # Admin dashboard
│   ├── layout.jsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── mobile/            # Komponen mobile
│   ├── web/               # Komponen web
│   └── shared/            # Komponen reusable
├── data/
│   └── dummyData.js       # Data dummy
└── styles/
    └── theme.js           # Theme config
```

---

## 🎨 Testing Fitur

### Bank Bibit
1. Klik tombol "Bank Bibit" di dashboard
2. Coba filter by category
3. Search bibit (contoh: "kangkung")
4. Klik card bibit untuk detail
5. Ubah quantity dan klik "Pesan Sekarang"

### Catat Panen
1. Klik "Catat Panen"
2. Pilih jenis tanaman
3. Input jumlah
4. (Optional) Upload foto
5. Submit

### Menu Gizi
1. Klik "Menu Gizi"
2. Filter by category
3. Toggle "Dari Kebun Saya"
4. Klik resep untuk detail lengkap

### Edukasi
1. Klik "Edukasi"
2. Browse artikel
3. Lihat video tutorial
4. Try kuis (coming soon)

---

## 🔧 Troubleshooting

### Port sudah digunakan
```bash
# Ganti port
npm run dev -- -p 3001
```

### Clear cache
```bash
rm -rf .next
npm run dev
```

### Reinstall dependencies
```bash
rm -rf node_modules
npm install
```

---

## 🌐 Build untuk Production

```bash
# Build
npm run build

# Start production server
npm start
```

---

## 📱 Preview di Mobile

### Menggunakan ngrok (recommended)
```bash
# Install ngrok
npm install -g ngrok

# Run ngrok
ngrok http 3000
```

### Menggunakan IP lokal
1. Cari IP komputer Anda:
   ```bash
   ipconfig (Windows)
   ifconfig (Mac/Linux)
   ```
2. Buka di HP: `http://[IP_ANDA]:3000`
3. Pastikan HP dan komputer di jaringan WiFi yang sama

---

## 🎯 Demo Credentials

**Login:**
- Nomor HP: (bebas, contoh: 081234567890)
- PIN: (bebas, minimal 4 digit)

**Register:**
- Kode Kader: (bebas, contoh: PKK2025)

*Semua menggunakan dummy data, tidak ada validasi backend*

---

## 📊 Data Dummy

Aplikasi menggunakan data dummy dari `data/dummyData.js`:
- 15 jenis sayuran
- 6 resep masakan
- 5 artikel edukasi
- 4 video tutorial
- Sample users & transactions

---

## 🎨 Customization

### Ubah warna tema
Edit `styles/theme.js` atau `tailwind.config.js`

### Tambah komponen baru
Buat file di `components/mobile/` atau `components/web/`

### Tambah halaman baru
Buat folder baru di `app/` dengan `page.jsx`

---

## 📚 Dokumentasi Lengkap

- [README.md](README.md) - Overview project
- [USAGE_GUIDE.md](USAGE_GUIDE.md) - Panduan penggunaan komponen
- [COMPONENT_STRUCTURE.md](COMPONENT_STRUCTURE.md) - Arsitektur detail

---

## ⚡ Tips Development

1. **Hot Reload**: Perubahan code otomatis ter-reload
2. **Console Logs**: Buka DevTools untuk melihat event logs
3. **Responsive**: Test dengan Chrome DevTools responsive mode
4. **Component Isolation**: Test komponen satu per satu

---

## 🐛 Known Issues

1. **Emoji icons**: Untuk production, ganti dengan icon library
2. **Image placeholders**: Ganti dengan gambar asli
3. **No backend**: Semua data dummy, perlu integrate dengan API

---

## 📞 Need Help?

Jika ada masalah:
1. Check console untuk error messages
2. Pastikan semua dependencies terinstall
3. Restart development server
4. Clear browser cache

---

**Happy Coding! 🌱**

Last updated: 2025-01-12
