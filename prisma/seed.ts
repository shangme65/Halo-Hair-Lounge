import { PrismaClient, ServiceCategory, ProductCategory } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@halohairlounge.com" },
    update: {},
    create: {
      email: "admin@halohairlounge.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
      phone: "+1234567890",
    },
  });

  console.log("✅ Created admin user:", admin.email);

  // Create demo customer
  const customerPassword = await bcrypt.hash("customer123", 10);
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      name: "Jane Doe",
      password: customerPassword,
      role: "USER",
      phone: "+1234567891",
    },
  });

  console.log("✅ Created customer user:", customer.email);

  // Create services
  const services = [
    {
      name: "Classic Haircut",
      description:
        "Professional haircut with styling consultation. Includes wash and blow dry.",
      price: 65.0,
      duration: 60,
      category: ServiceCategory.HAIRCUT,
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800",
    },
    {
      name: "Premium Color Treatment",
      description:
        "Full color service with premium products. Includes toner and deep conditioning.",
      price: 180.0,
      duration: 180,
      category: ServiceCategory.COLORING,
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
    },
    {
      name: "Balayage Highlights",
      description: "Hand-painted highlights for a natural, sun-kissed look.",
      price: 220.0,
      duration: 210,
      category: ServiceCategory.COLORING,
      image:
        "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800",
    },
    {
      name: "Deep Conditioning Treatment",
      description: "Intensive moisture therapy for damaged or dry hair.",
      price: 85.0,
      duration: 45,
      category: ServiceCategory.TREATMENT,
      image:
        "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800",
    },
    {
      name: "Special Event Styling",
      description:
        "Elegant updo or styling for weddings and special occasions.",
      price: 120.0,
      duration: 90,
      category: ServiceCategory.STYLING,
      image:
        "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=800",
    },
    {
      name: "Hair Extensions Installation",
      description:
        "Premium quality hair extensions with professional installation.",
      price: 450.0,
      duration: 240,
      category: ServiceCategory.EXTENSIONS,
      image:
        "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=800",
    },
    {
      name: "Box Braids",
      description: "Protective styling with premium synthetic or human hair.",
      price: 200.0,
      duration: 300,
      category: ServiceCategory.BRAIDING,
      image:
        "https://images.unsplash.com/photo-1605980676233-e14c31c797b3?w=800",
    },
    {
      name: "Keratin Treatment",
      description: "Smoothing treatment that eliminates frizz and adds shine.",
      price: 300.0,
      duration: 180,
      category: ServiceCategory.TREATMENT,
      image:
        "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800",
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        ...service,
        id: service.name.toLowerCase().replace(/\s+/g, "-"),
      },
    });
  }

  console.log("✅ Created services");

  // Create products
  const products = [
    {
      name: "Hydrating Shampoo",
      description:
        "Gentle cleansing shampoo infused with argan oil and vitamin E. Perfect for all hair types, this luxurious formula restores moisture and adds brilliant shine.",
      price: 32.0,
      compareAtPrice: 40.0,
      images: [
        "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800",
      ],
      category: ProductCategory.SHAMPOO,
      brand: "Halo Signature",
      stock: 50,
      isFeatured: true,
      tags: ["hydrating", "sulfate-free", "best-seller"],
    },
    {
      name: "Repair Conditioner",
      description:
        "Intensive repair conditioner with keratin and collagen. Rebuilds damaged hair from within.",
      price: 35.0,
      compareAtPrice: 45.0,
      images: [
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
      ],
      category: ProductCategory.CONDITIONER,
      brand: "Halo Signature",
      stock: 45,
      isFeatured: true,
      tags: ["repair", "keratin", "damaged-hair"],
    },
    {
      name: "Color Protection Shampoo",
      description:
        "UV-protecting shampoo that locks in color and prevents fading.",
      price: 34.0,
      images: [
        "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800",
      ],
      category: ProductCategory.SHAMPOO,
      brand: "Halo Pro",
      stock: 30,
      isFeatured: false,
      tags: ["color-safe", "uv-protection"],
    },
    {
      name: "Hair Growth Serum",
      description:
        "Advanced formula with biotin and natural botanicals to stimulate hair growth.",
      price: 58.0,
      compareAtPrice: 72.0,
      images: [
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800",
      ],
      category: ProductCategory.TREATMENT,
      brand: "Halo Labs",
      stock: 25,
      isFeatured: true,
      tags: ["growth", "biotin", "serum"],
    },
    {
      name: "Volumizing Mousse",
      description:
        "Lightweight mousse that adds body and hold without stiffness.",
      price: 28.0,
      images: [
        "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=800",
      ],
      category: ProductCategory.STYLING,
      brand: "Halo Style",
      stock: 40,
      isFeatured: false,
      tags: ["volume", "mousse", "hold"],
    },
    {
      name: "Heat Protection Spray",
      description:
        "Thermal protection up to 450°F. Shields hair from heat damage.",
      price: 26.0,
      images: [
        "https://images.unsplash.com/photo-1620967098601-c44db8f51667?w=800",
      ],
      category: ProductCategory.STYLING,
      brand: "Halo Style",
      stock: 55,
      isFeatured: true,
      tags: ["heat-protection", "spray"],
    },
    {
      name: "Argan Oil Hair Mask",
      description: "Intensive weekly treatment with pure Moroccan argan oil.",
      price: 42.0,
      images: [
        "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=800",
      ],
      category: ProductCategory.TREATMENT,
      brand: "Halo Signature",
      stock: 35,
      isFeatured: true,
      tags: ["argan-oil", "mask", "weekly-treatment"],
    },
    {
      name: "Professional Blow Dryer",
      description:
        "Ionic technology blow dryer with 3 heat settings and cool shot.",
      price: 145.0,
      compareAtPrice: 200.0,
      images: [
        "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800",
      ],
      category: ProductCategory.TOOLS,
      brand: "Halo Pro",
      stock: 15,
      isFeatured: true,
      tags: ["blow-dryer", "ionic", "professional"],
    },
    {
      name: "Ceramic Flat Iron",
      description:
        "Professional-grade flat iron with adjustable temperature control.",
      price: 120.0,
      images: [
        "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800",
      ],
      category: ProductCategory.TOOLS,
      brand: "Halo Pro",
      stock: 20,
      isFeatured: false,
      tags: ["flat-iron", "ceramic", "straightener"],
    },
    {
      name: "Silk Scrunchie Set",
      description:
        "Set of 5 pure silk scrunchies. Gentle on hair, prevents breakage.",
      price: 24.0,
      images: [
        "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=800",
      ],
      category: ProductCategory.ACCESSORIES,
      brand: "Halo Essentials",
      stock: 60,
      isFeatured: false,
      tags: ["scrunchies", "silk", "accessories"],
    },
    {
      name: "Semi-Permanent Hair Color - Rose Gold",
      description: "Vibrant semi-permanent color that lasts 4-6 weeks.",
      price: 18.0,
      images: [
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
      ],
      category: ProductCategory.COLORING,
      brand: "Halo Color",
      stock: 30,
      isFeatured: false,
      tags: ["color", "semi-permanent", "rose-gold"],
    },
    {
      name: "Purple Toning Shampoo",
      description: "Neutralizes brassy tones in blonde and silver hair.",
      price: 30.0,
      images: [
        "https://images.unsplash.com/photo-1526045478516-99145907023c?w=800",
      ],
      category: ProductCategory.SHAMPOO,
      brand: "Halo Pro",
      stock: 40,
      isFeatured: false,
      tags: ["toning", "purple", "blonde-care"],
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("✅ Created products");

  // Create sample appointment
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(14, 0, 0, 0);

  await prisma.appointment.create({
    data: {
      userId: customer.id,
      serviceId: "classic-haircut",
      date: tomorrow,
      startTime: "14:00",
      endTime: "15:00",
      status: "CONFIRMED",
      notes: "First time customer",
    },
  });

  console.log("✅ Created sample appointment");

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
