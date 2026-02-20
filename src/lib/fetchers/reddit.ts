import { prisma } from "@/lib/prisma";
import type { FetchResult } from "@/types";

// Reddit public JSON API - no OAuth needed
// We add .json to subreddit URLs and parse the response

interface RedditPost {
  data: {
    title: string;
    url: string;
    permalink: string;
    author: string;
    selftext: string;
    is_self: boolean;
    created_utc: number;
    score: number;
  };
}

export async function fetchRedditSubreddit(
  sourceId: string,
  subredditJsonUrl: string
): Promise<FetchResult> {
  const result: FetchResult = {
    source: subredditJsonUrl,
    newArticles: 0,
    errors: [],
  };

  try {
    const response = await fetch(`${subredditJsonUrl}?limit=25&raw_json=1`, {
      headers: {
        "User-Agent": "TechPulse/1.0 (personal news aggregator)",
      },
    });

    if (!response.ok) {
      result.errors.push(`Reddit returned ${response.status}`);
      return result;
    }

    const data = await response.json();
    const posts: RedditPost[] = data.data?.children || [];

    for (const { data: post } of posts) {
      // Use external URL for link posts, reddit permalink for self posts
      const articleUrl = post.is_self
        ? `https://www.reddit.com${post.permalink}`
        : post.url;

      try {
        const existing = await prisma.article.findUnique({
          where: { url: articleUrl },
        });

        if (!existing) {
          await prisma.article.create({
            data: {
              title: post.title,
              url: articleUrl,
              author: post.author,
              sourceId,
              categories: "[]",
              publishedAt: new Date(post.created_utc * 1000),
            },
          });
          result.newArticles++;
        }
      } catch (e) {
        result.errors.push(`Post "${post.title}": ${String(e)}`);
      }
    }

    await prisma.source.update({
      where: { id: sourceId },
      data: { lastFetchedAt: new Date() },
    });
  } catch (e) {
    result.errors.push(`Reddit fetch error: ${String(e)}`);
  }

  return result;
}
