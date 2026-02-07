// Dummy Data untuk EduPangan Application

export const vegetables = [
  {
    id: 1,
    name: 'Kangkung',
    scientificName: 'Ipomoea aquatica',
    category: 'Sayuran Hijau',
    stockAvailable: 150,
    unit: 'bibit',
    growthPeriod: '25-30 hari',
    waterNeeds: 'Tinggi',
    difficulty: 'Mudah',
    price: 500,
    nutritionFacts: {
      vitamin: 'A, C, K',
      mineral: 'Zat Besi, Kalsium',
      calories: '19 per 100g'
    },
    image: '/images/kangkung.jpg',
    tips: 'Cocok ditanam di area dengan air mengalir atau sistem hidroponik',
  },
  {
    id: 2,
    name: 'Bayam',
    scientificName: 'Amaranthus',
    category: 'Sayuran Hijau',
    stockAvailable: 200,
    unit: 'bibit',
    growthPeriod: '30-40 hari',
    waterNeeds: 'Sedang',
    difficulty: 'Mudah',
    price: 500,
    nutritionFacts: {
      vitamin: 'A, C, K, B9',
      mineral: 'Zat Besi, Magnesium',
      calories: '23 per 100g'
    },
    image: '/images/bayam.jpg',
    tips: 'Tumbuh baik di musim hujan, panen berkala untuk hasil optimal',
  },
  {
    id: 3,
    name: 'Tomat',
    scientificName: 'Solanum lycopersicum',
    category: 'Buah',
    stockAvailable: 100,
    unit: 'bibit',
    growthPeriod: '60-80 hari',
    waterNeeds: 'Sedang',
    difficulty: 'Sedang',
    price: 1000,
    nutritionFacts: {
      vitamin: 'C, K, B9',
      mineral: 'Kalium',
      calories: '18 per 100g'
    },
    image: '/images/tomat.jpg',
    tips: 'Perlu penyangga, pemangkasan rutin untuk hasil maksimal',
  },
  {
    id: 4,
    name: 'Cabai Rawit',
    scientificName: 'Capsicum frutescens',
    category: 'Bumbu',
    stockAvailable: 80,
    unit: 'bibit',
    growthPeriod: '75-90 hari',
    waterNeeds: 'Sedang',
    difficulty: 'Sedang',
    price: 1500,
    nutritionFacts: {
      vitamin: 'A, C',
      mineral: 'Kalium',
      calories: '40 per 100g'
    },
    image: '/images/cabai.jpg',
    tips: 'Hindari overwatering, panen saat warna merah penuh',
  },
  {
    id: 5,
    name: 'Sawi Hijau',
    scientificName: 'Brassica juncea',
    category: 'Sayuran Hijau',
    stockAvailable: 180,
    unit: 'bibit',
    growthPeriod: '30-40 hari',
    waterNeeds: 'Sedang',
    difficulty: 'Mudah',
    price: 500,
    nutritionFacts: {
      vitamin: 'A, C, K',
      mineral: 'Kalsium, Zat Besi',
      calories: '13 per 100g'
    },
    image: '/images/sawi.jpg',
    tips: 'Cocok untuk pemula, tahan hama relatif baik',
  },
  {
    id: 6,
    name: 'Terong Ungu',
    scientificName: 'Solanum melongena',
    category: 'Buah',
    stockAvailable: 70,
    unit: 'bibit',
    growthPeriod: '60-70 hari',
    waterNeeds: 'Sedang',
    difficulty: 'Sedang',
    price: 1000,
    nutritionFacts: {
      vitamin: 'C, K, B6',
      mineral: 'Mangan, Kalium',
      calories: '25 per 100g'
    },
    image: '/images/terong.jpg',
    tips: 'Butuh sinar matahari penuh, panen saat kulit mengkilap',
  },
  {
    id: 7,
    name: 'Bawang Daun',
    scientificName: 'Allium fistulosum',
    category: 'Bumbu',
    stockAvailable: 250,
    unit: 'bibit',
    growthPeriod: '60-70 hari',
    waterNeeds: 'Sedang',
    difficulty: 'Mudah',
    price: 500,
    nutritionFacts: {
      vitamin: 'C, K',
      mineral: 'Kalsium',
      calories: '32 per 100g'
    },
    image: '/images/bawang-daun.jpg',
    tips: 'Panen bertahap, potong bagian atas saja agar terus tumbuh',
  },
  {
    id: 8,
    name: 'Pare',
    scientificName: 'Momordica charantia',
    category: 'Buah',
    stockAvailable: 60,
    unit: 'bibit',
    growthPeriod: '55-70 hari',
    waterNeeds: 'Sedang',
    difficulty: 'Sedang',
    price: 800,
    nutritionFacts: {
      vitamin: 'C, A',
      mineral: 'Zat Besi, Kalium',
      calories: '17 per 100g'
    },
    image: '/images/pare.jpg',
    tips: 'Butuh rambatan, bagus untuk kontrol gula darah',
  },
  {
    id: 9,
    name: 'Kacang Panjang',
    scientificName: 'Vigna unguiculata',
    category: 'Kacang-kacangan',
    stockAvailable: 120,
    unit: 'bibit',
    growthPeriod: '50-60 hari',
    waterNeeds: 'Sedang',
    difficulty: 'Mudah',
    price: 700,
    nutritionFacts: {
      vitamin: 'A, C, K',
      mineral: 'Protein, Serat',
      calories: '47 per 100g'
    },
    image: '/images/kacang-panjang.jpg',
    tips: 'Perlu ajir atau rambatan, panen rutin agar produktif',
  },
  {
    id: 10,
    name: 'Kemangi',
    scientificName: 'Ocimum basilicum',
    category: 'Herbal',
    stockAvailable: 200,
    unit: 'bibit',
    growthPeriod: '30-40 hari',
    waterNeeds: 'Sedang',
    difficulty: 'Mudah',
    price: 500,
    nutritionFacts: {
      vitamin: 'K, A, C',
      mineral: 'Kalsium, Zat Besi',
      calories: '23 per 100g'
    },
    image: '/images/kemangi.jpg',
    tips: 'Cocok sebagai companion plant, tumbuh cepat',
  },
  {
    id: 11,
    name: 'Mentimun',
    scientificName: 'Cucumis sativus',
    category: 'Buah',
    stockAvailable: 90,
    unit: 'bibit',
    growthPeriod: '50-65 hari',
    waterNeeds: 'Tinggi',
    difficulty: 'Mudah',
    price: 800,
    nutritionFacts: {
      vitamin: 'K, C',
      mineral: 'Kalium, Magnesium',
      calories: '16 per 100g'
    },
    image: '/images/mentimun.jpg',
    tips: 'Perlu rambatan dan penyiraman teratur',
  },
  {
    id: 12,
    name: 'Daun Bawang',
    scientificName: 'Allium schoenoprasum',
    category: 'Bumbu',
    stockAvailable: 220,
    unit: 'bibit',
    growthPeriod: '65-75 hari',
    waterNeeds: 'Sedang',
    difficulty: 'Mudah',
    price: 500,
    nutritionFacts: {
      vitamin: 'C, K',
      mineral: 'Folat',
      calories: '30 per 100g'
    },
    image: '/images/daun-bawang.jpg',
    tips: 'Bisa dipanen berkali-kali, cocok di pot',
  },
  {
    id: 13,
    name: 'Selada',
    scientificName: 'Lactuca sativa',
    category: 'Sayuran Hijau',
    stockAvailable: 160,
    unit: 'bibit',
    growthPeriod: '40-50 hari',
    waterNeeds: 'Sedang',
    difficulty: 'Mudah',
    price: 600,
    nutritionFacts: {
      vitamin: 'A, K, C',
      mineral: 'Folat',
      calories: '15 per 100g'
    },
    image: '/images/selada.jpg',
    tips: 'Tumbuh baik di tempat teduh parsial, panen daun luar',
  },
  {
    id: 14,
    name: 'Seledri',
    scientificName: 'Apium graveolens',
    category: 'Herbal',
    stockAvailable: 140,
    unit: 'bibit',
    growthPeriod: '85-95 hari',
    waterNeeds: 'Tinggi',
    difficulty: 'Sedang',
    price: 700,
    nutritionFacts: {
      vitamin: 'K, A, C',
      mineral: 'Kalium, Folat',
      calories: '16 per 100g'
    },
    image: '/images/seledri.jpg',
    tips: 'Butuh tanah lembab, cocok untuk sup dan masakan',
  },
  {
    id: 15,
    name: 'Wortel',
    scientificName: 'Daucus carota',
    category: 'Umbi',
    stockAvailable: 110,
    unit: 'bibit',
    growthPeriod: '70-80 hari',
    waterNeeds: 'Sedang',
    difficulty: 'Sedang',
    price: 800,
    nutritionFacts: {
      vitamin: 'A (Beta Karoten), K',
      mineral: 'Kalium',
      calories: '41 per 100g'
    },
    image: '/images/wortel.jpg',
    tips: 'Butuh tanah gembur dan dalam, hindari batu dan kerikil',
  }
];

