import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { requireAdmin } from '../../../lib/auth';
import { z } from 'zod';

const createArticleSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter').max(255),
  slug: z.string().min(5).max(255).optional(),
  excerpt: z.string().min(20, 'Ringkasan minimal 20 karakter'),
  content: z.string().min(40, 'Konten minimal 40 karakter'),
  category: z.string().min(2).max(100).optional(),
  readTime: z.string().min(2).max(30).optional(),
  author: z.string().min(2).max(100).optional(),
  tags: z.array(z.string().min(1).max(30)).max(15).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  publishDate: z.string().datetime().optional(),
});

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status') || 'published';

    const articles = await prisma.nutritionArticle.findMany({
      where: { status },
      orderBy: { publishDate: 'desc' },
      take: Number.isNaN(limit) ? 50 : Math.min(limit, 100),
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Articles GET error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const auth = await requireAdmin()(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { action = 'list', status = 'published', limit = 100 } = body || {};

    if (action === 'create') {
      const validation = createArticleSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { error: validation.error.errors[0].message },
          { status: 400 }
        );
      }

      const payload = validation.data;
      const article = await prisma.nutritionArticle.create({
        data: {
          title: payload.title,
          slug: slugify(payload.slug || payload.title),
          excerpt: payload.excerpt,
          content: payload.content,
          category: payload.category || 'Gizi Keluarga',
          readTime: payload.readTime || '5 menit',
          author: payload.author || auth.user.name || 'Admin EduPangan',
          tags: payload.tags || [],
          status: payload.status || 'draft',
          publishDate: payload.publishDate ? new Date(payload.publishDate) : new Date(),
        },
      });

      return NextResponse.json(
        { message: 'Artikel berhasil dibuat', article },
        { status: 201 }
      );
    }

    const articles = await prisma.nutritionArticle.findMany({
      where: status === 'all' ? {} : { status },
      orderBy: { updatedAt: 'desc' },
      take: Math.min(Number(limit) || 100, 200),
    });

    return NextResponse.json(articles);
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Slug artikel sudah digunakan' }, { status: 409 });
    }

    console.error('Articles POST admin list error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
