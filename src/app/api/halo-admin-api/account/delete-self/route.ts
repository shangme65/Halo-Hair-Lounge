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

    // First verify the user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      // User already deleted - clean up any remaining session data
      // and return success so they can proceed to create new admin
      try {
        await prisma.session.deleteMany({});
        await prisma.account.deleteMany({});
      } catch (e) {
        // Ignore cleanup errors
      }
      return NextResponse.json(
        {
          message:
            "Account already deleted. Please sign out and create a new admin account.",
          alreadyDeleted: true,
        },
        { status: 200 }
      );
    }

    // Delete all data when admin account is deleted
    // Delete items in correct order to avoid foreign key constraint errors
    try {
      // Delete appointment products first (references appointments and products)
      await prisma.appointmentProduct.deleteMany({});

      // Delete appointments (references users and services)
      await prisma.appointment.deleteMany({});

      // Reset hero content to default instead of deleting
      const defaultHeroSlides = [
        {
          subtitle: "Premium Hair Care Excellence",
          title: "Transform Your Look",
          description:
            "Experience luxury styling with our expert stylists and premium products",
          colorScheme: "green",
          cta: { text: "Book Appointment", href: "/book" },
          secondaryCta: { text: "Explore Services", href: "/services" },
        },
        {
          subtitle: "Expert Stylists",
          title: "Your Beauty, Our Passion",
          description:
            "Discover personalized hair care solutions tailored just for you",
          colorScheme: "green",
          cta: { text: "View Services", href: "/services" },
          secondaryCta: { text: "Explore Services", href: "/services" },
        },
        {
          subtitle: "Quality Products",
          title: "Indulge in Luxury",
          description:
            "Premium hair treatments using the finest products in the industry",
          colorScheme: "green",
          cta: { text: "Shop Products", href: "/products" },
          secondaryCta: { text: "Explore Services", href: "/services" },
        },
      ];

      // Delete existing hero content and create default
      await prisma.heroContent.deleteMany({});
      await prisma.heroContent.create({
        data: {
          slides: defaultHeroSlides,
        },
      });

      // Delete other content sections
      await prisma.ctaContent.deleteMany({});
      await prisma.featuresContent.deleteMany({});
      await prisma.faqContent.deleteMany({});
      await prisma.testimonialsContent.deleteMany({});
      await prisma.whyChooseUsContent.deleteMany({});

      // Delete all products (before categories)
      await prisma.product.deleteMany({});

      // Delete all services (before anything that references them)
      await prisma.service.deleteMany({});

      // Delete ALL categories (for clean reset)
      await prisma.productCategoryModel.deleteMany({});
      await prisma.serviceCategory.deleteMany({});

      // Delete verification tokens
      await prisma.verificationToken.deleteMany({});

      // Delete ONLY THIS USER's accounts and sessions (not all users)
      await prisma.account.deleteMany({
        where: { userId: userId },
      });
      await prisma.session.deleteMany({
        where: { userId: userId },
      });

      // Finally, delete the admin user
      await prisma.user.delete({
        where: { id: userId },
      });

      console.log("✅ All data deleted successfully, admin account removed");
    } catch (error) {
      console.error("Detailed deletion error:", error);
      throw error;
    }

    // Create response with headers to clear cookies
    const response = NextResponse.json(
      {
        message: "Account and all associated data deleted successfully",
        requiresLogout: true,
      },
      { status: 200 }
    );

    // Clear NextAuth cookies
    response.cookies.set("next-auth.session-token", "", {
      maxAge: 0,
      path: "/",
    });
    response.cookies.set("__Secure-next-auth.session-token", "", {
      maxAge: 0,
      path: "/",
      secure: true,
    });
    response.cookies.set("next-auth.csrf-token", "", {
      maxAge: 0,
      path: "/",
    });
    response.cookies.set("__Host-next-auth.csrf-token", "", {
      maxAge: 0,
      path: "/",
      secure: true,
    });

    return response;
  } catch (error: any) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
