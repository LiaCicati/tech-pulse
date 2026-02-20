import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const search = params.get("search") || undefined;
  const categories = params.getAll("category");
  const sourceIds = params.getAll("sourceId");
  const dateFrom = params.get("dateFrom");
  const dateTo = params.get("dateTo");
  const page = parseInt(params.get("page") || "1");
  const pageSize = Math.min(parseInt(params.get("pageSize") || "12"), 50);
  const sortBy = params.get("sortBy") || "publishedAt";
  const sortOrder = params.get("sortOrder") || "desc";

  const where: Prisma.ArticleWhereInput = {};

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { author: { contains: search } },
    ];
  }

  // Category filter: since categories is a JSON string in SQLite,
  // we filter by checking if the categories string contains the category name
  if (categories.length > 0) {
    where.AND = categories.map((cat) => ({
      OR: [
        { categories: { contains: cat } },
        { source: { categories: { contains: cat } } },
      ],
    }));
  }

  if (sourceIds.length > 0) {
    where.sourceId = { in: sourceIds };
  }

  if (dateFrom || dateTo) {
    where.publishedAt = {};
    if (dateFrom)
      (where.publishedAt as Prisma.DateTimeNullableFilter).gte = new Date(
        dateFrom
      );
    if (dateTo)
      (where.publishedAt as Prisma.DateTimeNullableFilter).lte = new Date(
        dateTo
      );
  }

  const orderBy: Prisma.ArticleOrderByWithRelationInput =
    sortBy === "title"
      ? { title: sortOrder as "asc" | "desc" }
      : sortBy === "fetchedAt"
        ? { fetchedAt: sortOrder as "asc" | "desc" }
        : { publishedAt: sortOrder as "asc" | "desc" };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: { source: true, bookmarks: true },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.article.count({ where }),
  ]);

  return NextResponse.json({
    data: articles,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
