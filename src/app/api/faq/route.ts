import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const content = await prisma.faqContent.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!content) {
      return NextResponse.json({ faqs: [] });
    }

    return NextResponse.json({ faqs: content.faqs });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQs" },
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

    const { faqs } = await request.json();

    const content = await prisma.faqContent.upsert({
      where: { id: "default" },
      update: { faqs },
      create: { id: "default", faqs },
    });

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error("Error updating FAQs:", error);
    return NextResponse.json(
      { error: "Failed to update FAQs" },
      { status: 500 }
    );
  }
}
