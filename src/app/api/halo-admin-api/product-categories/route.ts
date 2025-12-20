import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ProductCategory } from "@prisma/client";

// GET - Get all product categories with product counts
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all categories from enum
    const allCategories = Object.values(ProductCategory);

    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      allCategories.map(async (category) => {
        const count = await prisma.product.count({
          where: { category },
        });

        return {
          value: category,
          label:
            category.charAt(0) +
            category.slice(1).toLowerCase().replace(/_/g, " "),
          productCount: count,
        };
      })
    );

    return NextResponse.json(categoriesWithCounts);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