export const recipes = [
  {
    id: 1,
    name: 'Tumis Kangkung Terasi',
    category: 'Sayuran',
    difficulty: 'Mudah',
    prepTime: '15 menit',
    cookTime: '10 menit',
    servings: 4,
    ingredients: [
      { item: 'Kangkung', amount: '2 ikat', fromGarden: true },
      { item: 'Cabai Rawit', amount: '5 buah', fromGarden: true },
      { item: 'Bawang Putih', amount: '4 siung', fromGarden: false },
      { item: 'Terasi', amount: '1 sdt', fromGarden: false },
      { item: 'Garam', amount: 'secukupnya', fromGarden: false },
    ],
    instructions: [
      'Bersihkan kangkung, potong-potong',
      'Haluskan cabai, bawang putih, dan terasi',
      'Tumis bumbu hingga harum',
      'Masukkan kangkung, aduk cepat',
      'Tambahkan garam, masak hingga layu'
    ],
    nutritionPerServing: {
      calories: 85,
      protein: '3g',
      carbs: '8g',
      fat: '5g',
      fiber: '2g'
    },
    image: '/images/recipe-tumis-kangkung.jpg',
  },
  {
    id: 2,
    name: 'Sayur Bening Bayam',
    category: 'Sayuran',
    difficulty: 'Mudah',
    prepTime: '10 menit',
    cookTime: '15 menit',
    servings: 4,
    ingredients: [
      { item: 'Bayam', amount: '1 ikat', fromGarden: true },
      { item: 'Jagung Manis', amount: '2 buah', fromGarden: false },
      { item: 'Tomat', amount: '2 buah', fromGarden: true },
      { item: 'Bawang Merah', amount: '3 siung', fromGarden: false },
      { item: 'Garam', amount: 'secukupnya', fromGarden: false },
    ],
    instructions: [
      'Rebus air hingga mendidih',
      'Masukkan jagung dan bawang merah',
      'Tambahkan tomat yang sudah dipotong',
      'Masukkan bayam, masak sebentar',
      'Beri garam, angkat'
    ],
    nutritionPerServing: {
      calories: 60,
      protein: '2g',
      carbs: '12g',
      fat: '0.5g',
      fiber: '3g'
    },
    image: '/images/recipe-sayur-bening.jpg',
  },
  {
    id: 3,
    name: 'Capcay Sayuran Segar',
    category: 'Sayuran',
    difficulty: 'Sedang',
    prepTime: '20 menit',
    cookTime: '15 menit',
    servings: 4,
    ingredients: [
      { item: 'Sawi Hijau', amount: '5 lembar', fromGarden: true },
      { item: 'Wortel', amount: '1 buah', fromGarden: true },
      { item: 'Kacang Panjang', amount: '10 batang', fromGarden: true },
      { item: 'Bawang Putih', amount: '4 siung', fromGarden: false },
      { item: 'Kecap Asin', amount: '2 sdm', fromGarden: false },
    ],
    instructions: [
      'Potong semua sayuran sesuai selera',
      'Tumis bawang putih hingga harum',
      'Masukkan wortel, masak hingga setengah matang',
      'Tambahkan sayuran lain, aduk rata',
      'Beri bumbu, masak sebentar agar tetap renyah'
    ],
    nutritionPerServing: {
      calories: 95,
      protein: '4g',
      carbs: '15g',
      fat: '3g',
      fiber: '4g'
    },
    image: '/images/recipe-capcay.jpg',
  },
  {
    id: 4,
    name: 'Sambal Terong Balado',
    category: 'Lauk',
    difficulty: 'Sedang',
    prepTime: '15 menit',
    cookTime: '20 menit',
    servings: 4,
    ingredients: [
      { item: 'Terong Ungu', amount: '4 buah', fromGarden: true },
      { item: 'Cabai Rawit', amount: '10 buah', fromGarden: true },
      { item: 'Tomat', amount: '2 buah', fromGarden: true },
      { item: 'Bawang Merah', amount: '5 siung', fromGarden: false },
      { item: 'Garam', amount: 'secukupnya', fromGarden: false },
    ],
    instructions: [
      'Potong terong, goreng hingga layu',
      'Haluskan cabai, tomat, bawang merah',
      'Tumis bumbu halus hingga harum',
      'Masukkan terong goreng',
      'Aduk rata, masak hingga bumbu meresap'
    ],
    nutritionPerServing: {
      calories: 120,
      protein: '3g',
      carbs: '18g',
      fat: '5g',
      fiber: '6g'
    },
    image: '/images/recipe-terong-balado.jpg',
  },
  {
    id: 5,
    name: 'Salad Sayur Segar',
    category: 'Salad',
    difficulty: 'Mudah',
    prepTime: '15 menit',
    cookTime: '0 menit',
    servings: 3,
    ingredients: [
      { item: 'Selada', amount: '1 ikat', fromGarden: true },
      { item: 'Tomat', amount: '3 buah', fromGarden: true },
      { item: 'Mentimun', amount: '2 buah', fromGarden: true },
      { item: 'Wortel', amount: '1 buah', fromGarden: true },
      { item: 'Dressing', amount: 'secukupnya', fromGarden: false },
    ],
    instructions: [
      'Cuci bersih semua sayuran',
      'Potong-potong sesuai selera',
      'Tata dalam mangkuk saji',
      'Siram dengan dressing favorit',
      'Sajikan segera'
    ],
    nutritionPerServing: {
      calories: 45,
      protein: '2g',
      carbs: '8g',
      fat: '1g',
      fiber: '3g'
    },
    image: '/images/recipe-salad.jpg',
  },
  {
    id: 6,
    name: 'Oseng Pare Telur',
    category: 'Lauk',
    difficulty: 'Mudah',
    prepTime: '10 menit',
    cookTime: '12 menit',
    servings: 4,
    ingredients: [
      { item: 'Pare', amount: '3 buah', fromGarden: true },
      { item: 'Telur', amount: '2 butir', fromGarden: false },
      { item: 'Cabai Rawit', amount: '5 buah', fromGarden: true },
      { item: 'Bawang Putih', amount: '3 siung', fromGarden: false },
      { item: 'Garam', amount: 'secukupnya', fromGarden: false },
    ],
    instructions: [
      'Iris tipis pare, rendam air garam untuk kurangi pahit',
      'Kocok telur lepas',
      'Tumis bawang dan cabai',
      'Masukkan pare, oseng hingga layu',
      'Tuang telur, aduk rata, masak hingga telur matang'
    ],
    nutritionPerServing: {
      calories: 110,
      protein: '7g',
      carbs: '6g',
      fat: '7g',
      fiber: '2g'
    },
    image: '/images/recipe-oseng-pare.jpg',
  },
];

