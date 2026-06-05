import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { jsonResponse, errorResponse } from "@/lib/cache";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    const reviews = await prisma.review.findMany({
      where: productId ? { productId: parseInt(productId) } : {},
      include: {
        user: { select: { name: true } },
        product: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return jsonResponse(reviews);
  } catch {
    return errorResponse("Помилка завантаження відгуків");
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return errorResponse("Необхідна авторизація", 401);

    const userId = parseInt((session.user as { id: string }).id);
    const { productId, rating, comment } = await req.json();

    if (!productId || !rating || rating < 1 || rating > 5) {
      return errorResponse("Невірні дані відгуку", 400);
    }

    const review = await prisma.review.create({
      data: { userId, productId, rating, comment },
      include: { user: { select: { name: true } } },
    });

    return jsonResponse(review, 201);
  } catch {
    return errorResponse("Помилка створення відгуку");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
      return errorResponse("Доступ заборонено", 403);
    }

    const { id } = await req.json();
    await prisma.review.delete({ where: { id } });
    return jsonResponse({ message: "Відгук видалено" });
  } catch {
    return errorResponse("Помилка видалення відгуку");
  }
}
