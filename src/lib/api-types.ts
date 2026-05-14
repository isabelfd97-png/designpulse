// Matches Prisma Article model select fields returned by /api/articles
export interface ArticleResponse {
  id: string;
  title: string;
  summary: string | null;
  sourceUrl: string;
  contentType: string;
  relevanceScore: number;
  publishedAt: string; // ISO 8601 string (DateTime serialized to JSON)
  createdAt: string;
}

export interface PaginationMeta {
  nextCursor: string | null;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Content type enum (matches schema contentType values)
export type ContentType =
  | 'Tool Release'
  | 'Industry News'
  | 'Tutorial'
  | 'Case Study';

export const CONTENT_TYPES: ContentType[] = [
  'Tool Release',
  'Industry News',
  'Tutorial',
  'Case Study',
];
