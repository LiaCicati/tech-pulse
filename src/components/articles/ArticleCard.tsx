"use client";

import { ExternalLink, Bookmark } from "lucide-react";
import { CATEGORY_LABELS, CATEGORY_COLORS, type Category } from "@/lib/categories";
import { parseCategories } from "@/types";
import type { ArticleFull } from "@/types";
import clsx from "clsx";
import { useState } from "react";

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

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
      className="block bg-white rounded-xl border border-gray-100 px-5 py-4 hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5 transition-all group"
    >
      {/* Top row: source + time + bookmark */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="font-medium text-gray-500">
            {article.source.name}
          </span>
          {article.publishedAt && (
            <>
              <span>&middot;</span>
              <time>{timeAgo(new Date(article.publishedAt))}</time>
            </>
          )}
        </div>
        <button
          onClick={toggleBookmark}
          className="p-1 rounded-md hover:bg-gray-100 cursor-pointer -mr-1"
          title={bookmarked ? "Remove bookmark" : "Bookmark"}
        >
          <Bookmark
            size={15}
            className={clsx(
              "transition-colors",
              bookmarked
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-200 group-hover:text-gray-300"
            )}
          />
        </button>
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 mb-3">
        {article.title}
      </h3>

      {/* Bottom row: categories + external icon */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {effectiveCategories.map((cat: Category) => (
            <span
              key={cat}
              className={clsx(
                "text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full",
                CATEGORY_COLORS[cat]
              )}
            >
              {CATEGORY_LABELS[cat]}
            </span>
          ))}
        </div>
        <ExternalLink
          size={12}
          className="text-gray-200 group-hover:text-gray-400 transition-colors shrink-0 ml-2"
        />
      </div>
    </a>
  );
}
