import { NextResponse } from "next/server";
import { fetchAllSources } from "@/lib/fetchers";

export async function POST() {
  try {
    const results = await fetchAllSources();
    const totalNew = results.reduce((sum, r) => sum + r.newArticles, 0);
    return NextResponse.json({
      success: true,
      totalNew,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
