import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get all service categories with counts (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all categories from database
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { label: "asc" },
    });

    // Get service counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await prisma.service.count({
          where: {
            categories: {
              has: category.value,
            },
          },
        });

        return {
          id: category.id,
          value: category.value,
          label: category.label,
          serviceCount: count,
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
