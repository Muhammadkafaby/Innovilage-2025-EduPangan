# Struktur Komponen EduPangan UI

Dokumen ini menjelaskan struktur lengkap komponen dan arsitektur sistem EduPangan.

## 📁 Struktur Folder

```
edupangan-ui/
├── components/
│   ├── mobile/                 # Komponen untuk aplikasi mobile
│   │   ├── SplashScreen.jsx   # Tampilan awal aplikasi
│   │   ├── Login.jsx          # Halaman login
│   │   ├── Register.jsx       # Halaman registrasi
│   │   ├── Dashboard.jsx      # Dashboard utama
│   │   ├── BankBibit.jsx      # Katalog dan pemesanan bibit
│   │   ├── CatatPanen.jsx     # Form catat hasil panen
│   │   ├── MenuGizi.jsx       # Rekomendasi menu sehat
│   │   └── Edukasi.jsx        # Platform edukasi
│   │
│   ├── web/                    # Komponen untuk website admin
│   │   └── AdminDashboard.jsx # Panel admin lengkap
│   │
│   └── shared/                 # Komponen reusable
│       ├── Button.jsx         # Button component
│       └── Card.jsx           # Card component
│
├── styles/
│   └── theme.js               # Konfigurasi design system
│
├── data/
│   └── dummyData.js           # Data dummy untuk development
│
├── utils/                      # Helper functions (optional)
│
├── README.md                   # Dokumentasi utama
├── USAGE_GUIDE.md             # Panduan penggunaan detail
├── COMPONENT_STRUCTURE.md     # Dokumen ini
├── tailwind.config.js         # Konfigurasi Tailwind CSS
└── package.json               # Dependencies
```

---

## 🎨 Design System

### Color Palette

**Primary (Hijau Alami)**
```
#E8F5E9 - primary-50   (Background terang)
#C8E6C9 - primary-100  (Background card)
#A5D6A7 - primary-200
#81C784 - primary-300
#66BB6A - primary-400
#4CAF50 - primary-500  (Main color)
#43A047 - primary-600
#388E3C - primary-700
#2E7D32 - primary-800  (Text gelap)
#1B5E20 - primary-900
```

**Secondary (Oranye Lembut)**
```
#FFF3E0 - secondary-50
#FFE0B2 - secondary-100
#FFCC80 - secondary-200
#FFB74D - secondary-300  (Main color)
#FFA726 - secondary-400
#FF9800 - secondary-500
#FB8C00 - secondary-600
#F57C00 - secondary-700
#EF6C00 - secondary-800
#E65100 - secondary-900
```

**Accent (Kuning Muda)**
```
#FFF9C4 - accent-light  (Main color)
#FFF59D - accent
#FFF176 - accent-dark
```

### Typography

**Font Family**
- Primary: Inter
- Secondary: Nunito Sans
- Fallback: system-ui, sans-serif

**Font Sizes**
```
xs:   12px (0.75rem)
sm:   14px (0.875rem)
base: 16px (1rem)      - Default body text
lg:   18px (1.125rem)
xl:   20px (1.25rem)
2xl:  24px (1.5rem)
3xl:  30px (1.875rem)
4xl:  36px (2.25rem)
5xl:  48px (3rem)
```

**Font Weights**
```
light:    300
regular:  400  - Body text
medium:   500
semibold: 600  - Headings
bold:     700  - Strong emphasis
```

### Spacing Scale

```
xs:  4px   (0.25rem)
sm:  8px   (0.5rem)
md:  16px  (1rem)     - Default spacing
lg:  24px  (1.5rem)
xl:  32px  (2rem)
2xl: 48px  (3rem)
3xl: 64px  (4rem)
```

### Border Radius

```
none: 0
sm:   4px   (0.25rem)
md:   8px   (0.5rem)
lg:   12px  (0.75rem)  - Cards
xl:   16px  (1rem)     - Buttons
2xl:  24px  (1.5rem)   - Large cards
full: 9999px           - Pills, avatars
```

### Shadows

```
sm:   Small shadow for subtle elevation
md:   Medium shadow for cards
lg:   Large shadow for modals
xl:   Extra large for floating elements
2xl:  Maximum shadow for popups
```

