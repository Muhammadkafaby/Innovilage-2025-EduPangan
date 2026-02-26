import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/auth';
import { runArticleGeneration } from '../../../../lib/ai/generator';

export async function POST(request) {
  try {
    const auth = await requireAdmin()(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const result = await runArticleGeneration('manual');

    return NextResponse.json({
      message: 'Artikel AI berhasil dibuat',
      topic: result.topic,
      article: result.article,
      durationMs: result.durationMs,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Gagal generate artikel AI' },
      { status: 500 }
    );
  }
}
