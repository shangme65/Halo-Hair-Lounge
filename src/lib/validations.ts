import { z } from "zod";

// ============================================
// Service Validation Schemas
// ============================================
export const serviceCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be less than 2000 characters")
    .trim(),
  price: z
    .union([z.string(), z.number()])
    .transform((val): number => {
      const num = typeof val === "string" ? parseFloat(val) : val;
      return num;
    })
    .refine(
      (val) => !isNaN(val) && val >= 0,
      "Price must be a positive number"
    ),
  compareAtPrice: z
    .union([z.string(), z.number(), z.null()])
    .transform((val): number | null => {
      if (val === null || val === "" || val === undefined) return null;
      const num = typeof val === "string" ? parseFloat(val) : val;
      return isNaN(num) ? null : num;
    })
    .refine(
      (val) => val === null || val >= 0,
      "Compare at price must be a positive number"
    )
    .optional()
    .nullable(),
  duration: z
    .union([z.string(), z.number()])
    .transform((val): number => {
      const num = typeof val === "string" ? parseInt(val, 10) : val;
      return num;
    })
    .refine(
      (val) => !isNaN(val) && val > 0 && val <= 480,
      "Duration must be between 1 and 480 minutes"
    ),
  categories: z
    .array(z.string().trim())
    .min(1, "At least one category is required")
    .max(10, "Maximum 10 categories allowed"),
  image: z.string().optional().default(""),
  isActive: z.boolean().optional().default(true),
});

export const serviceUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be less than 2000 characters")
    .trim()
    .optional(),
  price: z
    .union([z.string(), z.number()])
    .transform((val): number => {
      const num = typeof val === "string" ? parseFloat(val) : val;
      return num;
    })
    .refine((val) => !isNaN(val) && val >= 0, "Price must be a positive number")
    .optional(),
  compareAtPrice: z
    .union([z.string(), z.number(), z.null()])
    .transform((val): number | null => {
      if (val === null || val === "" || val === undefined) return null;
      const num = typeof val === "string" ? parseFloat(val) : val;
      return isNaN(num) ? null : num;
    })
    .refine(
      (val) => val === null || val >= 0,
      "Compare at price must be a positive number"
    )
    .optional()
    .nullable(),
  duration: z
    .union([z.string(), z.number()])
    .transform((val): number => {
      const num = typeof val === "string" ? parseInt(val, 10) : val;
      return num;
    })
    .refine(
      (val) => !isNaN(val) && val > 0 && val <= 480,
      "Duration must be between 1 and 480 minutes"
    )
    .optional(),
  categories: z
    .array(z.string().trim())
    .min(1, "At least one category is required")
    .max(10, "Maximum 10 categories allowed")
    .optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
});

// ============================================
// Product Validation Schemas
// ============================================
export const productCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(5000, "Description must be less than 5000 characters")
    .trim(),
  price: z
    .union([z.string(), z.number()])
    .transform((val): number => {
      const num = typeof val === "string" ? parseFloat(val) : val;
      return num;
    })
    .refine(
      (val) => !isNaN(val) && val >= 0,
      "Price must be a positive number"
    ),
  compareAtPrice: z
    .union([z.string(), z.number(), z.null()])
    .optional()
    .transform((val): number | null => {
      if (val === null || val === undefined || val === "") return null;
      const num = typeof val === "string" ? parseFloat(val) : (val as number);
      return isNaN(num) ? null : num;
    }),
  images: z
    .array(z.string())
    .max(10, "Maximum 10 images allowed")
    .optional()
    .default([]),
  categories: z
    .array(z.string().trim())
    .min(1, "At least one category is required")
    .max(10, "Maximum 10 categories allowed"),
  brand: z
    .string()
    .min(1, "Brand is required")
    .max(100, "Brand must be less than 100 characters")
    .trim(),
  stock: z
    .union([z.string(), z.number()])
    .transform((val): number => {
      const num = typeof val === "string" ? parseInt(val, 10) : val;
      return num;
    })
    .refine(
      (val) => !isNaN(val) && val >= 0,
      "Stock must be a non-negative number"
    ),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  tags: z
    .array(z.string().trim())
    .max(20, "Maximum 20 tags allowed")
    .optional()
    .default([]),
});

