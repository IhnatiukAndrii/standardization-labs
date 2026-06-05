import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { jsonResponse, errorResponse } from "@/lib/cache";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const brandId = searchParams.get("brand");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }
    if (brandId) {
      where.brandId = parseInt(brandId);
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, unknown>).gte = parseFloat(minPrice);
      if (maxPrice) (where.price as Record<string, unknown>).lte = parseFloat(maxPrice);
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return jsonResponse(products);
  } catch {
    return errorResponse("Помилка завантаження товарів");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, price, imageUrl, stock, categoryId, brandId } = body;

    const product = await prisma.product.create({
      data: { name, description, price, imageUrl, stock, categoryId, brandId },
      include: { category: true, brand: true },
    });

    return jsonResponse(product, 201);
  } catch {
    return errorResponse("Помилка створення товару");
  }
}
