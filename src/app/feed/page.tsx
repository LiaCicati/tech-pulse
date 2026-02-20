"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useArticles } from "@/hooks/useArticles";
import { SearchBar } from "@/components/search/SearchBar";
import { FilterPanel } from "@/components/search/FilterPanel";
import { ArticleList } from "@/components/articles/ArticleList";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Suspense } from "react";

function FeedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { articles, total, totalPages, page, isLoading } =
    useArticles(searchParams);

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
        <span className="text-xs text-gray-400 tabular-nums">
          {total} article{total !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="mb-6 space-y-3">
        <SearchBar />
        <FilterPanel />
      </div>

      <ArticleList articles={articles} isLoading={isLoading} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8 pb-4">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg disabled:opacity-20 hover:bg-white hover:border-gray-300 cursor-pointer transition-colors"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-xs text-gray-400 tabular-nums">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg disabled:opacity-20 hover:bg-white hover:border-gray-300 cursor-pointer transition-colors"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function FeedPage() {
  return (
    <Suspense>
      <FeedContent />
    </Suspense>
  );
}
