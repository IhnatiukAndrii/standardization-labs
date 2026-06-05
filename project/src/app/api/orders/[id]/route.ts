import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { jsonResponse, errorResponse } from "@/lib/cache";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return errorResponse("Необхідна авторизація", 401);

    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: { select: { name: true, email: true } },
        orderItems: {
          include: { product: true },
        },
      },
    });

    if (!order) return errorResponse("Замовлення не знайдено", 404);

    return jsonResponse(order);
  } catch {
    return errorResponse("Помилка завантаження замовлення");
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
      return errorResponse("Доступ заборонено", 403);
    }

    const { id } = await params;
    const { status } = await req.json();

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    return jsonResponse(order);
  } catch {
    return errorResponse("Помилка оновлення замовлення");
  }
}
