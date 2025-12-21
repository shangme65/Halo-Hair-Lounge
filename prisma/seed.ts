import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user from environment variables
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminName = process.env.ADMIN_NAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminPhone = process.env.ADMIN_PHONE;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables"
    );
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: adminName || "Admin User",
      password: hashedPassword,
      role: "ADMIN",
      phone: adminPhone || "+1234567890",
      emailVerified: new Date(), // Admin email is pre-verified
    },
  });

  console.log("✅ Created admin user:", admin.email);

  // Create service categories (matching the ones from your services page)
  const serviceCategories = [
    { value: "chemical-straightening", label: "Chemical straightening" },
    { value: "hair-coloring", label: "Hair Coloring" },
    { value: "hair-loss-treatments", label: "Hair loss treatments" },
    { value: "haircut-styling", label: "Haircut & Styling" },
    { value: "keratin-treatments", label: "Keratin treatments" },
    { value: "scalp-treatments", label: "Scalp treatments" },
  ];

  for (const category of serviceCategories) {
    await prisma.serviceCategory.upsert({
      where: { value: category.value },
      update: {},
      create: category,
    });
  }

  console.log("✅ Created service categories");

  // Create product categories (matching the ones from your products page)
  const productCategories = [
    { value: "COLORING", label: "Coloring" },
    { value: "CONDITIONER", label: "Conditioner" },
    { value: "SHAMPOO", label: "Shampoo" },
    { value: "STYLING", label: "Styling" },
    { value: "TREATMENT", label: "Treatment" },
  ];

  for (const category of productCategories) {
    await prisma.productCategoryModel.upsert({
      where: { value: category.value },
      update: {},
      create: category,
    });
  }

  console.log("✅ Created product categories");

  // Create services (updated to match new categories)
  const services = [
    {
      name: "Balayage Color",
      description:
        "Hand-painted highlights for a natural, sun-kissed look. Includes toner and styling.",
      price: 220.0,
      duration: 180,
      categories: ["hair-coloring"],
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
    },
    {
      name: "Full Color Treatment",
      description:
        "Complete color transformation with premium products. Includes deep conditioning.",
      price: 180.0,
      duration: 150,
      categories: ["hair-coloring"],
      image:
        "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800",
    },
    {
      name: "Classic Haircut & Style",
      description:
        "Professional haircut with styling consultation. Includes wash and blow dry.",
      price: 65.0,
      duration: 60,
      categories: ["haircut-styling"],
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800",
    },
    {
      name: "Keratin Smoothing Treatment",
      description:
        "Professional keratin treatment that eliminates frizz and adds brilliant shine for up to 3 months.",
      price: 300.0,
      duration: 180,
      categories: ["keratin-treatments"],
      image:
        "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800",
    },
    {
      name: "Brazilian Blowout",
      description:
        "The original smoothing treatment that reduces frizz and styling time.",
      price: 350.0,
      duration: 120,
      categories: ["keratin-treatments"],
      image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800",
    },
    {
      name: "Deep Scalp Treatment",
      description:
        "Therapeutic scalp treatment to promote healthy hair growth and relieve tension.",
      price: 85.0,
      duration: 45,
      categories: ["scalp-treatments"],
      image:
        "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800",
    },
    {
      name: "Japanese Hair Straightening",
      description:
        "Permanent straightening treatment for silky smooth, pin-straight hair.",
      price: 450.0,
      duration: 240,
      categories: ["chemical-straightening"],
      image:
        "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800",
    },
    {
      name: "Hair Growth Therapy",
      description:
        "Advanced treatment to combat hair loss and stimulate new growth.",
      price: 150.0,
      duration: 60,
      categories: ["hair-loss-treatments"],
      image:
        "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=800",
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

  // Create products with categories array (multi-category support)
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
      categories: ["SHAMPOO"],
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
      categories: ["CONDITIONER", "TREATMENT"],
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
      categories: ["SHAMPOO", "COLORING"],
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
      categories: ["TREATMENT"],
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
      categories: ["STYLING"],
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
      categories: ["STYLING", "TREATMENT"],
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
      categories: ["TREATMENT", "CONDITIONER"],
      brand: "Halo Signature",
      stock: 35,
      isFeatured: true,
      tags: ["argan-oil", "mask", "weekly-treatment"],
    },
    {
      name: "Moisturizing Conditioner",
      description:
        "Daily conditioner with coconut oil for soft, manageable hair.",
      price: 30.0,
      images: [
        "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800",
      ],
      categories: ["CONDITIONER"],
      brand: "Halo Signature",
      stock: 50,
      isFeatured: false,
      tags: ["moisturizing", "daily-use"],
    },
    {
      name: "Curl Defining Gel",
      description:
        "Frizz-free hold for perfectly defined curls. Non-sticky formula.",
      price: 24.0,
      images: [
        "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800",
      ],
      categories: ["STYLING"],
      brand: "Halo Style",
      stock: 35,
      isFeatured: false,
      tags: ["curls", "gel", "definition"],
    },
    {
      name: "Semi-Permanent Hair Color - Rose Gold",
      description: "Vibrant semi-permanent color that lasts 4-6 weeks.",
      price: 18.0,
      images: [
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
      ],
      categories: ["COLORING"],
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
      categories: ["SHAMPOO", "COLORING"],
      brand: "Halo Pro",
      stock: 40,
      isFeatured: false,
      tags: ["toning", "purple", "blonde-care"],
    },
    {
      name: "Leave-In Conditioner Spray",
      description: "Lightweight leave-in treatment for detangling and shine.",
      price: 28.0,
      images: [
        "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=800",
      ],
      categories: ["CONDITIONER", "TREATMENT"],
      brand: "Halo Signature",
      stock: 45,
      isFeatured: false,
      tags: ["leave-in", "detangling", "spray"],
    },
  ];

  // Use upsert for products to avoid duplicates
  for (const product of products) {
    const productId = product.name.toLowerCase().replace(/\s+/g, "-");
    await prisma.product.upsert({
      where: { id: productId },
      update: { categories: product.categories },
      create: {
        id: productId,
        ...product,
      },
    });
  }

  console.log("✅ Created products");

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
