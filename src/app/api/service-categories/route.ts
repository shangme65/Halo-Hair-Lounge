import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { label: "asc" },
    });

    // Get service counts for each category (only active services for public)
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await prisma.service.count({
          where: {
            categories: {
              has: category.value,
            },
            isActive: true, // Only count active services for public
          },
        });

        return {
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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { value, label } = await req.json();

    if (!value || !label) {
      return NextResponse.json(
        { error: "Value and label are required" },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existing = await prisma.serviceCategory.findUnique({
      where: { value },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }

    const category = await prisma.serviceCategory.create({
      data: { value, label },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
