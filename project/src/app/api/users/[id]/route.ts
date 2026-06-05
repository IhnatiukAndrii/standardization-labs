import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { jsonResponse, errorResponse } from "@/lib/cache";

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
    const { role } = await req.json();

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    return jsonResponse(user);
  } catch {
    return errorResponse("Помилка оновлення користувача");
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
      return errorResponse("Доступ заборонено", 403);
    }

    const { id } = await params;
    await prisma.user.delete({ where: { id: parseInt(id) } });
    return jsonResponse({ message: "Користувача видалено" });
  } catch {
    return errorResponse("Помилка видалення користувача");
  }
}
