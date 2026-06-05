import { prisma } from "@/lib/db";
import { jsonResponse, errorResponse } from "@/lib/cache";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return jsonResponse(categories);
  } catch {
    return errorResponse("Помилка завантаження категорій");
  }
}
