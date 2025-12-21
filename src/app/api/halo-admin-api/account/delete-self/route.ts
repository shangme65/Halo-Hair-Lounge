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
    // This uses a transaction to ensure everything is deleted atomically
    await prisma.$transaction(async (tx) => {
      // Delete all products
      await tx.product.deleteMany({});
      
      // Delete all product categories
      await tx.productCategoryModel.deleteMany({});
      
      // Delete all services
      await tx.service.deleteMany({});
      
      // Delete all service categories
      await tx.serviceCategory.deleteMany({});
      
      // Delete all appointments
      await tx.appointment.deleteMany({});
      
      // Delete all page content sections
      await tx.heroSection.deleteMany({});
      await tx.cTASection.deleteMany({});
      await tx.feature.deleteMany({});
      await tx.fAQ.deleteMany({});
      await tx.testimonial.deleteMany({});
      await tx.whyChooseUs.deleteMany({});
      
      // Finally, delete the admin user
      await tx.user.delete({
        where: { id: userId },
      });
    });

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
