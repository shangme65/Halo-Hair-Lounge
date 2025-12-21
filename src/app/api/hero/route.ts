import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { heroContentSchema, validateRequest } from "@/lib/validations";

export async function GET() {
  try {
    const heroContent = await prisma.heroContent.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ heroContent });
  } catch (error) {
    // Security: Log error without exposing details
    return NextResponse.json(
      { error: "Failed to fetch hero content" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Security: Verify admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input with Zod schema
    const validation = validateRequest(heroContentSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    const { slides } = validation.data;

    // Check if hero content exists
    const existing = await prisma.heroContent.findFirst();

    let heroContent;
    if (existing) {
      heroContent = await prisma.heroContent.update({
        where: { id: existing.id },
        data: { slides },
      });
    } else {
      heroContent = await prisma.heroContent.create({
        data: { slides },
      });
    }

    return NextResponse.json({ heroContent });
  } catch (error) {
    // Security: Log error without exposing details
    return NextResponse.json(
      { error: "Failed to update hero content" },
      { status: 500 }
    );
  }
}
