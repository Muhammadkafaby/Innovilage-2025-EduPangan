import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthUser } from '../../../../lib/auth';
import { generateAiChatReply } from '../../../../lib/ai/client';

function isImageModelError(message) {
  return /does not support image input|cannot read\s+"?.+\.(png|jpg|jpeg|webp|gif)"?/i.test(String(message || ''));
}

function friendlyImageMessage() {
  return 'Saat ini AI chat hanya mendukung input teks. Saya belum bisa membaca file gambar (mis. PNG/JPG). Tolong tulis isi gambar atau pertanyaannya dalam teks, nanti saya bantu jawab.';
}

function sanitizeChatText(text) {
  return String(text || '')
    .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/gi, '')
    .replace(/your operational mode has changed[\s\S]*/gi, '')
    .replace(/^ERROR:\s*/gim, '')
    .trim();
}

function busyFallbackMessage() {
  return 'Maaf, AI sedang sibuk sebentar. Coba kirim ulang pertanyaan Anda dalam 5-10 detik.';
}

const chatSchema = z.object({
  message: z.string().min(2, 'Pesan terlalu pendek').max(2000),
  mode: z.enum(['user', 'admin']).default('user'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(2000),
      })
    )
    .max(12)
    .optional(),
});

export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);
    const body = await request.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { message, mode, history = [] } = parsed.data;
    const cleanMessage = sanitizeChatText(message);

    if (!cleanMessage) {
      return NextResponse.json({
        reply: 'Silakan kirim pertanyaan dalam teks ya. Saya siap bantu.',
      });
    }

    if (mode === 'admin') {
      if (!authUser || (authUser.role !== 'admin' && authUser.role !== 'kader')) {
        return NextResponse.json({ error: 'Akses admin ditolak' }, { status: 403 });
      }
    }

    const reply = await generateAiChatReply({
      mode,
      message: cleanMessage,
      history,
      userName: authUser?.name,
    });

    const cleanReply = sanitizeChatText(reply);
    return NextResponse.json({
      reply: cleanReply || busyFallbackMessage(),
    });
  } catch (error) {
    const message = String(error?.message || 'Gagal memproses chat AI');
    if (isImageModelError(message)) {
      return NextResponse.json({
        reply: friendlyImageMessage(),
      });
    }

    return NextResponse.json({
      reply: busyFallbackMessage(),
    });
  }
}
