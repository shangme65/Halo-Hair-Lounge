import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Delete all data when admin account is deleted
    // Delete items in correct order to avoid foreign key constraint errors
    try {
      // Delete appointments first (they reference users)
      await prisma.appointment.deleteMany({});

      // Delete all page content sections (no foreign keys)
      await prisma.heroSection.deleteMany({});
      await prisma.cTASection.deleteMany({});
      await prisma.feature.deleteMany({});
      await prisma.fAQ.deleteMany({});
      await prisma.testimonial.deleteMany({});
      await prisma.whyChooseUs.deleteMany({});

      // Delete all products (before categories)
      await prisma.product.deleteMany({});

      // Delete all services (before categories)
      await prisma.service.deleteMany({});

      // Now delete categories (no more dependencies)
      await prisma.productCategoryModel.deleteMany({});
      await prisma.serviceCategory.deleteMany({});

      // Delete all other users except the current admin
      await prisma.user.deleteMany({
        where: {
          id: { not: userId },
        },
      });

      // Finally, delete the admin user
      await prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      console.error("Detailed deletion error:", error);
      throw error;
    }

    return NextResponse.json(
      {
        message: "Account and all associated data deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
