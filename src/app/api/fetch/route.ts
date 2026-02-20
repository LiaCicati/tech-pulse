import { NextResponse } from "next/server";
import { fetchAllSources } from "@/lib/fetchers";
import { cleanupOldArticles } from "@/lib/fetchers/retention";

export async function POST() {
  try {
    const results = await fetchAllSources();
    const { deletedOld, deletedInactive } = await cleanupOldArticles();
    const totalNew = results.reduce((sum, r) => sum + r.newArticles, 0);
    return NextResponse.json({
      success: true,
      totalNew,
      cleaned: deletedOld + deletedInactive,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