export const educationArticles = [
  {
    id: 1,
    title: 'Cara Membuat Kompos dari Sampah Dapur',
    category: 'Pupuk Organik',
    readTime: '5 menit',
    author: 'Tim Penyuluh Pertanian',
    publishDate: '2025-01-15',
    excerpt: 'Pelajari cara mudah mengubah sampah dapur menjadi pupuk organik berkualitas untuk kebun Anda.',
    content: `
      Membuat kompos sendiri sangat mudah dan hemat biaya. Berikut langkah-langkahnya:

      1. Siapkan wadah tertutup dengan lubang udara
      2. Kumpulkan sampah organik (kulit sayur, buah, sisa makanan)
      3. Campur dengan tanah dan starter kompos
      4. Aduk setiap 3 hari sekali
      5. Kompos siap digunakan setelah 3-4 minggu

      Tips: Hindari memasukkan daging, tulang, atau minyak ke dalam kompos.
    `,
    image: '/images/article-kompos.jpg',
    tags: ['kompos', 'pupuk organik', 'daur ulang'],
    views: 342,
    likes: 87,
  },
  {
    id: 2,
    title: 'Sistem Irigasi Tetes Sederhana untuk Pekarangan',
    category: 'Irigasi',
    readTime: '7 menit',
    author: 'Ir. Budi Santoso',
    publishDate: '2025-01-10',
    excerpt: 'Hemat air hingga 50% dengan sistem irigasi tetes yang bisa dibuat sendiri di rumah.',
    content: `
      Irigasi tetes sangat efisien untuk kebun rumah. Cara membuatnya:

      1. Siapkan botol plastik bekas 1.5 liter
      2. Lubangi tutup botol dengan jarum panas (3-5 lubang kecil)
      3. Isi botol dengan air
      4. Tancapkan terbalik di dekat tanaman
      5. Air akan menetes perlahan langsung ke akar

      Alternatif: Gunakan selang bekas dengan lubang kecil setiap 20cm.
    `,
    image: '/images/article-irigasi.jpg',
    tags: ['irigasi', 'hemat air', 'DIY'],
    views: 521,
    likes: 143,
  },
  {
    id: 3,
    title: 'Mengenal Hama dan Cara Pengendalian Organik',
    category: 'Pengendalian Hama',
    readTime: '10 menit',
    author: 'Dr. Siti Aminah',
    publishDate: '2025-01-08',
    excerpt: 'Kenali jenis hama umum dan cara mengendalikannya tanpa pestisida kimia berbahaya.',
    content: `
      Hama tanaman bisa dikendalikan secara organik:

      1. Ulat: Semprotkan air sabun atau ambil manual
      2. Kutu Daun: Gunakan air bawang putih atau pestisida nabati
      3. Tikus: Tanam kemangi di sekeliling kebun
      4. Bekicot: Taburkan abu di sekeliling tanaman

      Pencegahan terbaik: rotasi tanaman, companion planting, dan jaga kebersihan kebun.
    `,
    image: '/images/article-hama.jpg',
    tags: ['hama', 'organik', 'pestisida alami'],
    views: 689,
    likes: 201,
  },
  {
    id: 4,
    title: 'Panduan Lengkap Menanam Sayuran di Polybag',
    category: 'Teknik Menanam',
    readTime: '8 menit',
    author: 'Agus Permana, S.P.',
    publishDate: '2025-01-05',
    excerpt: 'Tidak punya lahan luas? Polybag adalah solusi praktis untuk berkebun di rumah.',
    content: `
      Menanam di polybag cocok untuk lahan terbatas:

      1. Pilih polybag ukuran minimal 30cm untuk sayuran
      2. Gunakan media tanam: tanah, kompos, sekam (2:1:1)
      3. Buat lubang drainase di bagian bawah
      4. Tanam bibit dengan hati-hati
      5. Letakkan di tempat yang cukup sinar matahari
      6. Siram teratur pagi atau sore

      Sayuran yang cocok: cabai, tomat, terong, kangkung, bayam, sawi.
    `,
    image: '/images/article-polybag.jpg',
    tags: ['polybag', 'urban farming', 'lahan sempit'],
    views: 823,
    likes: 267,
  },
  {
    id: 5,
    title: 'Gizi Seimbang dari Hasil Kebun Sendiri',
    category: 'Nutrisi',
    readTime: '6 menit',
    author: 'Nurul Hidayati, S.Gz',
    publishDate: '2025-01-03',
    excerpt: 'Memenuhi kebutuhan gizi keluarga dengan sayuran dari pekarangan rumah.',
    content: `
      Kebun rumah bisa memenuhi kebutuhan gizi harian:

      - Sayuran Hijau: Vitamin A, K, zat besi (kangkung, bayam, sawi)
      - Buah-buahan: Vitamin C, serat (tomat, cabai, pare)
      - Kacang-kacangan: Protein nabati (kacang panjang)
      - Herbal: Antioksidan (kemangi, seledri, daun bawang)

      Target: 400g sayur dan buah per hari per orang (WHO).
      Dengan kebun 10m², keluarga bisa panen 2-3kg sayur per minggu.
    `,
    image: '/images/article-gizi.jpg',
    tags: ['gizi', 'nutrisi', 'kesehatan'],
    views: 456,
    likes: 178,
  },
];

