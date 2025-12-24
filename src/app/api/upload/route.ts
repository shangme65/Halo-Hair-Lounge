import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sharp from "sharp";
import { uploadTypeSchema } from "@/lib/validations";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
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
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    // Fallback for mobile devices that might not set proper MIME type
    let detectedType = file.type;
    if (!detectedType || detectedType === "application/octet-stream") {
      if (fileExtension === "jpg" || fileExtension === "jpeg") {
        detectedType = "image/jpeg";
      } else if (fileExtension === "png") {
        detectedType = "image/png";
      } else if (fileExtension === "webp") {
        detectedType = "image/webp";
      }
    }

    if (!allowedTypes.includes(detectedType)) {
      console.error("Invalid MIME type:", {
        original: file.type,
        detected: detectedType,
        extension: fileExtension,
      });
      return NextResponse.json(
        {
          error: `Invalid file type '${detectedType}'. Only JPEG, PNG, and WebP are allowed`,
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
    if (!validateMagicBytes(buffer, detectedType)) {
      console.error("Magic bytes validation failed for type:", detectedType);
      return NextResponse.json(
        {
          error:
            "File content does not match declared type. Please ensure the file is a valid image.",
        },
        { status: 400 }
      );
    }

    // Process image with sharp (also strips EXIF data for privacy)
    let processedBuffer: Buffer;
    if (enhanceHD) {
      // Enhance image quality and resize if necessary
      processedBuffer = await sharp(buffer)
        .rotate() // Auto-rotate based on EXIF
        .resize(1920, 1080, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .sharpen()
        .jpeg({ quality: 95, mozjpeg: true })
        .toBuffer();
    } else {
      // Standard quality
      processedBuffer = await sharp(buffer)
        .rotate() // Auto-rotate based on EXIF
        .resize(1200, 800, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toBuffer();
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `halo-hair-lounge/${typeValidation.data}s`,
          resource_type: "image",
          format: "jpg",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(processedBuffer);
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      fileName: uploadResult.public_id,
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
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
