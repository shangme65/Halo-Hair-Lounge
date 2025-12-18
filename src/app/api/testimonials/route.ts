import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const content = await prisma.testimonialsContent.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!content) {
      return NextResponse.json({ testimonials: [] });
    }

    return NextResponse.json({ testimonials: content.testimonials });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
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

    const { testimonials } = await request.json();

    const content = await prisma.testimonialsContent.upsert({
      where: { id: "default" },
      update: { testimonials },
      create: { id: "default", testimonials },
    });

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error("Error updating testimonials:", error);
    return NextResponse.json(
      { error: "Failed to update testimonials" },
      { status: 500 }
    );
  }
}
