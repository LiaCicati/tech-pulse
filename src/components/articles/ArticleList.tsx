import type { ArticleFull } from "@/types";
import { ArticleCard } from "./ArticleCard";

export function ArticleList({
  articles,
  isLoading,
}: {
  articles: ArticleFull[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 px-5 py-4 animate-pulse"
          >
            <div className="h-3 bg-gray-100 rounded w-2/5 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="flex gap-1.5">
              <div className="h-4 bg-gray-100 rounded-full w-14" />
              <div className="h-4 bg-gray-100 rounded-full w-10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg font-medium">No articles found</p>
        <p className="text-sm mt-1">
          Try adjusting your filters or click Refresh to fetch new articles.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
