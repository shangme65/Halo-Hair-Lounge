import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { faqContentSchema, validateRequest } from "@/lib/validations";

export async function GET() {
  try {
    const content = await prisma.faqContent.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!content) {
      const defaultSectionHeader = {
        badge: "Got Questions?",
        titlePrefix: "Frequently Asked ",
        titleHighlight: "Questions",
        subtitle:
          "Everything you need to know about our services and booking process",
        ctaText: "Still have questions? We're here to help!",
        ctaButtonText: "Contact Us",
        ctaButtonLink: "/contact",
      };
      return NextResponse.json({
        faqs: [],
        sectionHeader: defaultSectionHeader,
      });
    }

    const contentData = content as any;
    const sectionHeader = contentData.sectionHeader || {
      badge: "Got Questions?",
      titlePrefix: "Frequently Asked ",
      titleHighlight: "Questions",
      subtitle:
        "Everything you need to know about our services and booking process",
      ctaText: "Still have questions? We're here to help!",
      ctaButtonText: "Contact Us",
      ctaButtonLink: "/contact",
    };

    return NextResponse.json({ faqs: content.faqs, sectionHeader });
  } catch (error) {
    // Security: Log error without exposing details
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

    const body = await request.json();

    // Validate input with Zod schema
    const validation = validateRequest(faqContentSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    const { faqs, sectionHeader } = validation.data;

    const content = await prisma.faqContent.upsert({
      where: { id: "default" },
      update: { faqs, sectionHeader } as any,
      create: { id: "default", faqs, sectionHeader } as any,
    });

    return NextResponse.json({ success: true, content });
  } catch (error) {
    // Log detailed error for debugging
    console.error("FAQ Update Error:", error);
    return NextResponse.json(
      {
        error: "Failed to update FAQs",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
