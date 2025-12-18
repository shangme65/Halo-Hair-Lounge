import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const content = await prisma.ctaContent.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!content) {
      return NextResponse.json({
        title: "",
        description: "",
        buttonText: "",
        buttonHref: "",
      });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching CTA:", error);
    return NextResponse.json({ error: "Failed to fetch CTA" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, buttonText, buttonHref } = await request.json();

    const content = await prisma.ctaContent.upsert({
      where: { id: "default" },
      update: { title, description, buttonText, buttonHref },
      create: { id: "default", title, description, buttonText, buttonHref },
    });

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error("Error updating CTA:", error);
    return NextResponse.json(
      { error: "Failed to update CTA" },
      { status: 500 }
    );
  }
}
