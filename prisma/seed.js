const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPin = await bcrypt.hash('1234', 12);

  const participantUsers = [
    { name: 'NURUL FADHILLAH', phone: '082129243662' },
    { name: 'NURNENGSIH', phone: '082128112350' },
    { name: 'KARENI', phone: '081818917700' },
    { name: 'ASIH PURWASIH', phone: '081573792526' },
    { name: 'TINARTI', phone: '089505447981' },
    { name: 'Nining nursini', phone: '085351650060' },
    { name: 'Widiyawati', phone: '083125190942' },
    { name: 'Sri mulyati', phone: '085903772838' },
    { name: 'Sarnitem', phone: '082126440480' },
    { name: 'Karni', phone: '081395386627' },
    { name: "wati'ah", phone: '081947266351' },
    { name: 'tarkinah', phone: '085211543682' },
    { name: 'sumiyati', phone: '0895355274932' },
    { name: 'castini', phone: '089528573507' },
    { name: 'Darsini', phone: '085890074546' },
    { name: 'Nurjanah', phone: '089636707224' },
    { name: 'Sri kurnaeni', phone: '089664363583' },
    { name: 'Dewi Ratna sari', phone: '089325843062' },
    { name: 'Carinih', phone: '083172521051' },
    { name: 'Tubah', phone: '0895630025496' },
    { name: 'Carsini', phone: '081222069560' },
    { name: 'Sartinah', phone: '081321128534' },
    { name: 'hj.sun', phone: '081211047874' },
    { name: 'Muhammad Kafaby', phone: '089529202742'},
    { name: '(CEO Devstack) Davi Pramudya Putra', phone: '081214240287'},
  ];

  const adminPhones = new Set([
    '089529202742',
    '081214240287',
    '082128112350',
  ]);

  const users = await Promise.all(
    participantUsers.map((participant, index) =>
      prisma.user.upsert({
        where: { phone: participant.phone },
        update: {
          name: participant.name,
          pin: hashedPin,
          role: adminPhones.has(participant.phone) ? 'admin' : 'peserta',
          kaderCode: adminPhones.has(participant.phone) ? 'ADMIN001' : 'PKK2025',
        },
        create: {
          name: participant.name,
          phone: participant.phone,
          rw: String(((index % 5) + 1)).padStart(2, '0'),
          pin: hashedPin,
          role: adminPhones.has(participant.phone) ? 'admin' : 'peserta',
          kaderCode: adminPhones.has(participant.phone) ? 'ADMIN001' : 'PKK2025',
          gardenSize: '10m²',
        },
      })
    )
  );

  console.log(`Created ${users.length} users`);

  for (let i = 0; i < users.length; i += 1) {
    const deviceNumber = i + 1;
    const deviceId = String(deviceNumber).padStart(3, '0');
    await prisma.userDevice.upsert({
      where: { userId: users[i].id },
      update: {
        deviceNumber,
        deviceId,
        username: `Telyuk_${deviceId}`,
        password: `Telyuk_${deviceId}_Sukses`,
      },
      create: {
        userId: users[i].id,
        deviceNumber,
        deviceId,
        username: `Telyuk_${deviceId}`,
        password: `Telyuk_${deviceId}_Sukses`,
      },
    });
  }

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
