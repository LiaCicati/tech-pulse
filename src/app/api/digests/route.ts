import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET() {
  const digests = await prisma.digest.findMany({
    include: {
      articles: {
        include: { article: { include: { source: true } } },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(digests);
}

export async function POST(request: NextRequest) {
  const { title, articleIds } = (await request.json()) as {
    title: string;
    articleIds: string[];
  };

  const digest = await prisma.digest.create({
    data: {
      title,
      shareSlug: nanoid(10),
      articles: {
        create: articleIds.map((articleId: string, index: number) => ({
          articleId,
          order: index,
        })),
      },
    },
    include: {
      articles: {
        include: { article: { include: { source: true } } },
        orderBy: { order: "asc" },
      },
    },
  });

  return NextResponse.json(digest);
}
