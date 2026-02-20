import { prisma } from "@/lib/prisma";
import type { FetchResult } from "@/types";

interface DevtoArticle {
  id: number;
  title: string;
  url: string;
  user: { name: string };
  description: string;
  published_at: string;
  tag_list: string[];
}

export async function fetchDevtoArticles(
  sourceId: string
): Promise<FetchResult> {
  const result: FetchResult = {
    source: "dev.to API",
    newArticles: 0,
    errors: [],
  };

  try {
    const response = await fetch(
      "https://dev.to/api/articles?per_page=30&top=7",
      {
        headers: { "User-Agent": "TechPulse/1.0" },
      }
    );

    if (!response.ok) {
      result.errors.push(`Dev.to API returned ${response.status}`);
      return result;
    }

    const articles: DevtoArticle[] = await response.json();

    for (const article of articles) {
      try {
        const existing = await prisma.article.findUnique({
          where: { url: article.url },
        });

        if (!existing) {
          await prisma.article.create({
            data: {
              title: article.title,
              url: article.url,
              author: article.user.name,
              sourceId,
              categories: "[]",
              publishedAt: new Date(article.published_at),
            },
          });
          result.newArticles++;
        }
      } catch (e) {
        result.errors.push(`Article "${article.title}": ${String(e)}`);
      }
    }

    await prisma.source.update({
      where: { id: sourceId },
      data: { lastFetchedAt: new Date() },
    });
  } catch (e) {
    result.errors.push(`Dev.to fetch error: ${String(e)}`);
  }

  return result;
}