export const videoTutorials = [
  {
    id: 1,
    title: 'Cara Membuat Irigasi Tetes dari Botol Bekas',
    duration: '05:30',
    thumbnail: '/images/video-thumb-1.jpg',
    url: 'https://example.com/video1',
    views: 1234,
    category: 'Irigasi',
  },
  {
    id: 2,
    title: 'Tutorial Lengkap Menanam Cabai di Polybag',
    duration: '12:45',
    thumbnail: '/images/video-thumb-2.jpg',
    url: 'https://example.com/video2',
    views: 2456,
    category: 'Menanam',
  },
  {
    id: 3,
    title: 'Membuat Kompos Cepat 14 Hari',
    duration: '08:20',
    thumbnail: '/images/video-thumb-3.jpg',
    url: 'https://example.com/video3',
    views: 1876,
    category: 'Pupuk',
  },
  {
    id: 4,
    title: 'Mengatasi Hama Tanaman Secara Alami',
    duration: '10:15',
    thumbnail: '/images/video-thumb-4.jpg',
    url: 'https://example.com/video4',
    views: 3421,
    category: 'Hama',
  },
];

export const users = [
  {
    id: 1,
    name: 'Ibu Siti Aminah',
    phone: '081234567890',
    rw: '02',
    role: 'peserta',
    joinDate: '2025-01-01',
    gardenSize: '15m²',
    totalHarvest: 45.5,
    activePlants: 12,
  },
  {
    id: 2,
    name: 'Ibu Nurhasanah',
    phone: '081234567891',
    rw: '02',
    role: 'peserta',
    joinDate: '2025-01-02',
    gardenSize: '20m²',
    totalHarvest: 38.2,
    activePlants: 15,
  },
  {
    id: 3,
    name: 'Ibu Aisyah',
    phone: '081234567892',
    rw: '03',
    role: 'kader',
    joinDate: '2024-12-15',
    gardenSize: '25m²',
    totalHarvest: 67.8,
    activePlants: 18,
  },
];

