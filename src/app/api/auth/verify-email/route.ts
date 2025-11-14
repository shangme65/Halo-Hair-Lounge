import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

// Handle email button verification (from email link)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      // Redirect to verification page with error
      return NextResponse.redirect(
        new URL("/auth/verify-email?error=missing-token", req.url)
      );
    }

    // Find user with this verification token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL("/auth/verify-email?error=invalid-token", req.url)
      );
    }

    // Check if token has expired
    if (
      user.verificationTokenExpiry &&
      user.verificationTokenExpiry < new Date()
    ) {
      return NextResponse.redirect(
        new URL("/auth/verify-email?error=expired-token", req.url)
      );
    }

    // Update user to mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    // Send welcome email
    try {
      await sendWelcomeEmail({
        to: user.email,
        name: user.name || "User",
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    // Redirect to success page with auto-login enabled
    return NextResponse.redirect(
      new URL(
        `/auth/verify-email?verified=true&email=${encodeURIComponent(
          user.email
        )}`,
        req.url
      )
    );
  } catch (error: any) {
    console.error("Email verification error:", error);
    return NextResponse.redirect(
      new URL("/auth/verify-email?error=server-error", req.url)
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Find user with this verification token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (
      user.verificationTokenExpiry &&
      user.verificationTokenExpiry < new Date()
    ) {
      return NextResponse.json(
        { error: "Verification token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 200 }
      );
    }

    // Update user to mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    // Send welcome email
    try {
      await sendWelcomeEmail({
        to: user.email,
        name: user.name || "User",
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail verification if welcome email fails
    }

    return NextResponse.json(
      {
        message: "Email verified successfully!",
        verified: true,
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
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Resend verification email
export async function PUT(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 200 }
      );
    }

    // Generate new verification token
    const crypto = require("crypto");
    const verificationToken = crypto.randomInt(100000, 999999).toString();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpiry,
      },
    });

    // Resend verification email
    const { sendVerificationEmail } = await import("@/lib/email");
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${verificationToken}`;

    await sendVerificationEmail({
      to: user.email,
      name: user.name || "User",
      verificationCode: verificationToken,
      verificationLink,
    });

    return NextResponse.json(
      { message: "Verification email sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification email" },
      { status: 500 }
    );
  }
}
