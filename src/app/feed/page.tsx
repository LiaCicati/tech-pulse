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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Feed</h1>
        <span className="text-sm text-gray-500">
          {total} article{total !== 1 ? "s" : ""}
        </span>
      </div>

      <SearchBar />
      <FilterPanel />
      <ArticleList articles={articles} isLoading={isLoading} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md disabled:opacity-30 hover:bg-gray-50 cursor-pointer"
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md disabled:opacity-30 hover:bg-gray-50 cursor-pointer"
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