export const gardenActivities = [
  {
    id: 1,
    userId: 1,
    type: 'tanam',
    plantName: 'Kangkung',
    quantity: 20,
    date: '2025-01-10',
    status: 'tumbuh',
    expectedHarvest: '2025-02-10',
  },
  {
    id: 2,
    userId: 1,
    type: 'panen',
    plantName: 'Bayam',
    quantity: 2.5,
    unit: 'kg',
    date: '2025-01-08',
    status: 'selesai',
  },
  {
    id: 3,
    userId: 2,
    type: 'tanam',
    plantName: 'Cabai Rawit',
    quantity: 10,
    date: '2025-01-05',
    status: 'tumbuh',
    expectedHarvest: '2025-03-15',
  },
];

export const seedBankTransactions = [
  {
    id: 1,
    userId: 1,
    transactionType: 'ambil',
    vegetableId: 1,
    vegetableName: 'Kangkung',
    quantity: 20,
    date: '2025-01-10',
    contributionPaid: 2000,
    status: 'selesai',
  },
  {
    id: 2,
    userId: 2,
    transactionType: 'ambil',
    vegetableId: 4,
    vegetableName: 'Cabai Rawit',
    quantity: 10,
    date: '2025-01-09',
    contributionPaid: 3000,
    status: 'selesai',
  },
  {
    id: 3,
    userId: 1,
    transactionType: 'kembalikan',
    vegetableId: 2,
    vegetableName: 'Bayam',
    quantity: 50,
    date: '2025-01-08',
    contributionReceived: 2500,
    status: 'selesai',
  },
];

