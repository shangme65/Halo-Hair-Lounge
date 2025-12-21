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
      // Delete appointment products first (references appointments and products)
      await prisma.appointmentProduct.deleteMany({});

      // Delete appointments (references users and services)
      await prisma.appointment.deleteMany({});

      // Delete all page content sections (no foreign keys)
      await prisma.heroContent.deleteMany({});
      await prisma.ctaContent.deleteMany({});
      await prisma.featuresContent.deleteMany({});
      await prisma.faqContent.deleteMany({});
      await prisma.testimonialsContent.deleteMany({});
      await prisma.whyChooseUsContent.deleteMany({});

      // Delete all products (before categories)
      await prisma.product.deleteMany({});

      // Delete all services (before anything that references them)
      await prisma.service.deleteMany({});

      // Now delete categories (no more dependencies)
      await prisma.productCategoryModel.deleteMany({});
      await prisma.serviceCategory.deleteMany({});

      // Delete accounts and sessions for all users
      await prisma.account.deleteMany({});
      await prisma.session.deleteMany({});

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
