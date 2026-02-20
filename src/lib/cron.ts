import cron from "node-cron";
import { fetchAllSources } from "@/lib/fetchers";
import { cleanupOldArticles } from "@/lib/fetchers/retention";

let isRunning = false;

export function startCronJobs() {
  // Fetch every 2 hours
  cron.schedule("0 */2 * * *", async () => {
    if (isRunning) {
      console.log("[Cron] Fetch already in progress, skipping.");
      return;
    }

    isRunning = true;
    console.log(`[Cron] Starting fetch at ${new Date().toISOString()}`);

    try {
      const results = await fetchAllSources();
      const totalNew = results.reduce((sum, r) => sum + r.newArticles, 0);
      const totalErrors = results.reduce(
        (sum, r) => sum + r.errors.length,
        0
      );
      console.log(
        `[Cron] Fetch complete: ${totalNew} new articles, ${totalErrors} errors`
      );
    } catch (error) {
      console.error("[Cron] Fetch failed:", error);
    } finally {
      isRunning = false;
    }
  });

  // Cleanup old articles once a day at 3am
  cron.schedule("0 3 * * *", async () => {
    console.log(`[Cron] Running cleanup at ${new Date().toISOString()}`);
    try {
      const { deletedOld, deletedInactive } = await cleanupOldArticles();
      console.log(
        `[Cron] Cleanup done: ${deletedOld} expired, ${deletedInactive} from inactive sources`
      );
    } catch (error) {
      console.error("[Cron] Cleanup failed:", error);
    }
  });

  console.log("[Cron] Scheduled: fetch every 2h, cleanup daily at 3am");
}
