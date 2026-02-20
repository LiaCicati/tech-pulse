import Parser from "rss-parser";
import { prisma } from "@/lib/prisma";
import type { FetchResult } from "@/types";

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "TechPulse/1.0",
  },
  customFields: {
    item: [["content:encoded", "contentEncoded"]],
  },
});

export async function fetchRSSSource(
  sourceId: string,
  feedUrl: string
): Promise<FetchResult> {
  const result: FetchResult = { source: feedUrl, newArticles: 0, errors: [] };

  try {
    const feed = await parser.parseURL(feedUrl);

    for (const item of feed.items) {
      if (!item.link || !item.title) continue;

      try {
        const existing = await prisma.article.findUnique({
          where: { url: item.link },
        });

        if (!existing) {
          await prisma.article.create({
            data: {
              title: item.title.trim(),
              url: item.link,
              author: item.creator || item.author || null,
              content:
                (item as Record<string, string>).contentEncoded ||
                item.contentSnippet ||
                item.content ||
                null,
              sourceId,
              categories: "[]",
              publishedAt: item.pubDate ? new Date(item.pubDate) : null,
            },
          });
          result.newArticles++;
        }
      } catch (itemError) {
        result.errors.push(`Item "${item.title}": ${String(itemError)}`);
      }
    }

    await prisma.source.update({
      where: { id: sourceId },
      data: { lastFetchedAt: new Date() },
    });
  } catch (feedError) {
    result.errors.push(`Feed error: ${String(feedError)}`);
  }

  return result;
}
