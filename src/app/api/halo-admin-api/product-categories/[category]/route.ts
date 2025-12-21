import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// DELETE - Delete all products in a category and the category itself
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ category: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const category = params.category;

    // Check if there are products in this category (using categories array)
    const productCount = await prisma.product.count({
      where: { categories: { has: category } },
    });

    // Delete all products in the category (if any)
    if (productCount > 0) {
      await prisma.product.deleteMany({
        where: { categories: { has: category } },
      });
    }

    // Delete the category itself from the database
    await prisma.productCategoryModel.delete({
      where: { value: category },
    });

    return NextResponse.json({
      message:
        productCount > 0
          ? `Successfully deleted ${productCount} product(s) and removed ${category} category`
          : `Successfully deleted ${category} category`,
      deletedCount: productCount,
    });
  } catch (error) {
    console.error("Error deleting category products:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
