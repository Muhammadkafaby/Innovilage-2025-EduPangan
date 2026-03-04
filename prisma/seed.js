const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPin = await bcrypt.hash('1234', 12);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { phone: '081234567890' },
      update: {},
      create: {
        name: 'Ibu Siti Aminah',
        phone: '081234567890',
        rw: '02',
        pin: hashedPin,
        role: 'peserta',
        kaderCode: 'PKK2025',
        gardenSize: '15m²',
      },
    }),
    prisma.user.upsert({
      where: { phone: '081234567891' },
      update: {},
      create: {
        name: 'Ibu Nurhasanah',
        phone: '081234567891',
        rw: '02',
        pin: hashedPin,
        role: 'peserta',
        kaderCode: 'PKK2025',
        gardenSize: '20m²',
      },
    }),
    prisma.user.upsert({
      where: { phone: '081234567892' },
      update: {},
      create: {
        name: 'Ibu Aisyah',
        phone: '081234567892',
        rw: '03',
        pin: hashedPin,
        role: 'kader',
        kaderCode: 'KADER001',
        gardenSize: '25m²',
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  await prisma.userDevice.upsert({
    where: { userId: users[0].id },
    update: {
      deviceNumber: 1,
      deviceId: '001',
      username: 'Telyuk_001',
      password: 'Telyuk_001_Sukses',
    },
    create: {
      userId: users[0].id,
      deviceNumber: 1,
      deviceId: '001',
      username: 'Telyuk_001',
      password: 'Telyuk_001_Sukses',
    },
  });

  await prisma.userDevice.upsert({
    where: { userId: users[1].id },
    update: {
      deviceNumber: 2,
      deviceId: '002',
      username: 'Telyuk_002',
      password: 'Telyuk_002_Sukses',
    },
    create: {
      userId: users[1].id,
      deviceNumber: 2,
      deviceId: '002',
      username: 'Telyuk_002',
      password: 'Telyuk_002_Sukses',
    },
  });

  await prisma.userDevice.upsert({
    where: { userId: users[2].id },
    update: {
      deviceNumber: 3,
      deviceId: '003',
      username: 'Telyuk_003',
      password: 'Telyuk_003_Sukses',
    },
    create: {
      userId: users[2].id,
      deviceNumber: 3,
      deviceId: '003',
      username: 'Telyuk_003',
      password: 'Telyuk_003_Sukses',
    },
  });

  const seeds = [
    { name: 'Kangkung', scientificName: 'Ipomoea aquatica', category: 'Sayuran Hijau', stockAvailable: 150, growthPeriod: '25-30 hari', waterNeeds: 'Tinggi', difficulty: 'Mudah', price: 500, nutritionFacts: { vitamin: 'A, C, K', mineral: 'Zat Besi, Kalsium', calories: '19 per 100g' }, tips: 'Cocok ditanam di area dengan air mengalir atau sistem hidroponik' },
    { name: 'Bayam', scientificName: 'Amaranthus', category: 'Sayuran Hijau', stockAvailable: 200, growthPeriod: '30-40 hari', waterNeeds: 'Sedang', difficulty: 'Mudah', price: 500, nutritionFacts: { vitamin: 'A, C, K, B9', mineral: 'Zat Besi, Magnesium', calories: '23 per 100g' }, tips: 'Tumbuh baik di musim hujan, panen berkala untuk hasil optimal' },
    { name: 'Tomat', scientificName: 'Solanum lycopersicum', category: 'Buah', stockAvailable: 100, growthPeriod: '60-80 hari', waterNeeds: 'Sedang', difficulty: 'Sedang', price: 1000, nutritionFacts: { vitamin: 'C, K, B9', mineral: 'Kalium', calories: '18 per 100g' }, tips: 'Perlu penyangga, pemangkasan rutin untuk hasil maksimal' },
    { name: 'Cabai Rawit', scientificName: 'Capsicum frutescens', category: 'Bumbu', stockAvailable: 80, growthPeriod: '75-90 hari', waterNeeds: 'Sedang', difficulty: 'Sedang', price: 1500, nutritionFacts: { vitamin: 'A, C', mineral: 'Kalium', calories: '40 per 100g' }, tips: 'Hindari overwatering, panen saat warna merah penuh' },
    { name: 'Sawi Hijau', scientificName: 'Brassica juncea', category: 'Sayuran Hijau', stockAvailable: 180, growthPeriod: '30-40 hari', waterNeeds: 'Sedang', difficulty: 'Mudah', price: 500, nutritionFacts: { vitamin: 'A, C, K', mineral: 'Kalsium, Zat Besi', calories: '13 per 100g' }, tips: 'Cocok untuk pemula, tahan hama relatif baik' },
    { name: 'Terong Ungu', scientificName: 'Solanum melongena', category: 'Buah', stockAvailable: 70, growthPeriod: '60-70 hari', waterNeeds: 'Sedang', difficulty: 'Sedang', price: 1000, nutritionFacts: { vitamin: 'C, K, B6', mineral: 'Mangan, Kalium', calories: '25 per 100g' }, tips: 'Butuh sinar matahari penuh, panen saat kulit mengkilap' },
    { name: 'Bawang Daun', scientificName: 'Allium fistulosum', category: 'Bumbu', stockAvailable: 250, growthPeriod: '60-70 hari', waterNeeds: 'Sedang', difficulty: 'Mudah', price: 500, nutritionFacts: { vitamin: 'C, K', mineral: 'Kalsium', calories: '32 per 100g' }, tips: 'Panen bertahap, potong bagian atas saja agar terus tumbuh' },
    { name: 'Pare', scientificName: 'Momordica charantia', category: 'Buah', stockAvailable: 60, growthPeriod: '55-70 hari', waterNeeds: 'Sedang', difficulty: 'Sedang', price: 800, nutritionFacts: { vitamin: 'C, A', mineral: 'Zat Besi, Kalium', calories: '17 per 100g' }, tips: 'Butuh rambatan, bagus untuk kontrol gula darah' },
    { name: 'Kacang Panjang', scientificName: 'Vigna unguiculata', category: 'Kacang-kacangan', stockAvailable: 120, growthPeriod: '50-60 hari', waterNeeds: 'Sedang', difficulty: 'Mudah', price: 700, nutritionFacts: { vitamin: 'A, C, K', mineral: 'Protein, Serat', calories: '47 per 100g' }, tips: 'Perlu ajir atau rambatan, panen rutin agar produktif' },
    { name: 'Kemangi', scientificName: 'Ocimum basilicum', category: 'Herbal', stockAvailable: 200, growthPeriod: '30-40 hari', waterNeeds: 'Sedang', difficulty: 'Mudah', price: 500, nutritionFacts: { vitamin: 'K, A, C', mineral: 'Kalsium, Zat Besi', calories: '23 per 100g' }, tips: 'Cocok sebagai companion plant, tumbuh cepat' },
    { name: 'Mentimun', scientificName: 'Cucumis sativus', category: 'Buah', stockAvailable: 90, growthPeriod: '50-65 hari', waterNeeds: 'Tinggi', difficulty: 'Mudah', price: 800, nutritionFacts: { vitamin: 'K, C', mineral: 'Kalium, Magnesium', calories: '16 per 100g' }, tips: 'Perlu rambatan dan penyiraman teratur' },
    { name: 'Daun Bawang', scientificName: 'Allium schoenoprasum', category: 'Bumbu', stockAvailable: 220, growthPeriod: '65-75 hari', waterNeeds: 'Sedang', difficulty: 'Mudah', price: 500, nutritionFacts: { vitamin: 'C, K', mineral: 'Folat', calories: '30 per 100g' }, tips: 'Bisa dipanen berkali-kali, cocok di pot' },
    { name: 'Selada', scientificName: 'Lactuca sativa', category: 'Sayuran Hijau', stockAvailable: 160, growthPeriod: '40-50 hari', waterNeeds: 'Sedang', difficulty: 'Mudah', price: 600, nutritionFacts: { vitamin: 'A, K, C', mineral: 'Folat', calories: '15 per 100g' }, tips: 'Tumbuh baik di tempat teduh parsial, panen daun luar' },
    { name: 'Seledri', scientificName: 'Apium graveolens', category: 'Herbal', stockAvailable: 140, growthPeriod: '85-95 hari', waterNeeds: 'Tinggi', difficulty: 'Sedang', price: 700, nutritionFacts: { vitamin: 'K, A, C', mineral: 'Kalium, Folat', calories: '16 per 100g' }, tips: 'Butuh tanah lembab, cocok untuk sup dan masakan' },
    { name: 'Wortel', scientificName: 'Daucus carota', category: 'Umbi', stockAvailable: 110, growthPeriod: '70-80 hari', waterNeeds: 'Sedang', difficulty: 'Sedang', price: 800, nutritionFacts: { vitamin: 'A (Beta Karoten), K', mineral: 'Kalium', calories: '41 per 100g' }, tips: 'Butuh tanah gembur dan dalam, hindari batu dan kerikil' },
  ];

  for (const seed of seeds) {
    await prisma.seed.upsert({
      where: { id: seeds.indexOf(seed) + 1 },
      update: seed,
      create: seed,
    });
  }

  console.log(`Created ${seeds.length} seeds`);

  const nutritionArticles = [
    {
      title: 'Porsi Sayur Harian untuk Keluarga: Panduan Praktis',
      slug: 'porsi-sayur-harian-keluarga-panduan-praktis',
      category: 'Gizi Keluarga',
      excerpt: 'Panduan sederhana memenuhi target 400 gram sayur dan buah per hari dengan bahan lokal dari kebun rumah.',
      content: `Memenuhi konsumsi sayur dan buah harian tidak harus mahal. Dengan kebun rumah, keluarga dapat menyiapkan menu segar setiap hari.\n\nTips praktis:\n1. Siapkan 2 jenis sayur berbeda setiap hari.\n2. Kombinasikan sayur hijau dan sumber protein.\n3. Gunakan metode masak singkat agar zat gizi tetap terjaga.\n\nMulai dari porsi kecil lalu tingkatkan bertahap agar anak terbiasa.`,
      author: 'Tim EduPangan',
      readTime: '5 menit',
      views: 124,
      tags: ['gizi', 'keluarga', 'sayur', 'pola-makan'],
    },
    {
      title: 'Menu Mingguan Berbasis Panen Kebun Rumah',
      slug: 'menu-mingguan-berbasis-panen-kebun-rumah',
      category: 'Menu Seimbang',
      excerpt: 'Contoh menu 7 hari berbasis hasil panen kebun agar lebih hemat dan tetap bergizi seimbang.',
      content: `Menyusun menu mingguan dari hasil panen membantu keluarga lebih hemat dan sehat.\n\nContoh pola:\n- Senin: Tumis kangkung + tempe\n- Selasa: Sup bayam + telur\n- Rabu: Capcay sayur kebun\n\nPastikan ada sumber karbohidrat, protein, dan serat dalam setiap piring.`,
      author: 'Tim EduPangan',
      readTime: '6 menit',
      views: 98,
      tags: ['menu', 'panen', 'hemat', 'gizi-seimbang'],
    },
  ];

  for (const article of nutritionArticles) {
    await prisma.nutritionArticle.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        category: article.category,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        readTime: article.readTime,
        views: article.views,
        tags: article.tags,
        status: 'published',
      },
      create: {
        ...article,
        status: 'published',
      },
    });
  }

  console.log(`Created ${nutritionArticles.length} nutrition articles`);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
