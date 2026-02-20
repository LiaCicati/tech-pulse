"use client";

import Link from "next/link";
import { RefreshCw, Bookmark, FileText, Home, Rss } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [fetching, setFetching] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const triggerFetch = async () => {
    setFetching(true);
    setLastResult(null);
    try {
      const res = await fetch("/api/fetch", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setLastResult(`${data.totalNew} new articles`);
        // Reload page to show new articles
        if (data.totalNew > 0) {
          window.location.reload();
        }
      }
    } catch {
      setLastResult("Fetch failed");
    } finally {
      setFetching(false);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-gray-900"
        >
          <Rss size={20} className="text-orange-500" />
          Tech Pulse
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <Home size={16} /> Dashboard
          </Link>
          <Link
            href="/feed"
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <Rss size={16} /> Feed
          </Link>
          <Link
            href="/bookmarks"
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <Bookmark size={16} /> Bookmarks
          </Link>
          <Link
            href="/digests"
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <FileText size={16} /> Digests
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={triggerFetch}
              disabled={fetching}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw
                size={14}
                className={fetching ? "animate-spin" : ""}
              />
              {fetching ? "Fetching..." : "Refresh"}
            </button>
            {lastResult && (
              <span className="text-xs text-gray-500">{lastResult}</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
