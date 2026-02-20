import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { parseTakeaways } from "@/types";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DigestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const digest = await prisma.digest.findUnique({
    where: { id },
    include: {
      articles: {
        include: { article: { include: { source: true } } },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!digest) return notFound();

  return (
    <div className="max-w-3xl">
      <Link
        href="/digests"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={14} /> Back to digests
      </Link>

      <h1 className="text-2xl font-bold mb-1">{digest.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Created {new Date(digest.createdAt).toLocaleDateString()} &middot;{" "}
        {digest.articles.length} articles
      </p>

      <div className="space-y-6">
        {digest.articles.map(({ article }, i) => {
          const takeaways = parseTakeaways(article.keyTakeaways);
          return (
            <div key={article.id} className="border-b border-gray-200 pb-4">
              <h2 className="font-semibold">
                {i + 1}. {article.title}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {article.source.name}
                {article.author && ` &middot; ${article.author}`} &middot;{" "}
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-0.5"
                >
                  Read original <ExternalLink size={10} />
                </a>
              </p>
              {article.summary && (
                <p className="text-sm text-gray-700 mt-2">{article.summary}</p>
              )}
              {takeaways.length > 0 && (
                <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-0.5">
                  {takeaways.map((t, j) => (
                    <li key={j}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
