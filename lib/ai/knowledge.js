export const nutritionKnowledge = [
  'Fokus konten: gizi keluarga Indonesia, stunting prevention, menu harian berbasis pangan lokal.',
  'Gunakan bahasa Indonesia sederhana, ramah ibu rumah tangga, dan langkah praktis.',
  'Selalu sertakan keseimbangan karbohidrat, protein, lemak sehat, serat, dan air putih.',
  'Prioritaskan bahan yang mudah didapat: kangkung, bayam, tomat, tempe, telur, ikan lokal.',
  'Untuk anak: variasi warna makanan, tekstur sesuai usia, porsi kecil tapi sering.',
  'Hindari klaim medis berlebihan; gunakan kalimat edukatif non-diagnostik.',
  'Tutup dengan tips implementasi mingguan agar bisa langsung dipraktikkan.',
];

export const rotatingTopics = [
  'menu bergizi seimbang untuk keluarga dengan bahan kebun rumah',
  'strategi mencegah stunting melalui pola makan harian',
  'ide bekal sekolah sehat dari sayur lokal',
  'menu MPASI sederhana berbasis bahan lokal',
  'kombinasi panen kebun dan protein murah untuk makan malam',
  'cara meningkatkan asupan serat keluarga tanpa biaya tinggi',
  'menu ibu hamil dan menyusui berbasis bahan segar',
  'kebiasaan sarapan bergizi untuk anak usia sekolah',
  'pengolahan sayur agar zat gizi tetap terjaga',
  'perencanaan menu mingguan hemat dan bernutrisi',
];

export function pickTopic(previousTopics = []) {
  const normalized = new Set(previousTopics.map((t) => String(t || '').toLowerCase()));
  const candidate = rotatingTopics.find((topic) => !normalized.has(topic.toLowerCase()));
  if (candidate) return candidate;

  return rotatingTopics[Math.floor(Math.random() * rotatingTopics.length)];
}
