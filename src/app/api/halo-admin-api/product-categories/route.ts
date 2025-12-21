import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get all product categories with product counts
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all categories from database
    const categories = await prisma.productCategoryModel.findMany({
      orderBy: { label: "asc" },
    });

    // Get product counts for each category (using categories array)
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await prisma.product.count({
          where: { categories: { has: category.value } },
        });

        return {
          value: category.value,
          label: category.label,
          productCount: count,
        };
      })
    );

    // Filter out categories with 0 products
    const activeCategories = categoriesWithCounts.filter(
      (cat) => cat.productCount > 0
    );

    // Return all categories (including empty ones for dropdown selection)
    return NextResponse.json(categoriesWithCounts);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST - Create a new product category
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Convert name to value format (uppercase with underscores)
    const value = name.trim().toUpperCase().replace(/\s+/g, "_");
    const label = name.trim();

    // Check if category already exists
    const existingCategory = await prisma.productCategoryModel.findUnique({
      where: { value },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 409 }
      );
    }

    // Create the category
    const category = await prisma.productCategoryModel.create({
      data: {
        value,
        label,
      },
    });

    return NextResponse.json({
      message: "Category created successfully",
      category: {
        value: category.value,
        label: category.label,
        productCount: 0,
      },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
