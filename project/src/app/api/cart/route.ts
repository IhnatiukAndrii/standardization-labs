import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { jsonResponse, errorResponse } from "@/lib/cache";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return errorResponse("Необхідна авторизація", 401);

    const userId = parseInt((session.user as { id: string }).id);

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: { brand: true, category: true },
        },
      },
    });
    return jsonResponse(cartItems);
  } catch {
    return errorResponse("Помилка завантаження кошика");
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return errorResponse("Необхідна авторизація", 401);

    const userId = parseInt((session.user as { id: string }).id);
    const { productId, quantity } = await req.json();

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    let item;
    if (existing) {
      item = await prisma.cartItem.update({
        where: { userId_productId: { userId, productId } },
        data: { quantity: existing.quantity + (quantity ?? 1) },
        include: { product: true },
      });
    } else {
      item = await prisma.cartItem.create({
        data: { userId, productId, quantity: quantity ?? 1 },
        include: { product: true },
      });
    }

    return jsonResponse(item, 201);
  } catch {
    return errorResponse("Помилка додавання до кошика");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return errorResponse("Необхідна авторизація", 401);

    const userId = parseInt((session.user as { id: string }).id);
    const { productId } = await req.json();

    await prisma.cartItem.delete({
      where: { userId_productId: { userId, productId } },
    });

    return jsonResponse({ message: "Товар видалено з кошика" });
  } catch {
    return errorResponse("Помилка видалення з кошика");
  }
}
