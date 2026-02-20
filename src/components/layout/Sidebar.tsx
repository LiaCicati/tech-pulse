"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  CATEGORY_LABELS,
  type Category,
  CATEGORIES,
} from "@/lib/categories";
import clsx from "clsx";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategories = searchParams.getAll("category") as Category[];

  const toggleCategory = (cat: Category) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentCategories = params.getAll("category");

    // Remove all category params and re-add
    params.delete("category");
    if (currentCategories.includes(cat)) {
      // Remove this category
      currentCategories
        .filter((c) => c !== cat)
        .forEach((c) => params.append("category", c));
    } else {
      // Add this category
      currentCategories.forEach((c) => params.append("category", c));
      params.append("category", cat);
    }
    params.set("page", "1");

    const target = pathname === "/" ? "/feed" : pathname;
    router.push(`${target}?${params.toString()}`);
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 p-4 hidden md:block min-h-[calc(100vh-3.5rem)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Categories
        </h3>
        {activeCategories.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Clear
          </button>
        )}
      </div>
      <ul className="space-y-1">
        {CATEGORIES.map((key) => (
          <li key={key}>
            <button
              onClick={() => toggleCategory(key)}
              className={clsx(
                "w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer",
                activeCategories.includes(key)
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {CATEGORY_LABELS[key]}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