---

## 📱 Mobile Components Detail

### 1. SplashScreen

**Fungsi:** Tampilan awal aplikasi dengan auto-redirect

**Elemen UI:**
- Logo EduPangan (🌱)
- App name dengan font bold
- Tagline "Panen Cerdas, Gizi Keluarga Terjaga"
- Loading indicator (3 dots animasi)
- Version number

**Animasi:**
- Logo bounce effect
- Decorative circles pulse
- Dots bounce with delay

**Duration:** 3 detik

---

### 2. Login

**Fungsi:** Autentikasi pengguna dengan nomor HP dan PIN

**Elemen UI:**
- Header dengan gradient green
- Input nomor HP (format: 081234567890)
- Input PIN (masked, 4-6 digit)
- Button "Masuk" dengan loading state
- Link "Lupa PIN?"
- Button "Daftar Akun Baru" (outline)
- Info box untuk kader PKK

**Validasi:**
- Nomor HP minimal 10 digit
- PIN minimal 4 digit
- Real-time error message

---

### 3. Register

**Fungsi:** Pendaftaran pengguna baru

**Elemen UI:**
- Form fields:
  - Nama lengkap (text)
  - RW (dropdown: RW 01-08)
  - Nomor HP (numeric)
  - Kode Kader (uppercase, 4-10 karakter)
  - PIN (numeric, 4-6 digit)
  - Konfirmasi PIN
- Checkbox persetujuan
- Button "Daftar Sekarang"
- Link ke Login

**Validasi:**
- Semua field required
- PIN harus sama dengan konfirmasi
- Kode kader format tertentu
- Checkbox harus dicentang

---

### 4. Dashboard

**Fungsi:** Halaman utama dengan overview kebun dan quick actions

**Sections:**

1. **Header**
   - Nama pengguna
   - Notifikasi badge

2. **Stats Cards (2 kolom)**
   - Tanaman Aktif (hijau)
   - Siap Panen (oranye)

3. **Quick Actions (4 tombol grid)**
   - Catat Panen (📝)
   - Bank Bibit (🌾)
   - Menu Gizi (🍽️)
   - Edukasi (📚)

4. **Status Kebun**
   - Irigasi status
   - Kesehatan tanaman
   - Stok kompos

5. **Bibit Tersedia**
   - 3 bibit terpopuler (grid)

6. **Saran Menu Harian**
   - 1 rekomendasi menu dengan CTA

7. **Aktivitas Terbaru**
   - List 3 aktivitas terakhir

8. **Bottom Navigation**
   - Beranda (🏠)
   - Kebun (🌱)
   - Bibit (🌾)
   - Edukasi (📚)
   - Profil (👤)

---

### 5. BankBibit

**Fungsi:** Katalog bibit dan sistem pemesanan

**Features:**

1. **List View**
   - Search bar
   - Category filter (horizontal scroll)
   - Grid 2 kolom dengan card
   - Setiap card: image, nama, kategori, stok, harga

2. **Detail View**
   - Image besar
   - Nama ilmiah
   - Quick stats (waktu tumbuh, kebutuhan air, kesulitan)
   - Kandungan gizi (vitamin, mineral, kalori)
   - Tips menanam (yellow info box)
   - Quantity selector (+/- buttons)
   - Price calculator
   - Button "Pesan Sekarang"

**Kategori:**
- Semua
- Sayuran Hijau
- Buah
- Bumbu
- Herbal
- Kacang-kacangan
- Umbi

---

### 6. CatatPanen

**Fungsi:** Form input hasil panen

**Form Fields:**

1. **Jenis Tanaman** (dropdown)
   - Populate dari data vegetables

2. **Jumlah Panen** (number + unit selector)
   - Units: kg, gram, ikat, buah

3. **Tanggal Panen** (date picker)
   - Max: hari ini

4. **Foto Hasil Panen** (image upload)
   - Optional
   - Max 5MB
   - Preview sebelum upload

5. **Catatan Tambahan** (textarea)
   - Optional
   - Max 200 karakter

**Additional Info:**
- Yellow info box: Kenapa catat panen?
- List panen terbaru (3 items)

