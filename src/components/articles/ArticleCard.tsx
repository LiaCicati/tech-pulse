"use client";

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
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span className="font-semibold text-gray-700">
              {article.source.name}
            </span>
            {article.publishedAt && (
              <>
                <span>&middot;</span>
                <time>
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </>
            )}
            {article.author && (
              <>
                <span>&middot;</span>
                <span className="truncate">{article.author}</span>
              </>
            )}
          </div>
          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>
          <div className="flex flex-wrap gap-1 mt-3">
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
        </div>
        <div className="flex flex-col items-center gap-2 shrink-0 pt-1">
          <button
            onClick={toggleBookmark}
            className="p-1.5 rounded-md hover:bg-gray-100 cursor-pointer"
            title={bookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <Bookmark
              size={18}
              className={clsx(
                bookmarked
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-gray-300 group-hover:text-gray-400"
              )}
            />
          </button>
          <ExternalLink
            size={14}
            className="text-gray-300 group-hover:text-gray-400"
          />
        </div>
      </div>
    </a>
  );
}
