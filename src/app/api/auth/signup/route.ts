import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

function generateVerificationCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Generate verification code and expiry (24 hours)
    const verificationToken = generateVerificationCode();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        phone: validatedData.phone,
        role: "USER",
        verificationToken,
        verificationTokenExpiry,
        emailVerified: null, // Email not verified yet
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Send verification email
    try {
      const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${verificationToken}`;

      await sendVerificationEmail({
        to: user.email,
        name: user.name || "User",
        verificationCode: verificationToken,
        verificationLink,
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail the signup if email fails, but log it
    }

    return NextResponse.json(
      {
        message:
          "User created successfully. Please check your email to verify your account.",
        user,
        requiresVerification: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
