import { z } from 'zod';

const aiArticleSchema = z.object({
  title: z.string().min(10).max(255),
  excerpt: z.string().min(40).max(500),
  content: z.string().min(250),
  category: z.string().min(3).max(100).default('Gizi Keluarga'),
  readTime: z.string().min(2).max(30).default('5 menit'),
  tags: z.array(z.string().min(2).max(30)).min(3).max(8),
});

export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 255);
}

async function requestBiznetChat(messages, temperature = 0.7) {
  const apiKey = process.env.BIZNETGIO_API_KEY;
  if (!apiKey) {
    throw new Error('BIZNETGIO_API_KEY belum di-set di environment');
  }

  const res = await fetch('https://api.biznetgio.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.BIZNETGIO_MODEL || 'openai/gpt-oss-20b',
      temperature,
      messages,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`AI request gagal: ${res.status} ${errText}`);
  }

  const payload = await res.json();
  return payload?.choices?.[0]?.message?.content;
}

function normalizeChatText(text) {
  const raw = String(text || '');

  if (/cannot read\s+"?.+\.(png|jpg|jpeg|webp|gif)"?.*does not support image input/i.test(raw)) {
    return friendlyImageNotSupportedMessage();
  }

  const cleaned = raw
    .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/gi, '')
    .replace(/&lt;system-reminder&gt;[\s\S]*?&lt;\/system-reminder&gt;/gi, '')
    .replace(/<system-reminder>[\s\S]*/gi, '')
    .replace(/&lt;system-reminder&gt;[\s\S]*/gi, '')
    .replace(/your operational mode has changed[\s\S]*/gi, '')
    .replace(/^ERROR:\s*/gim, '')
    .replace(/inform the user\.?/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleaned
    .replace(/\\\(\\displaystyle\s*([\s\S]*?)\\\)/g, '$1')
    .replace(/\\\(([\s\S]*?)\\\)/g, '$1')
    .replace(/\\\[([\s\S]*?)\\\]/g, '$1')
    .replace(/\\langle\s*/g, '<')
    .replace(/\\rangle/g, '>')
    .replace(/\\vec\{([^}]+)\}/g, '$1')
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
    .replace(/\\cdot/g, '·')
    .replace(/\\times/g, '×')
    .replace(/\\bigl/g, '')
    .replace(/\\bigr/g, '')
    .replace(/\\left/g, '')
    .replace(/\\right/g, '')
    .replace(/\\;/g, ' ')
    .replace(/\\,/g, ' ')
    .replace(/\\ /g, ' ')
    .replace(/\\_/g, '_')
    .replace(/\*\*\s*\\\s*/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function sanitizeForModel(text) {
  return String(text || '')
    .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/gi, '')
    .replace(/&lt;system-reminder&gt;[\s\S]*?&lt;\/system-reminder&gt;/gi, '')
    .replace(/<system-reminder>[\s\S]*/gi, '')
    .replace(/&lt;system-reminder&gt;[\s\S]*/gi, '')
    .replace(/your operational mode has changed[\s\S]*/gi, '')
    .replace(/^ERROR:\s*/gim, '')
    .replace(/inform the user\.?/gi, '')
    .trim();
}

function looksLikeImageInput(text) {
  const value = String(text || '').toLowerCase();
  return /(\.png|\.jpg|\.jpeg|\.webp|\.gif|<image|gambar terlampir|lihat gambar)/.test(value);
}

function friendlyImageNotSupportedMessage() {
  return 'Saat ini AI chat hanya mendukung input teks. Saya belum bisa membaca file gambar (mis. PNG/JPG). Tolong tulis isi gambar atau pertanyaannya dalam teks, nanti saya bantu rangkum dan jawab.';
}

export async function generateAiChatReply({ mode = 'user', message, history = [], userName }) {
  const roleMode = mode === 'admin' ? 'admin' : 'user';

  if (looksLikeImageInput(message)) {
    return friendlyImageNotSupportedMessage();
  }

  const systemPrompt = roleMode === 'admin'
    ? [
        'Kamu adalah asisten AI admin EduPangan.',
        'Jawaban harus ringkas, action-oriented, dan dalam Bahasa Indonesia.',
        'Fokus: monitoring program gizi, operasional bank bibit, engagement warga, dan ide konten artikel.',
        'Jika user minta langkah, berikan checklist praktis.',
      ].join('\n')
    : [
        'Kamu adalah asisten AI EduPangan untuk keluarga Indonesia.',
        'Jawaban harus ramah, praktis, mudah dipraktikkan, dan dalam Bahasa Indonesia.',
        'Fokus: gizi keluarga, kebun rumah, menu harian sehat, dan tips panen.',
        'Hindari klaim medis berlebihan dan sertakan saran realistis.',
      ].join('\n');

  const safeHistory = Array.isArray(history)
    ? history
        .slice(-8)
        .map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: sanitizeForModel(m.content),
        }))
        .filter((m) => m.content.length > 0 && !looksLikeImageInput(m.content))
    : [];

  const cleanMessage = sanitizeForModel(message);

  if (!cleanMessage) {
    return 'Silakan tulis pertanyaan Anda dalam teks, saya siap bantu.';
  }

  const content = userName
    ? `Nama pengguna: ${userName}\nPertanyaan: ${cleanMessage}`
    : cleanMessage;

  let aiText;
  try {
    aiText = await requestBiznetChat(
      [
        { role: 'system', content: systemPrompt },
        ...safeHistory,
        { role: 'user', content },
      ],
      0.6
    );
  } catch (error) {
    const msg = String(error?.message || '');
    if (/does not support image input|cannot read .*\.(png|jpg|jpeg|webp|gif)/i.test(msg)) {
      return friendlyImageNotSupportedMessage();
    }
    throw error;
  }

  if (!aiText) {
    throw new Error('AI response kosong');
  }

  if (/does not support image input|cannot read .*\.(png|jpg|jpeg|webp|gif)/i.test(aiText)) {
    return friendlyImageNotSupportedMessage();
  }

  const normalized = normalizeChatText(aiText);
  if (!normalized) {
    return 'Saya siap bantu. Coba kirim pertanyaan berikutnya dalam teks singkat ya.';
  }

  return normalized;
}

export async function generateNutritionArticle({ topic, knowledge }) {
  const systemPrompt = [
    'Kamu adalah AI EduPangan yang menulis artikel gizi untuk keluarga Indonesia.',
    'Tulis konten yang aplikatif, jelas, tidak mengandung klaim medis berlebihan.',
    'Output HARUS valid JSON tanpa markdown.',
    'Gunakan format JSON: {"title":"...","excerpt":"...","content":"...","category":"...","readTime":"...","tags":["...","..."]}',
    'Konten 4-7 paragraf, boleh ada bullet praktis.',
    'Seluruh isi harus dalam Bahasa Indonesia.',
    ...knowledge,
  ].join('\n');

  const userPrompt = `Buat artikel baru dengan topik: ${topic}`;

  const raw = await requestBiznetChat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  if (!raw) {
    throw new Error('AI response kosong');
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const first = raw.indexOf('{');
    const last = raw.lastIndexOf('}');
    if (first >= 0 && last > first) {
      parsed = JSON.parse(raw.slice(first, last + 1));
    } else {
      throw new Error('AI response bukan JSON valid');
    }
  }

  const article = aiArticleSchema.parse(parsed);

  return {
    ...article,
    slug: slugify(article.title),
    source: 'ai',
  };
}
