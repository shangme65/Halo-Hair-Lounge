import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const content = await prisma.featuresContent.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!content) {
      return NextResponse.json({ features: [] });
    }

    return NextResponse.json({ features: content.features });
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

    const { features } = await request.json();

    const content = await prisma.featuresContent.upsert({
      where: { id: "default" },
      update: { features },
      create: { id: "default", features },
    });

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error("Error updating features:", error);
    return NextResponse.json(
      { error: "Failed to update features" },
      { status: 500 }
    );
  }
}
