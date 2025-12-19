import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Fetch all services (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("Get services error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new service
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, price, duration, categories, image, isActive } =
      body;

    if (
      !name ||
      !description ||
      price === undefined ||
      !duration ||
      !categories ||
      !Array.isArray(categories) ||
      categories.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields or invalid categories" },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        categories,
        image: image || "",
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
