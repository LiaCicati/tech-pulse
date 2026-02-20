import { prisma } from "@/lib/prisma";
import { fetchRSSSource } from "./rss";
import { fetchDevtoArticles } from "./devto";
import { fetchRedditSubreddit } from "./reddit";
import type { FetchResult } from "@/types";

export async function fetchAllSources(): Promise<FetchResult[]> {
  const sources = await prisma.source.findMany({
    where: { active: true },
  });

  const results: FetchResult[] = [];

  for (const source of sources) {
    console.log(`[Fetch] Processing: ${source.name}`);
    let result: FetchResult;

    if (source.type === "RSS") {
      result = await fetchRSSSource(source.id, source.url);
    } else if (source.url.includes("dev.to/api")) {
      result = await fetchDevtoArticles(source.id);
    } else if (source.url.includes("reddit.com")) {
      result = await fetchRedditSubreddit(source.id, source.url);
    } else {
      result = {
        source: source.name,
        newArticles: 0,
        errors: ["Unknown source type"],
      };
    }

    console.log(
      `[Fetch] ${source.name}: ${result.newArticles} new, ${result.errors.length} errors`
    );
    results.push(result);
  }

  return results;
}
