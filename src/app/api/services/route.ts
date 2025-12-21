import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ services });
  } catch (error) {
    // Security: Log error without exposing details
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
