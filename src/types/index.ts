import type { Article, Source, Bookmark, Digest, DigestArticle } from "@prisma/client";
import type { Category } from "@/lib/categories";

// Article with its source relation
export type ArticleWithSource = Article & {
  source: Source;
};

// Article with all relations for display
export type ArticleFull = Article & {
  source: Source;
  bookmarks: Bookmark[];
};

// Digest with nested articles
export type DigestWithArticles = Digest & {
  articles: (DigestArticle & {
    article: Article & { source: Source };
  })[];
};

// Search/filter parameters
export interface ArticleFilters {
  search?: string;
  categories?: Category[];
  sourceIds?: string[];
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "publishedAt" | "fetchedAt" | "title";
  sortOrder?: "asc" | "desc";
}

// API response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Fetch job result
export interface FetchResult {
  source: string;
  newArticles: number;
  errors: string[];
}

// Helper to parse JSON string fields from SQLite
export function parseCategories(json: string): Category[] {
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}

export function parseTakeaways(json: string | null): string[] {
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}
