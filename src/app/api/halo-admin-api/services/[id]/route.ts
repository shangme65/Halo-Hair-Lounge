import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

// PUT - Update service
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

    const body = await req.json();
    const { name, description, price, duration, categories, image, isActive } =
      body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(duration && { duration: parseInt(duration) }),
        ...(categories &&
          Array.isArray(categories) &&
          categories.length > 0 && { categories }),
        ...(image !== undefined && { image }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Update service error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete service
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

    // Get the service to retrieve image path
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Delete the service from database
    await prisma.service.delete({
      where: { id },
    });

    // Delete the image file if it exists and is a local upload
    if (service.image && service.image.startsWith("/uploads/")) {
      try {
        const imagePath = path.join(process.cwd(), "public", service.image);
        await unlink(imagePath);
      } catch (error) {
        console.error("Error deleting image file:", error);
        // Continue even if file deletion fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete service error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
