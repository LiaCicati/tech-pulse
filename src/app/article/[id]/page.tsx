import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { parseCategories, parseTakeaways } from "@/types";
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
  const takeaways = parseTakeaways(article.keyTakeaways);

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

      <div className="flex items-center gap-3 mb-6">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Read original <ExternalLink size={12} />
        </a>
      </div>

      {/* Summary section */}
      {article.summary && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-2">AI Summary</h2>
          <p className="text-sm text-gray-700 mb-3">{article.summary}</p>
          {takeaways.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">
                Key Takeaways
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {takeaways.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Category badges */}
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

      {/* Article content */}
      {article.content && (
        <div className="prose prose-sm max-w-none bg-white border border-gray-200 rounded-lg p-6">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      )}

      {!article.content && (
        <div className="text-center py-8 text-gray-500 bg-white border border-gray-200 rounded-lg">
          <p>No content preview available.</p>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm mt-1 inline-block"
          >
            Read the full article on {article.source.name}
          </a>
        </div>
      )}
    </div>
  );
}
