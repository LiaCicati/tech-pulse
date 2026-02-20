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
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse"
          >
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />
            <div className="flex gap-1">
              <div className="h-5 bg-gray-100 rounded-full w-16" />
              <div className="h-5 bg-gray-100 rounded-full w-12" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No articles found</p>
        <p className="text-sm mt-1">
          Try adjusting your filters or click Refresh to fetch new articles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
