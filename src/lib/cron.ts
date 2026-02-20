import cron from "node-cron";
import { fetchAllSources } from "@/lib/fetchers";

let isRunning = false;

export function startCronJobs() {
  // Run every 2 hours
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

  console.log("[Cron] Scheduled: fetch sources every 2 hours");
}
