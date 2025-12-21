import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Get all product categories (public endpoint)
export async function GET() {
  try {
    // Get all categories from database
    const categories = await prisma.productCategoryModel.findMany({
      orderBy: { label: "asc" },
    });

    // Get product counts for each category (using categories array)
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await prisma.product.count({
          where: {
            categories: { has: category.value },
            isActive: true, // Only count active products for public
          },
        });

        return {
          value: category.value,
          label: category.label,
          productCount: count,
        };
      })
    );

    // Return all categories (including empty ones)
    return NextResponse.json(categoriesWithCounts);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
