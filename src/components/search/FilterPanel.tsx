"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function FilterPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3 mb-4 text-sm flex-wrap">
      <div className="flex items-center gap-2">
        <label className="text-gray-500 text-xs">From:</label>
        <input
          type="date"
          value={searchParams.get("dateFrom") || ""}
          onChange={(e) => updateParam("dateFrom", e.target.value || null)}
          className="border border-gray-200 rounded px-2 py-1 text-xs bg-white"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-gray-500 text-xs">To:</label>
        <input
          type="date"
          value={searchParams.get("dateTo") || ""}
          onChange={(e) => updateParam("dateTo", e.target.value || null)}
          className="border border-gray-200 rounded px-2 py-1 text-xs bg-white"
        />
      </div>
      <select
        value={searchParams.get("sortBy") || "publishedAt"}
        onChange={(e) => updateParam("sortBy", e.target.value)}
        className="border border-gray-200 rounded px-2 py-1 text-xs bg-white"
      >
        <option value="publishedAt">Sort by Date Published</option>
        <option value="fetchedAt">Sort by Date Fetched</option>
        <option value="title">Sort by Title</option>
      </select>
      <select
        value={searchParams.get("sortOrder") || "desc"}
        onChange={(e) => updateParam("sortOrder", e.target.value)}
        className="border border-gray-200 rounded px-2 py-1 text-xs bg-white"
      >
        <option value="desc">Newest First</option>
        <option value="asc">Oldest First</option>
      </select>
    </div>
  );
}
