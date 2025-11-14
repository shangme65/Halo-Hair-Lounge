import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, sessionToken } = await req.json();

    if (!email || !sessionToken) {
      return NextResponse.json(
        { error: "Email and session token are required" },
        { status: 400 }
      );
    }

    // Find user with matching session token
    const user = await prisma.user.findFirst({
      where: {
        email,
        resetToken: sessionToken,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid session token" },
        { status: 401 }
      );
    }

    // Check if session token has expired (5 minutes)
    if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
      return NextResponse.json(
        { error: "Session token has expired" },
        { status: 401 }
      );
    }

    // Clear the session token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Verify signin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
