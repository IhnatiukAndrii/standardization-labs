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
    const isAdmin = (session.user as { role: string }).role === "ADMIN";

    const orders = await prisma.order.findMany({
      where: isAdmin ? {} : { userId },
      include: {
        user: { select: { name: true, email: true } },
        orderItems: {
          include: { product: { select: { name: true, imageUrl: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return jsonResponse(orders);
  } catch {
    return errorResponse("Помилка завантаження замовлень");
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return errorResponse("Необхідна авторизація", 401);

    const userId = parseInt((session.user as { id: string }).id);
    const { address, phone } = await req.json();

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return errorResponse("Кошик порожній", 400);
    }

    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId,
        address,
        phone,
        total,
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        orderItems: { include: { product: true } },
      },
    });

    await prisma.cartItem.deleteMany({ where: { userId } });

    return jsonResponse(order, 201);
  } catch {
    return errorResponse("Помилка створення замовлення");
  }
}
