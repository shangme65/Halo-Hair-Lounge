import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const heroContent = await prisma.heroContent.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ heroContent });
  } catch (error) {
    console.error("Error fetching hero content:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero content" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { slides } = body;

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
    console.error("Error updating hero content:", error);
    return NextResponse.json(
      { error: "Failed to update hero content" },
      { status: 500 }
    );
  }
}
