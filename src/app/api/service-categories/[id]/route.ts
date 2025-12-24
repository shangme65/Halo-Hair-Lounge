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

    // Check if any services are using this category
    const servicesWithCategory = await prisma.service.findMany({
      where: {
        categories: {
          has: category.value,
        },
      },
      select: { id: true, categories: true },
    });

    // Remove this category from all services that use it
    if (servicesWithCategory.length > 0) {
      await Promise.all(
        servicesWithCategory.map(async (service) => {
          const updatedCategories = service.categories.filter(
            (cat: string) => cat !== category.value
          );

          await prisma.service.update({
            where: { id: service.id },
            data: { categories: updatedCategories },
          });
        })
      );
    }

    // Delete the category
    await prisma.serviceCategory.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Category deleted successfully",
      servicesUpdated: servicesWithCategory.length,
    });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