---

### 7. MenuGizi

**Fungsi:** Rekomendasi menu sehat dari hasil panen

**Features:**

1. **List View**
   - Category filter (tabs)
   - Toggle "Dari Kebun Saya"
   - Recipe cards:
     - Image
     - Nama resep
     - Waktu & kesulitan
     - Badge: X bahan dari kebun
     - Kalori info

2. **Detail View**
   - Image
   - Metadata (kesulitan, waktu, porsi)
   - Informasi gizi (grid 2x2):
     - Kalori
     - Protein
     - Karbohidrat
     - Lemak
   - List bahan-bahan:
     - Badge hijau untuk bahan dari kebun
     - Icon berbeda (🌱 vs 🛒)
   - Langkah-langkah (numbered list)
   - Action buttons (Simpan, Bagikan)

3. **Target Gizi Harian**
   - Progress bars untuk:
     - Sayur & Buah (400g target)
     - Protein (60g target)
     - Serat (25g target)

---

### 8. Edukasi

**Fungsi:** Platform pembelajaran berkebun

**Tabs:**

1. **Artikel**
   - Cards dengan:
     - Thumbnail
     - Judul
     - Excerpt (2 baris)
     - Read time & views
   - Detail artikel:
     - Full content
     - Author & date
     - Tags

2. **Video**
   - Video cards:
     - Thumbnail dengan play icon
     - Judul
     - Duration & views

3. **Kuis**
   - Coming soon interface
   - "Mulai Kuis" CTA

---

## 💻 Web Component Detail

### AdminDashboard

**Fungsi:** Panel administrasi lengkap untuk BUMDes/Admin Desa

**Layout:**

1. **Sidebar (fixed left)**
   - Logo EduPangan
   - Navigation menu (6 items)
   - User profile at bottom

2. **Main Content Area**
   - Header bar (sticky)
   - Content sections (scrollable)

**Menu Items:**

1. **Dashboard**
   - 4 stat cards:
     - Total Pengguna (hijau)
     - Total Panen (oranye)
     - Stok Bibit (biru)
     - Iuran Bulanan (kuning)
   - Charts:
     - Line graph aktivitas 7 hari
     - Top 5 bibit terpopuler
   - Tabel aktivitas terbaru

2. **Kelola Pengguna**
   - 3 stat cards (total, aktif, kader)
   - Search bar
   - Data table:
     - Columns: Nama, No. HP, RW, Role, Total Panen, Aksi
     - Avatar icons
     - Role badges
     - "Detail" button

3. **Stok Bibit**
   - Grid 3 kolom
   - Setiap card:
     - Nama bibit
     - Stok badge (warna berdasarkan jumlah)
     - Kategori
     - Harga
     - Action buttons (+ Stok, Edit)

4. **Transaksi**
   - Data table riwayat:
     - Columns: Tanggal, Pengguna, Jenis, Bibit, Jumlah, Iuran
     - Transaction type badge (ambil/kembalikan)

5. **Laporan**
   - Coming soon / placeholder for charts & reports

6. **Konten Edukasi**
   - Coming soon / placeholder for content management

---

## 🎯 Component Patterns

### 1. Responsive Design

All components menggunakan **mobile-first approach**:

```jsx
// Mobile (default)
<div className="px-4 py-2">

// Tablet (md: 768px+)
<div className="px-4 md:px-8 py-2 md:py-4">

// Desktop (lg: 1024px+)
<div className="px-4 md:px-8 lg:px-12 py-2 md:py-4 lg:py-6">
```

### 2. Loading States

```jsx
{isLoading ? (
  <div className="flex items-center justify-center">
    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
      {/* Spinner SVG */}
    </svg>
    Loading...
  </div>
) : (
  <Content />
)}
```

### 3. Error Handling

```jsx
{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
    ⚠️ {error}
  </div>
)}
```

### 4. Empty States

```jsx
{items.length === 0 && (
  <div className="text-center py-12">
    <span className="text-6xl mb-4 block">🔍</span>
    <p className="text-gray-600">Tidak ada data</p>
  </div>
)}
```

### 5. Card Hover Effects

