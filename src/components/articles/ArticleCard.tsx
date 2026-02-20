"use client";

import Link from "next/link";
import { ExternalLink, Bookmark } from "lucide-react";
import { CATEGORY_LABELS, CATEGORY_COLORS, type Category } from "@/lib/categories";
import { parseCategories } from "@/types";
import type { ArticleFull } from "@/types";
import clsx from "clsx";
import { useState } from "react";

export function ArticleCard({ article }: { article: ArticleFull }) {
  const articleCategories = parseCategories(article.categories);
  const sourceCategories = parseCategories(article.source.categories);
  const effectiveCategories =
    articleCategories.length > 0 ? articleCategories : sourceCategories;

  const [bookmarked, setBookmarked] = useState(article.bookmarks.length > 0);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked(!bookmarked);
    try {
      await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: article.id }),
      });
    } catch {
      setBookmarked(bookmarked);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <Link
            href={`/article/${article.id}`}
            className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2 block"
          >
            {article.title}
          </Link>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <span className="font-medium">{article.source.name}</span>
            {article.author && (
              <>
                <span>&middot;</span>
                <span>{article.author}</span>
              </>
            )}
            {article.publishedAt && (
              <>
                <span>&middot;</span>
                <time>
                  {new Date(article.publishedAt).toLocaleDateString()}
                </time>
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {effectiveCategories.map((cat: Category) => (
              <span
                key={cat}
                className={clsx(
                  "text-xs px-2 py-0.5 rounded-full",
                  CATEGORY_COLORS[cat]
                )}
              >
                {CATEGORY_LABELS[cat]}
              </span>
            ))}
          </div>
          {article.summary && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {article.summary}
            </p>
          )}
        </div>
        <div className="flex flex-col items-center gap-2 shrink-0">
          <button
            onClick={toggleBookmark}
            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
            title={bookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <Bookmark
              size={18}
              className={clsx(
                bookmarked
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-gray-400"
              )}
            />
          </button>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            title="Open original"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