export const productUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(5000, "Description must be less than 5000 characters")
    .trim()
    .optional(),
  price: z
    .union([z.string(), z.number()])
    .transform((val): number => {
      const num = typeof val === "string" ? parseFloat(val) : val;
      return num;
    })
    .refine((val) => !isNaN(val) && val >= 0, "Price must be a positive number")
    .optional(),
  compareAtPrice: z
    .union([z.string(), z.number(), z.null()])
    .transform((val): number | null => {
      if (val === null || val === undefined || val === "") return null;
      const num = typeof val === "string" ? parseFloat(val) : (val as number);
      return isNaN(num) ? null : num;
    })
    .optional(),
  images: z.array(z.string()).max(10, "Maximum 10 images allowed").optional(),
  categories: z
    .array(z.string().trim())
    .min(1, "At least one category is required")
    .max(10, "Maximum 10 categories allowed")
    .optional(),
  brand: z
    .string()
    .min(1, "Brand is required")
    .max(100, "Brand must be less than 100 characters")
    .trim()
    .optional(),
  stock: z
    .union([z.string(), z.number()])
    .transform((val): number => {
      const num = typeof val === "string" ? parseInt(val, 10) : val;
      return num;
    })
    .refine(
      (val) => !isNaN(val) && val >= 0,
      "Stock must be a non-negative number"
    )
    .optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  tags: z
    .array(z.string().trim())
    .max(20, "Maximum 20 tags allowed")
    .optional(),
});

// ============================================
// Appointment Validation Schemas
// ============================================
export const appointmentCreateSchema = z.object({
  serviceId: z.string().min(1, "Service ID is required"),
  productIds: z.array(z.string()).optional(),
  date: z
    .string()
    .min(1, "Date is required")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Invalid date format"),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  notes: z
    .string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional(),
  customerName: z
    .string()
    .min(1, "Customer name is required")
    .max(100, "Name must be less than 100 characters")
    .trim()
    .optional(),
  customerEmail: z.string().email("Invalid email format").optional(),
  customerPhone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]+$/, "Invalid phone number format")
    .min(7, "Phone number too short")
    .max(20, "Phone number too long")
    .optional(),
});

export const appointmentStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"], {
    errorMap: () => ({ message: "Invalid appointment status" }),
  }),
});

// ============================================
// Content Validation Schemas
// ============================================
export const heroSlideSchema = z.object({
  id: z.string().optional(),
  title: z.string().max(200, "Title must be less than 200 characters").trim(),
  subtitle: z
    .string()
    .max(500, "Subtitle must be less than 500 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .trim()
    .optional(),
  colorScheme: z.enum(["purple", "gold", "teal", "green"]).optional(),
  cta: z
    .object({
      text: z
        .string()
        .max(50, "Button text must be less than 50 characters")
        .trim(),
      href: z.string().max(200),
    })
    .optional(),
  secondaryCta: z
    .object({
      text: z
        .string()
        .max(50, "Button text must be less than 50 characters")
        .trim(),
      href: z.string().max(200),
    })
    .optional(),
  backgroundImage: z.string().url().optional().or(z.literal("")),
  backgroundGradient: z.string().max(500).optional(),
});

export const heroContentSchema = z.object({
  slides: z.array(heroSlideSchema).max(10, "Maximum 10 slides allowed"),
});

export const ctaContentSchema = z.object({
  badge: z
    .string()
    .max(100, "Badge must be less than 100 characters")
    .trim()
    .optional(),
  title: z.string().max(200, "Title must be less than 200 characters").trim(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .trim(),
  buttonText: z
    .string()
    .max(50, "Button text must be less than 50 characters")
    .trim(),
  buttonHref: z
    .string()
    .max(200, "Button link must be less than 200 characters"),
  leadingIcon: z
    .string()
    .max(200, "Leading icon must be less than 200 characters")
    .optional(),
  trailingIcon: z
    .string()
    .max(200, "Trailing icon must be less than 200 characters")
    .optional(),
  trustIndicators: z.array(z.string()).optional(),
});

export const faqItemSchema = z.object({
  id: z.string().optional(),
  question: z
    .string()
    .min(1)
    .max(500, "Question must be less than 500 characters")
    .trim(),
  answer: z
    .string()
    .min(1)
    .max(2000, "Answer must be less than 2000 characters")
    .trim(),
});

export const faqContentSchema = z.object({
  faqs: z.array(faqItemSchema).max(50, "Maximum 50 FAQs allowed"),
  sectionHeader: z
    .object({
      badge: z.string(),
      titlePrefix: z.string(),
      titleHighlight: z.string(),
      subtitle: z.string(),
      ctaText: z.string().optional(),
      ctaButtonText: z.string().optional(),
      ctaButtonLink: z.string().optional(),
    })
    .optional(),
});

export const testimonialSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1)
    .max(100, "Name must be less than 100 characters")
    .trim(),
  role: z
    .string()
    .max(100, "Role must be less than 100 characters")
    .trim()
    .optional(),
  text: z
    .string()
    .min(1)
    .max(1000, "Text must be less than 1000 characters")
    .trim(),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  image: z.string().optional(),
  ringColor: z.string().optional(),
  verified: z.boolean().optional(),
});

