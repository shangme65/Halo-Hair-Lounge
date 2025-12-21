import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { whyChooseUsContentSchema, validateRequest } from "@/lib/validations";

export async function GET() {
  try {
    const content = await prisma.whyChooseUsContent.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!content) {
      return NextResponse.json({ reasons: [] });
    }

    return NextResponse.json({ reasons: content.reasons });
  } catch (error) {
    // Security: Log error without exposing details
    return NextResponse.json(
      { error: "Failed to fetch content" },
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

    // Validate input with Zod schema - items will be stored as reasons
    const validation = validateRequest(whyChooseUsContentSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    // Map items to reasons for database storage
    const reasons = validation.data.items;

    const content = await prisma.whyChooseUsContent.upsert({
      where: { id: "default" },
      update: { reasons },
      create: { id: "default", reasons },
    });

    return NextResponse.json({ success: true, content });
  } catch (error) {
    // Security: Log error without exposing details
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}
