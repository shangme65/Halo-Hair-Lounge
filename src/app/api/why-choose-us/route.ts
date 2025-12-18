import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
    console.error("Error fetching why choose us:", error);
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

    const { reasons } = await request.json();

    const content = await prisma.whyChooseUsContent.upsert({
      where: { id: "default" },
      update: { reasons },
      create: { id: "default", reasons },
    });

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error("Error updating why choose us:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}
