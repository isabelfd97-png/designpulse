import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/articles
 * Returns paginated articles with optional filtering.
 *
 * Query params:
 * - limit: number (1-100, default 20)
 * - cursor: string (for cursor-based pagination)
 * - contentType: string (optional — "Tool Release" | "Industry News" | "Tutorial" | "Case Study")
 */
export async function GET(request: NextRequest) {
  try {
    const limit = Math.min(
      Math.max(parseInt(request.nextUrl.searchParams.get('limit') || '20', 10), 1),
      100
    );

    const cursor = request.nextUrl.searchParams.get('cursor');
    const contentType = request.nextUrl.searchParams.get('contentType');

    const where: { contentType?: string } = {};
    if (contentType) {
      where.contentType = contentType;
    }

    const articles = await db.article.findMany({
      take: limit,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      where,
      orderBy: [{ relevanceScore: 'desc' }, { publishedAt: 'desc' }],
      select: {
        id: true,
        title: true,
        summary: true,
        sourceUrl: true,
        contentType: true,
        relevanceScore: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    const nextCursor =
      articles.length === limit ? articles[articles.length - 1].id : null;

    return NextResponse.json(
      {
        articles,
        pagination: {
          nextCursor,
          hasMore: !!nextCursor,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/articles error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
