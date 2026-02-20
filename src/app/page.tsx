import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS, CATEGORY_COLORS, CATEGORIES } from "@/lib/categories";
import type { Category } from "@/lib/categories";
import Link from "next/link";
import { Rss, BookmarkIcon, Newspaper } from "lucide-react";
import clsx from "clsx";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [totalArticles, todayArticles, totalBookmarks, totalSources] =
    await Promise.all([
      prisma.article.count(),
      prisma.article.count({
        where: {
          fetchedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.bookmark.count(),
      prisma.source.count({ where: { active: true } }),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Newspaper size={16} className="text-gray-400" />
            <span className="text-xs text-gray-500">Total Articles</span>
          </div>
          <div className="text-2xl font-bold">{totalArticles}</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Newspaper size={16} className="text-blue-400" />
            <span className="text-xs text-gray-500">New Today</span>
          </div>
          <div className="text-2xl font-bold">{todayArticles}</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <BookmarkIcon size={16} className="text-yellow-400" />
            <span className="text-xs text-gray-500">Bookmarks</span>
          </div>
          <div className="text-2xl font-bold">{totalBookmarks}</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Rss size={16} className="text-orange-400" />
            <span className="text-xs text-gray-500">Active Sources</span>
          </div>
          <div className="text-2xl font-bold">{totalSources}</div>
        </div>
      </div>

      {/* Category grid */}
      <h2 className="text-lg font-semibold mb-3">Browse by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {CATEGORIES.map((key) => (
          <Link
            key={key}
            href={`/feed?category=${key}`}
            className={clsx(
              CATEGORY_COLORS[key as Category],
              "rounded-lg p-4 text-center font-medium hover:opacity-80 transition-opacity block"
            )}
          >
            {CATEGORY_LABELS[key as Category]}
          </Link>
        ))}
      </div>

      {/* Quick start hint */}
      {totalArticles === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-medium mb-1">Getting started</p>
          <p>
            Click the <strong>Refresh</strong> button in the top bar to fetch
            articles from all your configured sources. This may take a minute.
          </p>
        </div>
      )}
    </div>
  );
}
