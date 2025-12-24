import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";
import { serviceUpdateSchema, validateRequest } from "@/lib/validations";

// GET - Get single service by ID
export async function GET(
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

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    // Validate ID format
    if (!id || id.length > 50) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();

    // Validate input with Zod schema
    const validation = validateRequest(serviceUpdateSchema, body);
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
      duration,
      categories,
      image,
      isActive,
    } = validation.data;

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price }),
        ...(compareAtPrice !== undefined && { compareAtPrice }),
        ...(duration !== undefined && { duration }),
        ...(categories && categories.length > 0 && { categories }),
        ...(image !== undefined && { image }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    // Security: Log error without exposing details
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

    // Validate ID format
    if (!id || id.length > 50) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
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
        // Continue even if file deletion fails - not critical
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