export const testimonialsContentSchema = z.object({
  testimonials: z
    .array(testimonialSchema)
    .max(50, "Maximum 50 testimonials allowed"),
  sectionHeader: z
    .object({
      badge: z.string().optional(),
      titlePrefix: z.string().optional(),
      titleHighlight: z.string().optional(),
      subtitle: z.string().optional(),
      cardsPerRow: z.number().min(2).max(6).optional(),
    })
    .optional(),
});

export const featureSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(1)
    .max(100, "Title must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .min(1)
    .max(500, "Description must be less than 500 characters")
    .trim(),
  icon: z.string().max(50).optional(),
});

export const featuresContentSchema = z.object({
  badgeText: z.string().min(1).max(50).trim().optional(),
  headingPrefix: z.string().min(1).max(100).trim().optional(),
  headingHighlight: z.string().min(1).max(100).trim().optional(),
  description: z.string().min(1).max(500).trim().optional(),
  features: z.array(featureSchema).max(20, "Maximum 20 features allowed"),
});

export const whyChooseUsItemSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(1)
    .max(100, "Title must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .min(1)
    .max(500, "Description must be less than 500 characters")
    .trim(),
  icon: z.string().max(50).optional(),
});

export const whyChooseUsContentSchema = z.object({
  items: z.array(whyChooseUsItemSchema).max(20, "Maximum 20 items allowed"),
});

// ============================================
// Category Validation Schemas
// ============================================
export const categorySchema = z.object({
  value: z
    .string()
    .min(1, "Value is required")
    .max(50, "Value must be less than 50 characters")
    .regex(
      /^[a-z0-9\-]+$/,
      "Value must be lowercase alphanumeric with hyphens only"
    )
    .trim(),
  label: z
    .string()
    .min(1, "Label is required")
    .max(100, "Label must be less than 100 characters")
    .trim(),
});

// ============================================
// Upload Validation
// ============================================
export const uploadTypeSchema = z.enum(["service", "product", "testimonial"], {
  errorMap: () => ({ message: "Invalid upload type" }),
});

// ============================================
// ID Validation
// ============================================
export const idParamSchema = z.object({
  id: z.string().min(1, "ID is required").max(50, "Invalid ID format"),
});

// ============================================
// Helper function to validate and return errors
// ============================================
export function validateRequest<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { success: true; data: z.output<T> } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.errors.map((err) => {
      const path = err.path.join(".");
      return path ? `${path}: ${err.message}` : err.message;
    });
    return { success: false, errors };
  }

  return { success: true, data: result.data as z.output<T> };
}

// Type exports for use in route handlers
export type ServiceCreateInput = z.output<typeof serviceCreateSchema>;
export type ServiceUpdateInput = z.output<typeof serviceUpdateSchema>;
export type ProductCreateInput = z.output<typeof productCreateSchema>;
export type ProductUpdateInput = z.output<typeof productUpdateSchema>;
export type AppointmentStatusInput = z.output<typeof appointmentStatusSchema>;

// ============================================
// Sanitization Helpers
// ============================================
export function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\-_.]/g, "")
    .substring(0, 200);
}
