import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ctaContentSchema, validateRequest } from "@/lib/validations";

export async function GET() {
  try {
    const content = await prisma.ctaContent.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!content) {
      return NextResponse.json({
        badge: "Book Now & Get Started",
        title: "Ready for Your Transformation?",
        description:
          "Book your appointment today and experience the Halo difference",
        buttonText: "Book Your Appointment",
        buttonHref: "/book",
        trustIndicators: [
          "Expert Stylists",
          "Premium Products",
          "Flexible Scheduling",
          "Premium Styling",
          "Expert Care",
          "Personalized Service",
        ],
      });
    }

    return NextResponse.json(content);
  } catch (error) {
    // Security: Log error without exposing details
    return NextResponse.json({ error: "Failed to fetch CTA" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input with Zod schema
    const validation = validateRequest(ctaContentSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    const {
      badge,
      title,
      description,
      buttonText,
      buttonHref,
      leadingIcon,
      trailingIcon,
      trustIndicators,
    } = validation.data;

    const content = await prisma.ctaContent.upsert({
      where: { id: "default" },
      update: {
        badge: badge || "Book Now & Get Started",
        title,
        description,
        buttonText,
        buttonHref,
        leadingIcon: leadingIcon || null,
        trailingIcon: trailingIcon || null,
        trustIndicators: trustIndicators || [],
      },
      create: {
        id: "default",
        badge: badge || "Book Now & Get Started",
        title,
        description,
        buttonText,
        buttonHref,
        leadingIcon: leadingIcon || null,
        trailingIcon: trailingIcon || null,
        trustIndicators: trustIndicators || [],
      },
    });

    return NextResponse.json({ success: true, content });
  } catch (error) {
    // Security: Log error without exposing details
    return NextResponse.json(
      { error: "Failed to update CTA" },
      { status: 500 }
    );
  }
}
