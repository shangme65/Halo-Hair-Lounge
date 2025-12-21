import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { productCreateSchema, validateRequest } from "@/lib/validations";

// GET - Fetch all products (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    // Security: Log error without exposing details
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate input with Zod schema
    const validation = validateRequest(productCreateSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    const {
      name,
      description,
      price,
      compareAtPrice,
      images,
      categories,
      brand,
      stock,
      isActive,
      isFeatured,
      tags,
    } = validation.data;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        compareAtPrice: compareAtPrice ?? null,
        images: images ?? [],
        categories,
        brand,
        stock,
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        tags: tags ?? [],
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    // Security: Log error without exposing details
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
