"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import type { DigestWithArticles, ArticleFull } from "@/types";

interface BookmarkWithArticle {
  id: string;
  articleId: string;
  notes: string | null;
  article: ArticleFull;
}

export default function DigestsPage() {
  const router = useRouter();
  const [digests, setDigests] = useState<DigestWithArticles[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkWithArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/digests").then((r) => r.json()),
      fetch("/api/bookmarks").then((r) => r.json()),
    ])
      .then(([d, b]) => {
        setDigests(d);
        setBookmarks(b);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleArticle = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const createDigest = async () => {
    if (!title || selectedIds.size === 0) return;
    setCreating(true);
    try {
      const res = await fetch("/api/digests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, articleIds: Array.from(selectedIds) }),
      });
      const digest = await res.json();
      router.push(`/digests/${digest.id}`);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Digests</h1>
        <div className="animate-pulse space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-lg border p-4">
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Digests</h1>
        <button
          onClick={() => setShowBuilder(!showBuilder)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-700 cursor-pointer"
        >
          <Plus size={14} /> New Digest
        </button>
      </div>

      {/* Builder */}
      {showBuilder && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-3">Create a Digest</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digest title (e.g., 'Week 8 Frontend Highlights')"
            className="w-full border border-gray-200 rounded-lg p-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
          {bookmarks.length === 0 ? (
            <p className="text-sm text-gray-500">
              No bookmarked articles yet. Bookmark some articles first.
            </p>
          ) : (
            <>
              <p className="text-xs text-gray-500 mb-2">
                Select from your bookmarked articles:
              </p>
              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                {bookmarks.map((bm) => (
                  <label
                    key={bm.articleId}
                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(bm.articleId)}
                      onChange={() => toggleArticle(bm.articleId)}
                      className="rounded"
                    />
                    <span className="text-sm flex-1">{bm.article.title}</span>
                    <span className="text-xs text-gray-400">
                      {bm.article.source.name}
                    </span>
                  </label>
                ))}
              </div>
              <button
                onClick={createDigest}
                disabled={creating || !title || selectedIds.size === 0}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 text-sm cursor-pointer"
              >
                {creating
                  ? "Creating..."
                  : `Create Digest (${selectedIds.size} articles)`}
              </button>
            </>
          )}
        </div>
      )}

      {/* Digest list */}
      {digests.length === 0 && !showBuilder ? (
        <div className="text-center py-12 text-gray-500">
          <FileText size={32} className="mx-auto mb-2 text-gray-300" />
          <p className="text-lg">No digests yet</p>
          <p className="text-sm mt-1">
            Create a digest to curate and share articles with your team.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {digests.map((digest) => (
            <Link
              key={digest.id}
              href={`/digests/${digest.id}`}
              className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <h3 className="font-medium">{digest.title}</h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <span>{digest.articles.length} articles</span>
                <span>&middot;</span>
                <time>
                  {new Date(digest.createdAt).toLocaleDateString()}
                </time>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
