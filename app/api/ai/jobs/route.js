import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const auth = await requireAdmin()(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '30', 10), 100);

    const logs = await prisma.aiJobLog.findMany({
      where: { jobType: 'nutrition_article' },
      orderBy: { createdAt: 'desc' },
      take: Number.isNaN(limit) ? 30 : limit,
    });

    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Gagal memuat job logs AI' },
      { status: 500 }
    );
  }
}
