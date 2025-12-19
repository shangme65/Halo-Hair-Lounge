import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the category to find its value
    const category = await prisma.serviceCategory.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if there are services using this category
    const servicesWithCategory = await prisma.service.findMany({
      where: {
        categories: {
          has: category.value,
        },
      },
      take: 1,
    });

    if (servicesWithCategory.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with existing services" },
        { status: 400 }
      );
    }

    await prisma.serviceCategory.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
