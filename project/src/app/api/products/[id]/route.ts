import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { jsonResponse, errorResponse } from "@/lib/cache";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        brand: true,
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) return errorResponse("Товар не знайдено", 404);

    return jsonResponse(product);
  } catch {
    return errorResponse("Помилка завантаження товару");
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: body,
      include: { category: true, brand: true },
    });
    return jsonResponse(product);
  } catch {
    return errorResponse("Помилка оновлення товару");
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id: parseInt(id) } });
    return jsonResponse({ message: "Товар видалено" });
  } catch {
    return errorResponse("Помилка видалення товару");
  }
}
