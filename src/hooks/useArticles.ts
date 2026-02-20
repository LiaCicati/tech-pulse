"use client";

import { useState, useEffect } from "react";
import type { ArticleFull, PaginatedResponse } from "@/types";

export function useArticles(searchParams: URLSearchParams) {
  const [data, setData] = useState<PaginatedResponse<ArticleFull> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const paramsString = searchParams.toString();

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/articles?${paramsString}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [paramsString]);

  return {
    articles: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    page: data?.page ?? 1,
    isLoading,
  };
}
