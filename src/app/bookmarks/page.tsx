"use client";

import { useEffect, useState } from "react";
import type { ArticleFull } from "@/types";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Bookmark } from "lucide-react";

interface BookmarkWithArticle {
  id: string;
  articleId: string;
  notes: string | null;
  article: ArticleFull;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkWithArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/bookmarks")
      .then((res) => res.json())
      .then((data) => {
        setBookmarks(
          data.map((bm: BookmarkWithArticle) => ({
            ...bm,
            article: { ...bm.article, bookmarks: [{ id: bm.id }] },
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const startEditingNotes = (bm: BookmarkWithArticle) => {
    setEditingNotes(bm.articleId);
    setNoteText(bm.notes || "");
  };

  const saveNotes = async (articleId: string) => {
    setSaving(true);
    try {
      await fetch("/api/bookmarks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, notes: noteText }),
      });
      setBookmarks((prev) =>
        prev.map((bm) =>
          bm.articleId === articleId ? { ...bm, notes: noteText } : bm
        )
      );
      setEditingNotes(null);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Bookmarks</h1>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border p-4">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Bookmarks</h1>
        <span className="text-sm text-gray-500">
          {bookmarks.length} saved article{bookmarks.length !== 1 ? "s" : ""}
        </span>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Bookmark size={32} className="mx-auto mb-2 text-gray-300" />
          <p className="text-lg">No bookmarks yet</p>
          <p className="text-sm mt-1">
            Save articles from the feed by clicking the bookmark icon.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bm) => (
            <div key={bm.id}>
              <ArticleCard article={bm.article} />
              <div className="ml-4 mt-1">
                {editingNotes === bm.articleId ? (
                  <div className="mt-2">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add your notes..."
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                    />
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => saveNotes(bm.articleId)}
                        disabled={saving}
                        className="text-sm px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingNotes(null)}
                        className="text-sm px-3 py-1 text-gray-600 hover:text-gray-900 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditingNotes(bm)}
                    className="text-xs text-gray-400 hover:text-gray-600 mt-1 cursor-pointer"
                  >
                    {bm.notes ? (
                      <span className="text-gray-600 italic">
                        &ldquo;{bm.notes}&rdquo;
                      </span>
                    ) : (
                      "Add notes..."
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
