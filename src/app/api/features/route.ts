import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { featuresContentSchema, validateRequest } from "@/lib/validations";

export async function GET() {
  try {
    const content = await prisma.featuresContent.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!content) {
      return NextResponse.json({ features: [] });
    }

    return NextResponse.json({
      badgeText: content.badgeText || "Our Commitment",
      headingPrefix: content.headingPrefix || "Why Choose ",
      headingHighlight: content.headingHighlight || "Halo Hair Lounge",
      description:
        content.description ||
        "Experience the perfect blend of luxury, expertise, and innovation at our premier salon",
      features: content.features,
    });
  } catch (error) {
    console.error("Error fetching features:", error);
    return NextResponse.json(
      { error: "Failed to fetch features" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Received body:", JSON.stringify(body, null, 2));

    // Validate input with Zod schema
    const validation = validateRequest(featuresContentSchema, body);
    if (!validation.success) {
      console.error("Validation failed:", validation.errors);
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    const {
      badgeText,
      headingPrefix,
      headingHighlight,
      description,
      features,
    } = validation.data;

    console.log("Attempting to upsert with data:", {
      badgeText,
      headingPrefix,
      headingHighlight,
      description,
      featuresCount: features.length,
    });

    const content = await prisma.featuresContent.upsert({
      where: { id: "default" },
      update: {
        badgeText,
        headingPrefix,
        headingHighlight,
        description,
        features,
      },
      create: {
        id: "default",
        badgeText,
        headingPrefix,
        headingHighlight,
        description,
        features,
      },
    });

    console.log("Successfully saved features");
    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error("Error updating features:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      {
        error: "Failed to update features",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