export const notifications = [
  {
    id: 1,
    type: 'reminder',
    title: 'Waktunya Menyiram!',
    message: 'Kangkung dan Bayam Anda perlu disiram pagi ini',
    date: '2025-01-12 06:00',
    read: false,
    icon: '💧',
  },
  {
    id: 2,
    type: 'harvest',
    title: 'Siap Panen!',
    message: 'Bayam Anda sudah siap dipanen (ditanam 30 hari lalu)',
    date: '2025-01-11 08:00',
    read: false,
    icon: '🌿',
  },
  {
    id: 3,
    type: 'stock',
    title: 'Bibit Baru Tersedia',
    message: 'Bibit Tomat Cherry baru saja tersedia di Bank Bibit',
    date: '2025-01-10 14:30',
    read: true,
    icon: '🌱',
  },
  {
    id: 4,
    type: 'education',
    title: 'Artikel Baru',
    message: 'Baca: "Cara Membuat Kompos dari Sampah Dapur"',
    date: '2025-01-09 10:00',
    read: true,
    icon: '📚',
  },
  {
    id: 5,
    type: 'event',
    title: 'Pelatihan Minggu Ini',
    message: 'Pelatihan Sistem Irigasi Tetes - Sabtu, 15 Jan jam 09.00',
    date: '2025-01-08 16:00',
    read: true,
    icon: '📅',
  },
];

