import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";
import { productUpdateSchema, validateRequest } from "@/lib/validations";

// PUT - Update product
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate ID format
    if (!id || id.length > 50) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();

    // Validate input with Zod schema
    const validation = validateRequest(productUpdateSchema, body);
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

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price }),
        ...(compareAtPrice !== undefined && { compareAtPrice }),
        ...(images !== undefined && { images }),
        ...(categories !== undefined && { categories }),
        ...(brand && { brand }),
        ...(stock !== undefined && { stock }),
        ...(isActive !== undefined && { isActive }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(tags !== undefined && { tags }),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    // Security: Log error without exposing details
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate ID format
    if (!id || id.length > 50) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Get the product to retrieve image paths
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete the product from database
    await prisma.product.delete({
      where: { id },
    });

    // Delete all product image files if they exist and are local uploads
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        if (imageUrl.startsWith("/uploads/")) {
          try {
            const imagePath = path.join(process.cwd(), "public", imageUrl);
            await unlink(imagePath);
          } catch (error) {
            // Continue even if file deletion fails - not critical
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // Security: Log error without exposing details
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
