import { prisma } from "@/lib/db";
import { jsonResponse, errorResponse } from "@/lib/cache";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
    });
    return jsonResponse(brands);
  } catch {
    return errorResponse("Помилка завантаження брендів");
  }
}
