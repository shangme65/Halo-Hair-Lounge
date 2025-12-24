import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { uploadTypeSchema, sanitizeFilename } from "@/lib/validations";

// Magic bytes for image validation
const MAGIC_BYTES: Record<string, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/jpg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF header, followed by WEBP
};

function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  const signatures = MAGIC_BYTES[mimeType];
  if (!signatures) return false;

  return signatures.some((signature) => {
    for (let i = 0; i < signature.length; i++) {
      if (buffer[i] !== signature[i]) return false;
    }
    return true;
  });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Security: Only ADMIN can upload (removed STAFF since you don't need it)
    if (!session || session.user?.role !== "ADMIN") {
      console.error("Upload auth failed:", {
        hasSession: !!session,
        role: session?.user?.role,
      });
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;
    const enhanceHD = formData.get("enhanceHD") === "true";

    console.log("Upload request:", {
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size,
      type,
      enhanceHD,
    });

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate upload type with Zod
    const typeValidation = uploadTypeSchema.safeParse(type);
    if (!typeValidation.success) {
      console.error("Upload type validation failed:", {
        type,
        errors: typeValidation.error,
      });
      return NextResponse.json(
        { error: `Invalid type: ${type}` },
        { status: 400 }
      );
    }

    // Validate file type (MIME type)
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      console.error("Invalid MIME type:", file.type);
      return NextResponse.json(
        {
          error: `Invalid file type '${file.type}'. Only JPEG, PNG, and WebP are allowed`,
        },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Security: Validate magic bytes to prevent file type spoofing
    if (!validateMagicBytes(buffer, file.type)) {
      console.error("Magic bytes validation failed for type:", file.type);
      return NextResponse.json(
        {
          error:
            "File content does not match declared type. Please ensure the file is a valid image.",
        },
        { status: 400 }
      );
    }

    // Security: Generate safe filename (prevent path traversal)
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const sanitizedName = sanitizeFilename(file.name);
    const baseName = path.basename(sanitizedName, path.extname(sanitizedName));
    const fileName = `${timestamp}-${randomSuffix}-${baseName}.jpg`; // Always output as jpg

    // Determine upload directory (using validated type)
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      typeValidation.data === "service"
        ? "services"
        : typeValidation.data === "product"
        ? "products"
        : "testimonials"
    );

    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }

    const filePath = path.join(uploadDir, fileName);

    // Security: Ensure file path is within expected directory (prevent path traversal)
    const resolvedPath = path.resolve(filePath);
    const resolvedUploadDir = path.resolve(uploadDir);
    if (!resolvedPath.startsWith(resolvedUploadDir)) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    // Process image with sharp (also strips EXIF data for privacy)
    if (enhanceHD) {
      // Enhance image quality and resize if necessary
      const processedBuffer = await sharp(buffer)
        .rotate() // Auto-rotate based on EXIF
        .resize(1920, 1080, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .sharpen()
        .jpeg({ quality: 95, mozjpeg: true })
        .toBuffer();
      await writeFile(filePath, processedBuffer);
    } else {
      // Standard quality
      const processedBuffer = await sharp(buffer)
        .rotate() // Auto-rotate based on EXIF
        .resize(1200, 800, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toBuffer();
      await writeFile(filePath, processedBuffer);
    }

    // Return the public URL
    const publicUrl = `/uploads/${
      typeValidation.data === "service"
        ? "services"
        : typeValidation.data === "product"
        ? "products"
        : "testimonials"
    }/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
    });
  } catch (error: any) {
    // Log detailed error for debugging
    console.error("Upload error details:", {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    
    // Return more specific error message
    const errorMessage = error?.message || "Failed to upload file";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
