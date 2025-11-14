import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

// PUT - Update product
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      description,
      price,
      compareAtPrice,
      images,
      category,
      brand,
      stock,
      isActive,
      isFeatured,
      tags,
    } = body;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(compareAtPrice !== undefined && {
          compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        }),
        ...(images !== undefined && { images }),
        ...(category && { category }),
        ...(brand && { brand }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(isActive !== undefined && { isActive }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(tags !== undefined && { tags }),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the product to retrieve image paths
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete the product from database
    await prisma.product.delete({
      where: { id: params.id },
    });

    // Delete all product image files if they exist and are local uploads
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        if (imageUrl.startsWith("/uploads/")) {
          try {
            const imagePath = path.join(process.cwd(), "public", imageUrl);
            await unlink(imagePath);
          } catch (error) {
            console.error("Error deleting image file:", error);
            // Continue even if file deletion fails
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
