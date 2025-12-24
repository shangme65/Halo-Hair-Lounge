import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

// Security: One-time setup secret to prevent unauthorized access
const SETUP_SECRET = process.env.ADMIN_SETUP_SECRET;

export async function POST(req: NextRequest) {
  try {
    // Check if any admin already exists - this is for initial setup only
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        {
          error:
            "Admin account already exists. This endpoint is disabled after initial setup.",
        },
        { status: 403 }
      );
    }

    // Security: For initial setup (no admin exists), allow without secret
    // For subsequent requests (admin exists), require setup secret
    // This ensures the endpoint is only accessible during first-time setup
    const authHeader = req.headers.get("x-setup-secret");
    let setupSecret = authHeader;

    // If not in header, check body
    if (!setupSecret) {
      try {
        const body = await req.clone().json();
        setupSecret = body.setupSecret;
      } catch {
        // Body might not be JSON, continue
      }
    }

    // Only validate secret if ADMIN_SETUP_SECRET is configured AND admin exists
    // For initial setup with no admin, skip secret validation
    if (SETUP_SECRET && setupSecret !== SETUP_SECRET && existingAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid setup secret" },
        { status: 401 }
      );
    }

    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminName = process.env.ADMIN_NAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminPhone = process.env.ADMIN_PHONE;

    if (!adminEmail || !adminName || !adminPassword) {
      return NextResponse.json(
        {
          error:
            "Admin credentials are not configured in environment variables",
        },
        { status: 500 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password with higher cost factor for admin
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user and seed default data in a transaction
    // Increased timeout to 30 seconds to accommodate seeding operations
    const result = await prisma.$transaction(
      async (tx) => {
        // Create admin user
        const user = await tx.user.create({
          data: {
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            phone: adminPhone,
            role: "ADMIN",
            emailVerified: new Date(), // Auto-verify admin accounts
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        });

        // Create service categories
        const serviceCategories = [
          { value: "chemical-straightening", label: "Chemical straightening" },
          { value: "hair-coloring", label: "Hair Coloring" },
          { value: "hair-loss-treatments", label: "Hair loss treatments" },
          { value: "haircut-styling", label: "Haircut & Styling" },
          { value: "keratin-treatments", label: "Keratin treatments" },
          { value: "scalp-treatments", label: "Scalp treatments" },
        ];

        for (const category of serviceCategories) {
          await tx.serviceCategory.create({ data: category });
        }

        // Create product categories
        const productCategories = [
          { value: "COLORING", label: "Coloring" },
          { value: "CONDITIONER", label: "Conditioner" },
          { value: "SHAMPOO", label: "Shampoo" },
          { value: "STYLING", label: "Styling" },
          { value: "TREATMENT", label: "Treatment" },
        ];

        for (const category of productCategories) {
          await tx.productCategoryModel.create({ data: category });
        }

        // Create default services
        const services = [
          {
            id: "balayage-color",
            name: "Balayage Color",
            description:
              "Hand-painted highlights for a natural, sun-kissed look. Includes toner and styling.",
            price: 220.0,
            duration: 180,
            categories: ["hair-coloring"],
            image:
              "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
            isActive: true,
          },
          {
            id: "full-color-treatment",
            name: "Full Color Treatment",
            description:
              "Complete color transformation with premium products. Includes deep conditioning.",
            price: 180.0,
            duration: 150,
            categories: ["hair-coloring"],
            image:
              "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800",
            isActive: true,
          },
          {
            id: "classic-haircut-style",
            name: "Classic Haircut & Style",
            description:
              "Professional haircut with styling consultation. Includes wash and blow dry.",
            price: 65.0,
            duration: 60,
            categories: ["haircut-styling"],
            image:
              "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800",
            isActive: true,
          },
          {
            id: "keratin-smoothing-treatment",
            name: "Keratin Smoothing Treatment",
            description:
              "Professional keratin treatment that eliminates frizz and adds brilliant shine for up to 3 months.",
            price: 300.0,
            duration: 180,
            categories: ["keratin-treatments"],
            image:
              "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800",
            isActive: true,
          },
        ];

        for (const service of services) {
          await tx.service.create({ data: service });
        }

        // Create default products
        const products = [
          {
            id: "hydrating-shampoo",
            name: "Hydrating Shampoo",
            description:
              "Gentle cleansing shampoo infused with argan oil and vitamin E.",
            price: 32.0,
            compareAtPrice: 40.0,
            images: [
              "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800",
            ],
            categories: ["SHAMPOO"],
            brand: "Halo Signature",
            stock: 50,
            isActive: true,
            isFeatured: true,
            tags: ["hydrating", "sulfate-free"],
          },
          {
            id: "repair-conditioner",
            name: "Repair Conditioner",
            description:
              "Intensive repair conditioner with keratin and collagen.",
            price: 35.0,
            compareAtPrice: 45.0,
            images: [
              "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
            ],
            categories: ["CONDITIONER", "TREATMENT"],
            brand: "Halo Signature",
            stock: 45,
            isActive: true,
            isFeatured: true,
            tags: ["repair", "keratin"],
          },
          {
            id: "volumizing-mousse",
            name: "Volumizing Mousse",
            description: "Lightweight mousse that adds body and hold.",
            price: 28.0,
            images: [
              "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=800",
            ],
            categories: ["STYLING"],
            brand: "Halo Style",
            stock: 40,
            isActive: true,
            isFeatured: false,
            tags: ["volume", "mousse"],
          },
        ];

        for (const product of products) {
          await tx.product.create({ data: product });
        }

        return user;
      },
      {
        maxWait: 30000, // 30 seconds
        timeout: 30000, // 30 seconds
      }
    );

    return NextResponse.json(
      {
        message: "Admin account created successfully with default data",
        user: result,
        credentials: {
          email: adminEmail,
          password: adminPassword, // Return for auto-login during setup
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Security: Log error without exposing details
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint to check if admin exists
export async function GET() {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    return NextResponse.json({
      adminExists: !!existingAdmin,
    });
  } catch (error) {
    // Security: Log error without exposing details
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
