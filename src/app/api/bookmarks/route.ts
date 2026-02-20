import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const bookmarks = await prisma.bookmark.findMany({
    include: { article: { include: { source: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(bookmarks);
}

export async function POST(request: NextRequest) {
  const { articleId } = await request.json();

  const existing = await prisma.bookmark.findUnique({
    where: { articleId },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return NextResponse.json({ bookmarked: false });
  }

  const bookmark = await prisma.bookmark.create({
    data: { articleId },
  });
  return NextResponse.json({ bookmarked: true, bookmark });
}

export async function PATCH(request: NextRequest) {
  const { articleId, notes } = await request.json();

  const bookmark = await prisma.bookmark.update({
    where: { articleId },
    data: { notes },
  });

  return NextResponse.json(bookmark);
}