```jsx
<div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
  {/* Content */}
</div>
```

### 6. Button Active State

```jsx
<button className="bg-green-500 hover:bg-green-600 active:scale-95 transition-all">
  Click Me
</button>
```

---

## 🔄 Data Flow

### Mobile App Flow

```
SplashScreen (3s)
    ↓
Login/Register
    ↓
Dashboard (Hub)
    ↓
┌───┴───┬───────┬─────────┐
│       │       │         │
Kebun   Bibit   Menu    Edukasi
│       │       │         │
├─ Status      Recipe    Article
├─ Aktivitas   Detail    Video
└─ Catat Panen          Quiz
```

### Admin Flow

```
AdminDashboard (Hub)
    ↓
┌───┴───┬─────────┬──────────┬─────────┐
│       │         │          │         │
Stats   Users   Seeds    Transactions  Reports
```

### Data Management

```
Component
    ↓
Props/State
    ↓
Event Handler
    ↓
API Call (future)
    ↓
Update State
    ↓
Re-render
```

---

## 🎨 Icon System

### Menggunakan Emoji

Untuk prototype, menggunakan emoji sebagai icon:

```jsx
// Status icons
🌱 - Tanaman/Bibit
✅ - Success/Selesai
📝 - Input/Catat
🌾 - Bank Bibit
🍽️ - Menu/Makanan
📚 - Edukasi/Belajar
💧 - Air/Irigasi
🧪 - Kompos/Pupuk
📊 - Statistik/Dashboard
👥 - Pengguna/Users
💰 - Uang/Iuran
📈 - Laporan/Growth
⏱️ - Waktu/Durasi
🔔 - Notifikasi
⚙️ - Settings
```

### Production: Icon Library

Untuk production, ganti dengan icon library seperti:
- Heroicons
- Lucide React
- React Icons
- Phosphor Icons

---

## 🚀 Performance Optimization

### 1. Lazy Loading

```jsx
const AdminDashboard = lazy(() => import('./components/web/AdminDashboard'));
```

### 2. Image Optimization

```jsx
// Next.js Image component
import Image from 'next/image';

<Image
  src="/images/vegetable.jpg"
  width={400}
  height={300}
  alt="Kangkung"
  loading="lazy"
/>
```

### 3. Memoization

```jsx
const MemoizedCard = React.memo(Card);
```

### 4. Virtual Scrolling

Untuk list panjang, gunakan react-window atau react-virtualized.

---

## 📦 Deployment Checklist

- [ ] Replace emoji icons dengan icon library
- [ ] Add real images untuk vegetables/recipes
- [ ] Connect to API backend
- [ ] Add error boundaries
- [ ] Implement analytics
- [ ] Add PWA manifest
- [ ] Setup service worker
- [ ] Optimize images
- [ ] Add meta tags untuk SEO
- [ ] Setup environment variables
- [ ] Add loading skeletons
- [ ] Implement offline support
- [ ] Add unit tests
- [ ] Add E2E tests
- [ ] Setup CI/CD pipeline

---

## 🔐 Security Considerations

1. **Input Validation**
   - Sanitize user inputs
   - Prevent XSS attacks

2. **Authentication**
   - Secure PIN storage (hash)
   - JWT token management
   - Session timeout

3. **Authorization**
   - Role-based access control
   - Admin vs User permissions

4. **API Security**
   - HTTPS only
   - Rate limiting
   - CORS configuration

---

## 📱 PWA Features

### Manifest

- App name: EduPangan
- Theme color: #4CAF50
- Background: #FFFFFF
- Display: standalone
- Orientation: portrait

### Offline Support

- Cache static assets
- Cache API responses
- Sync when online
- Background sync untuk form submission

### Push Notifications

- Reminder penyiraman
- Notifikasi panen
- Update bibit baru
- Pengumuman kegiatan

---

## 🎓 Learning Resources

### Tailwind CSS
- [Official Docs](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)

### React
- [React Docs](https://react.dev)
- [React Patterns](https://reactpatterns.com/)

### Next.js
- [Next.js Docs](https://nextjs.org/docs)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)

---

**Dokumen ini akan terus di-update seiring development. Last updated: 2025-01-12**
