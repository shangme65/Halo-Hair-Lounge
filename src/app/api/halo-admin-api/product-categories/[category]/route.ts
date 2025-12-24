import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// DELETE - Remove category from all products and delete the category itself
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

    // Find all products that have this category
    const productsWithCategory = await prisma.product.findMany({
      where: {
        categories: { has: category },
      },
      select: { id: true, categories: true },
    });

    // Remove this category from all products that use it
    if (productsWithCategory.length > 0) {
      await Promise.all(
        productsWithCategory.map(async (product) => {
          const updatedCategories = product.categories.filter(
            (cat: string) => cat !== category
          );

          await prisma.product.update({
            where: { id: product.id },
            data: { categories: updatedCategories },
          });
        })
      );
    }

    // Delete the category itself from the database
    await prisma.productCategoryModel.delete({
      where: { value: category },
    });

    return NextResponse.json({
      message:
        productsWithCategory.length > 0
          ? `Successfully removed ${category} category from ${productsWithCategory.length} product(s)`
          : `Successfully deleted ${category} category`,
      productsUpdated: productsWithCategory.length,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
