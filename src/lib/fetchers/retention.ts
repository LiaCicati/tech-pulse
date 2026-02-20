import { prisma } from "@/lib/prisma";

// Only keep articles from the last 30 days
export const RETENTION_DAYS = 30;

/**
 * Delete articles older than RETENTION_DAYS that are not bookmarked.
 * Also deletes all articles from inactive sources.
 */
export async function cleanupOldArticles(): Promise<{
  deletedOld: number;
  deletedInactive: number;
}> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);

  // Delete old articles that aren't bookmarked
  const oldResult = await prisma.article.deleteMany({
    where: {
      publishedAt: { lt: cutoff },
      bookmarks: { none: {} },
    },
  });

  // Delete articles from inactive sources (not bookmarked)
  const inactiveResult = await prisma.article.deleteMany({
    where: {
      source: { active: false },
      bookmarks: { none: {} },
    },
  });

  return {
    deletedOld: oldResult.count,
    deletedInactive: inactiveResult.count,
  };
}
