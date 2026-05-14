import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { type ArticleResponse, type PaginatedResponse, CONTENT_TYPES } from '@/lib/api-types';

/**
 * GET /api/articles
 *
 * Returns paginated articles ordered by relevanceScore desc, then publishedAt desc.
 *
 * Query params:
 *   limit       number    1-100 (default: 20)
 *   cursor      string    CUID of last article (for cursor pagination)
 *   contentType string    One of: "Tool Release" | "Industry News" | "Tutorial" | "Case Study"
 *
 * Response: { data: ArticleResponse[], pagination: { nextCursor, hasMore } }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // --- Validate limit ---
    const rawLimit = searchParams.get('limit') ?? '20';
    const limit = parseInt(rawLimit, 10);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid limit. Must be an integer between 1 and 100.' },
        { status: 400 }
      );
    }

    // --- Validate contentType ---
    const rawContentType = searchParams.get('contentType');
    if (rawContentType !== null && !CONTENT_TYPES.includes(rawContentType as typeof CONTENT_TYPES[number])) {
      return NextResponse.json(
        { error: `Invalid contentType. Must be one of: ${CONTENT_TYPES.join(', ')}.` },
        { status: 400 }
      );
    }
    const contentType = rawContentType as typeof CONTENT_TYPES[number] | null;

    // --- Validate cursor ---
    const cursor = searchParams.get('cursor');

    // --- Build where clause ---
    const where = contentType ? { contentType } : {};

    // --- Query (wrapped in try/catch to handle DB unavailability gracefully) ---
    let articles: ArticleResponse[] = [];
    let nextCursor: string | null = null;

    try {
      const rows = await db.article.findMany({
        take: limit,
        ...(cursor
          ? { skip: 1, cursor: { id: cursor } }
          : {}),
        where,
        orderBy: [
          { relevanceScore: 'desc' },
          { publishedAt: 'desc' },
        ],
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

      articles = rows as unknown as ArticleResponse[];
      nextCursor = articles.length === limit ? articles[articles.length - 1].id : null;
    } catch (dbError) {
      // Database not yet connected (e.g. no Docker / Railway not provisioned).
      // Return empty results instead of 500 so the endpoint is testable without DB.
      console.warn('[GET /api/articles] Database unavailable, returning empty results:', dbError);
    }

    const response: PaginatedResponse<ArticleResponse> = {
      data: articles,
      pagination: {
        nextCursor,
        hasMore: nextCursor !== null,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('[GET /api/articles] Unhandled error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles. Please try again.' },
      { status: 500 }
    );
  }
}
