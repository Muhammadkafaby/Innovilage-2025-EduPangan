import prisma from '../prisma';
import { generateNutritionArticle } from './client';
import { nutritionKnowledge, pickTopic } from './knowledge';

async function uniqueSlug(baseSlug) {
  const existing = await prisma.nutritionArticle.findUnique({
    where: { slug: baseSlug },
    select: { id: true },
  });

  if (!existing) return baseSlug;

  let idx = 2;
  while (idx < 9999) {
    const candidate = `${baseSlug}-${idx}`;
    const row = await prisma.nutritionArticle.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!row) return candidate;
    idx += 1;
  }

  return `${baseSlug}-${Date.now()}`;
}

export async function runArticleGeneration(triggerType = 'scheduler') {
  const startedAt = Date.now();

  const recent = await prisma.aiJobLog.findMany({
    where: { jobType: 'nutrition_article' },
    orderBy: { createdAt: 'desc' },
    take: 8,
    select: { topic: true },
  });

  const topic = pickTopic(recent.map((r) => r.topic));

  try {
    const generated = await generateNutritionArticle({
      topic,
      knowledge: nutritionKnowledge,
    });

    const slug = await uniqueSlug(generated.slug);

    const article = await prisma.nutritionArticle.create({
      data: {
        title: generated.title,
        slug,
        excerpt: generated.excerpt,
        content: generated.content,
        category: generated.category,
        readTime: generated.readTime,
        tags: generated.tags,
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
        message: 'Artikel berhasil dibuat oleh AI',
        durationMs: Date.now() - startedAt,
      },
    });

    return {
      ok: true,
      topic,
      article,
      durationMs: Date.now() - startedAt,
    };
  } catch (error) {
    await prisma.aiJobLog.create({
      data: {
        jobType: 'nutrition_article',
        triggerType,
        status: 'failed',
        topic,
        message: error.message || 'AI generator gagal',
        durationMs: Date.now() - startedAt,
      },
    });

    throw error;
  }
}