export const upcomingEvents = [
  {
    id: 1,
    title: 'Pelatihan Sistem Irigasi Tetes',
    date: '2025-01-15',
    time: '09:00 - 12:00',
    location: 'Balai RW 02',
    speaker: 'Ir. Budi Santoso',
    participants: 25,
    maxParticipants: 30,
    category: 'Pelatihan',
  },
  {
    id: 2,
    title: 'Panen Raya Kangkung Bersama',
    date: '2025-01-20',
    time: '07:00 - 09:00',
    location: 'Kebun Komunal RT 03',
    speaker: '-',
    participants: 40,
    maxParticipants: 50,
    category: 'Kegiatan',
  },
  {
    id: 3,
    title: 'Workshop Pembuatan Pestisida Organik',
    date: '2025-01-25',
    time: '13:00 - 15:00',
    location: 'Balai Desa',
    speaker: 'Dr. Siti Aminah',
    participants: 18,
    maxParticipants: 25,
    category: 'Workshop',
  },
];

export const quizQuestions = [
  {
    id: 1,
    question: 'Berapa lama waktu yang dibutuhkan kangkung untuk siap panen?',
    options: ['15-20 hari', '25-30 hari', '40-50 hari', '60-70 hari'],
    correctAnswer: 1,
    category: 'Tanaman',
    difficulty: 'Mudah',
  },
  {
    id: 2,
    question: 'Apa manfaat utama dari sistem irigasi tetes?',
    options: ['Hemat air', 'Tanaman tumbuh lebih cepat', 'Tidak perlu pupuk', 'Bebas hama'],
    correctAnswer: 0,
    category: 'Irigasi',
    difficulty: 'Mudah',
  },
  {
    id: 3,
    question: 'Sayuran apa yang paling tinggi kandungan Vitamin A?',
    options: ['Kangkung', 'Bayam', 'Wortel', 'Sawi'],
    correctAnswer: 2,
    category: 'Gizi',
    difficulty: 'Sedang',
  },
  {
    id: 4,
    question: 'Berapa target konsumsi sayur dan buah per hari menurut WHO?',
    options: ['200g', '300g', '400g', '500g'],
    correctAnswer: 2,
    category: 'Gizi',
    difficulty: 'Sedang',
  },
  {
    id: 5,
    question: 'Apa yang TIDAK boleh dimasukkan ke dalam kompos?',
    options: ['Kulit buah', 'Sisa sayuran', 'Daging dan tulang', 'Daun kering'],
    correctAnswer: 2,
    category: 'Pupuk',
    difficulty: 'Mudah',
  },
];

export const dashboardStats = {
  totalUsers: 87,
  activeUsers: 64,
  totalHarvest: 342.5,
  seedBankStock: 2340,
  weeklyGrowth: 12.5,
  monthlyContribution: 156000,
};

export default {
  vegetables,
  recipes,
  educationArticles,
  videoTutorials,
  users,
  gardenActivities,
  seedBankTransactions,
  notifications,
  upcomingEvents,
  quizQuestions,
  dashboardStats,
};
