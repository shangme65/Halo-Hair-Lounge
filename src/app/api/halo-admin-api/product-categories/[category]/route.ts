import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// DELETE - Delete all products in a category
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

    // Check if there are products in this category
    const productCount = await prisma.product.count({
      where: { category: category as any },
    });

    if (productCount === 0) {
      return NextResponse.json(
        { error: "No products found in this category" },
        { status: 404 }
      );
    }

    // Delete all products in the category
    await prisma.product.deleteMany({
      where: { category: category as any },
    });

    return NextResponse.json({
      message: `Successfully deleted ${productCount} product(s) from ${category} category`,
      deletedCount: productCount,
    });
  } catch (error) {
    console.error("Error deleting category products:", error);
    return NextResponse.json(
      { error: "Failed to delete category products" },
      { status: 500 }
    );
  }
}
