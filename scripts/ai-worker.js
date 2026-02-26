const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function runGeneration(triggerType = 'scheduler') {
  const startedAt = Date.now();

  try {
    const recent = await prisma.aiJobLog.findMany({
      where: { jobType: 'nutrition_article' },
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: { topic: true },
    });

    const topics = [
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

    const used = new Set(recent.map((r) => String(r.topic || '').toLowerCase()));
    const topic = topics.find((t) => !used.has(t.toLowerCase())) || topics[Math.floor(Math.random() * topics.length)];

    const apiKey = process.env.BIZNETGIO_API_KEY;
    if (!apiKey) {
      throw new Error('BIZNETGIO_API_KEY belum di-set');
    }

    const systemPrompt = [
      'Kamu adalah AI EduPangan yang menulis artikel gizi untuk keluarga Indonesia.',
      'Output HARUS JSON valid tanpa markdown dengan format:',
      '{"title":"...","excerpt":"...","content":"...","category":"...","readTime":"...","tags":["...","..."]}',
      'Tulisan berbahasa Indonesia, praktis, tidak mengandung klaim medis berlebihan.',
      'Topik wajib diikuti sesuai permintaan user.',
    ].join('\n');

    const response = await fetch('https://api.biznetgio.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.BIZNETGIO_MODEL || 'openai/gpt-oss-20b',
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Buat artikel dengan topik: ${topic}` },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI request gagal: ${response.status} ${await response.text()}`);
    }

    const payload = await response.json();
    const raw = payload?.choices?.[0]?.message?.content;
    if (!raw) {
      throw new Error('AI response kosong');
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      const s = raw.indexOf('{');
      const e = raw.lastIndexOf('}');
      if (s >= 0 && e > s) {
        parsed = JSON.parse(raw.slice(s, e + 1));
      } else {
        throw error;
      }
    }

    const slugBase = String(parsed.title || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 255);

    let slug = slugBase || `artikel-ai-${Date.now()}`;
    let suffix = 2;
    while (await prisma.nutritionArticle.findUnique({ where: { slug }, select: { id: true } })) {
      slug = `${slugBase}-${suffix}`;
      suffix += 1;
    }

    const article = await prisma.nutritionArticle.create({
      data: {
        title: parsed.title,
        slug,
        excerpt: parsed.excerpt,
        content: parsed.content,
        category: parsed.category || 'Gizi Keluarga',
        readTime: parsed.readTime || '5 menit',
        tags: Array.isArray(parsed.tags) ? parsed.tags : ['gizi', 'keluarga', 'edupangan'],
        status: 'published',
        source: 'ai',
        author: 'AI EduPangan',
        publishDate: new Date(),
      },
    });

    await prisma.aiJobLog.create({
      data: {
        jobType: 'nutrition_article',
        triggerType,
        status: 'success',
        topic,
        title: article.title,
        message: 'Artikel AI berhasil dibuat',
        durationMs: Date.now() - startedAt,
      },
    });

    console.log(`[AI Worker] SUCCESS: ${article.title}`);
  } catch (error) {
    await prisma.aiJobLog.create({
      data: {
        jobType: 'nutrition_article',
        triggerType,
        status: 'failed',
        message: error.message || 'Unknown error',
        durationMs: Date.now() - startedAt,
      },
    });
    console.error('[AI Worker] FAILED:', error.message || error);
  }
}

async function main() {
  const once = process.argv.includes('--once');
  const intervalMs = parseInt(process.env.AI_ARTICLE_INTERVAL_MS || '300000', 10);

  if (once) {
    await runGeneration('manual_script');
    await prisma.$disconnect();
    return;
  }

  console.log(`[AI Worker] Running every ${intervalMs}ms`);
  await runGeneration('scheduler');
  setInterval(() => {
    runGeneration('scheduler').catch((err) => {
      console.error('[AI Worker] interval error:', err.message || err);
    });
  }, intervalMs);
}

main().catch(async (error) => {
  console.error('[AI Worker] fatal:', error.message || error);
  await prisma.$disconnect();
  process.exit(1);
});
