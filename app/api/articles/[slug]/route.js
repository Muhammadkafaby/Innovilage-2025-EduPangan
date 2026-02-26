import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';
import { z } from 'zod';

const updateArticleSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter').max(255).optional(),
  excerpt: z.string().min(20, 'Ringkasan minimal 20 karakter').optional(),
  content: z.string().min(40, 'Konten minimal 40 karakter').optional(),
  category: z.string().min(2).max(100).optional(),
  readTime: z.string().min(2).max(30).optional(),
  author: z.string().min(2).max(100).optional(),
  tags: z.array(z.string().min(1).max(30)).max(15).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  publishDate: z.string().datetime().optional(),
  slug: z.string().min(5).max(255).optional(),
});

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function GET(_request, { params }) {
  try {
    const { slug } = params;

    const article = await prisma.nutritionArticle.findUnique({
      where: { slug },
    });

    if (!article) {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Article detail GET error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function POST(_request, { params }) {
  try {
    const { slug } = params;

    const article = await prisma.nutritionArticle.update({
      where: { slug },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ message: 'View updated', views: article.views });
  } catch (error) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    }

    console.error('Article views POST error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const auth = await requireAdmin()(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { slug } = params;
    const body = await request.json();
    const validation = updateArticleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const payload = validation.data;
    const updateData = {};

    if (payload.title !== undefined) {
      updateData.title = payload.title;
      if (!payload.slug) {
        updateData.slug = slugify(payload.title);
      }
    }
    if (payload.slug !== undefined) updateData.slug = slugify(payload.slug);
    if (payload.excerpt !== undefined) updateData.excerpt = payload.excerpt;
    if (payload.content !== undefined) updateData.content = payload.content;
    if (payload.category !== undefined) updateData.category = payload.category;
    if (payload.readTime !== undefined) updateData.readTime = payload.readTime;
    if (payload.author !== undefined) updateData.author = payload.author;
    if (payload.tags !== undefined) updateData.tags = payload.tags;
    if (payload.status !== undefined) updateData.status = payload.status;
    if (payload.publishDate !== undefined) updateData.publishDate = new Date(payload.publishDate);

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada field yang diperbarui' },
        { status: 400 }
      );
    }

    const updated = await prisma.nutritionArticle.update({
      where: { slug },
      data: updateData,
    });

    return NextResponse.json({ message: 'Artikel berhasil diperbarui', article: updated });
  } catch (error) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    }
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Slug artikel sudah digunakan' }, { status: 409 });
    }

    console.error('Article PATCH error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await requireAdmin()(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { slug } = params;

    await prisma.nutritionArticle.delete({
      where: { slug },
    });

    return NextResponse.json({ message: 'Artikel berhasil dihapus' });
  } catch (error) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    }

    console.error('Article DELETE error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
