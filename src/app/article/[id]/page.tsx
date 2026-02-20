import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { parseCategories } from "@/types";
import { CATEGORY_LABELS, CATEGORY_COLORS, type Category } from "@/lib/categories";
import { ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id },
    include: { source: true, bookmarks: true },
  });

  if (!article) return notFound();

  const articleCategories = parseCategories(article.categories);
  const sourceCategories = parseCategories(article.source.categories);
  const effectiveCategories =
    articleCategories.length > 0 ? articleCategories : sourceCategories;

  return (
    <div className="max-w-3xl">
      <Link
        href="/feed"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={14} /> Back to feed
      </Link>

      <h1 className="text-2xl font-bold mb-2">{article.title}</h1>

      <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
        <span className="font-medium">{article.source.name}</span>
        {article.author && (
          <>
            <span>&middot;</span>
            <span>by {article.author}</span>
          </>
        )}
        {article.publishedAt && (
          <>
            <span>&middot;</span>
            <time>
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mb-6">
        {effectiveCategories.map((cat: Category) => (
          <span
            key={cat}
            className={clsx(
              "text-xs px-2 py-0.5 rounded-full",
              CATEGORY_COLORS[cat]
            )}
          >
            {CATEGORY_LABELS[cat]}
          </span>
        ))}
      </div>

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 text-sm"
      >
        Read on {article.source.name} <ExternalLink size={14} />
      </a>
    </div>
  );
}
