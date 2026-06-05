import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { jsonResponse, errorResponse } from "@/lib/cache";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get("all") === "true";

    const news = await prisma.news.findMany({
      where: showAll ? {} : { published: true },
      orderBy: { createdAt: "desc" },
    });
    return jsonResponse(news);
  } catch {
    return errorResponse("Помилка завантаження новин");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, imageUrl, published } = body;

    const item = await prisma.news.create({
      data: { title, content, imageUrl, published: published ?? false },
    });
    return jsonResponse(item, 201);
  } catch {
    return errorResponse("Помилка створення новини");
  }
}
