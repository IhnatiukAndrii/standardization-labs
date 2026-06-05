import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { jsonResponse, errorResponse } from "@/lib/cache";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.news.findUnique({
      where: { id: parseInt(id) },
    });
    if (!item) return errorResponse("Новину не знайдено", 404);
    return jsonResponse(item);
  } catch {
    return errorResponse("Помилка завантаження новини");
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const item = await prisma.news.update({
      where: { id: parseInt(id) },
      data: body,
    });
    return jsonResponse(item);
  } catch {
    return errorResponse("Помилка оновлення новини");
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.news.delete({ where: { id: parseInt(id) } });
    return jsonResponse({ message: "Новину видалено" });
  } catch {
    return errorResponse("Помилка видалення новини");
  }
}
